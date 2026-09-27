-- 20260918000000_fix_linter_issues.sql
-- Fixes multiple security vulnerabilities flagged by the Supabase DB Linter

-- 1. Disable GraphQL exposure for the public schema
-- This resolves: pg_graphql_anon_table_exposed & pg_graphql_authenticated_table_exposed
COMMENT ON SCHEMA public IS '@graphql({"omit": true})';

-- 2. Move pg_net extension to a dedicated schema
-- This resolves: extension_in_public
CREATE SCHEMA IF NOT EXISTS net;
-- NOTE: If pg_net is already installed, this moves it. If it fails due to dependencies, 
-- you may need to update usages of net functions to include the schema prefix.
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_extension WHERE extname = 'pg_net' AND extnamespace = 'public'::regnamespace
    ) THEN
        ALTER EXTENSION pg_net SET SCHEMA net;
    END IF;
END $$;

-- 3. Enable RLS on public tables that missed it
-- This resolves: rls_disabled_in_public
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'schema_migrations') THEN
        ALTER TABLE public.schema_migrations ENABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'knowledge_base') THEN
        ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- 4. Set SECURITY INVOKER on views that were implicitly SECURITY DEFINER
-- This resolves: security_definer_view
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_views WHERE schemaname = 'public' AND viewname = 'admin_notifications') THEN
        ALTER VIEW public.admin_notifications SET (security_invoker = true);
    END IF;
    IF EXISTS (SELECT FROM pg_views WHERE schemaname = 'public' AND viewname = 'academy_students_view') THEN
        ALTER VIEW public.academy_students_view SET (security_invoker = true);
    END IF;
END $$;

-- 5. Fix mutable search paths for all functions in the public schema
-- This resolves: function_search_path_mutable and partially mitigates anon_security_definer_function_executable
DO $$
DECLARE
    rec RECORD;
BEGIN
    FOR rec IN 
        SELECT 
            n.nspname AS schema_name,
            p.proname AS function_name,
            pg_get_function_identity_arguments(p.oid) AS args
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public' 
          AND p.prokind = 'f' -- Only functions
          -- Don't override existing search_path if it's already set to something specific
          AND NOT EXISTS (
              SELECT 1 FROM unnest(p.proconfig) config_item
              WHERE config_item ILIKE 'search_path=%'
          )
    LOOP
        EXECUTE format('ALTER FUNCTION %I.%I(%s) SET search_path = public', 
                       rec.schema_name, rec.function_name, rec.args);
    END LOOP;
END $$;
