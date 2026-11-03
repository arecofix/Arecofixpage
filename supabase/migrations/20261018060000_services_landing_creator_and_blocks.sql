-- ==============================================================================
-- Migración: 20261018060000_services_landing_creator_and_blocks.sql
-- Descripción: Normalización del módulo de servicios, creador de landing pages,
--              editor de bloques unificado (servicios y blog) y captura de leads.
-- ==============================================================================

-- 1. Backup previo de la tabla de servicios
CREATE TABLE IF NOT EXISTS public.services_backup_20261018 AS 
SELECT * FROM public.services;

-- 2. Categorías de servicios
CREATE TABLE IF NOT EXISTS public.service_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL,
    icon VARCHAR(80),
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_service_cat_tenant_slug UNIQUE (tenant_id, slug)
);

-- 3. Actualización de columnas en public.services
ALTER TABLE public.services 
    ADD COLUMN IF NOT EXISTS short_description VARCHAR(280),
    ADD COLUMN IF NOT EXISTS long_description TEXT,
    ADD COLUMN IF NOT EXISTS base_price NUMERIC(12,2),
    ADD COLUMN IF NOT EXISTS price_currency CHAR(3) NOT NULL DEFAULT 'ARS',
    ADD COLUMN IF NOT EXISTS icon VARCHAR(80),
    ADD COLUMN IF NOT EXISTS is_quotable BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS is_bookable BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS template_slug VARCHAR(50) NOT NULL DEFAULT 'landing-v1',
    ADD COLUMN IF NOT EXISTS hero_image_url TEXT,
    ADD COLUMN IF NOT EXISTS seo_title VARCHAR(70),
    ADD COLUMN IF NOT EXISTS seo_description VARCHAR(160),
    ADD COLUMN IF NOT EXISTS canonical_url TEXT,
    ADD COLUMN IF NOT EXISTS og_image_url TEXT,
    ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Constraints de longitud de SEO
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_seo_title_len') THEN
        ALTER TABLE public.services 
            ADD CONSTRAINT chk_seo_title_len CHECK (seo_title IS NULL OR char_length(seo_title) <= 70);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_seo_desc_len') THEN
        ALTER TABLE public.services 
            ADD CONSTRAINT chk_seo_desc_len CHECK (seo_description IS NULL OR char_length(seo_description) <= 160);
    END IF;
END $$;

-- 4. Características de servicios (Features normalizadas)
CREATE TABLE IF NOT EXISTS public.service_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    label VARCHAR(120) NOT NULL,
    icon VARCHAR(80),
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_service_features_service_id 
    ON public.service_features(service_id, order_index);

-- 5. Editor de Bloques Compartido (Servicios y Blog Posts)
CREATE TABLE IF NOT EXISTS public.service_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_type VARCHAR(20) NOT NULL CHECK (owner_type IN ('service','post')),
    owner_id UUID NOT NULL,
    block_type VARCHAR(40) NOT NULL CHECK (block_type IN (
        'hero', 'features', 'rich_text', 'gallery', 'cta', 'faq', 
        'testimonials', 'contact', 'map', 'service_list'
    )),
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    order_index INT NOT NULL DEFAULT 0,
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_service_blocks_owner 
    ON public.service_blocks(owner_type, owner_id, order_index);

-- 6. Captura de Leads de Servicios
CREATE TABLE IF NOT EXISTS public.service_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(160),
    phone VARCHAR(40),
    message TEXT NOT NULL,
    source VARCHAR(50) NOT NULL DEFAULT 'landing_service',
    utm_source VARCHAR(80),
    utm_medium VARCHAR(80),
    utm_campaign VARCHAR(120),
    status VARCHAR(20) NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','quoted','won','lost')),
    ip_hash VARCHAR(64),
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    contacted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_service_leads_status_created 
    ON public.service_leads(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_service_leads_service_id 
    ON public.service_leads(service_id);

-- 7. Tabla de Redirecciones 301 para Preservar SEO
CREATE TABLE IF NOT EXISTS public.slug_redirects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    entity_type VARCHAR(20) NOT NULL CHECK (entity_type IN ('service','post')),
    entity_id UUID NOT NULL,
    old_slug VARCHAR(180) NOT NULL,
    new_slug VARCHAR(180) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_slug_redirect_old UNIQUE (tenant_id, entity_type, old_slug)
);

-- ==============================================================================
-- 8. Backfill Seguro de los Registros Existentes
-- ==============================================================================

-- Arecofix: registro con desc='SAMSUNG'
UPDATE public.services
SET 
    slug = COALESCE(NULLIF(slug, ''), 'arecofix'),
    base_price = COALESCE(base_price, price, 29800),
    short_description = COALESCE(short_description, 'Servicio especializado Arecofix'),
    long_description = COALESCE(long_description, 'SAMSUNG'),
    is_published = FALSE,
    updated_at = now()
WHERE id = '0a06699e-ca0d-466b-a2f2-dfab020b533e';

-- Recuperar datos: registro con desc='E'
UPDATE public.services
SET 
    slug = COALESCE(NULLIF(slug, ''), 'recuperar-datos'),
    base_price = COALESCE(base_price, price, 34800),
    short_description = COALESCE(short_description, 'Recuperación profesional de datos de memorias y dispositivos'),
    long_description = NULL,
    is_published = FALSE,
    updated_at = now()
WHERE id = 'fac3401c-7099-48c5-b8a1-473cd1df71b5';

-- Auditoría de Sitios web: normalización del JSON
UPDATE public.services
SET 
    slug = 'auditoria-de-sitios-web',
    base_price = COALESCE(base_price, price, 69000),
    short_description = 'Desarrollo de software y auditoría integral de sitios web',
    long_description = 'Análisis forense de performance, arquitectura, seguridad y SEO para sitios web y plataformas de software.',
    icon = 'fa-tools',
    hero_image_url = '/assets/img/branding/inicio.jpg',
    seo_title = 'Auditoría de Sitios Web en Marcos Paz | Arecofix',
    seo_description = 'Auditoría integral de sitios web, análisis técnico, seguridad y performance por Arecofix.',
    canonical_url = 'https://arecofix.com.ar/servicios/auditoria-de-sitios-web',
    is_published = TRUE,
    published_at = COALESCE(published_at, now()),
    updated_at = now()
WHERE id = '35064582-2e5d-441c-9450-ca111d447898';

-- Inserción de bloques iniciales para Auditoría de Sitios Web (idempotente)
DELETE FROM public.service_blocks 
WHERE owner_type = 'service' AND owner_id = '35064582-2e5d-441c-9450-ca111d447898';

INSERT INTO public.service_blocks (owner_type, owner_id, block_type, content, order_index, is_enabled)
VALUES
(
    'service',
    '35064582-2e5d-441c-9450-ca111d447898',
    'hero',
    '{
        "title": "Auditoría Integral de Sitios Web y Software",
        "subtitle": "Optimizá el rendimiento, la seguridad y la conversión de tu plataforma digital con los especialistas de Arecofix.",
        "ctaLabel": "Solicitar Diagnóstico",
        "ctaHref": "#contacto",
        "align": "left",
        "imageUrl": "/assets/img/branding/inicio.jpg"
    }'::jsonb,
    0,
    TRUE
),
(
    'service',
    '35064582-2e5d-441c-9450-ca111d447898',
    'features',
    '{
        "title": "¿Qué incluye nuestra auditoría técnica?",
        "items": [
            {"title": "Análisis de Velocidad", "description": "Core Web Vitals y optimización de recursos"},
            {"title": "Seguridad y Accesos", "description": "Revisión de headers, certificados y exposición de APIs"},
            {"title": "Auditoría SEO Técnico", "description": "Indexación, sitemap, metaetiquetas y schema.org"}
        ]
    }'::jsonb,
    1,
    TRUE
),
(
    'service',
    '35064582-2e5d-441c-9450-ca111d447898',
    'rich_text',
    '{
        "content": "### Diagnóstico Profesional\n\nNuestras auditorías entregan un informe detallado con hallazgos priorizados (P0, P1, P2) y código listo para aplicar, reduciendo costos operativos y aumentando la velocidad de carga de tu negocio."
    }'::jsonb,
    2,
    TRUE
),
(
    'service',
    '35064582-2e5d-441c-9450-ca111d447898',
    'contact',
    '{
        "title": "Pedí tu cotización personalizada",
        "subtitle": "Escribinos para coordinar una reunión de relevamiento con nuestros ingenieros."
    }'::jsonb,
    3,
    TRUE
);

-- ==============================================================================
-- 9. Row-Level Security (RLS)
-- ==============================================================================

-- Enable RLS
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slug_redirects ENABLE ROW LEVEL SECURITY;

-- 9.1 services: acceso público de lectura para servicios publicados y no eliminados
DROP POLICY IF EXISTS "services_public_select" ON public.services;
CREATE POLICY "services_public_select" ON public.services
    FOR SELECT
    USING (is_published = true AND deleted_at IS NULL);

-- 9.2 service_categories
DROP POLICY IF EXISTS "service_categories_public_select" ON public.service_categories;
CREATE POLICY "service_categories_public_select" ON public.service_categories
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "service_categories_admin_all" ON public.service_categories;
CREATE POLICY "service_categories_admin_all" ON public.service_categories
    FOR ALL TO authenticated
    USING (is_super_admin() OR tenant_id = get_current_tenant_id())
    WITH CHECK (is_super_admin() OR tenant_id = get_current_tenant_id());

-- 9.3 service_features
DROP POLICY IF EXISTS "service_features_public_select" ON public.service_features;
CREATE POLICY "service_features_public_select" ON public.service_features
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "service_features_admin_all" ON public.service_features;
CREATE POLICY "service_features_admin_all" ON public.service_features
    FOR ALL TO authenticated
    USING (
        is_super_admin() OR 
        EXISTS (
            SELECT 1 FROM public.services s 
            WHERE s.id = service_features.service_id 
              AND (s.tenant_id = get_current_tenant_id() OR is_super_admin())
        )
    )
    WITH CHECK (
        is_super_admin() OR 
        EXISTS (
            SELECT 1 FROM public.services s 
            WHERE s.id = service_features.service_id 
              AND (s.tenant_id = get_current_tenant_id() OR is_super_admin())
        )
    );

-- 9.4 service_blocks
DROP POLICY IF EXISTS "service_blocks_public_select" ON public.service_blocks;
CREATE POLICY "service_blocks_public_select" ON public.service_blocks
    FOR SELECT USING (is_enabled = true);

DROP POLICY IF EXISTS "service_blocks_admin_all" ON public.service_blocks;
CREATE POLICY "service_blocks_admin_all" ON public.service_blocks
    FOR ALL TO authenticated
    USING (is_super_admin() OR get_auth_user_role() = ANY(ARRAY['admin','super_admin','tenant_owner']))
    WITH CHECK (is_super_admin() OR get_auth_user_role() = ANY(ARRAY['admin','super_admin','tenant_owner']));

-- 9.5 service_leads
DROP POLICY IF EXISTS "service_leads_public_insert" ON public.service_leads;
CREATE POLICY "service_leads_public_insert" ON public.service_leads
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "service_leads_admin_all" ON public.service_leads;
CREATE POLICY "service_leads_admin_all" ON public.service_leads
    FOR ALL TO authenticated
    USING (is_super_admin() OR tenant_id = get_current_tenant_id())
    WITH CHECK (is_super_admin() OR tenant_id = get_current_tenant_id());

-- 9.6 slug_redirects
DROP POLICY IF EXISTS "slug_redirects_public_select" ON public.slug_redirects;
CREATE POLICY "slug_redirects_public_select" ON public.slug_redirects
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "slug_redirects_admin_all" ON public.slug_redirects;
CREATE POLICY "slug_redirects_admin_all" ON public.slug_redirects
    FOR ALL TO authenticated
    USING (is_super_admin() OR tenant_id = get_current_tenant_id())
    WITH CHECK (is_super_admin() OR tenant_id = get_current_tenant_id());
