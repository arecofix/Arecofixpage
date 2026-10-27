-- 1. Conteos
SELECT count(*) AS count_services FROM public.services;
SELECT count(*) AS count_features FROM public.service_features;
SELECT count(*) AS count_blocks FROM public.service_blocks;
SELECT count(*) AS count_services_backup FROM public.services_backup_20261018;
SELECT count(*) AS count_blog_backup FROM public.blog_posts_backup_20261018;

-- 2. Lista manual de servicios
SELECT id, name, slug, base_price, is_published, deleted_at FROM public.services;

-- 3. RLS Test con anon
SET ROLE anon;
-- Debe devolver SOLO 1 fila (la publicada: auditoria-de-sitios-web)
SELECT id, name, slug, is_published FROM public.services;

-- Debe devolver 0 filas o permiso denegado
SELECT count(*) AS count_leads_as_anon FROM public.service_leads;
RESET ROLE;
