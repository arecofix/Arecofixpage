-- 1. Limpiamos cualquier regla conflictiva previa para la tabla 'products'
DROP POLICY IF EXISTS "SuperAdmin Bypass All - Products" ON public.products;
DROP POLICY IF EXISTS "Tenant Owner Isolation - Products" ON public.products;
DROP POLICY IF EXISTS "Branch Staff Isolation - Products" ON public.products;

-- 2. Habilitar RLS en la tabla products (por si acaso no estuviera activo)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 3. POLÍTICA A: SuperAdmin (Ezequiel) tiene acceso global a todos los productos sin restricciones.
CREATE POLICY "SuperAdmin Bypass All - Products" ON public.products
  FOR ALL TO authenticated
  USING (public.get_auth_user_role() = 'super_admin');

-- 4. POLÍTICA B: Tenant Owner (Dueño de empresa). Puede ver y modificar todos los productos de su Tenant/Franquicia.
CREATE POLICY "Tenant Owner Isolation - Products" ON public.products
  FOR ALL TO authenticated
  USING (
    public.get_auth_user_role() = 'tenant_owner' 
    AND tenant_id = public.get_auth_user_tenant()
  );

-- 5. POLÍTICA C: Staff/Admins de Sucursal. Pueden ver y gestionar productos de su Tenant.
-- NOTA: Como la tabla de catálogo 'products' no posee la columna 'branch_id' (los productos son compartidos entre locales),
-- el aislamiento se realiza a nivel de 'tenant_id'. El stock por sucursal se maneja en 'product_stock_per_branch'.
CREATE POLICY "Branch Staff Isolation - Products" ON public.products
  FOR ALL TO authenticated
  USING (
    public.get_auth_user_role() IN ('admin', 'staff', 'technician')
    AND tenant_id = public.get_auth_user_tenant()
  );
