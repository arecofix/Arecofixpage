-- ==============================================================================
-- Migration: 20261022070000_harden_authenticated_definer_groupC.sql
-- Description: Harden admin analytics RPCs & zarx functions (R4 Group C)
-- Severity: HIGH SECURITY (P1)
-- Category: authenticated_security_definer_function_executable
-- ==============================================================================

BEGIN;

CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO anon, authenticated, service_role, postgres, supabase_admin;

-- ------------------------------------------------------------------------------
-- 1. get_admin_business_dashboard_metrics
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION private.get_admin_business_dashboard_metrics(p_tenant_id uuid DEFAULT NULL::uuid, p_range text DEFAULT 'month'::text, p_start_date timestamp with time zone DEFAULT NULL::timestamp with time zone, p_end_date timestamp with time zone DEFAULT NULL::timestamp with time zone, p_branch_id uuid DEFAULT NULL::uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, private, pg_temp, 'extensions', 'pg_temp'
AS $function$
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
    v_active_subscriptions_count bigint := 0;
    v_academy_revenue numeric := 0;
    v_critical_stock_count bigint := 0;
    v_critical_stock_items jsonb := '[]'::jsonb;
    v_overdue_pickup_repairs jsonb := '[]'::jsonb;
    v_expiring_grace_subscriptions jsonb := '[]'::jsonb;
    v_trend_6_months jsonb := '[]'::jsonb;
    v_repairs_revenue numeric := 0;
    v_revenue_by_origin jsonb;
    v_primary_tenant_id uuid;
BEGIN
    -- 0. Detectar Tenant Principal de Arecofix como fallback seguro
    SELECT id INTO v_primary_tenant_id
    FROM public.tenants
    WHERE custom_domain = 'arecofix.com.ar' OR slug = 'arecofix'
    ORDER BY created_at ASC
    LIMIT 1;

    IF v_primary_tenant_id IS NULL THEN
        v_primary_tenant_id := 'bba26ccd-59ce-471c-aac0-4c1f5513de3b'::uuid;
    END IF;

    -- 1. Identificar permisos del llamador (Service Role o Super Admin)
    BEGIN
        v_is_service_role := (
            current_user = 'postgres'
            OR (current_setting('request.jwt.claims', true)::jsonb ->> 'role') = 'service_role'
            OR auth.jwt() ->> 'role' = 'service_role'
        );
    EXCEPTION WHEN OTHERS THEN
        v_is_service_role := (current_user = 'postgres');
    END;

    v_is_super_admin := v_is_service_role OR public.is_super_admin();

    -- 2. Resolución de Tenant estricta y segura
    IF v_is_super_admin THEN
        -- Si es super_admin o backend service, puede especificar tenant o ver el principal
        v_tenant_id := COALESCE(p_tenant_id, public.get_current_tenant_id(), v_primary_tenant_id);
    ELSE
        -- Si es un usuario regular o administrador de sucursal, aislar en su tenant
        v_tenant_id := public.get_current_tenant_id();
        IF v_tenant_id IS NULL AND auth.uid() IS NOT NULL THEN
            SELECT p.tenant_id INTO v_tenant_id FROM public.profiles p WHERE p.id = auth.uid();
        END IF;

        IF v_tenant_id IS NULL THEN
            RETURN jsonb_build_object(
                'error', 'Tenant context required'
            );
        END IF;

        IF p_tenant_id IS NOT NULL AND p_tenant_id != v_tenant_id THEN
            RETURN jsonb_build_object(
                'error', 'Acceso denegado a métricas de otro tenant'
            );
        END IF;
    END IF;

    -- 3. Rango de Fechas respetando zona horaria de Argentina (America/Argentina/Buenos_Aires - UTC-3)
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
    ELSE -- 'month' por defecto
        v_start := date_trunc('month', now() AT TIME ZONE 'America/Argentina/Buenos_Aires') AT TIME ZONE 'America/Argentina/Buenos_Aires';
        v_end := now();
    END IF;

    -- 4. Caja (Ingresos, Egresos y Balance de Tesorería)
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

    -- 5. Ventas E-commerce
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

    -- 6. Reparaciones Activas y en Demora (> 7 días)
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
      AND current_status_id IN (5, 6)
      AND COALESCE(completed_at, updated_at, created_at) >= v_start
      AND COALESCE(completed_at, updated_at, created_at) <= v_end;

    -- 7. Alumnos en Academia y Facturación
    SELECT COUNT(DISTINCT COALESCE(user_id::text, student_email))
    INTO v_active_subscriptions_count
    FROM (
        SELECT user_id, NULL::text AS student_email FROM public.academy_subscriptions
        WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id) AND status = 'active'
        UNION
        SELECT user_id, email AS student_email FROM public.course_enrollments
        WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id) AND status IN ('confirmed', 'active')
    ) active_students;

    SELECT COALESCE(SUM(amount), 0)
    INTO v_academy_revenue
    FROM (
        SELECT amount FROM public.academy_payments
        WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
          AND status IN ('approved', 'paid')
          AND created_at >= v_start
          AND created_at <= v_end
        UNION ALL
        SELECT amount FROM public.cash_movements
        WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
          AND type = 'income'
          AND category IN ('beca', 'academy', 'curso', 'cursos', 'academia')
          AND created_at >= v_start
          AND created_at <= v_end
    ) ap;

    -- 8. Stock Crítico
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

    -- 9. Reparaciones Listas para Retirar Demoradas (> 48hs)
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

    -- 10. Suscripciones en Grace Period por Vencer (<= 3 días)
    SELECT COALESCE(jsonb_agg(sub), '[]'::jsonb)
    INTO v_expiring_grace_subscriptions
    FROM (
        SELECT 
            s.id,
            s.user_id,
            COALESCE(prof.email, u.email, '') AS user_email,
            COALESCE(NULLIF(TRIM(COALESCE(prof.first_name, '') || ' ' || COALESCE(prof.last_name, '')), ''), u.raw_user_meta_data->>'full_name', split_part(COALESCE(prof.email, u.email, ''), '@', 1), 'Alumno') AS student_name,
            s.grace_period_ends_at,
            GREATEST(0, ROUND(EXTRACT(EPOCH FROM (s.grace_period_ends_at - now())) / 86400))::integer AS days_left
        FROM public.academy_subscriptions s
        LEFT JOIN auth.users u ON u.id = s.user_id
        LEFT JOIN public.profiles prof ON prof.id = s.user_id
        WHERE (v_tenant_id IS NULL OR s.tenant_id = v_tenant_id)
          AND s.status = 'grace_period'
          AND s.grace_period_ends_at IS NOT NULL
          AND s.grace_period_ends_at <= (now() + INTERVAL '3 days')
        ORDER BY s.grace_period_ends_at ASC
        LIMIT 10
    ) sub;

    -- 11. Gráfico de Tendencia Histórica (Últimos 6 meses)
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

    -- 12. Origen de Ingresos
    v_revenue_by_origin := jsonb_build_object(
        'ecommerce', v_ecommerce_amount,
        'repairs', v_repairs_revenue,
        'academy', v_academy_revenue
    );

    -- 13. Consolidación de Respuesta (Completa y con aliases retrocompatibles)
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
            'has_delayed_alert', (v_delayed_repairs_count > 5),
            'active_subscriptions_count', v_active_subscriptions_count,
            'academy_revenue', v_academy_revenue,
            'critical_stock_count', v_critical_stock_count
        ),
        'alerts', jsonb_build_object(
            'critical_stock_count', v_critical_stock_count,
            'critical_stock_items', v_critical_stock_items,
            'overdue_pickup_repairs', v_overdue_pickup_repairs,
            'expiring_grace_subscriptions', v_expiring_grace_subscriptions
        ),
        'charts', jsonb_build_object(
            'trend_6_months', v_trend_6_months,
            'revenue_by_origin', v_revenue_by_origin
        ),
        -- Aliases para clientes o tests que consuman 'metrics' o 'trend'
        'metrics', jsonb_build_object(
            'total_income', v_income,
            'total_expense', v_expense,
            'net_cashflow', v_net_balance,
            'ecommerce_paid_count', v_ecommerce_orders_count,
            'ecommerce_paid_revenue', v_ecommerce_amount,
            'active_repairs_count', v_active_repairs_count,
            'delayed_repairs_count', v_delayed_repairs_count,
            'active_subscriptions_count', v_active_subscriptions_count,
            'academy_revenue', v_academy_revenue
        ),
        'revenue_by_origin', v_revenue_by_origin,
        'trend', v_trend_6_months
    );
END;
$function$;

REVOKE ALL ON FUNCTION private.get_admin_business_dashboard_metrics(uuid, text, timestamp with time zone, timestamp with time zone, uuid) FROM public;
GRANT EXECUTE ON FUNCTION private.get_admin_business_dashboard_metrics(uuid, text, timestamp with time zone, timestamp with time zone, uuid) TO authenticated, service_role;

DROP FUNCTION IF EXISTS public.get_admin_business_dashboard_metrics(uuid, text, timestamp with time zone, timestamp with time zone, uuid);

CREATE OR REPLACE FUNCTION public.get_admin_business_dashboard_metrics(
    p_tenant_id uuid DEFAULT NULL::uuid,
    p_range text DEFAULT 'month'::text,
    p_start_date timestamp with time zone DEFAULT NULL::timestamp with time zone,
    p_end_date timestamp with time zone DEFAULT NULL::timestamp with time zone,
    p_branch_id uuid DEFAULT NULL::uuid
)
RETURNS jsonb
LANGUAGE sql
SECURITY INVOKER
SET search_path = public, private, pg_temp
AS $$
    SELECT private.get_admin_business_dashboard_metrics(p_tenant_id, p_range, p_start_date, p_end_date, p_branch_id);
$$;

REVOKE ALL ON FUNCTION public.get_admin_business_dashboard_metrics(uuid, text, timestamp with time zone, timestamp with time zone, uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.get_admin_business_dashboard_metrics(uuid, text, timestamp with time zone, timestamp with time zone, uuid) TO authenticated, service_role;
COMMENT ON FUNCTION public.get_admin_business_dashboard_metrics(uuid, text, timestamp with time zone, timestamp with time zone, uuid) IS '@security-definer-justification: Wrapper SECURITY INVOKER que delega a private.get_admin_business_dashboard_metrics';

-- ------------------------------------------------------------------------------
-- 2. get_admin_dashboard_analytics
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION private.get_admin_dashboard_analytics(p_range text DEFAULT 'month'::text, p_branch_id uuid DEFAULT NULL::uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, private, pg_temp, 'extensions', 'pg_temp'
AS $function$
DECLARE
  v_start_date timestamptz;
  v_end_date timestamptz;
  v_now_arg timestamptz;
  v_top_products jsonb;
  v_customer_rfm jsonb;
  v_repairs_by_brand jsonb;
  v_repairs_by_model jsonb;
  v_common_issues jsonb;
  v_total_customers int;
  v_repeat_customers int;
  v_repeat_rate numeric;
  v_role text;
  v_current_user text;
BEGIN
  v_current_user := CURRENT_USER;
  SELECT COALESCE(
    current_setting('request.jwt.claim.role', true),
    (SELECT role FROM public.profiles WHERE id = auth.uid()),
    'anon'
  ) INTO v_role;

  IF v_current_user NOT IN ('postgres', 'supabase_admin') 
     AND v_role NOT IN ('super_admin', 'service_role') 
     AND NOT public.is_super_admin() THEN
    RETURN jsonb_build_object('error', 'Acceso denegado. Se requieren privilegios de Super Administrador.');
  END IF;

  -- Timezone Argentina UTC-3
  v_now_arg := now() AT TIME ZONE 'America/Argentina/Buenos_Aires';
  v_end_date := now();

  IF p_range = 'today' THEN
    v_start_date := date_trunc('day', v_now_arg) AT TIME ZONE 'America/Argentina/Buenos_Aires';
  ELSIF p_range = '7days' THEN
    v_start_date := (v_now_arg - interval '7 days');
  ELSIF p_range = 'year' THEN
    v_start_date := date_trunc('year', v_now_arg) AT TIME ZONE 'America/Argentina/Buenos_Aires';
  ELSE -- 'month'
    v_start_date := date_trunc('month', v_now_arg) AT TIME ZONE 'America/Argentina/Buenos_Aires';
  END IF;

  -- 1. Top 10 Selling Products
  SELECT jsonb_agg(row_to_json(tp))
  INTO v_top_products
  FROM (
    SELECT 
      p.id AS product_id,
      COALESCE(oi.product_name, p.name, 'Producto Desconocido') AS product_name,
      COALESCE(p.sku, 'S/SKU') AS sku,
      COALESCE(c.name, 'General') AS category_name,
      SUM(oi.quantity)::int AS units_sold,
      SUM(COALESCE(oi.subtotal, oi.quantity * oi.unit_price))::numeric AS revenue,
      COALESCE(p.stock, 0)::int AS current_stock
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    LEFT JOIN products p ON oi.product_id = p.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE o.status IN ('paid', 'completed', 'shipped', 'delivered')
      AND (p_range = 'year' OR o.created_at >= v_start_date)
      AND (p_branch_id IS NULL OR o.branch_id = p_branch_id)
    GROUP BY p.id, oi.product_name, p.name, p.sku, c.name, p.stock
    ORDER BY units_sold DESC, revenue DESC
    LIMIT 10
  ) tp;

  -- If no sales in current period, fallback to all-time top products so UI has real context
  IF v_top_products IS NULL OR jsonb_array_length(v_top_products) = 0 THEN
    SELECT jsonb_agg(row_to_json(tp_all))
    INTO v_top_products
    FROM (
      SELECT 
        p.id AS product_id,
        COALESCE(oi.product_name, p.name, 'Producto Desconocido') AS product_name,
        COALESCE(p.sku, 'S/SKU') AS sku,
        COALESCE(c.name, 'General') AS category_name,
        SUM(oi.quantity)::int AS units_sold,
        SUM(COALESCE(oi.subtotal, oi.quantity * oi.unit_price))::numeric AS revenue,
        COALESCE(p.stock, 0)::int AS current_stock
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      LEFT JOIN products p ON oi.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE o.status IN ('paid', 'completed', 'shipped', 'delivered')
      GROUP BY p.id, oi.product_name, p.name, p.sku, c.name, p.stock
      ORDER BY units_sold DESC, revenue DESC
      LIMIT 10
    ) tp_all;
  END IF;

  -- 2. Customer RFM Segmentation & Repeat Purchase Rate
  WITH customer_stats AS (
    SELECT 
      COALESCE(NULLIF(o.customer_name, ''), NULLIF(TRIM(CONCAT(p.first_name, ' ', p.last_name)), ''), 'Cliente') AS customer_name,
      COALESCE(NULLIF(o.customer_email, ''), p.email, 'Sin Email') AS customer_email,
      count(*)::int AS frequency,
      sum(o.total)::numeric AS monetary,
      max(o.created_at) AS last_order_date
    FROM orders o
    LEFT JOIN profiles p ON o.user_id = p.id
    WHERE o.status IN ('paid', 'completed', 'shipped', 'delivered')
    GROUP BY 1, 2
  )
  SELECT 
    count(*),
    count(*) FILTER (WHERE frequency > 1),
    ROUND(100.0 * count(*) FILTER (WHERE frequency > 1) / NULLIF(count(*), 0), 1)
  INTO v_total_customers, v_repeat_customers, v_repeat_rate
  FROM customer_stats;

  WITH customer_stats AS (
    SELECT 
      COALESCE(NULLIF(o.customer_name, ''), NULLIF(TRIM(CONCAT(p.first_name, ' ', p.last_name)), ''), 'Cliente') AS customer_name,
      COALESCE(NULLIF(o.customer_email, ''), p.email, 'Sin Email') AS customer_email,
      count(*)::int AS frequency,
      sum(o.total)::numeric AS monetary,
      max(o.created_at) AS last_order_date
    FROM orders o
    LEFT JOIN profiles p ON o.user_id = p.id
    WHERE o.status IN ('paid', 'completed', 'shipped', 'delivered')
    GROUP BY 1, 2
  )
  SELECT jsonb_agg(row_to_json(rfm_top))
  INTO v_customer_rfm
  FROM (
    SELECT 
      customer_name,
      customer_email,
      frequency,
      monetary,
      to_char(last_order_date AT TIME ZONE 'America/Argentina/Buenos_Aires', 'YYYY-MM-DD') AS last_order_date,
      CASE 
        WHEN frequency >= 3 OR monetary >= 50000 THEN 'Campeón (LTV Alto)'
        WHEN frequency >= 2 THEN 'Cliente Frecuente'
        WHEN last_order_date < now() - interval '60 days' THEN 'En Riesgo de Churn'
        ELSE 'Nuevo / Ocasional'
      END AS segment
    FROM customer_stats
    ORDER BY monetary DESC, frequency DESC
    LIMIT 10
  ) rfm_top;

  -- 3. Repairs by Brand
  SELECT jsonb_agg(row_to_json(rb))
  INTO v_repairs_by_brand
  FROM (
    SELECT 
      COALESCE(b.name, 'Sin Marca') AS brand_name,
      count(*)::int AS repair_count,
      ROUND(100.0 * count(*) / NULLIF((SELECT count(*) FROM repairs WHERE deleted_at IS NULL), 0), 1) AS percentage
    FROM repairs r
    LEFT JOIN customer_devices cd ON r.device_id = cd.id
    LEFT JOIN models m ON cd.model_id = m.id
    LEFT JOIN brands b ON m.brand_id = b.id
    WHERE r.deleted_at IS NULL
      AND (p_branch_id IS NULL OR r.branch_id = p_branch_id)
    GROUP BY b.name
    ORDER BY repair_count DESC
    LIMIT 8
  ) rb;

  -- 4. Repairs by Model
  SELECT jsonb_agg(row_to_json(rm))
  INTO v_repairs_by_model
  FROM (
    SELECT 
      COALESCE(m.name, 'Sin Modelo') AS model_name,
      COALESCE(b.name, 'Sin Marca') AS brand_name,
      count(*)::int AS repair_count
    FROM repairs r
    LEFT JOIN customer_devices cd ON r.device_id = cd.id
    LEFT JOIN models m ON cd.model_id = m.id
    LEFT JOIN brands b ON m.brand_id = b.id
    WHERE r.deleted_at IS NULL
      AND (p_branch_id IS NULL OR r.branch_id = p_branch_id)
    GROUP BY m.name, b.name
    ORDER BY repair_count DESC
    LIMIT 8
  ) rm;

  -- 5. Common Workshop Issues
  SELECT jsonb_agg(row_to_json(ci))
  INTO v_common_issues
  FROM (
    SELECT 
      COALESCE(NULLIF(TRIM(issue_description), ''), 'Sin especificar') AS issue,
      count(*)::int AS count
    FROM repairs
    WHERE deleted_at IS NULL 
      AND issue_description IS NOT NULL 
      AND issue_description <> ''
      AND (p_branch_id IS NULL OR branch_id = p_branch_id)
    GROUP BY issue
    ORDER BY count DESC
    LIMIT 5
  ) ci;

  RETURN jsonb_build_object(
    'period', jsonb_build_object(
      'range', p_range,
      'start_date', v_start_date,
      'end_date', v_end_date
    ),
    'top_products', COALESCE(v_top_products, '[]'::jsonb),
    'customer_analytics', jsonb_build_object(
      'total_customers', COALESCE(v_total_customers, 0),
      'repeat_customers', COALESCE(v_repeat_customers, 0),
      'repeat_purchase_rate', COALESCE(v_repeat_rate, 0.0),
      'top_customers', COALESCE(v_customer_rfm, '[]'::jsonb)
    ),
    'repair_analytics', jsonb_build_object(
      'by_brand', COALESCE(v_repairs_by_brand, '[]'::jsonb),
      'by_model', COALESCE(v_repairs_by_model, '[]'::jsonb),
      'common_issues', COALESCE(v_common_issues, '[]'::jsonb)
    )
  );
END;
$function$;

REVOKE ALL ON FUNCTION private.get_admin_dashboard_analytics(text, uuid) FROM public;
GRANT EXECUTE ON FUNCTION private.get_admin_dashboard_analytics(text, uuid) TO authenticated, service_role;

DROP FUNCTION IF EXISTS public.get_admin_dashboard_analytics(text, uuid);

CREATE OR REPLACE FUNCTION public.get_admin_dashboard_analytics(
    p_range text DEFAULT 'month'::text,
    p_branch_id uuid DEFAULT NULL::uuid
)
RETURNS jsonb
LANGUAGE sql
SECURITY INVOKER
SET search_path = public, private, pg_temp
AS $$
    SELECT private.get_admin_dashboard_analytics(p_range, p_branch_id);
$$;

REVOKE ALL ON FUNCTION public.get_admin_dashboard_analytics(text, uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.get_admin_dashboard_analytics(text, uuid) TO authenticated, service_role;
COMMENT ON FUNCTION public.get_admin_dashboard_analytics(text, uuid) IS '@security-definer-justification: Wrapper SECURITY INVOKER que delega a private.get_admin_dashboard_analytics';

-- ------------------------------------------------------------------------------
-- 3. get_admin_database_health
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION private.get_admin_database_health()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, private, pg_temp, 'extensions', 'pg_temp'
AS $function$
DECLARE
  v_active_conn int;
  v_max_conn int;
  v_idle_in_tx int;
  v_active_queries int;
  v_cache_hit numeric;
  v_total_locks int;
  v_blocked_locks int;
  v_long_queries int;
  v_table_stats jsonb;
  v_freshness jsonb;
  v_status text := 'healthy';
  v_role text;
  v_current_user text;
BEGIN
  v_current_user := CURRENT_USER;
  SELECT COALESCE(
    current_setting('request.jwt.claim.role', true),
    (SELECT role FROM public.profiles WHERE id = auth.uid()),
    'anon'
  ) INTO v_role;

  -- Security check: super_admin or service_role or postgres internal caller
  IF v_current_user NOT IN ('postgres', 'supabase_admin') 
     AND v_role NOT IN ('super_admin', 'service_role') 
     AND NOT public.is_super_admin() THEN
    RETURN jsonb_build_object('error', 'Acceso denegado. Se requieren privilegios de Super Administrador.');
  END IF;

  -- A. Connections & Transactions
  SELECT count(*) INTO v_active_conn FROM pg_stat_activity;
  v_max_conn := current_setting('max_connections')::int;
  SELECT count(*) INTO v_idle_in_tx FROM pg_stat_activity WHERE state = 'idle in transaction';
  SELECT count(*) INTO v_active_queries FROM pg_stat_activity WHERE state = 'active' AND pid <> pg_backend_pid();

  -- B. Buffer Cache Hit Ratio
  SELECT ROUND(100.0 * sum(blks_hit) / NULLIF(sum(blks_hit + blks_read), 0), 2)
  INTO v_cache_hit
  FROM pg_stat_database WHERE datname = current_database();

  -- C. Locks & Long Queries
  SELECT count(*) INTO v_total_locks FROM pg_locks;
  SELECT count(*) INTO v_blocked_locks FROM pg_locks WHERE NOT granted;
  SELECT count(*) INTO v_long_queries FROM pg_stat_activity WHERE state = 'active' AND now() - query_start > interval '30 minutes' AND pid <> pg_backend_pid();

  -- Health status resolution
  IF (v_blocked_locks > 0 OR v_long_queries > 0 OR (v_active_conn::numeric / NULLIF(v_max_conn, 1) > 0.85)) THEN
    v_status := 'warning';
  END IF;
  IF (v_active_conn::numeric / NULLIF(v_max_conn, 1) > 0.95 OR v_cache_hit < 85.0) THEN
    v_status := 'critical';
  END IF;

  -- D. Table Sizes & Vacuum Stats
  SELECT jsonb_agg(jsonb_build_object(
    'table_name', relname,
    'row_count', n_live_tup,
    'dead_tuples', n_dead_tup,
    'last_autovacuum', to_char(last_autovacuum, 'YYYY-MM-DD HH24:MI:SS'),
    'idx_scan_pct', COALESCE(ROUND(100.0 * idx_scan / NULLIF(idx_scan + seq_scan, 0), 1), 0),
    'total_size', pg_size_pretty(pg_total_relation_size(relid))
  ))
  INTO v_table_stats
  FROM pg_stat_user_tables
  WHERE relname IN ('products', 'orders', 'repairs', 'cash_movements', 'order_items', 'profiles', 'course_enrollments');

  -- E. Data Freshness
  SELECT jsonb_build_object(
    'last_order', (SELECT to_char(MAX(created_at) AT TIME ZONE 'America/Argentina/Buenos_Aires', 'YYYY-MM-DD HH24:MI:SS') FROM orders),
    'last_repair', (SELECT to_char(MAX(received_at) AT TIME ZONE 'America/Argentina/Buenos_Aires', 'YYYY-MM-DD HH24:MI:SS') FROM repairs WHERE deleted_at IS NULL),
    'last_cash_movement', (SELECT to_char(MAX(created_at) AT TIME ZONE 'America/Argentina/Buenos_Aires', 'YYYY-MM-DD HH24:MI:SS') FROM cash_movements),
    'last_enrollment', (SELECT to_char(MAX(created_at) AT TIME ZONE 'America/Argentina/Buenos_Aires', 'YYYY-MM-DD HH24:MI:SS') FROM course_enrollments),
    'last_product', (SELECT to_char(MAX(created_at) AT TIME ZONE 'America/Argentina/Buenos_Aires', 'YYYY-MM-DD HH24:MI:SS') FROM products WHERE deleted_at IS NULL)
  ) INTO v_freshness;

  RETURN jsonb_build_object(
    'status', v_status,
    'connections', jsonb_build_object(
      'active', v_active_conn,
      'max', v_max_conn,
      'percentage', ROUND(100.0 * v_active_conn / NULLIF(v_max_conn, 1), 1),
      'idle_in_transaction', v_idle_in_tx,
      'active_queries', v_active_queries
    ),
    'performance', jsonb_build_object(
      'cache_hit_ratio', COALESCE(v_cache_hit, 100),
      'total_locks', v_total_locks,
      'blocked_locks', v_blocked_locks,
      'long_running_queries', v_long_queries
    ),
    'table_stats', COALESCE(v_table_stats, '[]'::jsonb),
    'data_freshness', v_freshness,
    'links', jsonb_build_object(
      'studio_url', 'https://studio.arecofix.com.ar',
      'db_host', 'db.arecofix.com.ar',
      'posthog_url', 'https://us.posthog.com'
    ),
    'timestamp', to_char(now() AT TIME ZONE 'America/Argentina/Buenos_Aires', 'YYYY-MM-DD HH24:MI:SS')
  );
END;
$function$;

REVOKE ALL ON FUNCTION private.get_admin_database_health() FROM public;
GRANT EXECUTE ON FUNCTION private.get_admin_database_health() TO authenticated, service_role;

DROP FUNCTION IF EXISTS public.get_admin_database_health();

CREATE OR REPLACE FUNCTION public.get_admin_database_health()
RETURNS jsonb
LANGUAGE sql
SECURITY INVOKER
SET search_path = public, private, pg_temp
AS $$
    SELECT private.get_admin_database_health();
$$;

REVOKE ALL ON FUNCTION public.get_admin_database_health() FROM public;
GRANT EXECUTE ON FUNCTION public.get_admin_database_health() TO authenticated, service_role;
COMMENT ON FUNCTION public.get_admin_database_health() IS '@security-definer-justification: Wrapper SECURITY INVOKER que delega a private.get_admin_database_health';

-- ------------------------------------------------------------------------------
-- 4. get_dashboard_stats_v2
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION private.get_dashboard_stats_v2(p_branch_id uuid DEFAULT NULL::uuid)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, private, pg_temp, 'extensions', 'pg_temp'
AS $function$
DECLARE
    result json;
    v_tenant_id uuid;
    v_central_branch_id uuid;
BEGIN
    v_tenant_id := public.get_current_tenant_id();

    IF v_tenant_id IS NULL AND NOT public.is_super_admin() THEN
        RETURN '{}'::json;
    END IF;

    SELECT id INTO v_central_branch_id
    FROM public.branches
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
      AND is_active = true
    ORDER BY (slug IN ('arecofix', 'principal', 'central', 'main')) DESC, id ASC
    LIMIT 1;

    SELECT json_build_object(
        'users', (SELECT count(*) FROM public.profiles WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)),
        'products', (SELECT count(*) FROM public.products WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id) AND deleted_at IS NULL),
        'sales', (SELECT count(*) FROM public.orders
                  WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
                    AND status IN ('paid', 'shipped', 'completed', 'delivered')
                    AND (
                        p_branch_id IS NULL
                        OR branch_id = p_branch_id
                        OR (branch_id IS NULL AND p_branch_id = v_central_branch_id)
                    )),
        'devices_fixed', (SELECT count(*) FROM public.repairs
                          WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
                            AND current_status_id IN (5, 6)
                            AND (
                                p_branch_id IS NULL
                                OR branch_id = p_branch_id
                                OR (branch_id IS NULL AND p_branch_id = v_central_branch_id)
                            )),
        'active_repairs', (SELECT count(*) FROM public.repairs
                           WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
                             AND current_status_id NOT IN (5, 6)
                             AND (
                                 p_branch_id IS NULL
                                 OR branch_id = p_branch_id
                                 OR (branch_id IS NULL AND p_branch_id = v_central_branch_id)
                             ))
    ) INTO result;

    RETURN result;
END;
$function$;

REVOKE ALL ON FUNCTION private.get_dashboard_stats_v2(uuid) FROM public;
GRANT EXECUTE ON FUNCTION private.get_dashboard_stats_v2(uuid) TO authenticated, service_role;

DROP FUNCTION IF EXISTS public.get_dashboard_stats_v2(uuid);

CREATE OR REPLACE FUNCTION public.get_dashboard_stats_v2(p_branch_id uuid DEFAULT NULL::uuid)
RETURNS json
LANGUAGE sql
SECURITY INVOKER
SET search_path = public, private, pg_temp
AS $$
    SELECT private.get_dashboard_stats_v2(p_branch_id);
$$;

REVOKE ALL ON FUNCTION public.get_dashboard_stats_v2(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.get_dashboard_stats_v2(uuid) TO authenticated, service_role;
COMMENT ON FUNCTION public.get_dashboard_stats_v2(uuid) IS '@security-definer-justification: Wrapper SECURITY INVOKER que delega a private.get_dashboard_stats_v2';

-- ------------------------------------------------------------------------------
-- 5. get_financial_analytics_v3
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION private.get_financial_analytics_v3(p_tenant_id uuid, p_start_date timestamp with time zone DEFAULT (now() - '1 year'::interval), p_branch_id uuid DEFAULT NULL::uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, private, pg_temp, 'extensions', 'pg_temp'
AS $function$
DECLARE
    final_output jsonb;
    v_central_branch_id uuid;
BEGIN
    -- Determinar sucursal central para fallback transparente si p_branch_id es la matriz
    SELECT id INTO v_central_branch_id 
    FROM public.branches 
    WHERE tenant_id = p_tenant_id 
      AND is_active = true 
    ORDER BY (slug IN ('arecofix', 'principal', 'central', 'main')) DESC, id ASC 
    LIMIT 1;

    WITH monthly_series AS (
        SELECT to_char(date_trunc('month', d), 'YYYY-MM') AS period,
               to_char(date_trunc('month', d), 'Mon YYYY') AS label_month
        FROM generate_series(date_trunc('month', p_start_date), date_trunc('month', now()), '1 month'::interval) d
    ),
    orders_data AS (
        SELECT 
            to_char(date_trunc('month', o.created_at), 'YYYY-MM') AS period,
            COALESCE(SUM(o.total_amount), 0) AS sales_revenue,
            COALESCE(SUM(oi_agg.total_cost), 0) AS sales_cost
        FROM public.orders o
        LEFT JOIN (
            SELECT order_id, SUM(COALESCE(unit_cost_at_time, 0) * COALESCE(quantity, 1)) AS total_cost 
            FROM public.order_items 
            GROUP BY order_id
        ) oi_agg ON oi_agg.order_id = o.id
        WHERE o.tenant_id = p_tenant_id 
          AND o.created_at >= p_start_date
          AND (
              p_branch_id IS NULL 
              OR o.branch_id = p_branch_id 
              OR (o.branch_id IS NULL AND p_branch_id = v_central_branch_id)
          )
          AND o.status IN ('paid', 'shipped', 'completed', 'delivered')
        GROUP BY 1
    ),
    repairs_data AS (
        SELECT 
            to_char(date_trunc('month', COALESCE(r.completed_at, r.created_at)), 'YYYY-MM') AS period,
            COALESCE(SUM(COALESCE(r.final_cost, r.estimated_cost, 0)), 0) AS repairs_revenue,
            COALESCE(SUM(COALESCE(r.spare_part_cost, 0)), 0) AS repairs_cost
        FROM public.repairs r
        WHERE r.tenant_id = p_tenant_id 
          AND COALESCE(r.completed_at, r.created_at) >= p_start_date
          AND r.current_status_id IN (5, 6) -- Solo reparaciones listas o entregadas
          AND (
              p_branch_id IS NULL 
              OR r.branch_id = p_branch_id 
              OR (r.branch_id IS NULL AND p_branch_id = v_central_branch_id)
          )
        GROUP BY 1
    ),
    cash_expenses AS (
        SELECT 
            to_char(date_trunc('month', cm.created_at), 'YYYY-MM') AS period,
            COALESCE(SUM(cm.amount), 0) AS extra_costs
        FROM public.cash_movements cm
        WHERE cm.tenant_id = p_tenant_id 
          AND cm.type = 'expense' 
          AND cm.category IN ('purchase', 'insumos', 'gasto_fijo') 
          AND cm.created_at >= p_start_date
          AND (
              p_branch_id IS NULL 
              OR cm.branch_id = p_branch_id 
              OR (cm.branch_id IS NULL AND p_branch_id = v_central_branch_id)
          )
        GROUP BY 1
    ),
    consolidated_monthly AS (
        SELECT 
            ms.period,
            COALESCE(o.sales_revenue, 0) AS sales_revenue,
            COALESCE(o.sales_cost, 0) AS sales_cost,
            COALESCE(r.repairs_revenue, 0) AS repairs_revenue,
            COALESCE(r.repairs_cost, 0) AS repairs_cost,
            COALESCE(c.extra_costs, 0) AS extra_costs
        FROM monthly_series ms
        LEFT JOIN orders_data o ON ms.period = o.period
        LEFT JOIN repairs_data r ON ms.period = r.period
        LEFT JOIN cash_expenses c ON ms.period = c.period
        ORDER BY ms.period ASC
    )
    SELECT 
        jsonb_build_object(
            'total_gross_revenue', COALESCE(SUM(sales_revenue + repairs_revenue), 0),
            'total_cost', COALESCE(SUM(sales_cost + repairs_cost + extra_costs), 0),
            'total_net_profit', COALESCE(SUM(sales_revenue + repairs_revenue) - SUM(sales_cost + repairs_cost + extra_costs), 0),
            'current_month_gross', COALESCE(SUM(sales_revenue + repairs_revenue) FILTER (WHERE period = to_char(date_trunc('month', now()), 'YYYY-MM')), 0),
            'current_month_cost', COALESCE(SUM(sales_cost + repairs_cost + extra_costs) FILTER (WHERE period = to_char(date_trunc('month', now()), 'YYYY-MM')), 0),
            'current_month_profit', COALESCE(
                SUM(sales_revenue + repairs_revenue) FILTER (WHERE period = to_char(date_trunc('month', now()), 'YYYY-MM')) - 
                SUM(sales_cost + repairs_cost + extra_costs) FILTER (WHERE period = to_char(date_trunc('month', now()), 'YYYY-MM')), 
                0
            ),
            'monthly_breakdown', COALESCE(jsonb_agg(
                jsonb_build_object(
                    'period', period,
                    'sales_revenue', sales_revenue,
                    'sales_cost', sales_cost,
                    'repairs_revenue', repairs_revenue,
                    'repairs_cost', repairs_cost,
                    'extra_costs', extra_costs,
                    'gross_revenue', sales_revenue + repairs_revenue,
                    'cost', sales_cost + repairs_cost + extra_costs,
                    'net_profit', (sales_revenue + repairs_revenue) - (sales_cost + repairs_cost + extra_costs)
                )
            ), '[]'::jsonb)
        )
    INTO final_output
    FROM consolidated_monthly;

    RETURN final_output;
END;
$function$;

REVOKE ALL ON FUNCTION private.get_financial_analytics_v3(uuid, timestamp with time zone, uuid) FROM public;
GRANT EXECUTE ON FUNCTION private.get_financial_analytics_v3(uuid, timestamp with time zone, uuid) TO authenticated, service_role;

DROP FUNCTION IF EXISTS public.get_financial_analytics_v3(uuid, timestamp with time zone, uuid);

CREATE OR REPLACE FUNCTION public.get_financial_analytics_v3(
    p_tenant_id uuid,
    p_start_date timestamp with time zone DEFAULT (now() - '1 year'::interval),
    p_branch_id uuid DEFAULT NULL::uuid
)
RETURNS jsonb
LANGUAGE sql
SECURITY INVOKER
SET search_path = public, private, pg_temp
AS $$
    SELECT private.get_financial_analytics_v3(p_tenant_id, p_start_date, p_branch_id);
$$;

REVOKE ALL ON FUNCTION public.get_financial_analytics_v3(uuid, timestamp with time zone, uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.get_financial_analytics_v3(uuid, timestamp with time zone, uuid) TO authenticated, service_role;
COMMENT ON FUNCTION public.get_financial_analytics_v3(uuid, timestamp with time zone, uuid) IS '@security-definer-justification: Wrapper SECURITY INVOKER que delega a private.get_financial_analytics_v3';

-- ------------------------------------------------------------------------------
-- 6. Hardening zarx schema functions (convert to SECURITY INVOKER or revoke)
-- ------------------------------------------------------------------------------
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'zarx') THEN
        -- Revoke execute on trigger function handle_new_user
        IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'zarx' AND p.proname = 'handle_new_user') THEN
            REVOKE ALL ON FUNCTION zarx.handle_new_user() FROM public, anon, authenticated;
        END IF;

        -- Convert helpers and RPCs to SECURITY INVOKER
        IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'zarx' AND p.proname = 'is_admin') THEN
            ALTER FUNCTION zarx.is_admin() SECURITY INVOKER;
        END IF;

        IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'zarx' AND p.proname = 'calculate_danger_level') THEN
            ALTER FUNCTION zarx.calculate_danger_level(double precision, double precision, double precision) SECURITY INVOKER;
        END IF;

        IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'zarx' AND p.proname = 'delete_own_account') THEN
            ALTER FUNCTION zarx.delete_own_account() SECURITY INVOKER;
        END IF;

        IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'zarx' AND p.proname = 'get_alerts_in_radius') THEN
            ALTER FUNCTION zarx.get_alerts_in_radius(double precision, double precision, double precision) SECURITY INVOKER;
        END IF;

        IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'zarx' AND p.proname = 'get_heatmap_data') THEN
            ALTER FUNCTION zarx.get_heatmap_data(integer) SECURITY INVOKER;
        END IF;

        IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'zarx' AND p.proname = 'update_fcm_token') THEN
            ALTER FUNCTION zarx.update_fcm_token(text) SECURITY INVOKER;
        END IF;

        IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'zarx' AND p.proname = 'validate_neighbor_report') THEN
            ALTER FUNCTION zarx.validate_neighbor_report(uuid, uuid) SECURITY INVOKER;
        END IF;
    END IF;
END;
$$;

COMMIT;
