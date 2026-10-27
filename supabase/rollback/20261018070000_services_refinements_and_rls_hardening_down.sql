-- ==============================================================================
-- Rollback / Down: 20261018070000_services_refinements_and_rls_hardening_down.sql
-- ==============================================================================

DROP INDEX IF EXISTS public.services_slug_uniq;
DROP INDEX IF EXISTS public.idx_services_is_published;

ALTER TABLE public.categories DROP COLUMN IF EXISTS scope;
ALTER TABLE public.service_features DROP COLUMN IF EXISTS tenant_id;
ALTER TABLE public.service_blocks DROP COLUMN IF EXISTS tenant_id;

-- Restaurar backups si fuera necesario:
-- TRUNCATE public.services; INSERT INTO public.services SELECT * FROM public.services_backup_20261018;
-- TRUNCATE public.blog_posts; INSERT INTO public.blog_posts SELECT * FROM public.blog_posts_backup_20261018;
