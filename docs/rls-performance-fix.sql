-- RESOLUCIÓN DE ADVERTENCIAS DE RENDIMIENTO DE SUPABASE (MULTIPLE POLICIES)
-- Explicación: Este script soluciona los problemas de "multiple permissive policies"
-- aislando las políticas de modo que no se pisen entre el rol 'anon' y el 'authenticated'.

-- 1. SERVICES
-- Borramos la política duplicada ya que Supabase nos avisa que ya existía "Public read access to active services"
DROP POLICY IF EXISTS "Anon can see active services" ON public.services;

-- 2. BRANDS
-- Borramos la genérica y la creamos SÓLO para usuarios anónimos (TO anon). 
-- Los usuarios logueados usarán su propia 'tenant_isolation_policy'.
DROP POLICY IF EXISTS "Anon can see active brands" ON public.brands;
CREATE POLICY "Anon can see active brands" 
ON public.brands FOR SELECT TO anon 
USING (is_active = true);

-- 3. CATEGORIES
DROP POLICY IF EXISTS "Anon can see active categories" ON public.categories;
CREATE POLICY "Anon can see active categories" 
ON public.categories FOR SELECT TO anon 
USING (is_active = true);

-- 4. PRODUCT STOCK
DROP POLICY IF EXISTS "Anon can see stock" ON public.product_stock_per_branch;
CREATE POLICY "Anon can see stock" 
ON public.product_stock_per_branch FOR SELECT TO anon 
USING (true);

-- 5. PRODUCTS
DROP POLICY IF EXISTS "Anon can see active products" ON public.products;
CREATE POLICY "Anon can see active products" 
ON public.products FOR SELECT TO anon 
USING (is_active = true);

-- 6. TENANTS (Opcional por consistencia)
DROP POLICY IF EXISTS "Anon can see active tenants" ON public.tenants;
CREATE POLICY "Anon can see active tenants" 
ON public.tenants FOR SELECT TO anon 
USING (is_active = true);
