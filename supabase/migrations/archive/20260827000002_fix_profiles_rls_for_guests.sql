-- Permitir a los empleados (staff, branch_admin) actualizar perfiles de clientes invitados (is_guest = true)
-- Reemplaza la política anterior que sólo permitía a super_admin, tenant_owner, admin y al propio usuario.

DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;

CREATE POLICY "profiles_update_policy"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  auth.uid() = id 
  OR public.is_admin_user() 
  OR (is_guest = true AND tenant_id = public.get_my_tenant())
)
WITH CHECK (
  auth.uid() = id 
  OR public.is_admin_user() 
  OR (is_guest = true AND tenant_id = public.get_my_tenant())
);

-- Recargar esquema de PostgREST
NOTIFY pgrst, 'reload schema';
