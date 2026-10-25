-- ==============================================================================
-- Rollback / Down: 20261018060000_services_landing_creator_and_blocks_down.sql
-- ==============================================================================

DROP TABLE IF EXISTS public.slug_redirects CASCADE;
DROP TABLE IF EXISTS public.service_leads CASCADE;
DROP TABLE IF EXISTS public.service_blocks CASCADE;
DROP TABLE IF EXISTS public.service_features CASCADE;
DROP TABLE IF EXISTS public.service_categories CASCADE;

ALTER TABLE public.services 
    DROP COLUMN IF EXISTS short_description,
    DROP COLUMN IF EXISTS long_description,
    DROP COLUMN IF EXISTS base_price,
    DROP COLUMN IF EXISTS price_currency,
    DROP COLUMN IF EXISTS icon,
    DROP COLUMN IF EXISTS is_quotable,
    DROP COLUMN IF EXISTS is_bookable,
    DROP COLUMN IF EXISTS is_published,
    DROP COLUMN IF EXISTS template_slug,
    DROP COLUMN IF EXISTS hero_image_url,
    DROP COLUMN IF EXISTS seo_title,
    DROP COLUMN IF EXISTS seo_description,
    DROP COLUMN IF EXISTS canonical_url,
    DROP COLUMN IF EXISTS og_image_url,
    DROP COLUMN IF EXISTS published_at,
    DROP COLUMN IF EXISTS deleted_at;

-- Restaurar datos originales desde backup si existe
-- INSERT INTO public.services SELECT * FROM public.services_backup_20261018 ON CONFLICT (id) DO UPDATE ...
