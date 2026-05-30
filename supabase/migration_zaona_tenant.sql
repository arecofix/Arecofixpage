-- =============================================================================
-- MIGRACIÓN DE SUCURSAL ZAONA A TENANT INDEPENDIENTE (SaaS)
-- =============================================================================
-- INSTRUCCIONES:
-- 1. Genera un nuevo UUID para el nuevo Tenant (ej. en https://www.uuidgenerator.net/)
-- 2. Reemplaza 'NUEVO_TENANT_UUID' por tu nuevo UUID en este script.
-- 3. Ejecuta este script en el SQL Editor de tu consola de Supabase.
-- =============================================================================

-- 1. Crear el nuevo registro del Tenant independiente
INSERT INTO public.tenants (id, name, slug, plan_type, is_active, currency, tax_percentage, tax_abbreviation, tax_id_name, contact_email)
VALUES (
  'NUEVO_TENANT_UUID', -- Reemplazar con el nuevo UUID generado
  'Librería ZAONA',
  'libreria-zaona',
  'premium',
  true,
  'ARS',
  21,
  'IVA',
  'CUIT/CUIL',
  'zaona@arecofix.com.ar'
);

-- 2. Asociar la sucursal actual de Zaona al nuevo Tenant
UPDATE public.branches
SET tenant_id = 'NUEVO_TENANT_UUID'
WHERE id = 'ae0776b7-2034-4baf-acf3-a9dab87a1e51';

-- 3. Mover el Staff/Admin al nuevo Tenant (Tabla pública)
UPDATE public.profiles
SET 
  tenant_id = 'NUEVO_TENANT_UUID',
  role = 'tenant_owner' -- O 'admin'
WHERE email = 'zaona@arecofix.com.ar';

-- 4. Sincronizar metadatos de Auth para Claims del JWT
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || jsonb_build_object('tenant_id', 'NUEVO_TENANT_UUID')
WHERE email = 'zaona@arecofix.com.ar';

-- =============================================================================
-- MIGRACIÓN DE DATOS HISTÓRICOS Y OPERATIVOS DE LA SUCURSAL
-- =============================================================================

-- A) Migrar Marcas y Categorías asociadas a los productos que posee Zaona
UPDATE public.categories 
SET tenant_id = 'NUEVO_TENANT_UUID' 
WHERE id IN (
  SELECT category_id 
  FROM public.products 
  WHERE id IN (
    SELECT product_id 
    FROM public.product_stock_per_branch 
    WHERE branch_id = 'ae0776b7-2034-4baf-acf3-a9dab87a1e51'
  )
);

UPDATE public.brands 
SET tenant_id = 'NUEVO_TENANT_UUID' 
WHERE id IN (
  SELECT brand_id 
  FROM public.products 
  WHERE id IN (
    SELECT product_id 
    FROM public.product_stock_per_branch 
    WHERE branch_id = 'ae0776b7-2034-4baf-acf3-a9dab87a1e51'
  )
);

-- B) Migrar el Catálogo de Productos al nuevo Tenant
UPDATE public.products 
SET tenant_id = 'NUEVO_TENANT_UUID' 
WHERE id IN (
  SELECT product_id 
  FROM public.product_stock_per_branch 
  WHERE branch_id = 'ae0776b7-2034-4baf-acf3-a9dab87a1e51'
);

-- C) Migrar Clientes registrados bajo esa sucursal
UPDATE public.profiles
SET tenant_id = 'NUEVO_TENANT_UUID'
WHERE branch_id = 'ae0776b7-2034-4baf-acf3-a9dab87a1e51' AND role = 'user';

-- D) Migrar Órdenes, Reparaciones y Movimientos de Caja
UPDATE public.orders SET tenant_id = 'NUEVO_TENANT_UUID' WHERE branch_id = 'ae0776b7-2034-4baf-acf3-a9dab87a1e51';
UPDATE public.repairs SET tenant_id = 'NUEVO_TENANT_UUID' WHERE branch_id = 'ae0776b7-2034-4baf-acf3-a9dab87a1e51';
UPDATE public.cash_movements SET tenant_id = 'NUEVO_TENANT_UUID' WHERE branch_id = 'ae0776b7-2034-4baf-acf3-a9dab87a1e51';

-- E) Sincronizar el Stock por Sucursal
UPDATE public.product_stock_per_branch 
SET tenant_id = 'NUEVO_TENANT_UUID' 
WHERE branch_id = 'ae0776b7-2034-4baf-acf3-a9dab87a1e51';
