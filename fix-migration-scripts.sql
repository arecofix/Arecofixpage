-- =================================================================
-- SCRIPTS CRÍTICOS PARA RECUPERAR PRODUCTOS POST-MIGRACIÓN MULTI-SUCURSAL
-- =================================================================

-- TAREA A: Actualizar Política RLS para Super Admin
-- =================================================================

-- Eliminar política existente si existe
DROP POLICY IF EXISTS "products_select_final" ON public.products;

-- Crear nueva política que permite al Super Admin ver TODOS los productos
CREATE POLICY "products_select_final" ON public.products
FOR SELECT TO authenticated
USING (
  tenant_id = (SELECT p.tenant_id FROM public.profiles p WHERE p.id = (SELECT auth.uid()))
  AND (
    -- El Súper Admin (role='admin') puede ver TODOS los productos de su empresa
    (SELECT p.role FROM public.profiles p WHERE p.id = (SELECT auth.uid())) = 'admin'
    OR is_global = true 
    OR id IN (SELECT product_id FROM public.product_stock_per_branch WHERE branch_id = (SELECT p.branch_id FROM public.profiles p WHERE p.id = (SELECT auth.uid())))
  )
);

-- TAREA B: Identificar tenant principal y sucursal Central
-- =================================================================

-- Verificar tenant del usuario ezequielenrico15@gmail.com
SELECT 
  t.id as tenant_id,
  t.name as tenant_name,
  p.id as profile_id,
  p.role,
  p.branch_id,
  b.name as branch_name,
  b.slug as branch_slug
FROM public.tenants t
JOIN public.profiles p ON p.tenant_id = t.id  
LEFT JOIN public.branches b ON b.id = p.branch_id
WHERE p.email = 'ezequielenrico15@gmail.com';

-- TAREA C: Migración de Productos Antiguos a Globales
-- =================================================================

-- Paso 1: Identificar productos que necesitan ser migrados
-- (productos que no son globales y no tienen stock por sucursal)
SELECT 
  COUNT(*) as productos_a_migrar,
  'Productos que serán convertidos a globales' as descripcion
FROM public.products 
WHERE is_global = false 
  AND deleted_at IS NULL
  AND id NOT IN (
    SELECT DISTINCT product_id 
    FROM public.product_stock_per_branch 
    WHERE product_id IS NOT NULL
  );

-- Paso 2: Convertir productos antiguos a globales
UPDATE public.products 
SET is_global = true,
    updated_at = NOW()
WHERE is_global = false 
  AND deleted_at IS NULL
  AND id NOT IN (
    SELECT DISTINCT product_id 
    FROM public.product_stock_per_branch 
    WHERE product_id IS NOT NULL
  );

-- Verificar cuántos productos se actualizaron
SELECT 
  COUNT(*) as productos_convertidos_a_globales,
  'Productos ahora marcados como globales' as descripcion
FROM public.products 
WHERE is_global = true AND deleted_at IS NULL;

-- TAREA D: Crear Stock Central para Productos Globales
-- =================================================================

-- Paso 1: Identificar la sucursal central (la primera o la del Super Admin)
-- NOTA: Reemplazar 'TENANT_ID_AQUI' con el ID real del tenant principal
-- Y 'BRANCH_ID_AQUI' con el ID de la sucursal central

-- Primero, encontrar la sucursal central del tenant principal
WITH tenant_principal AS (
  SELECT tenant_id 
  FROM public.profiles 
  WHERE email = 'ezequielenrico15@gmail.com'
  LIMIT 1
),
sucursal_central AS (
  SELECT b.id, b.name, b.slug
  FROM public.branches b
  WHERE b.tenant_id = (SELECT tenant_id FROM tenant_principal)
  ORDER BY b.updated_at ASC  -- Usar updated_at en lugar de created_at
  LIMIT 1
)
SELECT * FROM sucursal_central;

-- Paso 2: Crear registros de stock para productos globales en sucursal central
-- NOTA: Reemplazar 'BRANCH_ID_CENTRAL' con el ID obtenido en la consulta anterior

INSERT INTO public.product_stock_per_branch (
  id,
  product_id, 
  branch_id,
  quantity,
  min_stock_alert,
  tenant_id,
  updated_at
)
SELECT 
  gen_random_uuid(),
  p.id as product_id,
  'BRANCH_ID_CENTRAL'::uuid as branch_id,  -- <-- REEMPLAZAR ESTE VALOR
  COALESCE(p.stock, 0) as quantity,
  COALESCE(p.min_stock_alert, 5) as min_stock_alert,
  p.tenant_id,
  NOW()
FROM public.products p
WHERE p.is_global = true 
  AND p.deleted_at IS NULL
  AND p.id NOT IN (
    SELECT product_id 
    FROM public.product_stock_per_branch 
    WHERE branch_id = 'BRANCH_ID_CENTRAL'::uuid  -- <-- REEMPLAZAR ESTE VALOR
  );

-- Verificar cuántos registros de stock se crearon
SELECT 
  COUNT(*) as stock_creado,
  'Registros de stock creados para productos globales' as descripcion
FROM public.product_stock_per_branch 
WHERE branch_id = 'BRANCH_ID_CENTRAL'::uuid;  -- <-- REEMPLAZAR ESTE VALOR

-- TAREA E: Verificación Final
-- =================================================================

-- Resumen final del estado de los productos
SELECT 
  'RESUMEN FINAL' as tipo,
  COUNT(*) as total,
  'Productos totales (activos)' as descripcion
FROM public.products 
WHERE deleted_at IS NULL

UNION ALL

SELECT 
  'GLOBALES' as tipo,
  COUNT(*) as total,
  'Productos globales (visibles en todas las sucursales)' as descripcion
FROM public.products 
WHERE is_global = true AND deleted_at IS NULL

UNION ALL

SELECT 
  'POR_SUCURSAL' as tipo,
  COUNT(*) as total,
  'Productos exclusivos de sucursales' as descripcion
FROM public.products 
WHERE is_global = false AND deleted_at IS NULL

UNION ALL

SELECT 
  'CON_STOCK' as tipo,
  COUNT(DISTINCT product_id) as total,
  'Productos con stock asignado en sucursales' as descripcion
FROM public.product_stock_per_branch;

-- Verificar productos específicos del Super Admin
SELECT 
  p.name,
  p.sku,
  p.price,
  p.is_global,
  CASE 
    WHEN p.is_global THEN 'Visible en todas las sucursales'
    ELSE 'Solo visible en sucursales específicas'
  END as visibilidad,
  ps.quantity as stock_central
FROM public.products p
LEFT JOIN public.product_stock_per_branch ps ON p.id = ps.product_id 
  AND ps.branch_id = (SELECT b.id FROM public.branches b WHERE b.tenant_id = p.tenant_id ORDER BY b.updated_at ASC LIMIT 1)
WHERE p.deleted_at IS NULL
ORDER BY p.updated_at DESC  -- Usar updated_at en lugar de created_at
LIMIT 20;
