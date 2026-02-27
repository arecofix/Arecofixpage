-- ============================================================
-- FIX DEFINITIVO: RLS PARA CATÁLOGO PÚBLICO (ANON)
-- Ejecutar en Supabase SQL Editor
-- ============================================================
-- Garantiza que usuarios NO logueados puedan leer el catálogo
-- (productos, categorías, marcas, stock) correctamente.
-- ============================================================

-- ── TENANTS ──────────────────────────────────────────────────
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anon can see active tenants" ON public.tenants;
CREATE POLICY "Anon can see active tenants"
ON public.tenants FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- ── CATEGORIES ───────────────────────────────────────────────
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anon can see active categories" ON public.categories;
CREATE POLICY "Anon can see active categories"
ON public.categories FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- ── PRODUCTS ─────────────────────────────────────────────────
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anon can see active products" ON public.products;
CREATE POLICY "Anon can see active products"
ON public.products FOR SELECT
TO anon, authenticated
USING (is_active = true AND deleted_at IS NULL);

-- ── BRANDS ───────────────────────────────────────────────────
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anon can see active brands" ON public.brands;
CREATE POLICY "Anon can see active brands"
ON public.brands FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- ── PRODUCT STOCK PER BRANCH ──────────────────────────────────
ALTER TABLE public.product_stock_per_branch ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anon can see stock" ON public.product_stock_per_branch;
CREATE POLICY "Anon can see stock"
ON public.product_stock_per_branch FOR SELECT
TO anon, authenticated
USING (true);

-- ── SERVICES (si se usan en páginas públicas) ────────────────
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anon can see active services" ON public.services;
CREATE POLICY "Anon can see active services"
ON public.services FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- ── VERIFICACIÓN: ejecutar para ver cuántos productos activos hay
-- SELECT COUNT(*) FROM products WHERE is_active = true AND deleted_at IS NULL;
-- SELECT COUNT(*) FROM categories WHERE is_active = true AND type = 'product';
-- SELECT * FROM categories WHERE type = 'product' AND is_active = true;
