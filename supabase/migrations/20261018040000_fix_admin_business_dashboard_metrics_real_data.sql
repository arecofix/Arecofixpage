-- ==============================================================================
-- MIGRACIÓN: CORRECCIÓN FORENSE Y SINCRONIZACIÓN DEL DASHBOARD INTEGRAL
-- ARCHIVO: 20261018040000_fix_admin_business_dashboard_metrics_real_data.sql
-- ==============================================================================
-- Causas resueltas:
-- 1. Desacoplamiento de contexto tenant para llamadas service_role y super_admin.
-- 2. Eliminación de referencias a columnas inexistentes (customer_name, device_model, grace_period_until, email en academy_subscriptions).
-- 3. Inclusión de estudiantes confirmados de course_enrollments en la métrica de alumnos.
-- 4. Estructura de retorno unificada (kpis, period, alerts, charts) con aliases retrocompatibles (metrics, trend).
-- 5. Zona horaria de Argentina (America/Argentina/Buenos_Aires - UTC-3) para truncado de fechas.
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.get_admin_business_dashboard_metrics(
    p_tenant_id uuid DEFAULT NULL::uuid,
    p_range text DEFAULT 'month'::text,
    p_start_date timestamp with time zone DEFAULT NULL::timestamp with time zone,
    p_end_date timestamp with time zone DEFAULT NULL::timestamp with time zone,
    p_branch_id uuid DEFAULT NULL::uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

GRANT EXECUTE ON FUNCTION public.get_admin_business_dashboard_metrics(uuid, text, timestamptz, timestamptz, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_business_dashboard_metrics(uuid, text, timestamptz, timestamptz, uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_admin_business_dashboard_metrics(uuid, text, timestamptz, timestamptz, uuid) TO anon;
