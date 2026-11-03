-- ==============================================================================
-- MIGRATION: 20261103200000_p0_fix_tenants_credential_leak.sql
-- DESCRIPTION: P0 Hotfix - Eliminate cross-tenant credential leak in public.tenants
-- ==============================================================================

BEGIN;

-- 1. Eliminar la política tenants_select_anon
DROP POLICY IF EXISTS "tenants_select_anon" ON public.tenants;

-- 2. Reescribir tenants_select_authenticated para que solo permita el tenant propio o super_admin
DROP POLICY IF EXISTS "tenants_select_authenticated" ON public.tenants;

CREATE POLICY "tenants_select_authenticated"
ON public.tenants
FOR SELECT
TO authenticated
USING (id = get_current_tenant_id() OR is_super_admin());

-- 3. Crear vista pública segura con solo atributos no sensibles del storefront
CREATE OR REPLACE VIEW public.public_tenant_profile AS
SELECT 
    id, 
    name, 
    slug, 
    branding_settings, 
    custom_domain, 
    currency,
    is_active,
    created_at
FROM public.tenants
WHERE is_active = true;

-- Conceder acceso SELECT a la vista pública segura
GRANT SELECT ON public.public_tenant_profile TO anon, authenticated, service_role;

-- 4. Crear función RPC SECURITY DEFINER para resolución segura por slug o dominio
CREATE OR REPLACE FUNCTION public.get_public_tenant_info(p_slug text)
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT to_jsonb(t) FROM (
    SELECT 
        id, 
        name, 
        slug, 
        branding_settings, 
        custom_domain, 
        currency,
        is_active,
        created_at
    FROM public.tenants
    WHERE (slug = p_slug OR custom_domain = p_slug OR id::text = p_slug) 
      AND is_active = true
    LIMIT 1
  ) t;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_tenant_info(text) TO anon, authenticated, service_role;

COMMIT;

