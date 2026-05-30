-- 1. Habilitar lectura pública de productos activos
DROP POLICY IF EXISTS "Public View - Products" ON public.products;
CREATE POLICY "Public View - Products" ON public.products
  FOR SELECT TO anon
  USING (is_active = true AND deleted_at IS NULL);

-- 2. Habilitar lectura pública de categorías activas
DROP POLICY IF EXISTS "Public View - Categories" ON public.categories;
CREATE POLICY "Public View - Categories" ON public.categories
  FOR SELECT TO anon
  USING (is_active = true AND deleted_at IS NULL);

-- 3. Habilitar lectura pública de marcas activas
DROP POLICY IF EXISTS "Public View - Brands" ON public.brands;
CREATE POLICY "Public View - Brands" ON public.brands
  FOR SELECT TO anon
  USING (is_active = true AND deleted_at IS NULL);

-- 4. Habilitar lectura pública de stock (necesario para el catálogo web si muestra "Sin Stock")
DROP POLICY IF EXISTS "Public View - Stock" ON public.product_stock_per_branch;
CREATE POLICY "Public View - Stock" ON public.product_stock_per_branch
  FOR SELECT TO anon
  USING (true);

-- 5. Habilitar lectura pública de tenants activos
DROP POLICY IF EXISTS "Public View - Tenants" ON public.tenants;
CREATE POLICY "Public View - Tenants" ON public.tenants
  FOR SELECT TO anon
  USING (is_active = true);

-- Asegurar lectura para authenticated general que quiera ver el catálogo (clientes logueados sin rol admin/staff)
DROP POLICY IF EXISTS "Authenticated View - Products" ON public.products;
CREATE POLICY "Authenticated View - Products" ON public.products
  FOR SELECT TO authenticated
  USING (is_active = true AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Authenticated View - Categories" ON public.categories;
CREATE POLICY "Authenticated View - Categories" ON public.categories
  FOR SELECT TO authenticated
  USING (is_active = true AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Authenticated View - Brands" ON public.brands;
CREATE POLICY "Authenticated View - Brands" ON public.brands
  FOR SELECT TO authenticated
  USING (is_active = true AND deleted_at IS NULL);
