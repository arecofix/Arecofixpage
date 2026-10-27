-- ====================================================================
-- MIGRATION: 20261012010000_normalize_finances_and_branch_data.sql
-- Description:
--   1. Backfill orphan records with branch_id = NULL for primary tenant
--      (Arecofix -> Central Branch de967f68-7b15-44c0-bc98-952ccf06e1e5).
--   2. Backfill missing completed_at for legacy delivered/completed repairs.
--   3. Normalize vw_cashflow_real and v_monthly_financials.
--   4. Refactor and optimize RPC functions:
--      - get_financial_analytics_v3
--      - get_dashboard_stats_v2
--   5. Add automated fallback triggers to prevent orphan branch_id.
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. BACKFILL ORPHAN BRANCH_ID FOR ARECOFIX TENANT
-- --------------------------------------------------------------------
DO $$
DECLARE
    v_arecofix_tenant uuid := 'bba26ccd-59ce-471c-aac0-4c1f5513de3b';
    v_arecofix_central uuid := 'de967f68-7b15-44c0-bc98-952ccf06e1e5';
    v_zaona_tenant uuid := '550e8400-e29b-41d4-a716-446655440000';
    v_zaona_branch uuid := 'ae0776b7-2034-4baf-acf3-a9dab87a1e51';
BEGIN
    -- Backfill repairs
    UPDATE public.repairs
    SET branch_id = v_arecofix_central
    WHERE tenant_id = v_arecofix_tenant AND branch_id IS NULL;

    -- Backfill orders
    UPDATE public.orders
    SET branch_id = v_arecofix_central
    WHERE tenant_id = v_arecofix_tenant AND branch_id IS NULL;

    -- Backfill cash movements
    UPDATE public.cash_movements
    SET branch_id = v_arecofix_central
    WHERE tenant_id = v_arecofix_tenant AND branch_id IS NULL;

    -- Backfill products
    UPDATE public.products
    SET branch_id = v_arecofix_central
    WHERE tenant_id = v_arecofix_tenant AND branch_id IS NULL;

    UPDATE public.products
    SET branch_id = v_zaona_branch
    WHERE tenant_id = v_zaona_tenant AND branch_id IS NULL;

    -- Backfill brands
    UPDATE public.brands
    SET branch_id = v_arecofix_central
    WHERE tenant_id = v_arecofix_tenant AND branch_id IS NULL;

    -- Backfill purchases
    UPDATE public.purchases
    SET branch_id = v_arecofix_central
    WHERE tenant_id = v_arecofix_tenant AND branch_id IS NULL;

    -- --------------------------------------------------------------------
    -- 2. BACKFILL COMPLETED_AT ON LEGACY FINISHED REPAIRS
    -- --------------------------------------------------------------------
    UPDATE public.repairs
    SET completed_at = COALESCE(updated_at, created_at)
    WHERE current_status_id IN (5, 6) AND completed_at IS NULL;

END $$;

-- --------------------------------------------------------------------
-- 3. NORMALIZE VIEWS: vw_cashflow_real & v_monthly_financials
-- --------------------------------------------------------------------
CREATE OR REPLACE VIEW public.vw_cashflow_real AS
SELECT 
    cm.tenant_id,
    cm.branch_id,
    ('Manual Cash ' || COALESCE(cm.category, 'General')) AS source,
    CASE WHEN cm.type = 'income' THEN cm.amount ELSE 0::numeric END AS net_positive,
    CASE WHEN cm.type = 'expense' THEN cm.amount ELSE 0::numeric END AS net_negative,
    cm.created_at AS date
FROM public.cash_movements cm

UNION ALL

SELECT 
    r.tenant_id,
    r.branch_id,
    'Repair Profit' AS source,
    (COALESCE(r.final_cost, r.estimated_cost, 0::numeric) - COALESCE(r.spare_part_cost, 0::numeric)) AS net_positive,
    0::numeric AS net_negative,
    COALESCE(r.completed_at, r.created_at) AS date
FROM public.repairs r
WHERE r.current_status_id IN (5, 6) -- 5: Listo para retirar, 6: Entregado

UNION ALL

SELECT 
    o.tenant_id,
    o.branch_id,
    'Sale Profit' AS source,
    o.total_amount AS net_positive,
    0::numeric AS net_negative,
    o.created_at AS date
FROM public.orders o
WHERE o.status IN ('completed', 'paid', 'delivered');

DROP VIEW IF EXISTS public.v_monthly_financials;
CREATE VIEW public.v_monthly_financials AS
SELECT 
    r.tenant_id,
    r.branch_id,
    date_trunc('month', COALESCE(r.completed_at, r.created_at)) AS month,
    SUM(COALESCE(r.final_cost, r.estimated_cost, 0::numeric)) AS total_repairs_revenue
FROM public.repairs r
WHERE r.current_status_id IN (5, 6)
GROUP BY r.tenant_id, r.branch_id, date_trunc('month', COALESCE(r.completed_at, r.created_at));

ALTER VIEW public.v_monthly_financials SET (security_invoker = true);

-- --------------------------------------------------------------------
-- 4. REFACTOR & OPTIMIZE get_financial_analytics_v3
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_financial_analytics_v3(
    p_tenant_id uuid,
    p_start_date timestamp with time zone DEFAULT (now() - '1 year'::interval),
    p_branch_id uuid DEFAULT NULL::uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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

-- --------------------------------------------------------------------
-- 5. REFACTOR & OPTIMIZE get_dashboard_stats_v2
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_dashboard_stats_v2(p_branch_id uuid DEFAULT NULL::uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    result json;
    v_tenant_id uuid;
    v_central_branch_id uuid;
BEGIN
    v_tenant_id := get_my_tenant();

    SELECT id INTO v_central_branch_id 
    FROM public.branches 
    WHERE tenant_id = v_tenant_id 
      AND is_active = true 
    ORDER BY (slug IN ('arecofix', 'principal', 'central', 'main')) DESC, id ASC 
    LIMIT 1;

    SELECT json_build_object(
        'users', (SELECT count(*) FROM public.profiles WHERE tenant_id = v_tenant_id),
        'products', (SELECT count(*) FROM public.products WHERE tenant_id = v_tenant_id),
        'sales', (SELECT count(*) FROM public.orders 
                  WHERE tenant_id = v_tenant_id 
                    AND status IN ('paid', 'shipped', 'completed', 'delivered')
                    AND (
                        p_branch_id IS NULL 
                        OR branch_id = p_branch_id 
                        OR (branch_id IS NULL AND p_branch_id = v_central_branch_id)
                    )),
        'devices_fixed', (SELECT count(*) FROM public.repairs 
                          WHERE tenant_id = v_tenant_id 
                            AND current_status_id IN (5, 6)
                            AND (
                                p_branch_id IS NULL 
                                OR branch_id = p_branch_id 
                                OR (branch_id IS NULL AND p_branch_id = v_central_branch_id)
                            ))
    ) INTO result;

    RETURN result;
END;
$function$;

-- --------------------------------------------------------------------
-- 6. PREVENT FUTURE ORPHAN RECORDS: AUTO-ASSIGN DEFAULT BRANCH
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.auto_assign_repair_branch()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    v_user_branch uuid;
BEGIN
    -- 1. Si ya viene con branch_id asignado, lo respetamos
    IF NEW.branch_id IS NOT NULL THEN
        RETURN NEW;
    END IF;

    -- 2. Obtenemos la sucursal del usuario actual
    IF auth.uid() IS NOT NULL THEN
        SELECT branch_id INTO v_user_branch FROM public.profiles WHERE id = auth.uid();
    END IF;

    -- 3. Fallback a la sucursal matriz del tenant si no tiene sucursal
    IF v_user_branch IS NULL THEN
        SELECT id INTO v_user_branch 
        FROM public.branches 
        WHERE tenant_id = NEW.tenant_id AND is_active = true
        ORDER BY (slug IN ('arecofix', 'principal', 'central', 'main')) DESC, id ASC
        LIMIT 1;
    END IF;

    NEW.branch_id := v_user_branch;
    RETURN NEW;
END;
$function$;

-- Auto-assign branch on orders if omitted
CREATE OR REPLACE FUNCTION public.auto_assign_order_branch()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    v_branch uuid;
BEGIN
    IF NEW.branch_id IS NOT NULL THEN
        RETURN NEW;
    END IF;

    IF auth.uid() IS NOT NULL THEN
        SELECT branch_id INTO v_branch FROM public.profiles WHERE id = auth.uid();
    END IF;

    IF v_branch IS NULL THEN
        SELECT id INTO v_branch 
        FROM public.branches 
        WHERE tenant_id = NEW.tenant_id AND is_active = true
        ORDER BY (slug IN ('arecofix', 'principal', 'central', 'main')) DESC, id ASC
        LIMIT 1;
    END IF;

    NEW.branch_id := v_branch;
    RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trg_auto_assign_order_branch ON public.orders;
CREATE TRIGGER trg_auto_assign_order_branch
BEFORE INSERT ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.auto_assign_order_branch();

-- Auto-assign branch on cash_movements if omitted
CREATE OR REPLACE FUNCTION public.auto_assign_cash_branch()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    v_branch uuid;
BEGIN
    IF NEW.branch_id IS NOT NULL THEN
        RETURN NEW;
    END IF;

    IF auth.uid() IS NOT NULL THEN
        SELECT branch_id INTO v_branch FROM public.profiles WHERE id = auth.uid();
    END IF;

    IF v_branch IS NULL THEN
        SELECT id INTO v_branch 
        FROM public.branches 
        WHERE tenant_id = NEW.tenant_id AND is_active = true
        ORDER BY (slug IN ('arecofix', 'principal', 'central', 'main')) DESC, id ASC
        LIMIT 1;
    END IF;

    NEW.branch_id := v_branch;
    RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trg_auto_assign_cash_branch ON public.cash_movements;
CREATE TRIGGER trg_auto_assign_cash_branch
BEFORE INSERT ON public.cash_movements
FOR EACH ROW EXECUTE FUNCTION public.auto_assign_cash_branch();
