@'
COPY (
  WITH linter_findings AS (
    -- 1. rls_policy_always_true
    SELECT
      'rls_policy_always_true' AS category,
      'WARN' AS level,
      'SECURITY' AS type,
      schemaname || '.' || tablename AS object,
      policyname AS detail
    FROM pg_policies
    WHERE (qual = 'true' OR with_check = 'true')
      AND schemaname IN ('public', 'zarx')

    UNION ALL

    -- 2. anon_security_definer_function_executable
    SELECT
      'anon_security_definer_function_executable' AS category,
      'WARN' AS level,
      'SECURITY' AS type,
      n.nspname || '.' || p.proname AS object,
      pg_get_function_identity_arguments(p.oid) AS detail
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname IN ('public', 'zarx')
      AND p.prosecdef = true
      AND has_function_privilege('anon', p.oid, 'EXECUTE')

    UNION ALL

    -- 3. authenticated_security_definer_function_executable
    SELECT
      'authenticated_security_definer_function_executable' AS category,
      'WARN' AS level,
      'SECURITY' AS type,
      n.nspname || '.' || p.proname AS object,
      pg_get_function_identity_arguments(p.oid) AS detail
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname IN ('public', 'zarx')
      AND p.prosecdef = true
      AND has_function_privilege('authenticated', p.oid, 'EXECUTE')

    UNION ALL

    -- 4. function_search_path_mutable
    SELECT
      'function_search_path_mutable' AS category,
      'WARN' AS level,
      'SECURITY' AS type,
      n.nspname || '.' || p.proname AS object,
      pg_get_function_identity_arguments(p.oid) AS detail
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname IN ('public', 'zarx')
      AND p.prokind = 'f'
      AND p.prolang != (SELECT oid FROM pg_language WHERE lanname = 'c')
      AND (p.proconfig IS NULL OR NOT EXISTS (SELECT 1 FROM unnest(p.proconfig) cfg WHERE cfg LIKE 'search_path=%'))


    UNION ALL

    -- 5. extension_in_public
    SELECT
      'extension_in_public' AS category,
      'WARN' AS level,
      'SECURITY' AS type,
      extname AS object,
      extnamespace::regnamespace::text AS detail
    FROM pg_extension
    WHERE extnamespace::regnamespace::text = 'public'

    UNION ALL

    -- 6. public_bucket_allows_listing
    SELECT
      'public_bucket_allows_listing' AS category,
      'WARN' AS level,
      'SECURITY' AS type,
      b.name AS object,
      pol.policyname AS detail
    FROM storage.buckets b
    JOIN pg_policies pol ON pol.schemaname = 'storage' AND pol.tablename = 'objects'
      AND (pol.qual = 'true' OR pol.qual LIKE '%' || quote_literal(b.id) || '%')
    WHERE b.public = true
      AND pol.cmd IN ('SELECT', 'ALL')
      AND (pol.roles @> ARRAY['anon'::name] OR pol.roles @> ARRAY['public'::name])
      AND (pol.qual = 'true' OR pol.qual NOT LIKE '%owner%' AND pol.qual NOT LIKE '%uid()%')


    UNION ALL

    -- 7. pg_graphql_anon_table_exposed
    SELECT
      'pg_graphql_anon_table_exposed' AS category,
      'WARN' AS level,
      'SECURITY' AS type,
      table_schema || '.' || table_name AS object,
      table_type AS detail
    FROM information_schema.tables
    WHERE table_schema IN ('public', 'zarx')
      AND has_table_privilege('anon', quote_ident(table_schema) || '.' || quote_ident(table_name), 'SELECT')

    UNION ALL

    -- 8. pg_graphql_authenticated_table_exposed
    SELECT
      'pg_graphql_authenticated_table_exposed' AS category,
      'WARN' AS level,
      'SECURITY' AS type,
      table_schema || '.' || table_name AS object,
      table_type AS detail
    FROM information_schema.tables
    WHERE table_schema IN ('public', 'zarx')
      AND has_table_privilege('authenticated', quote_ident(table_schema) || '.' || quote_ident(table_name), 'SELECT')

    UNION ALL

    -- 9. rls_enabled_no_policy
    SELECT
      'rls_enabled_no_policy' AS category,
      'INFO' AS level,
      'SECURITY' AS type,
      c.relnamespace::regnamespace::text || '.' || c.relname AS object,
      'Table has RLS enabled but no policies' AS detail
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname IN ('public', 'zarx')
      AND c.relkind = 'r'
      AND c.relrowsecurity = true
      AND NOT EXISTS (
        SELECT 1 FROM pg_policy pol WHERE pol.polrelid = c.oid
      )

    UNION ALL

    -- 10. auth_rls_initplan
    SELECT
      'auth_rls_initplan' AS category,
      'WARN' AS level,
      'PERFORMANCE' AS type,
      schemaname || '.' || tablename AS object,
      policyname AS detail
    FROM pg_policies
    WHERE schemaname IN ('public', 'zarx')
      AND (
        (qual ~* 'auth\.(uid|role|email|jwt)\(\)' AND qual !~* '\(\s*select\s+auth\.(uid|role|email|jwt)\(\)')
        OR
        (with_check ~* 'auth\.(uid|role|email|jwt)\(\)' AND with_check !~* '\(\s*select\s+auth\.(uid|role|email|jwt)\(\)')
      )


    UNION ALL

    -- 11. multiple_permissive_policies
    SELECT
      'multiple_permissive_policies' AS category,
      'WARN' AS level,
      'PERFORMANCE' AS type,
      schemaname || '.' || tablename AS object,
      'Role ' || r || ' has ' || count(*) || ' permissive policies for ' || cmd AS detail
    FROM pg_policies, unnest(roles) r
    WHERE schemaname IN ('public', 'zarx')
      AND permissive = 'PERMISSIVE'
    GROUP BY schemaname, tablename, cmd, r
    HAVING count(*) > 1

    UNION ALL

    -- 12. unindexed_foreign_keys
    SELECT
      'unindexed_foreign_keys' AS category,
      'INFO' AS level,
      'PERFORMANCE' AS type,
      c.conrelid::regclass::text AS object,
      c.conname AS detail
    FROM pg_constraint c
    JOIN pg_namespace n ON n.oid = c.connamespace
    WHERE c.contype = 'f' AND n.nspname IN ('public', 'zarx')
      AND NOT EXISTS (
        SELECT 1
        FROM pg_index i
        WHERE i.indrelid = c.conrelid
          AND (i.indkey::smallint[])[0:array_length(c.conkey, 1) - 1] = c.conkey
      )

    UNION ALL

    -- 13. duplicate_index
    SELECT
      'duplicate_index' AS category,
      'WARN' AS level,
      'PERFORMANCE' AS type,
      t.relname AS object,
      i1.relname || ' and ' || i2.relname AS detail
    FROM pg_index idx1
    JOIN pg_index idx2 ON idx1.indrelid = idx2.indrelid AND idx1.indexrelid < idx2.indexrelid
    JOIN pg_class t ON t.oid = idx1.indrelid
    JOIN pg_class i1 ON i1.oid = idx1.indexrelid
    JOIN pg_class i2 ON i2.oid = idx2.indexrelid
    JOIN pg_namespace n ON n.oid = t.relnamespace
    WHERE n.nspname IN ('public', 'zarx')
      AND idx1.indkey = idx2.indkey
      AND idx1.indexprs IS NOT DISTINCT FROM idx2.indexprs
      AND idx1.indpred IS NOT DISTINCT FROM idx2.indpred

    UNION ALL

    -- 14. no_primary_key
    SELECT
      'no_primary_key' AS category,
      'INFO' AS level,
      'PERFORMANCE' AS type,
      n.nspname || '.' || c.relname AS object,
      'Missing primary key' AS detail
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname IN ('public', 'zarx')
      AND c.relkind = 'r'
      AND NOT EXISTS (
        SELECT 1 FROM pg_constraint con
        WHERE con.conrelid = c.oid AND con.contype = 'p'
      )

    UNION ALL

    -- 15. unused_index
    SELECT
      'unused_index' AS category,
      'INFO' AS level,
      'PERFORMANCE' AS type,
      schemaname || '.' || relname AS object,
      indexrelname || ' (idx_scan: ' || idx_scan || ')' AS detail
    FROM pg_stat_user_indexes
    WHERE schemaname IN ('public', 'zarx')
      AND idx_scan = 0
      AND indexrelname NOT LIKE '%_pkey'
      AND indexrelname NOT LIKE '%_key'
  )
  SELECT category, level, type, object, detail
  FROM linter_findings
  ORDER BY category, object
) TO STDOUT WITH CSV HEADER;
'@ | ssh -i ssh-key-2026-08-30.key -o StrictHostKeyChecking=no ubuntu@ssh.arecofix.com.ar "docker exec -i -e PGPASSWORD=eze321 supabase-db psql -U supabase_admin -d postgres" > docs/assets/db/linter_post_final_20261020.csv