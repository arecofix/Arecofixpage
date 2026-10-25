-- ==============================================================================
-- MIGRACIÓN: DASHBOARD INTEGRAL DE NEGOCIO - ARECOFIX
-- ==============================================================================
-- Función RPC: public.get_admin_business_dashboard_metrics
-- Consolida sin queries N+1:
-- 1. Balance del Mes (Ingresos y Egresos de cash_movements)
-- 2. Ventas E-commerce (Orders pagados y monto)
-- 3. Reparaciones Activas y Retrasadas (Repairs)
-- 4. Academia (Suscripciones activas e ingresos de membresías)
-- 5. Stock Crítico (Productos por debajo de min_stock_alert)
-- 6. Gráficos de Tendencia (6 meses y origen de ingresos)
-- 7. Alertas Operativas (Stock, Retiros pendientes > 48h, Vencimiento de gracia)
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.get_admin_business_dashboard_metrics(
    p_tenant_id uuid DEFAULT NULL,
    p_range text DEFAULT 'month',
    p_start_date timestamptz DEFAULT NULL,
    p_end_date timestamptz DEFAULT NULL,
    p_branch_id uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    v_tenant_id uuid;
    v_start timestamptz;
    v_end timestamptz;
    v_result jsonb;
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
BEGIN
    -- 1. Tenant Resolution
    IF p_tenant_id IS NOT NULL THEN
        v_tenant_id := p_tenant_id;
    ELSE
        BEGIN
            v_tenant_id := get_my_tenant();
        EXCEPTION WHEN OTHERS THEN
            v_tenant_id := NULL;
        END;
    END IF;

    -- 2. Date Boundaries
    IF p_start_date IS NOT NULL AND p_end_date IS NOT NULL THEN
        v_start := p_start_date;
        v_end := p_end_date;
    ELSIF p_range = 'today' THEN
        v_start := date_trunc('day', now());
        v_end := now();
    ELSIF p_range = '7days' THEN
        v_start := now() - INTERVAL '7 days';
        v_end := now();
    ELSIF p_range = 'year' THEN
        v_start := date_trunc('year', now());
        v_end := now();
    ELSE -- 'month' por defecto
        v_start := date_trunc('month', now());
        v_end := now();
    END IF;

    -- 3. Caja (Ingresos, Egresos y Balance)
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

    -- 4. Ventas E-commerce
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

    -- 5. Reparaciones
    SELECT 
        COUNT(id),
        COUNT(id) FILTER (WHERE received_at < (now() - INTERVAL '7 days'))
    INTO v_active_repairs_count, v_delayed_repairs_count
    FROM public.repairs
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
      AND (p_branch_id IS NULL OR branch_id = p_branch_id)
      AND deleted_at IS NULL
      AND current_status_id NOT IN (6, 7); -- 6=Entregado, 7=Cancelado

    -- Facturación de reparaciones listas/entregadas en el período para gráfico de origen
    SELECT COALESCE(SUM(COALESCE(final_cost, estimated_cost, 0)), 0)
    INTO v_repairs_revenue
    FROM public.repairs
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
      AND (p_branch_id IS NULL OR branch_id = p_branch_id)
      AND current_status_id IN (5, 6)
      AND COALESCE(completed_at, updated_at, created_at) >= v_start
      AND COALESCE(completed_at, updated_at, created_at) <= v_end;

    -- 6. Suscripciones Academia
    SELECT COUNT(id)
    INTO v_active_subscriptions_count
    FROM public.academy_subscriptions
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
      AND status = 'active';

    SELECT COALESCE(SUM(amount), 0)
    INTO v_academy_revenue
    FROM public.academy_payments
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
      AND status = 'approved'
      AND created_at >= v_start
      AND created_at <= v_end;

    -- 7. Stock Crítico
    SELECT COUNT(id)
    INTO v_critical_stock_count
    FROM public.products
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
      AND (p_branch_id IS NULL OR branch_id = p_branch_id OR is_global = true)
      AND deleted_at IS NULL
      AND is_active = true
      AND stock <= COALESCE(min_stock_alert, 5);

    -- Lista de productos para el Centro de Alertas
    SELECT COALESCE(jsonb_agg(sub), '[]'::jsonb)
    INTO v_critical_stock_items
    FROM (
        SELECT id, name, sku, stock, COALESCE(min_stock_alert, 5) AS min_stock_alert, price
        FROM public.products
        WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
          AND (p_branch_id IS NULL OR branch_id = p_branch_id OR is_global = true)
          AND deleted_at IS NULL
          AND is_active = true
          AND stock <= COALESCE(min_stock_alert, 5)
        ORDER BY stock ASC, name ASC
        LIMIT 10
    ) sub;

    -- Reparaciones listas para retirar > 48hs
    SELECT COALESCE(jsonb_agg(sub), '[]'::jsonb)
    INTO v_overdue_pickup_repairs
    FROM (
        SELECT 
            r.id,
            r.tracking_code,
            COALESCE(p.first_name || ' ' || p.last_name, 'Cliente') AS client_name,
            COALESCE(r.completed_at, r.updated_at, r.created_at) AS ready_since,
            ROUND(EXTRACT(EPOCH FROM (now() - COALESCE(r.completed_at, r.updated_at, r.created_at))) / 3600)::integer AS hours_waiting,
            r.final_cost
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

    -- Suscripciones en grace_period que están por vencer (<= 3 días)
    SELECT COALESCE(jsonb_agg(sub), '[]'::jsonb)
    INTO v_expiring_grace_subscriptions
    FROM (
        SELECT 
            s.id,
            s.user_id,
            u.email AS user_email,
            COALESCE(prof.first_name || ' ' || prof.last_name, u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)) AS student_name,
            s.grace_period_ends_at,
            GREATEST(0, ROUND(EXTRACT(EPOCH FROM (s.grace_period_ends_at - now())) / 86400))::integer AS days_left
        FROM public.academy_subscriptions s
        JOIN auth.users u ON u.id = s.user_id
        LEFT JOIN public.profiles prof ON prof.id = s.user_id
        WHERE (v_tenant_id IS NULL OR s.tenant_id = v_tenant_id)
          AND s.status = 'grace_period'
          AND s.grace_period_ends_at <= (now() + INTERVAL '3 days')
        ORDER BY s.grace_period_ends_at ASC
        LIMIT 10
    ) sub;

    -- 8. Gráfico de Tendencia (Últimos 6 meses de Ingresos vs Egresos)
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
        'income', COALESCE(mc.income, 0),
        'expense', COALESCE(mc.expense, 0),
        'net_balance', COALESCE(mc.income, 0) - COALESCE(mc.expense, 0)
    ) ORDER BY m.period ASC), '[]'::jsonb)
    INTO v_trend_6_months
    FROM months m
    LEFT JOIN monthly_cash mc ON mc.period = m.period;

    -- 9. Origen de Ingresos (E-commerce, Reparaciones, Academia)
    v_revenue_by_origin := jsonb_build_object(
        'ecommerce', v_ecommerce_amount,
        'repairs', v_repairs_revenue,
        'academy', v_academy_revenue
    );

    -- 10. Consolidación Final
    v_result := jsonb_build_object(
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
            'critical_stock_items', v_critical_stock_items,
            'overdue_pickup_repairs', v_overdue_pickup_repairs,
            'expiring_grace_subscriptions', v_expiring_grace_subscriptions
        ),
        'charts', jsonb_build_object(
            'trend_6_months', v_trend_6_months,
            'revenue_by_origin', v_revenue_by_origin
        )
    );

    RETURN v_result;
END;
$function$;

-- Conceder permisos de ejecución a authenticated y service_role
GRANT EXECUTE ON FUNCTION public.get_admin_business_dashboard_metrics(uuid, text, timestamptz, timestamptz, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_business_dashboard_metrics(uuid, text, timestamptz, timestamptz, uuid) TO service_role;
