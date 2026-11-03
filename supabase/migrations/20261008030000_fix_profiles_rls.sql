-- ==============================================================================
-- TSK-01: Fix RLS de Perfiles (Lectura de clientes y limpieza masiva)
-- ==============================================================================

BEGIN;

-- 1. Drop ALL existing policies to clean up the 14+ chaotic policies
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Branch Staff Isolation" ON public.profiles;
DROP POLICY IF EXISTS "Filter_Soft_Deleted_Profiles" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "SuperAdmin Bypass All" ON public.profiles;
DROP POLICY IF EXISTS "Tenant profiles visibility" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_master_isolation" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "super_admin_all_access" ON public.profiles;
DROP POLICY IF EXISTS "profiles_tenant_isolation_restrictive" ON public.profiles;
DROP POLICY IF EXISTS "profiles_read_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_read_permission" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_permission" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_permission" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_permission" ON public.profiles;

-- 2. Prevent Infinite Recursion: Make helper functions SECURITY DEFINER
-- If these functions query `profiles` while being evaluated in `profiles` RLS, it loops infinitely.
ALTER FUNCTION public.get_auth_user_role() SECURITY DEFINER;
ALTER FUNCTION public.get_auth_user_tenant() SECURITY DEFINER;
ALTER FUNCTION public.get_auth_user_branch() SECURITY DEFINER;

-- 3. Restrictive Policy: Tenant Isolation
-- Users can only see/modify profiles if:
-- a) It's their own profile (id = auth.uid()) OR
-- b) It belongs to their tenant (tenant_id = get_auth_user_tenant()) OR
-- c) They are a super_admin
CREATE POLICY "profiles_tenant_isolation_restrictive" ON public.profiles
AS RESTRICTIVE FOR ALL
USING (
  id = auth.uid()
  OR tenant_id = public.get_auth_user_tenant()
  OR public.get_auth_user_role() = 'super_admin'
);

-- 4. Permissive Policies: Self Management
CREATE POLICY "profiles_read_own" ON public.profiles
FOR SELECT
USING (id = auth.uid());

CREATE POLICY "profiles_update_own" ON public.profiles
FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_insert_own" ON public.profiles
FOR INSERT
WITH CHECK (id = auth.uid());

-- 5. Permissive Policies: RBAC Permissions for Staff / Admins
CREATE POLICY "profiles_read_permission" ON public.profiles
FOR SELECT
USING (
  public.has_permission('customers:manage:branch', branch_id) OR
  public.has_permission('customers:manage:global', NULL) OR
  public.get_auth_user_role() = 'super_admin'
);

CREATE POLICY "profiles_insert_permission" ON public.profiles
FOR INSERT
WITH CHECK (
  public.has_permission('customers:manage:branch', branch_id) OR
  public.has_permission('customers:manage:global', NULL) OR
  public.get_auth_user_role() = 'super_admin'
);

CREATE POLICY "profiles_update_permission" ON public.profiles
FOR UPDATE
USING (
  public.has_permission('customers:manage:branch', branch_id) OR
  public.has_permission('customers:manage:global', NULL) OR
  public.get_auth_user_role() = 'super_admin'
)
WITH CHECK (
  public.has_permission('customers:manage:branch', branch_id) OR
  public.has_permission('customers:manage:global', NULL) OR
  public.get_auth_user_role() = 'super_admin'
);

CREATE POLICY "profiles_delete_permission" ON public.profiles
FOR DELETE
USING (
  public.get_auth_user_role() = 'super_admin'
);

COMMIT;
