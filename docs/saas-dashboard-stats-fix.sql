-- SQL para crear/Actualizar la función get_dashboard_stats() enfocada en Taller SaaS
-- Incluye métricas de reparaciones, ingresos por reparaciones, y separa datos por Tenant

CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS json AS $$
DECLARE
  v_tenant_id uuid;
  v_users int;
  v_products int;
  v_sales int;
  v_sales_revenue numeric;
  
  v_repairs_month int;
  v_repairs_revenue numeric;
  v_devices_fixed int;
  
  v_sales_chart json;
  v_products_chart json;
  v_category_chart json;
  result json;
BEGIN
  -- 1. Obtener el tenant actual
  v_tenant_id := public.get_my_tenant();

  -- 2. Conteo de Entidades Globales del Tenant
  SELECT COUNT(*) INTO v_users FROM public.profiles WHERE tenant_id = v_tenant_id;
  SELECT COUNT(*) INTO v_products FROM public.products WHERE tenant_id = v_tenant_id AND is_active = true;
  
  -- Ventas (E-Commerce)
  SELECT COUNT(*), COALESCE(SUM(total), 0) INTO v_sales, v_sales_revenue 
  FROM public.orders 
  WHERE tenant_id = v_tenant_id AND status = 'completed' AND deleted_at IS NULL;

  -- 3. Métricas del Taller de Reparaciones (MES ACTUAL)
  SELECT COUNT(*), COALESCE(SUM(final_cost), 0) INTO v_repairs_month, v_repairs_revenue
  FROM public.repairs
  WHERE tenant_id = v_tenant_id 
    AND deleted_at IS NULL
    AND extract(month from created_at) = extract(month from now())
    AND extract(year from created_at) = extract(year from now());

  -- Reparaciones completadas históricas (Equipos arreglados)
  SELECT COUNT(*) INTO v_devices_fixed
  FROM public.repairs
  WHERE tenant_id = v_tenant_id
    AND current_status_id IN (SELECT id FROM repair_status_types WHERE name ILIKE '%entregado%' OR name ILIKE '%reparado%');

  -- 4. Gráficos Chart.js (E-commerce / Ventas)
  -- Ventas por mes 
  SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json) INTO v_sales_chart FROM (
    SELECT to_char(created_at, 'YYYY-MM') as period, SUM(total) as total
    FROM public.orders
    WHERE tenant_id = v_tenant_id AND deleted_at IS NULL
    GROUP BY to_char(created_at, 'YYYY-MM')
    ORDER BY period ASC
    LIMIT 12
  ) t;

  -- Top 5 productos
  SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json) INTO v_products_chart FROM (
    SELECT p.name, SUM(oi.quantity) as quantity
    FROM public.order_items oi
    JOIN public.products p ON oi.product_id = p.id
    WHERE p.tenant_id = v_tenant_id
    GROUP BY p.name
    ORDER BY quantity DESC
    LIMIT 5
  ) t;

  -- Categorias
  SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json) INTO v_category_chart FROM (
    SELECT c.name, COUNT(p.id) as count
    FROM public.categories c
    LEFT JOIN public.products p ON p.category_id = c.id
    WHERE c.tenant_id = v_tenant_id
    GROUP BY c.name
  ) t;

  -- 5. Armar JSON de respuesta
  result := json_build_object(
    'users', v_users,
    'products', v_products,
    'sales', v_sales,
    'revenue', v_sales_revenue,
    'repairs_month', v_repairs_month,
    'repairs_revenue', v_repairs_revenue,
    'devices_fixed', v_devices_fixed,
    'sales_chart', v_sales_chart,
    'products_chart', v_products_chart,
    'category_chart', v_category_chart
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
