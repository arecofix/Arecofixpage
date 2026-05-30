-- 1. Limpiamos cualquier regla conflictiva previa para la tabla 'categories'
DROP POLICY IF EXISTS "SuperAdmin Bypass All - Categories" ON public.categories;
DROP POLICY IF EXISTS "Tenant Owner Isolation - Categories" ON public.categories;
DROP POLICY IF EXISTS "Branch Staff Isolation - Categories" ON public.categories;

-- 2. Habilitar RLS en la tabla categories (por si acaso no estuviera activo)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 3. POLÍTICA A: SuperAdmin (Ezequiel) tiene acceso global a todas las categorías sin restricciones.
CREATE POLICY "SuperAdmin Bypass All - Categories" ON public.categories
  FOR ALL TO authenticated
  USING (public.get_auth_user_role() = 'super_admin');

-- 4. POLÍTICA B: Tenant Owner (Dueño de empresa). Puede ver y modificar todas las categorías de su Tenant.
CREATE POLICY "Tenant Owner Isolation - Categories" ON public.categories
  FOR ALL TO authenticated
  USING (
    public.get_auth_user_role() = 'tenant_owner' 
    AND tenant_id = public.get_auth_user_tenant()
  );

-- 5. POLÍTICA C: Staff/Admins de Sucursal. Pueden ver y gestionar categorías de su Tenant.
CREATE POLICY "Branch Staff Isolation - Categories" ON public.categories
  FOR ALL TO authenticated
  USING (
    public.get_auth_user_role() IN ('admin', 'staff', 'technician')
    AND tenant_id = public.get_auth_user_tenant()
  );
