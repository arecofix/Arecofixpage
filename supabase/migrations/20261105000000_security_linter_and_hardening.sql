-- ==============================================================================
-- MIGRATION: 20261105000000_security_linter_and_hardening.sql
-- DESCRIPTION: Remediación Integral de Seguridad y Rendimiento (Supabase Linter)
-- 1. Security Definer Views -> security_invoker = true con RLS y column security.
-- 2. Revoke execute on SECURITY DEFINER triggers and internal RLS helpers from anon.
-- 3. Switch public catalog RPCs to SECURITY INVOKER with public select policies.
-- 4. Fix auth_rls_initplan on public.courses wrapping auth.uid() in (SELECT ...).
-- ==============================================================================

BEGIN;

-- ------------------------------------------------------------------------------
-- 1. SEGURIDAD DE VISTAS (Fix ERROR: security_definer_view)
-- ------------------------------------------------------------------------------

-- 1.1 tenants: Revocar SELECT completo a anon y restringir a columnas públicas no sensibles
REVOKE SELECT ON public.tenants FROM anon;
GRANT SELECT (
    id, name, slug, branding_settings, custom_domain, 
    currency, is_active, created_at, updated_at
) ON public.tenants TO anon;

-- Política RLS para lectura pública de tenants activos
DROP POLICY IF EXISTS tenants_anon_read_public ON public.tenants;
CREATE POLICY tenants_anon_read_public ON public.tenants
    FOR SELECT TO anon
    USING (is_active = true);

-- Establecer security_invoker = true en public_tenant_profile
ALTER VIEW public.public_tenant_profile SET (security_invoker = true);

-- 1.2 brands: Política pública para anon y security_invoker = true
DROP POLICY IF EXISTS brands_anon_select ON public.brands;
CREATE POLICY brands_anon_select ON public.brands
    FOR SELECT TO anon
    USING (is_active = true AND deleted_at IS NULL);

ALTER VIEW public.public_brand_profile SET (security_invoker = true);

-- 1.3 categories: Política pública para anon y security_invoker = true
DROP POLICY IF EXISTS categories_anon_select ON public.categories;
CREATE POLICY categories_anon_select ON public.categories
    FOR SELECT TO anon
    USING (is_active = true AND deleted_at IS NULL);

ALTER VIEW public.public_category_profile SET (security_invoker = true);

-- 1.4 branches, services y courses: Políticas públicas para anon requeridas para storefront
DROP POLICY IF EXISTS branches_anon_public_select ON public.branches;
CREATE POLICY branches_anon_public_select ON public.branches
    FOR SELECT TO anon
    USING (is_active = true);

DROP POLICY IF EXISTS services_anon_public_select ON public.services;
CREATE POLICY services_anon_public_select ON public.services
    FOR SELECT TO anon
    USING (deleted_at IS NULL AND is_published = true);

DROP POLICY IF EXISTS courses_anon_public_select ON public.courses;
CREATE POLICY courses_anon_public_select ON public.courses
    FOR SELECT TO anon
    USING (is_active = true);


-- ------------------------------------------------------------------------------
-- 2. PROTECCIÓN DE FUNCIONES TRIGGER E INFRAESTRUCTURA (Fix WARN anon/authenticated)
-- ------------------------------------------------------------------------------

-- Función trigger de reembolso: NUNCA ejecutable vía RPC externa
REVOKE EXECUTE ON FUNCTION public.fn_refund_deposit_on_repair_cancellation() FROM PUBLIC, anon, authenticated;

-- Función de limitación de tasa de pruebas: solo backend/service_role
REVOKE EXECUTE ON FUNCTION public.check_trial_rate_limit(text, integer, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_trial_rate_limit(text, integer, integer) TO service_role;

-- Helpers RLS internos: Revocar de anon (anon no tiene sesión ni roles administrativos)
REVOKE EXECUTE ON FUNCTION public.can_edit_profile(text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_auth_user_branch() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_auth_user_role() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_auth_user_tenant() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_current_tenant_id() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_my_tenant() FROM PUBLIC, anon;
-- get_request_guest_session() is required by anonymous cart RLS policies
GRANT EXECUTE ON FUNCTION public.get_request_guest_session() TO authenticated, anon;
REVOKE EXECUTE ON FUNCTION public.get_secure_branch_id() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_secure_tenant_id() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.has_permission(text, uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_admin_of_tenant(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_admin_user() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_super_admin() FROM PUBLIC, anon;


-- ------------------------------------------------------------------------------
-- 3. CONVERSIÓN DE RPCS DE CATÁLOGO A SECURITY INVOKER
-- Ahora que las tablas base tienen políticas públicas SELECT para anon,
-- estas funciones pueden ser SECURITY INVOKER sin perder funcionalidad.
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.get_public_tenant_info(p_slug text)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public, pg_temp
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
STABLE
SECURITY INVOKER
SET search_path = public, pg_temp
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

CREATE OR REPLACE FUNCTION public.get_public_branch_by_id(p_id uuid)
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
STABLE
SECURITY INVOKER
SET search_path = public, pg_temp
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
    WHERE b.id = p_id
      AND b.is_active = true
      AND EXISTS (
          SELECT 1 FROM public.tenants t 
          WHERE t.id = b.tenant_id AND t.is_active = true
      )
    LIMIT 1;
$$;

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
STABLE
SECURITY INVOKER
SET search_path = public, pg_temp
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
STABLE
SECURITY INVOKER
SET search_path = public, pg_temp
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

GRANT EXECUTE ON FUNCTION public.get_public_tenant_info(text) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_public_branch(text) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_public_branch_by_id(uuid) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_public_services(text) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_public_courses(text) TO anon, authenticated, service_role;


-- ------------------------------------------------------------------------------
-- 4. RENDIMIENTO RLS (Fix WARN: auth_rls_initplan)
-- Optimizar courses_tenant_select envolviendo llamadas a auth.uid() y
-- get_current_tenant_id() en (SELECT ...) para evaluación única por query.
-- ------------------------------------------------------------------------------

DROP POLICY IF EXISTS courses_tenant_select ON public.courses;
CREATE POLICY courses_tenant_select ON public.courses
    FOR SELECT TO authenticated
    USING (
        ((tenant_id = (SELECT get_current_tenant_id())) AND (is_active = true))
        OR (instructor_id = (SELECT auth.uid()))
        OR ((tenant_id = (SELECT get_current_tenant_id())) AND (is_admin() OR is_super_admin()))
        OR is_super_admin()
    );

COMMIT;

NOTIFY pgrst, 'reload schema';

