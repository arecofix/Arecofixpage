-- =============================================================================
-- MIGRACIÓN: Corrección de Visibilidad de Productos y RLS (v2)
-- Optimizada para roles de Dueño (tenant_owner) y Super Admin.
-- =============================================================================

BEGIN;

-- 1. Eliminar políticas previas para evitar conflictos
DROP POLICY IF EXISTS "products_read_policy" ON public.products;
DROP POLICY IF EXISTS "products_public_read_policy" ON public.products;

-- 2. Nueva política de lectura de productos para usuarios AUTENTICADOS
-- Permite que:
-- - Los admins y dueños vean TODO el inventario de su tenant.
-- - El staff vea los productos globales O los de su sucursal específica.
CREATE POLICY "products_read_policy" ON public.products
FOR SELECT
TO authenticated
USING (
    tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
    AND (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'tenant_owner', 'super_admin')
        OR is_global = true 
        OR branch_id IS NULL
        OR (branch_id = (SELECT branch_id FROM public.profiles WHERE id = auth.uid()))
    )
);

-- 3. Política para acceso PÚBLICO (Anónimo y Autenticado sin filtrar por perfíl)
-- Esto es lo que ven los clientes en la landing /lubrece o en la central.
CREATE POLICY "products_public_read_policy" ON public.products
FOR SELECT
TO anon, authenticated
USING (
    is_active = true 
    AND (is_global = true OR branch_id IS NULL)
);

-- 4. Asegurar integridad: Los productos sin branch_id explícito son globales (de la central)
UPDATE public.products SET is_global = true WHERE branch_id IS NULL;

-- 5. Otorgar permisos de escritura a admins y dueños (por si acaso no estaban finos)
DROP POLICY IF EXISTS "products_insert_policy" ON public.products;
CREATE POLICY "products_insert_policy" ON public.products
FOR INSERT 
TO authenticated
WITH CHECK (
    tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
    AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'tenant_owner', 'super_admin', 'staff')
);

DROP POLICY IF EXISTS "products_update_policy" ON public.products;
CREATE POLICY "products_update_policy" ON public.products
FOR UPDATE 
TO authenticated
USING (
    tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
    AND (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'tenant_owner', 'super_admin')
        OR (
            (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'staff' 
            AND branch_id = (SELECT branch_id FROM public.profiles WHERE id = auth.uid())
        )
    )
);

COMMIT;
