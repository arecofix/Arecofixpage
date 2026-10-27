const fs = require('fs');

function makePrivateDef(sql, name) {
  let res = sql.trim();
  let nameRegex = new RegExp('CREATE OR REPLACE FUNCTION public\\.' + name, 'g');
  res = res.replace(nameRegex, 'CREATE OR REPLACE FUNCTION private.' + name);
  res = res.replace(/SET search_path TO '[^']*'/, 'SET search_path = public, private, pg_temp');
  if (!res.endsWith(';')) {
    res += ';';
  }
  return res;
}

const f1 = fs.readFileSync('docs/assets/db/func_get_admin_business_dashboard_metrics.sql', 'utf8');
const f2 = fs.readFileSync('docs/assets/db/func_get_admin_dashboard_analytics.sql', 'utf8');
const f3 = fs.readFileSync('docs/assets/db/func_get_admin_database_health.sql', 'utf8');
const f4 = fs.readFileSync('docs/assets/db/func_get_dashboard_stats_v2.sql', 'utf8');
const f5 = fs.readFileSync('docs/assets/db/func_get_financial_analytics_v3.sql', 'utf8');

const out = `-- ==============================================================================
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
${makePrivateDef(f1, 'get_admin_business_dashboard_metrics')}

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
${makePrivateDef(f2, 'get_admin_dashboard_analytics')}

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
${makePrivateDef(f3, 'get_admin_database_health')}

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
${makePrivateDef(f4, 'get_dashboard_stats_v2')}

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
${makePrivateDef(f5, 'get_financial_analytics_v3')}

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
`;

fs.writeFileSync('supabase/migrations/20261022070000_harden_authenticated_definer_groupC.sql', out, 'utf8');
console.log('Successfully wrote 20261022070000_harden_authenticated_definer_groupC.sql');
