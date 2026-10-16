-- ==============================================================================
-- TSK-04 & TSK-05: Enforce STRICT Isolation AND explicit Permission logic
-- Drop old permissive policies and create granular permission policies.
-- ==============================================================================

BEGIN;

-- 1. Drop existing permissive policies on repairs
DROP POLICY IF EXISTS "repairs_final_policy" ON public.repairs;
DROP POLICY IF EXISTS "Branch Staff Isolation" ON public.repairs;
DROP POLICY IF EXISTS "Tenant Owner Isolation" ON public.repairs;
DROP POLICY IF EXISTS "SuperAdmin Bypass All" ON public.repairs;
DROP POLICY IF EXISTS "service_role_all_repairs" ON public.repairs;
DROP POLICY IF EXISTS "super_admin_all_access" ON public.repairs;

-- 2. Create RESTRICTIVE Policy for Tenant Isolation 
-- This ensures no permissive policy can ever bypass the tenant boundary, 
-- except for super_admin who may need cross-tenant access.
CREATE POLICY "repairs_tenant_isolation_restrictive" ON public.repairs
AS RESTRICTIVE FOR ALL
USING (
  tenant_id = public.get_my_tenant() 
  OR public.get_auth_user_role() = 'super_admin'
);

-- 3. Create PERMISSIVE Policies for Access based on the new Role/Permission schema
CREATE POLICY "repairs_read_permission" ON public.repairs
FOR SELECT
USING (
  public.has_permission('repairs:read:branch', branch_id) OR
  public.has_permission('repairs:read:global', NULL) OR
  public.get_auth_user_role() = 'super_admin'
);

CREATE POLICY "repairs_insert_permission" ON public.repairs
FOR INSERT
WITH CHECK (
  public.has_permission('repairs:create:branch', branch_id) OR
  public.has_permission('repairs:create:global', NULL) OR
  public.get_auth_user_role() = 'super_admin'
);

CREATE POLICY "repairs_update_permission" ON public.repairs
FOR UPDATE
USING (
  public.has_permission('repairs:edit:branch', branch_id) OR
  public.has_permission('repairs:edit:global', NULL) OR
  public.get_auth_user_role() = 'super_admin'
)
WITH CHECK (
  public.has_permission('repairs:edit:branch', branch_id) OR
  public.has_permission('repairs:edit:global', NULL) OR
  public.get_auth_user_role() = 'super_admin'
);

CREATE POLICY "repairs_delete_permission" ON public.repairs
FOR DELETE
USING (
  public.get_auth_user_role() = 'super_admin'
  -- Soft deletes are usually used, but if hard delete happens, restrict to super admin
);

COMMIT;
