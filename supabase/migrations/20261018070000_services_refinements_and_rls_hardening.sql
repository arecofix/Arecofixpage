-- ==============================================================================
-- Migración: 20261018070000_services_refinements_and_rls_hardening.sql
-- Descripción: Refinamientos aprobados, backups formales, columna scope en categories,
--              tenant_id en bloques/features y RLS hardened.
-- ==============================================================================

-- 1. Backup previo obligatorio
CREATE TABLE IF NOT EXISTS public.services_backup_20261018 AS 
SELECT * FROM public.services;

CREATE TABLE IF NOT EXISTS public.blog_posts_backup_20261018 AS 
SELECT * FROM public.blog_posts;

-- 2. Columna scope en categories para discriminar productos, servicios o ambos
ALTER TABLE public.categories 
    ADD COLUMN IF NOT EXISTS scope VARCHAR(20) DEFAULT 'both';

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_categories_scope') THEN
        ALTER TABLE public.categories 
            ADD CONSTRAINT chk_categories_scope CHECK (scope IN ('product','service','both'));
    END IF;
END $$;

-- 3. Sincronización y compatibilidad en public.services
UPDATE public.services 
SET 
    hero_image_url = COALESCE(hero_image_url, image_url),
    base_price = COALESCE(base_price, price);

-- Índices optimizados
CREATE UNIQUE INDEX IF NOT EXISTS services_slug_uniq 
    ON public.services(slug) 
    WHERE slug IS NOT NULL AND deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_services_is_published 
    ON public.services(is_published) 
    WHERE is_published = TRUE;

-- 4. Asegurar tenant_id en service_features y service_blocks
ALTER TABLE public.service_features 
    ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

UPDATE public.service_features sf
SET tenant_id = s.tenant_id
FROM public.services s
WHERE sf.service_id = s.id AND sf.tenant_id IS NULL;

ALTER TABLE public.service_blocks 
    ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;

UPDATE public.service_blocks sb
SET tenant_id = s.tenant_id
FROM public.services s
WHERE sb.owner_type = 'service' AND sb.owner_id = s.id AND sb.tenant_id IS NULL;

-- 5. Hardened Row-Level Security (RLS)
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slug_redirects ENABLE ROW LEVEL SECURITY;

-- 5.1 services
DROP POLICY IF EXISTS "services_public_select" ON public.services;
DROP POLICY IF EXISTS "services_anon_select" ON public.services;
CREATE POLICY "services_anon_select" ON public.services
    FOR SELECT TO anon, authenticated
    USING (is_published = TRUE AND deleted_at IS NULL);

DROP POLICY IF EXISTS "services_admin_crud" ON public.services;
CREATE POLICY "services_admin_crud" ON public.services
    FOR ALL TO authenticated
    USING (is_super_admin() OR tenant_id = get_current_tenant_id())
    WITH CHECK (is_super_admin() OR tenant_id = get_current_tenant_id());

-- 5.2 service_features
DROP POLICY IF EXISTS "service_features_public_select" ON public.service_features;
DROP POLICY IF EXISTS "service_features_anon_select" ON public.service_features;
CREATE POLICY "service_features_anon_select" ON public.service_features
    FOR SELECT TO anon, authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.services s 
            WHERE s.id = service_features.service_id 
              AND s.is_published = TRUE 
              AND s.deleted_at IS NULL
        )
    );

DROP POLICY IF EXISTS "service_features_admin_all" ON public.service_features;
CREATE POLICY "service_features_admin_all" ON public.service_features
    FOR ALL TO authenticated
    USING (is_super_admin() OR tenant_id = get_current_tenant_id())
    WITH CHECK (is_super_admin() OR tenant_id = get_current_tenant_id());

-- 5.3 service_blocks
DROP POLICY IF EXISTS "service_blocks_public_select" ON public.service_blocks;
DROP POLICY IF EXISTS "service_blocks_anon_select" ON public.service_blocks;
CREATE POLICY "service_blocks_anon_select" ON public.service_blocks
    FOR SELECT TO anon, authenticated
    USING (
        is_enabled = TRUE AND (
            (owner_type = 'service' AND EXISTS (
                SELECT 1 FROM public.services s 
                WHERE s.id = service_blocks.owner_id 
                  AND s.is_published = TRUE 
                  AND s.deleted_at IS NULL
            )) OR
            (owner_type = 'post' AND EXISTS (
                SELECT 1 FROM public.blog_posts p 
                WHERE p.id = service_blocks.owner_id 
                  AND p.status = 'published'
            ))
        )
    );

DROP POLICY IF EXISTS "service_blocks_admin_all" ON public.service_blocks;
CREATE POLICY "service_blocks_admin_all" ON public.service_blocks
    FOR ALL TO authenticated
    USING (is_super_admin() OR tenant_id = get_current_tenant_id() OR get_auth_user_role() = ANY(ARRAY['admin','super_admin','tenant_owner']))
    WITH CHECK (is_super_admin() OR tenant_id = get_current_tenant_id() OR get_auth_user_role() = ANY(ARRAY['admin','super_admin','tenant_owner']));

-- 5.4 service_leads
DROP POLICY IF EXISTS "service_leads_public_insert" ON public.service_leads;
DROP POLICY IF EXISTS "service_leads_anon_insert" ON public.service_leads;
CREATE POLICY "service_leads_anon_insert" ON public.service_leads
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

-- No hay política SELECT para anon -> denegado por defecto
DROP POLICY IF EXISTS "service_leads_admin_all" ON public.service_leads;
CREATE POLICY "service_leads_admin_all" ON public.service_leads
    FOR ALL TO authenticated
    USING (is_super_admin() OR tenant_id = get_current_tenant_id())
    WITH CHECK (is_super_admin() OR tenant_id = get_current_tenant_id());

-- 5.5 slug_redirects
DROP POLICY IF EXISTS "slug_redirects_public_select" ON public.slug_redirects;
DROP POLICY IF EXISTS "slug_redirects_anon_select" ON public.slug_redirects;
CREATE POLICY "slug_redirects_anon_select" ON public.slug_redirects
    FOR SELECT TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "slug_redirects_admin_all" ON public.slug_redirects;
CREATE POLICY "slug_redirects_admin_all" ON public.slug_redirects
    FOR ALL TO authenticated
    USING (is_super_admin() OR tenant_id = get_current_tenant_id())
    WITH CHECK (is_super_admin() OR tenant_id = get_current_tenant_id());
