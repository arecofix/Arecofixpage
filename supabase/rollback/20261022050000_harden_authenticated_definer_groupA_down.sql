-- ==============================================================================
-- Rollback Migration: 20261022050000_harden_authenticated_definer_groupA_down.sql
-- Description: Revert Group A helpers to SECURITY DEFINER
-- ==============================================================================

BEGIN;

ALTER FUNCTION public.can_edit_profile(text) SECURITY DEFINER;
ALTER FUNCTION public.get_auth_user_branch() SECURITY DEFINER;
ALTER FUNCTION public.get_auth_user_role() SECURITY DEFINER;
ALTER FUNCTION public.get_auth_user_tenant() SECURITY DEFINER;
ALTER FUNCTION public.get_my_permissions() SECURITY DEFINER;
ALTER FUNCTION public.get_my_tenant() SECURITY DEFINER;
ALTER FUNCTION public.get_secure_branch_id() SECURITY DEFINER;
ALTER FUNCTION public.get_secure_tenant_id() SECURITY DEFINER;
ALTER FUNCTION public.has_permission(text, uuid) SECURITY DEFINER;
ALTER FUNCTION public.is_admin() SECURITY DEFINER;
ALTER FUNCTION public.is_admin_of_tenant(uuid) SECURITY DEFINER;
ALTER FUNCTION public.is_admin_user() SECURITY DEFINER;
ALTER FUNCTION public.is_super_admin() SECURITY DEFINER;

COMMIT;
