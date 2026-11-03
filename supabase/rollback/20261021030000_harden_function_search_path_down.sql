-- ==============================================================================
-- Rollback Migration: 20261021030000_harden_function_search_path_down.sql
-- Description: Revert search_path configuration on functions in public and zarx
-- ==============================================================================

BEGIN;

DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT p.oid, n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) AS args
        FROM pg_proc p
        JOIN pg_namespace n ON n.oid = p.pronamespace
        WHERE n.nspname IN ('public', 'zarx')
          AND p.prokind = 'f'
          AND ('search_path=public, extensions, pg_temp' = ANY(p.proconfig))
    LOOP
        BEGIN
            EXECUTE format('ALTER FUNCTION %I.%I(%s) RESET search_path;', r.nspname, r.proname, r.args);
        EXCEPTION WHEN OTHERS THEN
            NULL;
        END;
    END LOOP;
END $$;

COMMIT;
