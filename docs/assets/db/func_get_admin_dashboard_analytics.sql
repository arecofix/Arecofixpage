CREATE OR REPLACE FUNCTION public.get_admin_dashboard_analytics(p_range text DEFAULT 'month'::text, p_branch_id uuid DEFAULT NULL::uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions', 'pg_temp'
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
$function$
