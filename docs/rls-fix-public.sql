-- SOLUCIÓN DE VISIBILIDAD DE TIENDA PÚBLICA (RLS PARA ANON)
-- Explicación: Este script soluciona el problema de "No se encontraron categorías"
-- y evita que el navbar y los productos aparezcan en blanco para los clientes.

-- 1. Permitir que los usuarios no logueados (anon) puedan leer el tenant principal (arecofix)
DROP POLICY IF EXISTS "Anon can see active tenants" ON public.tenants;
CREATE POLICY "Anon can see active tenants" 
ON public.tenants FOR SELECT 
USING (is_active = true);

-- 2. Permitir que los usuarios no logueados vean productos activos
DROP POLICY IF EXISTS "Anon can see active products" ON public.products;
CREATE POLICY "Anon can see active products" 
ON public.products FOR SELECT 
USING (is_active = true);

-- 3. Permitir ver las categorías y estructurar el menú del navbar
DROP POLICY IF EXISTS "Anon can see active categories" ON public.categories;
CREATE POLICY "Anon can see active categories" 
ON public.categories FOR SELECT 
USING (is_active = true);

-- 4. Permitir ver las marcas de los productos
DROP POLICY IF EXISTS "Anon can see active brands" ON public.brands;
CREATE POLICY "Anon can see active brands" 
ON public.brands FOR SELECT 
USING (is_active = true);

-- 5. Permitir la consulta libre del Stock en las sucursales para el buscador/navbar
DROP POLICY IF EXISTS "Anon can see stock" ON public.product_stock_per_branch;
CREATE POLICY "Anon can see stock" 
ON public.product_stock_per_branch FOR SELECT 
USING (true);

-- 6. Opcional (Servicios del home)
DROP POLICY IF EXISTS "Anon can see active services" ON public.services;
CREATE POLICY "Anon can see active services" 
ON public.services FOR SELECT 
USING (is_active = true);
