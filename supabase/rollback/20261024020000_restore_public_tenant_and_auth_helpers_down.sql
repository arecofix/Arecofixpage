-- ==============================================================================
-- Migration Down: 20261024020000_restore_public_tenant_and_auth_helpers_down.sql
-- Description: Rollback public functions to private schema if needed.
-- ==============================================================================

BEGIN;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'public' AND p.proname = 'get_current_tenant_id') THEN
    ALTER FUNCTION public.get_current_tenant_id() SET SCHEMA private;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'public' AND p.proname = 'get_request_guest_session') THEN
    ALTER FUNCTION public.get_request_guest_session() SET SCHEMA private;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'public' AND p.proname = 'is_admin' AND pg_get_function_identity_arguments(p.oid) = '') THEN
    ALTER FUNCTION public.is_admin() SET SCHEMA private;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'public' AND p.proname = 'is_super_admin') THEN
    ALTER FUNCTION public.is_super_admin() SET SCHEMA private;
  END IF;
END $$;

COMMIT;

NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';
