-- ==============================================================================
-- Migration: 20261022070000_harden_authenticated_definer_groupC_down.sql
-- Description: Revert Group C admin analytics RPC hardening and zarx
-- ==============================================================================

BEGIN;

-- 1. get_admin_business_dashboard_metrics
DROP FUNCTION IF EXISTS public.get_admin_business_dashboard_metrics(uuid, text, timestamp with time zone, timestamp with time zone, uuid);
DROP FUNCTION IF EXISTS private.get_admin_business_dashboard_metrics(uuid, text, timestamp with time zone, timestamp with time zone, uuid);

-- 2. get_admin_dashboard_analytics
DROP FUNCTION IF EXISTS public.get_admin_dashboard_analytics(text, uuid);
DROP FUNCTION IF EXISTS private.get_admin_dashboard_analytics(text, uuid);

-- 3. get_admin_database_health
DROP FUNCTION IF EXISTS public.get_admin_database_health();
DROP FUNCTION IF EXISTS private.get_admin_database_health();

-- 4. get_dashboard_stats_v2
DROP FUNCTION IF EXISTS public.get_dashboard_stats_v2(uuid);
DROP FUNCTION IF EXISTS private.get_dashboard_stats_v2(uuid);

-- 5. get_financial_analytics_v3
DROP FUNCTION IF EXISTS public.get_financial_analytics_v3(uuid, timestamp with time zone, uuid);
DROP FUNCTION IF EXISTS private.get_financial_analytics_v3(uuid, timestamp with time zone, uuid);

-- 6. zarx schema revert
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'zarx') THEN
        IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'zarx' AND p.proname = 'handle_new_user') THEN
            GRANT EXECUTE ON FUNCTION zarx.handle_new_user() TO authenticated, anon;
        END IF;

        IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'zarx' AND p.proname = 'is_admin') THEN
            ALTER FUNCTION zarx.is_admin() SECURITY DEFINER;
        END IF;

        IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'zarx' AND p.proname = 'calculate_danger_level') THEN
            ALTER FUNCTION zarx.calculate_danger_level(double precision, double precision, double precision) SECURITY DEFINER;
        END IF;

        IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'zarx' AND p.proname = 'delete_own_account') THEN
            ALTER FUNCTION zarx.delete_own_account() SECURITY DEFINER;
        END IF;

        IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'zarx' AND p.proname = 'get_alerts_in_radius') THEN
            ALTER FUNCTION zarx.get_alerts_in_radius(double precision, double precision, double precision) SECURITY DEFINER;
        END IF;

        IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'zarx' AND p.proname = 'get_heatmap_data') THEN
            ALTER FUNCTION zarx.get_heatmap_data(integer) SECURITY DEFINER;
        END IF;

        IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'zarx' AND p.proname = 'update_fcm_token') THEN
            ALTER FUNCTION zarx.update_fcm_token(text) SECURITY DEFINER;
        END IF;

        IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'zarx' AND p.proname = 'validate_neighbor_report') THEN
            ALTER FUNCTION zarx.validate_neighbor_report(uuid, uuid) SECURITY DEFINER;
        END IF;
    END IF;
END;
$$;

COMMIT;
