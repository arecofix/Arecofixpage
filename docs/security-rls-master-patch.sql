-- ==========================================
-- 🛡️ MASTER RLS SECURITY PATCH (VERSION 2.0)
-- Arecofix Multi-Tenant Protection
-- ==========================================

-- 1. Función Segura para Obtener Tenant ID
-- No depende de 'user_metadata' que el usuario puede editar.
-- Valida contra la tabla 'profiles' en cada petición.
CREATE OR REPLACE FUNCTION public.get_my_tenant()
RETURNS uuid
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tenant_id uuid;
BEGIN
  SELECT tenant_id INTO v_tenant_id
  FROM profiles
  WHERE id = auth.uid();
  
  RETURN v_tenant_id;
END;
$$;

-- 2. Asegurar que las tablas tengan RLS habilitado
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;

-- 3. Ejemplo de Política de Aislamiento Estricto (Tabla Products)
DROP POLICY IF EXISTS "Tenant Isolation - Products Select" ON public.products;
CREATE POLICY "Tenant Isolation - Products Select"
ON public.products FOR SELECT
TO authenticated
USING (tenant_id = get_my_tenant());

DROP POLICY IF EXISTS "Tenant Isolation - Products Insert" ON public.products;
CREATE POLICY "Tenant Isolation - Products Insert"
ON public.products FOR INSERT
TO authenticated
WITH CHECK (tenant_id = get_my_tenant());

DROP POLICY IF EXISTS "Tenant Isolation - Products Update" ON public.products;
CREATE POLICY "Tenant Isolation - Products Update"
ON public.products FOR UPDATE
TO authenticated
USING (tenant_id = get_my_tenant())
WITH CHECK (tenant_id = get_my_tenant());

DROP POLICY IF EXISTS "Tenant Isolation - Products Delete" ON public.products;
CREATE POLICY "Tenant Isolation - Products Delete"
ON public.products FOR DELETE
TO authenticated
USING (tenant_id = get_my_tenant());

-- 4. Repetir para Categorías (Crucial para el fix anterior)
DROP POLICY IF EXISTS "Tenant Isolation - Categories Select" ON public.categories;
CREATE POLICY "Tenant Isolation - Categories Select"
ON public.categories FOR SELECT
TO authenticated
USING (tenant_id = get_my_tenant());

DROP POLICY IF EXISTS "Tenant Isolation - Categories Insert" ON public.categories;
CREATE POLICY "Tenant Isolation - Categories Insert"
ON public.categories FOR INSERT
TO authenticated
WITH CHECK (tenant_id = get_my_tenant());

DROP POLICY IF EXISTS "Tenant Isolation - Categories Update" ON public.categories;
CREATE POLICY "Tenant Isolation - Categories Update"
ON public.categories FOR UPDATE
TO authenticated
USING (tenant_id = get_my_tenant())
WITH CHECK (tenant_id = get_my_tenant());

-- 5. Bloquear edición de metas de autenticación por el usuario
-- Esto evita que el usuario intente sobreescribir su propio metadata
-- aunque para RLS ahora usamos get_my_tenant() que es más seguro.
REVOKE UPDATE ON auth.users FROM authenticated;

-- 6. Agregar Políticas para Marcas (Brands)
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant Isolation - Brands Select" ON public.brands;
CREATE POLICY "Tenant Isolation - Brands Select"
ON public.brands FOR SELECT
TO authenticated
USING (tenant_id = get_my_tenant());

DROP POLICY IF EXISTS "Tenant Isolation - Brands Insert" ON public.brands;
CREATE POLICY "Tenant Isolation - Brands Insert"
ON public.brands FOR INSERT
TO authenticated
WITH CHECK (tenant_id = get_my_tenant());

DROP POLICY IF EXISTS "Tenant Isolation - Brands Update" ON public.brands;
CREATE POLICY "Tenant Isolation - Brands Update"
ON public.brands FOR UPDATE
TO authenticated
USING (tenant_id = get_my_tenant())
WITH CHECK (tenant_id = get_my_tenant());

DROP POLICY IF EXISTS "Tenant Isolation - Brands Delete" ON public.brands;
CREATE POLICY "Tenant Isolation - Brands Delete"
ON public.brands FOR DELETE
TO authenticated
USING (tenant_id = get_my_tenant());

-- 7. Agregar Políticas para Modelos (Models)
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant Isolation - Models Select" ON public.models;
CREATE POLICY "Tenant Isolation - Models Select"
ON public.models FOR SELECT
TO authenticated
USING (tenant_id = get_my_tenant());

DROP POLICY IF EXISTS "Tenant Isolation - Models Insert" ON public.models;
CREATE POLICY "Tenant Isolation - Models Insert"
ON public.models FOR INSERT
TO authenticated
WITH CHECK (tenant_id = get_my_tenant());

DROP POLICY IF EXISTS "Tenant Isolation - Models Update" ON public.models;
CREATE POLICY "Tenant Isolation - Models Update"
ON public.models FOR UPDATE
TO authenticated
USING (tenant_id = get_my_tenant())
WITH CHECK (tenant_id = get_my_tenant());

DROP POLICY IF EXISTS "Tenant Isolation - Models Delete" ON public.models;
CREATE POLICY "Tenant Isolation - Models Delete"
ON public.models FOR DELETE
TO authenticated
USING (tenant_id = get_my_tenant());
