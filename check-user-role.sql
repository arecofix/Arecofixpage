-- =================================================================
-- VERIFICAR ROL DEL USUARIO SUPER ADMIN
-- =================================================================

-- Verificar el perfil actual del usuario ezequielenrico15@gmail.com
SELECT 
  p.id,
  p.email,
  p.role,
  p.first_name,
  p.last_name,
  p.display_name,
  p.tenant_id,
  p.branch_id,
  t.name as tenant_name,
  b.name as branch_name,
  b.slug as branch_slug,
  CASE 
    WHEN p.role = 'admin' THEN '✅ Admin - Acceso global'
    WHEN p.role = 'super_admin' THEN '✅ Super Admin - Acceso global'
    WHEN p.role = 'tenant_owner' THEN '✅ Tenant Owner - Acceso global'
    WHEN p.role = 'staff' THEN '⚠️ Staff - Acceso limitado a su sucursal'
    ELSE '❌ Rol desconocido o sin permisos'
  END as access_level
FROM public.profiles p
LEFT JOIN public.tenants t ON p.tenant_id = t.id
LEFT JOIN public.branches b ON p.branch_id = b.id
WHERE p.email = 'ezequielenrico15@gmail.com';

-- Verificar todas las sucursales disponibles para tu tenant
SELECT 
  b.id,
  b.name,
  b.slug,
  b.is_active,
  b.global_markup_percentage,
  CASE 
    WHEN b.slug = 'admin' THEN '❌ Slug reservado - No accesible'
    ELSE '✅ Sucursal accesible'
  END as status
FROM public.branches b
WHERE b.tenant_id = (
  SELECT tenant_id 
  FROM public.profiles 
  WHERE email = 'ezequielenrico15@gmail.com'
  LIMIT 1
)
ORDER BY b.updated_at ASC;

-- Verificar si hay alguna restricción adicional
SELECT 
  'VERIFICACION_FINAL' as check_type,
  COUNT(*) as total_branches,
  'Sucursales disponibles para gestión' as description
FROM public.branches b
WHERE b.tenant_id = (
  SELECT tenant_id 
  FROM public.profiles 
  WHERE email = 'ezequielenrico15@gmail.com'
  LIMIT 1
)
AND b.is_active = true
AND b.slug NOT IN ('admin', 'login', 'register', 'perfil', 'nosotros', 'contacto');
