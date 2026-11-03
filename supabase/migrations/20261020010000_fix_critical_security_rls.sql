-- ==============================================================================
-- Migration: 20261020010000_fix_critical_security_rls.sql
-- Description: Enable RLS and secure policies on roles, role_permissions, 
--              services_backup_20261018, and blog_posts_backup_20261018.
-- Severity: CRITICAL SECURITY AUDIT FIX
-- ==============================================================================

BEGIN;

-- 1. Enable RLS on public.roles
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS roles_read_authenticated ON public.roles;
CREATE POLICY roles_read_authenticated ON public.roles
    FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS roles_write_super_admin ON public.roles;
CREATE POLICY roles_write_super_admin ON public.roles
    FOR ALL
    TO authenticated
    USING (is_super_admin())
    WITH CHECK (is_super_admin());

-- 2. Enable RLS on public.role_permissions
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS role_permissions_read_authenticated ON public.role_permissions;
CREATE POLICY role_permissions_read_authenticated ON public.role_permissions
    FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS role_permissions_write_super_admin ON public.role_permissions;
CREATE POLICY role_permissions_write_super_admin ON public.role_permissions
    FOR ALL
    TO authenticated
    USING (is_super_admin())
    WITH CHECK (is_super_admin());

-- 3. Enable RLS and isolate public.services_backup_20261018
ALTER TABLE public.services_backup_20261018 ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS services_backup_superadmin_only ON public.services_backup_20261018;
CREATE POLICY services_backup_superadmin_only ON public.services_backup_20261018
    FOR ALL
    TO authenticated
    USING (is_super_admin())
    WITH CHECK (is_super_admin());

REVOKE ALL ON public.services_backup_20261018 FROM anon, authenticated, public;
GRANT ALL ON public.services_backup_20261018 TO service_role, postgres;

-- 4. Enable RLS and isolate public.blog_posts_backup_20261018
ALTER TABLE public.blog_posts_backup_20261018 ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS blog_posts_backup_superadmin_only ON public.blog_posts_backup_20261018;
CREATE POLICY blog_posts_backup_superadmin_only ON public.blog_posts_backup_20261018
    FOR ALL
    TO authenticated
    USING (is_super_admin())
    WITH CHECK (is_super_admin());

REVOKE ALL ON public.blog_posts_backup_20261018 FROM anon, authenticated, public;
GRANT ALL ON public.blog_posts_backup_20261018 TO service_role, postgres;

COMMIT;
