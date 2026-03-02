-- Habilitar RLS en la tabla categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Política de Lectura: Usuarios autenticados solo ven categorías de su tenant
DROP POLICY IF EXISTS "Users can view categories of their tenant" ON public.categories;
CREATE POLICY "Users can view categories of their tenant"
ON public.categories
FOR SELECT
TO authenticated
USING (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid);

-- Política de Inserción: Usuarios autenticados solo pueden insertar en su tenant
DROP POLICY IF EXISTS "Users can insert categories to their tenant" ON public.categories;
CREATE POLICY "Users can insert categories to their tenant"
ON public.categories
FOR INSERT
TO authenticated
WITH CHECK (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid);

-- Política de Actualización: Solo categorías del propio tenant
DROP POLICY IF EXISTS "Users can update categories of their tenant" ON public.categories;
CREATE POLICY "Users can update categories of their tenant"
ON public.categories
FOR UPDATE
TO authenticated
USING (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid)
WITH CHECK (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid);

-- Política de Borrado: Solo categorías del propio tenant
DROP POLICY IF EXISTS "Users can delete categories of their tenant" ON public.categories;
CREATE POLICY "Users can delete categories of their tenant"
ON public.categories
FOR DELETE
TO authenticated
USING (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid);

-- También habilitar RLS para la tabla products si no lo tiene (opcional pero recomendado)
-- ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
