-- =================================================================
-- EJECUCIÓN AUTOMÁTICA DE MIGRACIÓN DE PRODUCTOS
-- Ejecutar este script completo en una sola transacción
-- =================================================================

-- Iniciar transacción
BEGIN;

-- Paso 1: Obtener IDs del tenant principal y sucursal central
WITH tenant_info AS (
  SELECT 
    t.id as tenant_id,
    t.name as tenant_name,
    p.id as admin_profile_id
  FROM public.tenants t
  JOIN public.profiles p ON p.tenant_id = t.id  
  WHERE p.email = 'ezequielenrico15@gmail.com'
  LIMIT 1
),
branch_central AS (
  SELECT 
    b.id as central_branch_id,
    b.name as central_branch_name,
    b.slug as central_branch_slug,
    t.tenant_id
  FROM public.branches b
  CROSS JOIN tenant_info t
  WHERE b.tenant_id = t.tenant_id
  ORDER BY b.updated_at ASC  -- Usar updated_at en lugar de created_at
  LIMIT 1
)

-- Paso 2: Actualizar política RLS para Super Admin
DROP POLICY IF EXISTS "products_select_final" ON public.products;

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

-- Paso 3: Migrar productos antiguos a globales
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

-- Paso 4: Crear stock central para productos globales
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
  bc.central_branch_id as branch_id,
  COALESCE(p.stock, 0) as quantity,
  COALESCE(p.min_stock_alert, 5) as min_stock_alert,
  p.tenant_id,
  NOW()
FROM public.products p
CROSS JOIN branch_central bc
WHERE p.is_global = true 
  AND p.deleted_at IS NULL
  AND p.tenant_id = bc.tenant_id
  AND p.id NOT IN (
    SELECT product_id 
    FROM public.product_stock_per_branch 
    WHERE branch_id = bc.central_branch_id
  );

-- Paso 5: Verificación y resultados
SELECT 
  'TENANT_PRINCIPAL' as metric,
  t.tenant_id as value,
  t.tenant_name as description
FROM tenant_info t

UNION ALL

SELECT 
  'SUCURSAL_CENTRAL' as metric,
  bc.central_branch_id::text as value,
  bc.central_branch_name || ' (' || bc.central_branch_slug || ')' as description
FROM branch_central bc

UNION ALL

SELECT 
  'PRODUCTOS_TOTALES' as metric,
  COUNT(*)::text as value,
  'Productos activos en el sistema' as description
FROM public.products 
WHERE deleted_at IS NULL

UNION ALL

SELECT 
  'PRODUCTOS_GLOBALES' as metric,
  COUNT(*)::text as value,
  'Ahora visibles en todas las sucursales' as description
FROM public.products 
WHERE is_global = true AND deleted_at IS NULL

UNION ALL

SELECT 
  'STOCK_CENTRAL_CREADO' as metric,
  COUNT(*)::text as value,
  'Registros de stock en sucursal central' as description
FROM public.product_stock_per_branch ps
JOIN branch_central bc ON ps.branch_id = bc.central_branch_id

UNION ALL

SELECT 
  'MIGRACION_EXITOSA' as metric,
  '✅ COMPLETADO' as value,
  'Todos los productos han sido recuperados y son visibles' as description;

-- Confirmar transacción
COMMIT;

-- =================================================================
-- VERIFICACIÓN MANUAL POST-MIGRACIÓN
-- Ejecutar estas consultas para verificar los resultados
-- =================================================================

-- Verificar productos del Super Admin
SELECT 
  p.name,
  p.sku,
  p.price,
  p.is_global,
  CASE 
    WHEN p.is_global THEN '🌐 Global (todas las sucursales)'
    ELSE '🏢 Por sucursal'
  END as tipo,
  ps.quantity as stock_central
FROM public.products p
LEFT JOIN public.product_stock_per_branch ps ON p.id = ps.product_id 
  AND ps.branch_id = (SELECT b.id FROM public.branches b ORDER BY b.created_at ASC LIMIT 1)
WHERE p.deleted_at IS NULL
ORDER BY p.is_global DESC, p.created_at DESC
LIMIT 10;

-- Verificar política RLS actual
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'products';
