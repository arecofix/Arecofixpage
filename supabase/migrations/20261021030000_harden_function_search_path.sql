-- ==============================================================================
-- Migration: 20261021030000_harden_function_search_path.sql
-- Description: Harden function search_path against schema hijacking across public and zarx
-- Severity: HIGH SECURITY (P1)
-- Category: function_search_path_mutable
-- ==============================================================================

BEGIN;

DO $$
DECLARE
    r RECORD;
    v_count INTEGER := 0;
BEGIN
    FOR r IN
        SELECT p.oid, n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) AS args
        FROM pg_proc p
        JOIN pg_namespace n ON n.oid = p.pronamespace
        WHERE n.nspname IN ('public', 'zarx')
          AND p.prokind = 'f'
          AND (p.proconfig IS NULL OR NOT ('search_path=' = ANY(p.proconfig)))
          -- exclude internal C/extension functions that cannot be altered
          AND p.prolang != (SELECT oid FROM pg_language WHERE lanname = 'c')
    LOOP
        BEGIN
            EXECUTE format('ALTER FUNCTION %I.%I(%s) SET search_path = public, extensions, pg_temp;', r.nspname, r.proname, r.args);
            v_count := v_count + 1;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Skipping function %.%(%): %', r.nspname, r.proname, r.args, SQLERRM;
        END;
    END LOOP;
    RAISE NOTICE 'Hardened search_path on % functions.', v_count;
END $$;

COMMIT;
