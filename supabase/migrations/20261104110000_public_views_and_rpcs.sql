-- ==============================================================================
-- MIGRATION: 20261104110000_public_views_and_rpcs.sql
-- DESCRIPTION: Public Safe Views, RPCs with Anti-Enumeration and Hardened Permissions
-- ==============================================================================

BEGIN;

-- 1. Vista pública de Tenants (Whitelist de columnas públicas no sensibles)
-- security_invoker=false intencional: la vista corre como owner para que anon pueda leer el perfil sin policy en la tabla base. La seguridad se garantiza por whitelist de columnas seguras (name, slug, branding, currency, custom_domain).
DROP VIEW IF EXISTS public.public_tenant_profile CASCADE;

CREATE VIEW public.public_tenant_profile
WITH (security_invoker = false) AS
SELECT 
    id,
    name,
    slug,
    branding_settings,
    custom_domain,
    currency,
    is_active,
    created_at,
    updated_at
FROM public.tenants
WHERE is_active = true;

GRANT SELECT ON public.public_tenant_profile TO anon, authenticated, service_role;

-- 2. Vista de sucursales protegida con security_invoker=true (Fix Opción C)
-- security_invoker=true: la vista hereda RLS de branches. Anon NO la consulta directamente (usa RPC get_public_branch). Authenticated ve solo sus branches por RLS.
DROP VIEW IF EXISTS public.public_branch_profile CASCADE;

CREATE VIEW public.public_branch_profile
WITH (security_invoker = true) AS
SELECT 
    b.id, 
    b.name, 
    b.official_name,
    b.slug, 
    b.address, 
    b.contact_phone, 
    b.whatsapp_number, 
    b.contact_email, 
    b.branding_settings, 
    b.is_active, 
    b.tenant_id, 
    b.updated_at
FROM public.branches b
WHERE b.is_active = true
  AND EXISTS (
      SELECT 1 FROM public.tenants t 
      WHERE t.id = b.tenant_id AND t.is_active = true
  );

REVOKE ALL ON public.public_branch_profile FROM PUBLIC;
REVOKE ALL ON public.public_branch_profile FROM anon;
GRANT SELECT ON public.public_branch_profile TO authenticated, service_role;

-- 3. RPC seguro anti-enumeración para sucursales públicas
CREATE OR REPLACE FUNCTION public.get_public_branch(p_slug text)
RETURNS TABLE (
    id uuid,
    name text,
    official_name text,
    slug text,
    address text,
    contact_phone text,
    whatsapp_number text,
    contact_email text,
    branding_settings jsonb,
    tenant_id uuid,
    updated_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        b.id,
        b.name,
        b.official_name,
        b.slug,
        b.address,
        b.contact_phone,
        b.whatsapp_number,
        b.contact_email,
        b.branding_settings,
        b.tenant_id,
        b.updated_at
    FROM public.branches b
    WHERE b.slug = p_slug 
      AND b.is_active = true
      AND EXISTS (
          SELECT 1 FROM public.tenants t 
          WHERE t.id = b.tenant_id AND t.is_active = true
      )
    LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_public_branch(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_branch(text) TO anon, authenticated, service_role;

-- 4. Vista pública segura de marcas (Brands)
-- security_invoker=false intencional: corre como owner para acceso storefront anónimo seguro por whitelist de columnas
DROP VIEW IF EXISTS public.public_brand_profile CASCADE;

CREATE VIEW public.public_brand_profile
WITH (security_invoker = false) AS
SELECT 
    id,
    name,
    slug,
    logo_url,
    tenant_id,
    branch_id,
    updated_at
FROM public.brands
WHERE deleted_at IS NULL AND is_active = true;

GRANT SELECT ON public.public_brand_profile TO anon, authenticated, service_role;

-- 5. Vista pública segura de categorías (Categories)
-- security_invoker=false intencional: corre como owner para acceso storefront anónimo seguro por whitelist de columnas
DROP VIEW IF EXISTS public.public_category_profile CASCADE;

CREATE VIEW public.public_category_profile
WITH (security_invoker = false) AS
SELECT 
    id,
    name,
    slug,
    description,
    image_url,
    parent_id,
    scope,
    tenant_id,
    branch_id
FROM public.categories
WHERE deleted_at IS NULL AND is_active = true;

GRANT SELECT ON public.public_category_profile TO anon, authenticated, service_role;

-- 6. RPC seguro anti-enumeración de servicios por tenant
CREATE OR REPLACE FUNCTION public.get_public_services(p_tenant_slug text)
RETURNS TABLE (
    id uuid,
    name text,
    slug text,
    description text,
    short_description text,
    image_url text,
    price numeric,
    tenant_id uuid,
    branch_id uuid
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        s.id,
        s.name,
        s.slug,
        s.description,
        s.short_description::text,
        s.image_url,
        s.price,
        s.tenant_id,
        s.branch_id
    FROM public.services s
    JOIN public.tenants t ON t.id = s.tenant_id
    WHERE t.slug = p_tenant_slug
      AND t.is_active = true
      AND s.deleted_at IS NULL
      AND s.is_published = true;
$$;

REVOKE ALL ON FUNCTION public.get_public_services(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_services(text) TO anon, authenticated, service_role;

-- 7. RPC seguro anti-enumeración de cursos por tenant
CREATE OR REPLACE FUNCTION public.get_public_courses(p_tenant_slug text)
RETURNS TABLE (
    id uuid,
    title text,
    slug text,
    description text,
    short_description text,
    image_url text,
    price numeric,
    tenant_id uuid
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        c.id,
        c.title,
        c.slug,
        c.description,
        c.short_description,
        c.image_url,
        c.price,
        c.tenant_id
    FROM public.courses c
    JOIN public.tenants t ON t.id = c.tenant_id
    WHERE t.slug = p_tenant_slug
      AND t.is_active = true
      AND c.is_active = true;
$$;

REVOKE ALL ON FUNCTION public.get_public_courses(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_courses(text) TO anon, authenticated, service_role;

NOTIFY pgrst, 'reload schema';

COMMIT;
