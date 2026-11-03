-- ==============================================================================
-- Migration DOWN: 20261022100000_hotfix_restore_definer_recursion_down.sql
-- ==============================================================================

BEGIN;

ALTER FUNCTION public.is_admin() SECURITY INVOKER;
ALTER FUNCTION public.is_super_admin() SECURITY INVOKER;
ALTER FUNCTION public.is_admin_user() SECURITY INVOKER;
ALTER FUNCTION public.is_admin_of_tenant(uuid) SECURITY INVOKER;
ALTER FUNCTION public.get_auth_user_role() SECURITY INVOKER;
ALTER FUNCTION public.get_auth_user_tenant() SECURITY INVOKER;
ALTER FUNCTION public.get_auth_user_branch() SECURITY INVOKER;
ALTER FUNCTION public.get_current_tenant_id() SECURITY INVOKER;
ALTER FUNCTION public.get_secure_tenant_id() SECURITY INVOKER;
ALTER FUNCTION public.get_my_tenant() SECURITY INVOKER;
ALTER FUNCTION public.get_secure_branch_id() SECURITY INVOKER;
ALTER FUNCTION public.has_permission(text, uuid) SECURITY INVOKER;
ALTER FUNCTION public.can_edit_profile(text) SECURITY INVOKER;
ALTER FUNCTION public.get_my_permissions() SECURITY INVOKER;
ALTER FUNCTION public.get_request_guest_session() SECURITY INVOKER;

COMMIT;

NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';
