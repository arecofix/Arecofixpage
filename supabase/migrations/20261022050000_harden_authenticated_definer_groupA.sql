-- ==============================================================================
-- Migration: 20261022050000_harden_authenticated_definer_groupA.sql
-- Description: Convert internal RLS and auth helper functions to SECURITY INVOKER (R4 Group A)
-- Severity: HIGH SECURITY (P1)
-- Category: authenticated_security_definer_function_executable
-- ==============================================================================

BEGIN;

-- Convert authorization and tenant helpers to SECURITY INVOKER
ALTER FUNCTION public.can_edit_profile(text) SECURITY INVOKER;
ALTER FUNCTION public.get_auth_user_branch() SECURITY INVOKER;
ALTER FUNCTION public.get_auth_user_role() SECURITY INVOKER;
ALTER FUNCTION public.get_auth_user_tenant() SECURITY INVOKER;
ALTER FUNCTION public.get_my_permissions() SECURITY INVOKER;
ALTER FUNCTION public.get_my_tenant() SECURITY INVOKER;
ALTER FUNCTION public.get_secure_branch_id() SECURITY INVOKER;
ALTER FUNCTION public.get_secure_tenant_id() SECURITY INVOKER;
ALTER FUNCTION public.has_permission(text, uuid) SECURITY INVOKER;
ALTER FUNCTION public.is_admin() SECURITY INVOKER;
ALTER FUNCTION public.is_admin_of_tenant(uuid) SECURITY INVOKER;
ALTER FUNCTION public.is_admin_user() SECURITY INVOKER;
ALTER FUNCTION public.is_super_admin() SECURITY INVOKER;

-- Add compliance comments
COMMENT ON FUNCTION public.is_admin() IS '@security-definer-justification: SECURITY INVOKER evalúa perfil de auth.uid() sin elevación de privilegios';
COMMENT ON FUNCTION public.is_super_admin() IS '@security-definer-justification: SECURITY INVOKER evalúa claim super_admin en JWT o profile sin elevación';
COMMENT ON FUNCTION public.get_auth_user_tenant() IS '@security-definer-justification: SECURITY INVOKER resuelve tenant_id de auth.uid()';

COMMIT;
