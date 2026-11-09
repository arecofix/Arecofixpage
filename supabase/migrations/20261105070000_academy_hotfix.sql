-- ==============================================================================
-- MIGRATION: 20261105070000_academy_hotfix.sql
-- HOTFIX: Precios reales, lógica de mora (effective_enrollment_status) y limpieza de datos
-- ==============================================================================

-- 1. Actualizar effective_enrollment_status para evaluar correctamente el vencimiento
CREATE OR REPLACE FUNCTION public.effective_enrollment_status(
  p_status text,
  p_next_due_date timestamptz
) RETURNS text
LANGUAGE sql
STABLE
SET search_path = public, pg_temp
AS $$
  SELECT CASE
    WHEN p_status IN ('cancelled', 'completed', 'scholarship') THEN p_status
    WHEN p_next_due_date IS NULL THEN COALESCE(p_status, 'pending_payment')
    WHEN now() <= p_next_due_date                      THEN 'active'
    WHEN now() <= p_next_due_date + INTERVAL '7 days'  THEN 'grace_period'
    ELSE 'suspended'
  END;
$$;

GRANT EXECUTE ON FUNCTION public.effective_enrollment_status(text, timestamptz) TO anon, authenticated, service_role;

-- 2. Limpieza de datos de prueba: 3 registros de Gabriel Bravo
UPDATE public.course_enrollments
SET payment_plan_status = 'cancelled',
    notes = 'Registro de prueba — eliminado de métricas',
    agreed_price = 0.00,
    installment_amount = 0.00,
    updated_at = now()
WHERE LOWER(email) IN ('ezequielenrico15@gmail.com', 'anatolli@gmail.com', 'ezequielol1015@gmail.com')
  AND (LOWER(full_name) LIKE '%gabriel bravo%' OR status = 'pending');

-- 3. Carrera Completa: $120.000/mes durante 6 meses. Total real = $720.000
UPDATE public.course_enrollments
SET agreed_price = 720000.00,
    installment_amount = 120000.00,
    installments_count = 6,
    updated_at = now()
WHERE course_id = '2b19915c-c845-412f-9048-e4bdb513600f'
  AND payment_plan_status NOT IN ('scholarship', 'cancelled');

-- 4. Reparación Android: $90.000/mes durante 3 meses. Total real = $270.000
UPDATE public.course_enrollments
SET agreed_price = 270000.00,
    installment_amount = 90000.00,
    installments_count = 3,
    updated_at = now()
WHERE course_id = 'f4b78d36-fa4e-47d8-b389-c47808b1eac1'
  AND payment_plan_status NOT IN ('scholarship', 'cancelled');

-- 5. Actualizar private.get_admin_business_dashboard_metrics compatible con el schema real de repairs
CREATE OR REPLACE FUNCTION private.get_admin_business_dashboard_metrics(
    p_tenant_id uuid DEFAULT NULL::uuid,
    p_range text DEFAULT 'month'::text,
    p_start_date timestamp with time zone DEFAULT NULL::timestamp with time zone,
    p_end_date timestamp with time zone DEFAULT NULL::timestamp with time zone,
    p_branch_id uuid DEFAULT NULL::uuid
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, private, pg_temp, 'extensions', 'pg_temp'
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
    v_critical_stock_count bigint := 0;
    v_critical_stock_items jsonb := '[]'::jsonb;
    v_overdue_pickup_repairs jsonb := '[]'::jsonb;
    v_expiring_grace_subscriptions jsonb := '[]'::jsonb;
    v_trend_6_months jsonb := '[]'::jsonb;
    v_repairs_revenue numeric := 0;
    v_revenue_by_origin jsonb;
    v_primary_tenant_id uuid;

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
    SELECT id INTO v_primary_tenant_id
    FROM public.tenants
    WHERE custom_domain = 'arecofix.com.ar' OR slug = 'arecofix'
    ORDER BY created_at ASC
    LIMIT 1;

    IF v_primary_tenant_id IS NULL THEN
        v_primary_tenant_id := 'bba26ccd-59ce-471c-aac0-4c1f5513de3b'::uuid;
    END IF;

    BEGIN
        v_is_service_role := (
            current_user IN ('postgres', 'supabase_admin')
            OR (current_setting('request.jwt.claims', true)::jsonb ->> 'role') = 'service_role'
            OR auth.jwt() ->> 'role' = 'service_role'
        );
    EXCEPTION WHEN OTHERS THEN
        v_is_service_role := (current_user IN ('postgres', 'supabase_admin'));
    END;

    v_is_super_admin := v_is_service_role OR public.is_super_admin();

    IF v_is_super_admin THEN
        v_tenant_id := COALESCE(p_tenant_id, public.get_current_tenant_id(), v_primary_tenant_id);
    ELSE
        v_tenant_id := public.get_current_tenant_id();
        IF v_tenant_id IS NULL AND auth.uid() IS NOT NULL THEN
            SELECT p.tenant_id INTO v_tenant_id FROM public.profiles p WHERE p.id = auth.uid();
        END IF;

        IF v_tenant_id IS NULL THEN
            RETURN jsonb_build_object('error', 'Tenant context required');
        END IF;

        IF p_tenant_id IS NOT NULL AND p_tenant_id != v_tenant_id THEN
            RETURN jsonb_build_object('error', 'Acceso denegado a métricas de otro tenant');
        END IF;
    END IF;

    -- Rango de Fechas
    IF p_start_date IS NOT NULL AND p_end_date IS NOT NULL THEN
        v_start := p_start_date;
        v_end := p_end_date;
    ELSIF p_range = 'today' THEN
        v_start := date_trunc('day', now() AT TIME ZONE 'America/Argentina/Buenos_Aires') AT TIME ZONE 'America/Argentina/Buenos_Aires';
        v_end := now();
    ELSIF p_range = '7days' THEN
        v_start := now() - INTERVAL '7 days';
        v_end := now();
    ELSIF p_range = 'year' THEN
        v_start := date_trunc('year', now() AT TIME ZONE 'America/Argentina/Buenos_Aires') AT TIME ZONE 'America/Argentina/Buenos_Aires';
        v_end := now();
    ELSE
        v_start := date_trunc('month', now() AT TIME ZONE 'America/Argentina/Buenos_Aires') AT TIME ZONE 'America/Argentina/Buenos_Aires';
        v_end := now();
    END IF;

    -- 1. Caja (Ingresos y Egresos)
    SELECT 
        COALESCE(SUM(amount) FILTER (WHERE type = 'income' OR type = 'INCOME'), 0),
        COALESCE(SUM(amount) FILTER (WHERE type = 'expense' OR type = 'EXPENSE'), 0)
    INTO v_income, v_expense
    FROM public.cash_movements
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
      AND (p_branch_id IS NULL OR branch_id = p_branch_id OR branch_id IS NULL)
      AND created_at >= v_start
      AND created_at <= v_end;

    v_net_balance := v_income - v_expense;

    -- 2. Ecommerce
    SELECT 
        COUNT(id),
        COALESCE(SUM(COALESCE(total_amount, total, 0)), 0)
    INTO v_ecommerce_orders_count, v_ecommerce_amount
    FROM public.orders
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
      AND (p_branch_id IS NULL OR branch_id = p_branch_id)
      AND status IN ('paid', 'shipped', 'completed', 'delivered', 'PAID', 'DELIVERED')
      AND created_at >= v_start
      AND created_at <= v_end;

    -- 3. Taller
    SELECT 
        COUNT(id),
        COUNT(id) FILTER (WHERE COALESCE(received_at, created_at) < (now() - INTERVAL '7 days'))
    INTO v_active_repairs_count, v_delayed_repairs_count
    FROM public.repairs
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
      AND (p_branch_id IS NULL OR branch_id = p_branch_id)
      AND deleted_at IS NULL
      AND current_status_id NOT IN (6, 7);

    SELECT COALESCE(SUM(COALESCE(final_cost, estimated_cost, 0)), 0)
    INTO v_repairs_revenue
    FROM public.repairs
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
      AND (p_branch_id IS NULL OR branch_id = p_branch_id)
      AND current_status_id IN (5, 6)
      AND COALESCE(completed_at, updated_at, created_at) >= v_start
      AND COALESCE(completed_at, updated_at, created_at) <= v_end;

    -- 4. Métricas honestas de Academia
    SELECT COUNT(id)
    INTO v_alumnos_matriculados
    FROM public.course_enrollments
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
      AND status = 'confirmed'
      AND payment_plan_status NOT IN ('cancelled');

    SELECT COUNT(id)
    INTO v_alumnos_becados
    FROM public.course_enrollments
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
      AND status = 'confirmed'
      AND payment_plan_status = 'scholarship';

    SELECT COUNT(id)
    INTO v_alumnos_pendientes_pago
    FROM public.course_enrollments
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
      AND status = 'confirmed'
      AND public.effective_enrollment_status(payment_plan_status, next_due_date) IN ('pending_payment', 'grace_period', 'suspended')
      AND payment_plan_status NOT IN ('scholarship', 'cancelled');

    SELECT COUNT(id)
    INTO v_alumnos_al_dia
    FROM public.course_enrollments
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
      AND status = 'confirmed'
      AND public.effective_enrollment_status(payment_plan_status, next_due_date) = 'active'
      AND payment_plan_status NOT IN ('scholarship', 'cancelled');

    SELECT COUNT(id)
    INTO v_alumnos_suspendidos
    FROM public.course_enrollments
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
      AND status = 'confirmed'
      AND public.effective_enrollment_status(payment_plan_status, next_due_date) = 'suspended'
      AND payment_plan_status NOT IN ('scholarship', 'cancelled');

    SELECT COALESCE(SUM(amount), 0)
    INTO v_ingresos_mes
    FROM public.academy_payments
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
      AND status = 'approved'
      AND paid_at >= v_start
      AND paid_at <= v_end;

    SELECT COALESCE(SUM(amount), 0)
    INTO v_ingresos_historicos
    FROM public.academy_payments
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
      AND status = 'approved';

    -- Facturación mensual potencial: suma cuotas de todos los no cancelados ni becados
    SELECT COALESCE(SUM(installment_amount), 0)
    INTO v_facturacion_potencial_mensual
    FROM public.course_enrollments
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
      AND status = 'confirmed'
      AND payment_plan_status NOT IN ('cancelled', 'scholarship');

    SELECT COUNT(id)
    INTO v_certificados_validos
    FROM public.course_certificates
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id);

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
        SELECT 
            p.id, 
            p.name, 
            COALESCE(p.sku, 'S/SKU') AS sku, 
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

    -- 6. Reparaciones Listas para Retirar Demoradas (> 48hs)
    SELECT COALESCE(jsonb_agg(sub), '[]'::jsonb)
    INTO v_overdue_pickup_repairs
    FROM (
        SELECT 
            r.id,
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

    -- 7. Alumnos en Grace Period por Vencer (<= 3 días)
    SELECT COALESCE(jsonb_agg(sub), '[]'::jsonb)
    INTO v_expiring_grace_subscriptions
    FROM (
        SELECT 
            e.id,
            e.email AS user_email,
            COALESCE(e.full_name, 'Alumno') AS student_name,
            (e.next_due_date + INTERVAL '7 days') AS grace_period_ends_at,
            GREATEST(0, CEIL(EXTRACT(EPOCH FROM ((e.next_due_date + INTERVAL '7 days') - now())) / 86400))::integer AS days_left
        FROM public.course_enrollments e
        WHERE (v_tenant_id IS NULL OR e.tenant_id = v_tenant_id)
          AND e.status = 'confirmed'
          AND public.effective_enrollment_status(e.payment_plan_status, e.next_due_date) = 'grace_period'
        ORDER BY e.next_due_date ASC
        LIMIT 10
    ) sub;

    -- 8. Gráfico de Tendencia Histórica (Últimos 6 meses)
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
            COALESCE(SUM(cm.amount) FILTER (WHERE cm.type = 'income' OR cm.type = 'INCOME'), 0) AS income,
            COALESCE(SUM(cm.amount) FILTER (WHERE cm.type = 'expense' OR cm.type = 'EXPENSE'), 0) AS expense
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

    -- 9. Origen de Ingresos
    v_revenue_by_origin := jsonb_build_object(
        'ecommerce', v_ecommerce_amount,
        'repairs', v_repairs_revenue,
        'academy', v_ingresos_mes
    );

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
            'active_subscriptions_count', v_alumnos_matriculados,
            'academy_revenue', v_ingresos_mes,
            'critical_stock_count', v_critical_stock_count,
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
