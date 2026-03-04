-- =============================================================================
-- MIGRACIÓN: Corrección de Visibilidad de Productos y RLS
-- =============================================================================

BEGIN;

-- 1. Eliminar política restrictiva previa
DROP POLICY IF EXISTS "products_read_policy" ON public.products;
DROP POLICY IF EXISTS "products_public_read_policy" ON public.products;

-- 2. Nueva política de lectura de productos (Robusta)
-- Permite que:
-- - Los admins vean TODO el inventario de su tenant (incluyendo todas las sucursales).
-- - El staff vea los productos globales O los de su sucursal específica.
CREATE POLICY "products_read_policy" ON public.products
FOR SELECT
TO authenticated
USING (
    tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
    AND (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
        OR is_global = true 
        OR branch_id IS NULL
        OR branch_id = (SELECT branch_id FROM public.profiles WHERE id = auth.uid())
    )
);

-- 3. Política para acceso público (Anónimo)
CREATE POLICY "products_public_read_policy" ON public.products
FOR SELECT
TO anon, authenticated
USING (
    is_active = true 
    AND (is_global = true OR branch_id IS NULL)
);

-- 4. Asegurar que los productos de la central (branch_id IS NULL) sean globales por defecto
UPDATE public.products SET is_global = true WHERE branch_id IS NULL;

COMMIT;
