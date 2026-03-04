-- =================================================================
-- CONSULTAS DE VERIFICACIÓN POST-MIGRACIÓN
-- Ejecutar estas consultas para verificar que todo funciona correctamente
-- =================================================================

-- 1. Verificar que el Super Admin puede ver todos los productos
-- (Simular la consulta que hace el frontend)
WITH super_admin_profile AS (
  SELECT id, tenant_id, role, email
  FROM public.profiles 
  WHERE email = 'ezequielenrico15@gmail.com'
  LIMIT 1
)
SELECT 
  'SUPER_ADMIN_VISIBILITY' as test,
  COUNT(*) as productos_visibles,
  'Productos que el Super Admin debería ver' as description
FROM public.products p
WHERE p.tenant_id = (SELECT tenant_id FROM super_admin_profile)
  AND p.deleted_at IS NULL
  AND (
    (SELECT role FROM super_admin_profile) = 'admin'  -- Super Admin ve todo
    OR p.is_global = true 
    OR p.id IN (
      SELECT product_id 
      FROM public.product_stock_per_branch 
      WHERE branch_id = (SELECT branch_id FROM super_admin_profile)
    )
  );

-- 2. Verificar productos globales creados
SELECT 
  'PRODUCTOS_GLOBALES' as test,
  COUNT(*) as total,
  'Productos marcados como globales' as description
FROM public.products 
WHERE is_global = true 
  AND deleted_at IS NULL;

-- 3. Verificar stock central creado
WITH central_branch AS (
  SELECT b.id, b.name
  FROM public.branches b
  JOIN public.profiles p ON p.tenant_id = b.tenant_id
  WHERE p.email = 'ezequielenrico15@gmail.com'
  ORDER BY b.updated_at ASC  -- Usar updated_at en lugar de created_at
  LIMIT 1
)
SELECT 
  'STOCK_CENTRAL' as test,
  COUNT(*) as total,
  'Productos con stock en sucursal central' as description
FROM public.product_stock_per_branch ps
JOIN central_branch cb ON ps.branch_id = cb.id;

-- 4. Verificar catálogo completo (lo que vería la tienda principal)
WITH central_branch AS (
  SELECT b.id, b.name, b.tenant_id
  FROM public.branches b
  JOIN public.profiles p ON p.tenant_id = b.tenant_id
  WHERE p.email = 'ezequielenrico15@gmail.com'
  ORDER BY b.updated_at ASC  -- Usar updated_at en lugar de created_at
  LIMIT 1
)
SELECT 
  'CATALOGO_TIENDA' as test,
  COUNT(*) as total,
  'Productos visibles en tienda principal (globales + locales)' as description
FROM public.products p
WHERE p.tenant_id = (SELECT tenant_id FROM central_branch)
  AND p.is_active = true
  AND p.deleted_at IS NULL
  AND (
    p.branch_id = (SELECT id FROM central_branch) 
    OR p.is_global = true
  );

-- 5. Mostrar productos específicos para verificación
WITH central_branch AS (
  SELECT b.id, b.name, b.tenant_id
  FROM public.branches b
  JOIN public.profiles p ON p.tenant_id = b.tenant_id
  WHERE p.email = 'ezequielenrico15@gmail.com'
  ORDER BY b.updated_at ASC  -- Usar updated_at en lugar de created_at
  LIMIT 1
)
SELECT 
  p.name,
  p.sku,
  p.price,
  p.is_global,
  CASE 
    WHEN p.is_global THEN '🌐 Global'
    ELSE '🏢 Local'
  END as tipo,
  ps.quantity as stock_central,
  CASE 
    WHEN p.branch_id = (SELECT id FROM central_branch) THEN 'Propio de esta sucursal'
    WHEN p.is_global THEN 'Global (reventa)'
    ELSE 'Otra sucursal'
  END as procedencia
FROM public.products p
LEFT JOIN public.product_stock_per_branch ps ON p.id = ps.product_id 
  AND ps.branch_id = (SELECT id FROM central_branch)
WHERE p.tenant_id = (SELECT tenant_id FROM central_branch)
  AND p.is_active = true
  AND p.deleted_at IS NULL
ORDER BY p.is_global DESC, p.updated_at DESC  -- Usar updated_at en lugar de created_at
LIMIT 15;

-- 6. Verificar política RLS actual
SELECT 
  'POLITICA_RLS' as test,
  policyname as nombre,
  permissive as tipo,
  cmd as comando,
  CASE 
    WHEN qual LIKE '%admin%' THEN '✅ Incluye Super Admin'
    ELSE '❌ No incluye Super Admin'
  END as super_admin_incluido
FROM pg_policies 
WHERE tablename = 'products';

-- 7. Estado final de la migración
SELECT 
  'RESUMEN_MIGRACION' as categoria,
  metric,
  value,
  description
FROM (
  SELECT 
    'PRODUCTOS_ACTIVOS' as metric,
    COUNT(*)::text as value,
    'Total productos en el sistema' as description
  FROM public.products 
  WHERE deleted_at IS NULL
  
  UNION ALL
  
  SELECT 
    'PRODUCTOS_GLOBALES' as metric,
    COUNT(*)::text as value,
    'Visibles en todas las sucursales' as description
  FROM public.products 
  WHERE is_global = true AND deleted_at IS NULL
  
  UNION ALL
  
  SELECT 
    'PRODUCTOS_LOCALES' as metric,
    COUNT(*)::text as value,
    'Exclusivos de sucursales' as description
  FROM public.products 
  WHERE is_global = false AND deleted_at IS NULL
  
  UNION ALL
  
  SELECT 
    'STOCK_REGISTROS' as metric,
    COUNT(*)::text as value,
    'Registros de stock creados' as description
  FROM public.product_stock_per_branch
) as summary
ORDER BY metric;
