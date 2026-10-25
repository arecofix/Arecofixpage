-- ==============================================================================
-- Migration Down: 20261020010000_fix_critical_security_rls_down.sql
-- Description: Revert RLS and policies on roles, role_permissions, 
--              services_backup_20261018, and blog_posts_backup_20261018.
-- ==============================================================================

BEGIN;

DROP POLICY IF EXISTS roles_read_authenticated ON public.roles;
DROP POLICY IF EXISTS roles_write_super_admin ON public.roles;
ALTER TABLE public.roles DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS role_permissions_read_authenticated ON public.role_permissions;
DROP POLICY IF EXISTS role_permissions_write_super_admin ON public.role_permissions;
ALTER TABLE public.role_permissions DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS services_backup_superadmin_only ON public.services_backup_20261018;
ALTER TABLE public.services_backup_20261018 DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS blog_posts_backup_superadmin_only ON public.blog_posts_backup_20261018;
ALTER TABLE public.blog_posts_backup_20261018 DISABLE ROW LEVEL SECURITY;

COMMIT;
