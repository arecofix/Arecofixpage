-- ACTUALIZACIÓN DE URLs: CDN -> API (Ya que el worker está en api.arecofix.com.ar)
-- IMPORTANTE: Ejecutar en el editor SQL de Supabase.

DO $$
DECLARE
    old_prefix TEXT := 'https://cdn.arecofix.com.ar/';
    new_prefix TEXT := 'https://api.arecofix.com.ar/';
    updated_rows INT;
    total_updated INT := 0;
BEGIN
    RAISE NOTICE 'ACTUALIZANDO URLS A API.ARECOFIX.COM.AR...';

    UPDATE public.profiles SET avatar_url = REPLACE(avatar_url, old_prefix, new_prefix) WHERE avatar_url LIKE old_prefix || '%';
    UPDATE public.brands SET logo_url = REPLACE(logo_url, old_prefix, new_prefix) WHERE logo_url LIKE old_prefix || '%';
    UPDATE public.models SET image_url = REPLACE(image_url, old_prefix, new_prefix) WHERE image_url LIKE old_prefix || '%';
    UPDATE public.categories SET image_url = REPLACE(image_url, old_prefix, new_prefix) WHERE image_url LIKE old_prefix || '%';
    UPDATE public.products SET 
        image_url = CASE WHEN image_url LIKE old_prefix || '%' THEN REPLACE(image_url, old_prefix, new_prefix) ELSE image_url END,
        og_image = CASE WHEN og_image LIKE old_prefix || '%' THEN REPLACE(og_image, old_prefix, new_prefix) ELSE og_image END
    WHERE (image_url LIKE old_prefix || '%' OR og_image LIKE old_prefix || '%');

    -- Galería JSONB de products
    UPDATE public.products 
    SET gallery_urls = (
        SELECT jsonb_agg(
            CASE 
                WHEN elem.value_text LIKE old_prefix || '%' 
                THEN to_jsonb(REPLACE(elem.value_text, old_prefix, new_prefix))
                ELSE elem.original_jsonb
            END
            ORDER BY elem.ord
        )
        FROM (
            SELECT a.value AS original_jsonb, a.value #>> '{}' AS value_text, a.ordinality AS ord
            FROM jsonb_array_elements(products.gallery_urls) WITH ORDINALITY AS a
        ) AS elem
    )
    WHERE gallery_urls IS NOT NULL AND gallery_urls::text LIKE '%' || old_prefix || '%';

    UPDATE public.courses SET image_url = REPLACE(image_url, old_prefix, new_prefix) WHERE image_url LIKE old_prefix || '%';
    UPDATE public.services SET image_url = REPLACE(image_url, old_prefix, new_prefix) WHERE image_url LIKE old_prefix || '%';
    UPDATE public.product_images SET image_url = REPLACE(image_url, old_prefix, new_prefix) WHERE image_url LIKE old_prefix || '%';
    UPDATE public.repair_images SET image_url = REPLACE(image_url, old_prefix, new_prefix) WHERE image_url LIKE old_prefix || '%';
    UPDATE public.blog_posts SET featured_image = REPLACE(featured_image, old_prefix, new_prefix) WHERE featured_image LIKE old_prefix || '%';
    UPDATE public.course_lessons SET url = REPLACE(url, old_prefix, new_prefix) WHERE url LIKE old_prefix || '%';
    UPDATE public.course_certificates SET pdf_url = REPLACE(pdf_url, old_prefix, new_prefix) WHERE pdf_url LIKE old_prefix || '%';

    RAISE NOTICE 'HECHO.';
END $$;
