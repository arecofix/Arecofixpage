CREATE OR REPLACE FUNCTION public.get_financial_analytics_v3(p_tenant_id uuid, p_start_date timestamp with time zone DEFAULT (now() - '1 year'::interval), p_branch_id uuid DEFAULT NULL::uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions', 'pg_temp'
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
$function$
