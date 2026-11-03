CREATE OR REPLACE FUNCTION public.get_admin_database_health()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions', 'pg_temp'
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
$function$
