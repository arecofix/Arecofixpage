-- ==============================================================================
-- MIGRATION M6: Academy System Activation & Honest Metrics
-- ==============================================================================

-- 1. Actualizar check constraint en course_enrollments para admitir todos los estados
ALTER TABLE public.course_enrollments
  DROP CONSTRAINT IF EXISTS course_enrollments_payment_plan_status_check;

ALTER TABLE public.course_enrollments
  ADD CONSTRAINT course_enrollments_payment_plan_status_check
  CHECK (payment_plan_status IN (
    'none',
    'pending_payment',
    'pending',
    'active',
    'in_progress',
    'grace_period',
    'suspended',
    'completed',
    'scholarship',
    'cancelled',
    'overdue'
  ));

-- 2. Actualizar effective_enrollment_status para contemplar pending_payment y scholarship
CREATE OR REPLACE FUNCTION public.effective_enrollment_status(
  p_status text,
  p_next_due_date timestamptz
) RETURNS text
LANGUAGE sql
STABLE
SET search_path = public, pg_temp
AS $$
  SELECT CASE
    WHEN p_status IN ('cancelled', 'completed', 'scholarship', 'pending_payment') THEN p_status
    WHEN p_next_due_date IS NULL THEN COALESCE(p_status, 'active')
    WHEN now() <= p_next_due_date                      THEN 'active'
    WHEN now() <= p_next_due_date + INTERVAL '7 days'  THEN 'grace_period'
    ELSE 'suspended'
  END;
$$;

GRANT EXECUTE ON FUNCTION public.effective_enrollment_status(text, timestamptz) TO anon, authenticated, service_role;

-- 3. Crear Storage bucket para comprobantes si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('comprobantes', 'comprobantes', false)
ON CONFLICT (id) DO NOTHING;

-- 4. Crear tabla de comprobantes de pago pendientes si no existe
CREATE TABLE IF NOT EXISTS public.academy_payment_proofs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  enrollment_id uuid NOT NULL REFERENCES public.course_enrollments(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  amount numeric(12,2) DEFAULT NULL,
  file_url text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz DEFAULT NULL,
  notes text DEFAULT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.academy_payment_proofs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'academy_payment_proofs' AND policyname = 'academy_payment_proofs_read') THEN
    CREATE POLICY "academy_payment_proofs_read" ON public.academy_payment_proofs
      FOR SELECT TO authenticated
      USING (
        tenant_id = get_current_tenant_id()
        OR auth.uid() = user_id
        OR is_super_admin()
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'academy_payment_proofs' AND policyname = 'academy_payment_proofs_insert') THEN
    CREATE POLICY "academy_payment_proofs_insert" ON public.academy_payment_proofs
      FOR INSERT TO authenticated
      WITH CHECK (
        tenant_id = get_current_tenant_id()
        OR auth.uid() = user_id
        OR is_super_admin()
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'academy_payment_proofs' AND policyname = 'academy_payment_proofs_update') THEN
    CREATE POLICY "academy_payment_proofs_update" ON public.academy_payment_proofs
      FOR UPDATE TO authenticated
      USING (
        tenant_id = get_current_tenant_id()
        OR is_super_admin()
      );
  END IF;
END $$;

-- 5. Crear función atómica void_academy_payment (Anulación de pago)
CREATE OR REPLACE FUNCTION public.void_academy_payment(
  p_payment_id uuid,
  p_user_id_admin uuid,
  p_reason text DEFAULT 'Anulación solicitada por administración'
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_payment record;
  v_enrollment record;
  v_reverted_paid_count integer;
  v_reverted_due_date timestamptz;
  v_reverted_plan_status text;
  v_cash_movement_id uuid;
BEGIN
  -- 1. Validar y bloquear el pago
  SELECT * INTO v_payment
  FROM public.academy_payments
  WHERE id = p_payment_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'El pago % no existe', p_payment_id;
  END IF;

  IF v_payment.status <> 'approved' THEN
    RAISE EXCEPTION 'Solo se pueden anular pagos con estado approved. Estado actual: %', v_payment.status;
  END IF;

  IF v_payment.enrollment_id IS NULL THEN
    RAISE EXCEPTION 'El pago no está asociado a una matrícula de curso individual';
  END IF;

  -- 2. Validar y bloquear la matrícula
  SELECT * INTO v_enrollment
  FROM public.course_enrollments
  WHERE id = v_payment.enrollment_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'La matrícula % asociada al pago no existe', v_payment.enrollment_id;
  END IF;

  -- 3. Marcar pago como refunded
  UPDATE public.academy_payments
  SET status = 'refunded',
      notes = TRIM(COALESCE(notes, '') || ' | Anulado: ' || COALESCE(p_reason, 'Sin motivo')),
      updated_at = now()
  WHERE id = v_payment.id;

  -- 4. Registrar contra-movimiento de egreso en caja
  INSERT INTO public.cash_movements (
    tenant_id,
    type,
    category,
    amount,
    payment_method,
    notes,
    reference_id,
    reference_type,
    created_at
  ) VALUES (
    v_payment.tenant_id,
    'expense',
    'academy',
    v_payment.amount,
    COALESCE(v_payment.payment_method, 'cash'),
    'Anulación recibo ' || COALESCE(v_payment.receipt_number, v_payment.id::text) || ': ' || COALESCE(p_reason, 'Anulado'),
    v_payment.id,
    'academy_payment',
    now()
  ) RETURNING id INTO v_cash_movement_id;

  -- 5. Revertir cuotas y vencimiento en la matrícula
  v_reverted_paid_count := GREATEST(0, COALESCE(v_enrollment.installments_paid, 1) - 1);

  IF v_reverted_paid_count = 0 THEN
    v_reverted_plan_status := 'pending_payment';
    v_reverted_due_date := v_enrollment.created_at + INTERVAL '1 month';
  ELSE
    v_reverted_plan_status := 'active';
    v_reverted_due_date := CASE
      WHEN v_enrollment.next_due_date IS NOT NULL THEN v_enrollment.next_due_date - INTERVAL '1 month'
      ELSE now()
    END;
  END IF;

  UPDATE public.course_enrollments
  SET installments_paid = v_reverted_paid_count,
      next_due_date = v_reverted_due_date,
      payment_plan_status = v_reverted_plan_status,
      updated_at = now()
  WHERE id = v_enrollment.id;

  -- 6. Auditoría si existe tabla audit_logs
  BEGIN
    INSERT INTO public.audit_logs (
      tenant_id,
      table_name,
      record_id,
      action,
      old_data,
      new_data,
      changed_by
    ) VALUES (
      v_payment.tenant_id,
      'academy_payments',
      v_payment.id,
      'VOID_PAYMENT',
      jsonb_build_object(
        'payment_id', v_payment.id,
        'status', 'approved',
        'amount', v_payment.amount,
        'receipt_number', v_payment.receipt_number
      ),
      jsonb_build_object(
        'payment_id', v_payment.id,
        'status', 'refunded',
        'reason', p_reason,
        'reverted_installments_paid', v_reverted_paid_count
      ),
      p_user_id_admin
    );
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;

  RETURN jsonb_build_object(
    'payment_id', v_payment.id,
    'status', 'refunded',
    'enrollment_id', v_enrollment.id,
    'installments_paid', v_reverted_paid_count,
    'payment_plan_status', v_reverted_plan_status,
    'next_due_date', v_reverted_due_date,
    'cash_movement_id', v_cash_movement_id
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.void_academy_payment(uuid, uuid, text) TO authenticated, service_role;

-- 6. Alias register_enrollment_payment -> register_academy_payment
CREATE OR REPLACE FUNCTION public.register_enrollment_payment(
  p_enrollment_id uuid,
  p_amount numeric,
  p_payment_method text,
  p_paid_at timestamptz DEFAULT now(),
  p_period_number integer DEFAULT NULL,
  p_notes text DEFAULT NULL,
  p_created_by uuid DEFAULT NULL
) RETURNS public.academy_payments
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT public.register_academy_payment(
    p_enrollment_id,
    p_amount,
    p_payment_method,
    p_paid_at,
    p_period_number,
    p_notes,
    p_created_by
  );
$$;

GRANT EXECUTE ON FUNCTION public.register_enrollment_payment(uuid, numeric, text, timestamptz, integer, text, uuid) TO authenticated, service_role;

-- 7. Estado honesto inicial de los 7 alumnos (Fase 3+4+5):
-- Axel duplicado
UPDATE public.course_enrollments
SET payment_plan_status = 'cancelled',
    installments_paid = 0,
    installments_count = 6,
    agreed_price = 120000,
    installment_amount = 20000,
    notes = 'Duplicado de chazarreta0749@gmail.com — unificado 2026-11-05',
    updated_at = now()
WHERE email = 'axl0749@gmail.com' AND status = 'confirmed';

-- Ezequiel cuenta interna/becado
UPDATE public.course_enrollments
SET payment_plan_status = 'scholarship',
    agreed_price = 0,
    installment_amount = 0,
    installments_paid = 0,
    installments_count = 6,
    user_id = COALESCE(user_id, '9da10a3a-e000-4a5e-8671-4f4c55266dbe'::uuid),
    notes = 'Cuenta interna de testing — no facturar',
    updated_at = now()
WHERE email = 'ezequielenrico15@gmail.com' AND status = 'confirmed';

-- Resto de alumnos (Carrera Completa y Android)
UPDATE public.course_enrollments e
SET payment_plan_status = 'pending_payment',
    installments_paid = 0,
    installments_count = 6,
    agreed_price = COALESCE(c.sale_price, c.price, 120000),
    installment_amount = ROUND(COALESCE(c.sale_price, c.price, 120000) / 6, 2),
    next_due_date = e.created_at + INTERVAL '1 month',
    expires_at = e.created_at + INTERVAL '1 month',
    updated_at = now()
FROM public.courses c
WHERE e.course_id = c.id
  AND e.status = 'confirmed'
  AND e.email NOT IN ('axl0749@gmail.com', 'ezequielenrico15@gmail.com');

-- 8. Actualizar private.get_admin_business_dashboard_metrics con métricas honestas
CREATE OR REPLACE FUNCTION private.get_admin_business_dashboard_metrics(
    p_tenant_id uuid DEFAULT NULL::uuid,
    p_range text DEFAULT 'month'::text,
    p_start_date timestamp with time zone DEFAULT NULL::timestamp with time zone,
    p_end_date timestamp with time zone DEFAULT NULL::timestamp with time zone,
    p_branch_id uuid DEFAULT NULL::uuid
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_is_service_role boolean := false;
    v_is_super_admin boolean := false;
    v_tenant_id uuid;
    v_start timestamptz;
    v_end timestamptz;
    v_income numeric := 0;
    v_expense numeric := 0;
    v_net_balance numeric := 0;
    v_ecommerce_orders_count bigint := 0;
    v_ecommerce_amount numeric := 0;
    v_active_repairs_count bigint := 0;
    v_delayed_repairs_count bigint := 0;
    v_repairs_revenue numeric := 0;
    v_critical_stock_count bigint := 0;
    v_critical_stock_items jsonb := '[]'::jsonb;
    v_overdue_pickup_repairs jsonb := '[]'::jsonb;
    v_expiring_grace_subscriptions jsonb := '[]'::jsonb;
    v_trend_6_months jsonb := '[]'::jsonb;
    v_revenue_by_origin jsonb := '{}'::jsonb;

    -- Métricas honestas de Academia
    v_alumnos_matriculados bigint := 0;
    v_alumnos_becados bigint := 0;
    v_alumnos_pendientes_pago bigint := 0;
    v_alumnos_al_dia bigint := 0;
    v_alumnos_suspendidos bigint := 0;
    v_ingresos_mes numeric := 0;
    v_ingresos_historicos numeric := 0;
    v_facturacion_potencial_mensual numeric := 0;
    v_certificados_validos bigint := 0;
    v_suscripciones_activas bigint := 0;
BEGIN
    -- Determinar rol de ejecución
    BEGIN
        v_is_service_role := (current_setting('request.jwt.claim.role', true) = 'service_role');
    EXCEPTION WHEN OTHERS THEN
        v_is_service_role := false;
    END;

    IF NOT v_is_service_role THEN
        BEGIN
            v_is_super_admin := is_super_admin();
        EXCEPTION WHEN OTHERS THEN
            v_is_super_admin := false;
        END;
    END IF;

    IF v_is_service_role OR v_is_super_admin THEN
        v_tenant_id := p_tenant_id;
    ELSE
        BEGIN
            v_tenant_id := get_current_tenant_id();
        EXCEPTION WHEN OTHERS THEN
            v_tenant_id := p_tenant_id;
        END;
    END IF;

    -- Rango de fechas
    IF p_start_date IS NOT NULL AND p_end_date IS NOT NULL THEN
        v_start := p_start_date;
        v_end := p_end_date;
    ELSE
        CASE p_range
            WHEN 'today' THEN
                v_start := date_trunc('day', now() AT TIME ZONE 'America/Argentina/Buenos_Aires') AT TIME ZONE 'America/Argentina/Buenos_Aires';
                v_end := now();
            WHEN '7days' THEN
                v_start := now() - INTERVAL '7 days';
                v_end := now();
            WHEN 'year' THEN
                v_start := date_trunc('year', now() AT TIME ZONE 'America/Argentina/Buenos_Aires') AT TIME ZONE 'America/Argentina/Buenos_Aires';
                v_end := now();
            ELSE -- 'month' por defecto
                v_start := date_trunc('month', now() AT TIME ZONE 'America/Argentina/Buenos_Aires') AT TIME ZONE 'America/Argentina/Buenos_Aires';
                v_end := now();
        END CASE;
    END IF;

    -- 1. Caja (Ingresos, Egresos y Balance de Tesorería)
    SELECT 
        COALESCE(SUM(amount) FILTER (WHERE type = 'income'), 0),
        COALESCE(SUM(amount) FILTER (WHERE type = 'expense'), 0)
    INTO v_income, v_expense
    FROM public.cash_movements
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
      AND (p_branch_id IS NULL OR branch_id = p_branch_id OR branch_id IS NULL)
      AND created_at >= v_start
      AND created_at <= v_end;

    v_net_balance := v_income - v_expense;

    -- 2. Ventas E-commerce
    SELECT 
        COUNT(id),
        COALESCE(SUM(COALESCE(total_amount, total, 0)), 0)
    INTO v_ecommerce_orders_count, v_ecommerce_amount
    FROM public.orders
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
      AND (p_branch_id IS NULL OR branch_id = p_branch_id)
      AND status IN ('paid', 'shipped', 'completed', 'delivered')
      AND created_at >= v_start
      AND created_at <= v_end;

    -- 3. Reparaciones Activas y en Demora (> 7 días)
    SELECT 
        COUNT(id),
        COUNT(id) FILTER (WHERE COALESCE(received_at, created_at) < (now() - INTERVAL '7 days'))
    INTO v_active_repairs_count, v_delayed_repairs_count
    FROM public.repairs
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
      AND (p_branch_id IS NULL OR branch_id = p_branch_id)
      AND deleted_at IS NULL
      AND current_status_id NOT IN (6, 7); -- 6=Entregado, 7=Cancelado

    -- Facturación de reparaciones entregadas/completadas en el período
    SELECT COALESCE(SUM(COALESCE(final_cost, estimated_cost, 0)), 0)
    INTO v_repairs_revenue
    FROM public.repairs
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
      AND (p_branch_id IS NULL OR branch_id = p_branch_id)
      AND deleted_at IS NULL
      AND current_status_id IN (5, 6)
      AND COALESCE(completed_at, updated_at, created_at) >= v_start
      AND COALESCE(completed_at, updated_at, created_at) <= v_end;

    -- 4. Métricas Honestas de Academia (CADA UNA CON SU PROPIA QUERY, SIN UNION)

    -- a) Alumnos matriculados activos (distintos user_id o email, no cancelados)
    SELECT COUNT(DISTINCT COALESCE(user_id::text, email))
    INTO v_alumnos_matriculados
    FROM public.course_enrollments
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
      AND status = 'confirmed'
      AND payment_plan_status NOT IN ('cancelled');

    -- b) Becados
    SELECT COUNT(id)
    INTO v_alumnos_becados
    FROM public.course_enrollments
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
      AND status = 'confirmed'
      AND payment_plan_status = 'scholarship';

    -- c) Pendientes de pago
    SELECT COUNT(id)
    INTO v_alumnos_pendientes_pago
    FROM public.course_enrollments
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
      AND status = 'confirmed'
      AND payment_plan_status IN ('pending_payment', 'grace_period');

    -- d) Al día
    SELECT COUNT(id)
    INTO v_alumnos_al_dia
    FROM public.course_enrollments
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
      AND status = 'confirmed'
      AND payment_plan_status = 'active';

    -- e) Suspendidos
    SELECT COUNT(id)
    INTO v_alumnos_suspendidos
    FROM public.course_enrollments
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
      AND status = 'confirmed'
      AND payment_plan_status = 'suspended';

    -- f) Ingresos del mes en Academia (Criterio Caja de pagos aprobados en academy_payments)
    SELECT COALESCE(SUM(amount), 0)
    INTO v_ingresos_mes
    FROM public.academy_payments
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
      AND status = 'approved'
      AND paid_at >= v_start
      AND paid_at <= v_end;

    -- g) Ingresos históricos de Academia
    SELECT COALESCE(SUM(amount), 0)
    INTO v_ingresos_historicos
    FROM public.academy_payments
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
      AND status = 'approved';

    -- h) Facturación mensual potencial (SUM installment_amount de alumnos con planes activos/pendientes)
    SELECT COALESCE(SUM(installment_amount), 0)
    INTO v_facturacion_potencial_mensual
    FROM public.course_enrollments
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
      AND status = 'confirmed'
      AND payment_plan_status IN ('pending_payment', 'active', 'grace_period');

    -- i) Certificados válidos emitidos
    SELECT COUNT(id)
    INTO v_certificados_validos
    FROM public.course_certificates
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id);

    -- j) Suscripciones globales recurrentes activas (tabla academy_subscriptions real)
    SELECT COUNT(id)
    INTO v_suscripciones_activas
    FROM public.academy_subscriptions
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
      AND status = 'active';

    -- 5. Stock Crítico
    SELECT COUNT(id)
    INTO v_critical_stock_count
    FROM public.products
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
      AND (p_branch_id IS NULL OR branch_id = p_branch_id OR is_global = true)
      AND deleted_at IS NULL
      AND is_active = true
      AND COALESCE(stock, 0) <= COALESCE(min_stock_alert, 5);

    SELECT COALESCE(jsonb_agg(sub), '[]'::jsonb)
    INTO v_critical_stock_items
    FROM (
        SELECT p.id, p.name, COALESCE(p.sku, 'S/SKU') AS sku,
               COALESCE(p.stock, 0) AS stock,
               COALESCE(p.min_stock_alert, 5) AS min_stock_alert,
               COALESCE(p.price, 0) AS price
        FROM public.products p
        WHERE (v_tenant_id IS NULL OR p.tenant_id = v_tenant_id)
          AND (p_branch_id IS NULL OR p.branch_id = p_branch_id OR p.is_global = true)
          AND p.deleted_at IS NULL
          AND p.is_active = true
          AND COALESCE(p.stock, 0) <= COALESCE(min_stock_alert, 5)
        ORDER BY p.stock ASC, p.name ASC
        LIMIT 10
    ) sub;

    -- 6. Reparaciones listas demoradas (> 48hs)
    SELECT COALESCE(jsonb_agg(sub), '[]'::jsonb)
    INTO v_overdue_pickup_repairs
    FROM (
        SELECT r.id,
               COALESCE(r.tracking_code, 'REP-' || r.repair_number::text, 'S/N') AS tracking_code,
               COALESCE(NULLIF(TRIM(COALESCE(p.first_name, '') || ' ' || COALESCE(p.last_name, '')), ''), 'Cliente') AS client_name,
               COALESCE(r.completed_at, r.updated_at, r.created_at) AS ready_since,
               GREATEST(0, ROUND(EXTRACT(EPOCH FROM (now() - COALESCE(r.completed_at, r.updated_at, r.created_at))) / 3600))::integer AS hours_waiting,
               COALESCE(r.final_cost, r.estimated_cost, 0) AS final_cost
        FROM public.repairs r
        LEFT JOIN public.profiles p ON p.id = r.client_id
        WHERE (v_tenant_id IS NULL OR r.tenant_id = v_tenant_id)
          AND (p_branch_id IS NULL OR r.branch_id = p_branch_id)
          AND r.deleted_at IS NULL
          AND r.current_status_id = 5
          AND COALESCE(r.completed_at, r.updated_at, r.created_at) < (now() - INTERVAL '48 hours')
        ORDER BY COALESCE(r.completed_at, r.updated_at, r.created_at) ASC
        LIMIT 10
    ) sub;

    -- 7. Alumnos en grace period por vencer
    SELECT COALESCE(jsonb_agg(sub), '[]'::jsonb)
    INTO v_expiring_grace_subscriptions
    FROM (
        SELECT e.id,
               e.email AS user_email,
               COALESCE(NULLIF(TRIM(COALESCE(p.first_name, '') || ' ' || COALESCE(p.last_name, '')), ''), e.full_name) AS student_name,
               (e.next_due_date + INTERVAL '7 days') AS grace_period_ends_at,
               GREATEST(0, CEIL(EXTRACT(EPOCH FROM ((e.next_due_date + INTERVAL '7 days') - now())) / 86400))::integer AS days_left
        FROM public.course_enrollments e
        LEFT JOIN public.profiles p ON p.id = e.user_id
        WHERE (v_tenant_id IS NULL OR e.tenant_id = v_tenant_id)
          AND e.status = 'confirmed'
          AND e.payment_plan_status = 'grace_period'
          AND e.next_due_date IS NOT NULL
          AND now() > e.next_due_date
          AND now() <= (e.next_due_date + INTERVAL '7 days')
        ORDER BY e.next_due_date ASC
        LIMIT 10
    ) sub;

    -- 8. Tendencia de 6 meses
    WITH months AS (
        SELECT 
            to_char(d, 'YYYY-MM') AS period,
            to_char(d, 'Mon') AS label
        FROM generate_series(
            date_trunc('month', now() - INTERVAL '5 months'),
            date_trunc('month', now()),
            '1 month'::interval
        ) d
    ),
    monthly_cash AS (
        SELECT 
            to_char(cm.created_at, 'YYYY-MM') AS period,
            COALESCE(SUM(cm.amount) FILTER (WHERE cm.type = 'income'), 0) AS income,
            COALESCE(SUM(cm.amount) FILTER (WHERE cm.type = 'expense'), 0) AS expense
        FROM public.cash_movements cm
        WHERE (v_tenant_id IS NULL OR cm.tenant_id = v_tenant_id)
          AND (p_branch_id IS NULL OR cm.branch_id = p_branch_id OR cm.branch_id IS NULL)
          AND cm.created_at >= (date_trunc('month', now() - INTERVAL '5 months'))
        GROUP BY 1
    )
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'period', m.period,
        'label', m.label,
        'month', m.period,
        'income', COALESCE(mc.income, 0),
        'expense', COALESCE(mc.expense, 0),
        'net_balance', COALESCE(mc.income, 0) - COALESCE(mc.expense, 0)
    ) ORDER BY m.period ASC), '[]'::jsonb)
    INTO v_trend_6_months
    FROM months m
    LEFT JOIN monthly_cash mc ON mc.period = m.period;

    -- 9. Revenue by Origin
    v_revenue_by_origin := jsonb_build_object(
        'ecommerce', v_ecommerce_amount,
        'repairs', v_repairs_revenue,
        'academy', v_ingresos_mes
    );

    -- 10. Construir respuesta final honesta y compatible
    RETURN jsonb_build_object(
        'period', jsonb_build_object(
            'range', p_range,
            'start_date', v_start,
            'end_date', v_end
        ),
        'kpis', jsonb_build_object(
            'total_income', v_income,
            'total_expense', v_expense,
            'net_balance', v_net_balance,
            'ecommerce_orders_count', v_ecommerce_orders_count,
            'ecommerce_amount', v_ecommerce_amount,
            'active_repairs_count', v_active_repairs_count,
            'delayed_repairs_count', v_delayed_repairs_count,
            'has_delayed_alert', (v_delayed_repairs_count > 0),
            'critical_stock_count', v_critical_stock_count,
            -- Métricas honestas de academia
            'alumnos_matriculados', v_alumnos_matriculados,
            'alumnos_becados', v_alumnos_becados,
            'alumnos_pendientes_pago', v_alumnos_pendientes_pago,
            'alumnos_al_dia', v_alumnos_al_dia,
            'alumnos_suspendidos', v_alumnos_suspendidos,
            'ingresos_mes', v_ingresos_mes,
            'ingresos_historicos', v_ingresos_historicos,
            'facturacion_potencial_mensual', v_facturacion_potencial_mensual,
            'certificados_validos', v_certificados_validos,
            'suscripciones_activas', v_suscripciones_activas,
            -- Compatibilidad retrospectiva para clientes anteriores
            'active_subscriptions_count', v_alumnos_matriculados,
            'academy_revenue', v_ingresos_mes
        ),
        'academy', jsonb_build_object(
            'alumnos_matriculados', v_alumnos_matriculados,
            'alumnos_becados', v_alumnos_becados,
            'alumnos_pendientes_pago', v_alumnos_pendientes_pago,
            'alumnos_al_dia', v_alumnos_al_dia,
            'alumnos_suspendidos', v_alumnos_suspendidos,
            'ingresos_mes', v_ingresos_mes,
            'ingresos_historicos', v_ingresos_historicos,
            'facturacion_potencial_mensual', v_facturacion_potencial_mensual,
            'certificados_validos', v_certificados_validos,
            'suscripciones_activas', v_suscripciones_activas
        ),
        'alerts', jsonb_build_object(
            'critical_stock_items', v_critical_stock_items,
            'overdue_pickup_repairs', v_overdue_pickup_repairs,
            'expiring_grace_subscriptions', v_expiring_grace_subscriptions
        ),
        'charts', jsonb_build_object(
            'trend_6_months', v_trend_6_months,
            'revenue_by_origin', v_revenue_by_origin
        ),
        'revenue_by_origin', v_revenue_by_origin,
        'trend', v_trend_6_months
    );
END;
$$;
