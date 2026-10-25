-- ==============================================================================
-- Rollback Migration: 20261021020000_revoke_anon_security_definer_down.sql
-- Description: Revert privileges revoked by 20261021020000_revoke_anon_security_definer.sql
-- ==============================================================================

BEGIN;

-- Restore public/anon execution on public functions
DO $$
DECLARE
    fn_record RECORD;
BEGIN
    FOR fn_record IN 
        SELECT p.oid, n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) AS args
        FROM pg_proc p
        JOIN pg_namespace n ON n.oid = p.pronamespace
        WHERE n.nspname IN ('public', 'zarx')
    LOOP
        EXECUTE format('GRANT EXECUTE ON FUNCTION %I.%I(%s) TO anon, authenticated, public;', 
                       fn_record.nspname, fn_record.proname, fn_record.args);
    END LOOP;
END $$;

-- Restore match_documents to SECURITY DEFINER
DO $$
DECLARE
    fn_record RECORD;
BEGIN
    FOR fn_record IN 
        SELECT p.oid, n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) AS args
        FROM pg_proc p
        JOIN pg_namespace n ON n.oid = p.pronamespace
        WHERE n.nspname = 'public' AND p.proname = 'match_documents'
    LOOP
        EXECUTE format('ALTER FUNCTION %I.%I(%s) SECURITY DEFINER;', 
                       fn_record.nspname, fn_record.proname, fn_record.args);
    END LOOP;
END $$;

COMMIT;
