-- ==============================================================================
-- MIGRATION: 20261104100000_p1_fix_branches_rls.sql
-- DESCRIPTION: P1 Hotfix - Ensure branches_select_anon is dropped and branches_select_authenticated is strictly scoped
-- ==============================================================================

BEGIN;

-- 1. Eliminar branches_select_anon sin excepción
DROP POLICY IF EXISTS "branches_select_anon" ON public.branches;

-- 2. Asegurar branches_select_authenticated (tenant propio, branch asignado o super_admin, sin is_active)
DROP POLICY IF EXISTS "branches_select_authenticated" ON public.branches;

CREATE POLICY "branches_select_authenticated"
ON public.branches
FOR SELECT
TO authenticated
USING (
    tenant_id = get_current_tenant_id() 
    OR id = get_auth_user_branch() 
    OR is_super_admin()
);

NOTIFY pgrst, 'reload schema';

COMMIT;
