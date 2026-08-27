-- MIGRACIÓN DE URLS DE SUPABASE A CLOUDFLARE R2 (VERSIÓN OPTIMIZADA Y SEGURA)
-- Reemplaza de forma dinámica cualquier URL pública de Supabase Storage hacia Cloudflare
-- IMPORTANTE: Realiza un backup (pg_dump) antes de correr en producción.

DO $$
DECLARE
    -- Se acorta el prefijo para capturar TODOS los buckets (ej: public-assets, avatars, etc.)
    -- de la URL base pública del storage de Supabase.
    old_prefix TEXT := 'https://jftiyfnnaogmgvksgkbn.supabase.co/storage/v1/object/public/';
    
    -- El nuevo CDN raiz. Como R2 actúa como root, el bucket original ('public-assets/') quedará como primer segmento del path.
    -- Ej: old_prefix + 'public-assets/img.jpg' -> new_prefix + '/public-assets/img.jpg'
    new_prefix TEXT := 'https://cdn.arecofix.com.ar/';
    
    -- Variables para diagnóstico
    updated_rows INT;
    total_updated INT := 0;
BEGIN
    RAISE NOTICE 'INICIANDO MIGRACIÓN MASIVA DE STORAGE URLS...';

    -- 1. Tabla profiles
    UPDATE public.profiles 
    SET avatar_url = REPLACE(avatar_url, old_prefix, new_prefix)
    WHERE avatar_url LIKE old_prefix || '%' AND avatar_url IS NOT NULL;
    GET DIAGNOSTICS updated_rows = ROW_COUNT; total_updated = total_updated + updated_rows;
    RAISE NOTICE 'Perfiles actualizados: %', updated_rows;

    -- 2. Tabla brands
    UPDATE public.brands 
    SET logo_url = REPLACE(logo_url, old_prefix, new_prefix)
    WHERE logo_url LIKE old_prefix || '%' AND logo_url IS NOT NULL;
    GET DIAGNOSTICS updated_rows = ROW_COUNT; total_updated = total_updated + updated_rows;

    -- 3. Tabla models
    UPDATE public.models 
    SET image_url = REPLACE(image_url, old_prefix, new_prefix)
    WHERE image_url LIKE old_prefix || '%' AND image_url IS NOT NULL;
    GET DIAGNOSTICS updated_rows = ROW_COUNT; total_updated = total_updated + updated_rows;

    -- 4. Tabla categories
    UPDATE public.categories 
    SET image_url = REPLACE(image_url, old_prefix, new_prefix)
    WHERE image_url LIKE old_prefix || '%' AND image_url IS NOT NULL;
    GET DIAGNOSTICS updated_rows = ROW_COUNT; total_updated = total_updated + updated_rows;

    -- 5. Tabla products (image_url, og_image)
    UPDATE public.products 
    SET 
        image_url = CASE WHEN image_url LIKE old_prefix || '%' THEN REPLACE(image_url, old_prefix, new_prefix) ELSE image_url END,
        og_image = CASE WHEN og_image LIKE old_prefix || '%' THEN REPLACE(og_image, old_prefix, new_prefix) ELSE og_image END
    WHERE (image_url LIKE old_prefix || '%' OR og_image LIKE old_prefix || '%');
    GET DIAGNOSTICS updated_rows = ROW_COUNT; total_updated = total_updated + updated_rows;
    RAISE NOTICE 'Productos (imágenes simples) actualizados: %', updated_rows;

    -- 5c. Tabla products (gallery_urls jsonb array) CON PRESERVACIÓN DE ORDEN
    UPDATE public.products 
    SET gallery_urls = (
        SELECT jsonb_agg(
            CASE 
                WHEN elem.value_text LIKE old_prefix || '%' 
                THEN to_jsonb(REPLACE(elem.value_text, old_prefix, new_prefix))
                ELSE elem.original_jsonb
            END
            ORDER BY elem.ord -- Garantizamos que se conserve el índice original del Array
        )
        FROM (
            SELECT 
                a.value AS original_jsonb, 
                a.value #>> '{}' AS value_text, 
                a.ordinality AS ord
            FROM jsonb_array_elements(products.gallery_urls) WITH ORDINALITY AS a
        ) AS elem
    )
    WHERE gallery_urls IS NOT NULL 
      AND gallery_urls::text LIKE '%' || old_prefix || '%';
    GET DIAGNOSTICS updated_rows = ROW_COUNT; total_updated = total_updated + updated_rows;
    RAISE NOTICE 'Productos (galerías JSONB) actualizados: %', updated_rows;

    -- 6. Tabla courses
    UPDATE public.courses 
    SET image_url = REPLACE(image_url, old_prefix, new_prefix)
    WHERE image_url LIKE old_prefix || '%' AND image_url IS NOT NULL;
    GET DIAGNOSTICS updated_rows = ROW_COUNT; total_updated = total_updated + updated_rows;

    -- 7. Tabla services
    UPDATE public.services 
    SET image_url = REPLACE(image_url, old_prefix, new_prefix)
    WHERE image_url LIKE old_prefix || '%' AND image_url IS NOT NULL;
    GET DIAGNOSTICS updated_rows = ROW_COUNT; total_updated = total_updated + updated_rows;

    -- 8. Tabla product_images
    UPDATE public.product_images 
    SET image_url = REPLACE(image_url, old_prefix, new_prefix)
    WHERE image_url LIKE old_prefix || '%' AND image_url IS NOT NULL;
    GET DIAGNOSTICS updated_rows = ROW_COUNT; total_updated = total_updated + updated_rows;

    -- 9. Tabla repair_images
    UPDATE public.repair_images 
    SET image_url = REPLACE(image_url, old_prefix, new_prefix)
    WHERE image_url LIKE old_prefix || '%' AND image_url IS NOT NULL;
    GET DIAGNOSTICS updated_rows = ROW_COUNT; total_updated = total_updated + updated_rows;

    -- 10. Tabla blog_posts
    UPDATE public.blog_posts 
    SET featured_image = REPLACE(featured_image, old_prefix, new_prefix)
    WHERE featured_image LIKE old_prefix || '%' AND featured_image IS NOT NULL;
    GET DIAGNOSTICS updated_rows = ROW_COUNT; total_updated = total_updated + updated_rows;

    -- 11. Tabla course_lessons
    UPDATE public.course_lessons 
    SET url = REPLACE(url, old_prefix, new_prefix)
    WHERE url LIKE old_prefix || '%' AND url IS NOT NULL;
    GET DIAGNOSTICS updated_rows = ROW_COUNT; total_updated = total_updated + updated_rows;
    
    -- 12. Tabla course_certificates
    UPDATE public.course_certificates 
    SET pdf_url = REPLACE(pdf_url, old_prefix, new_prefix)
    WHERE pdf_url LIKE old_prefix || '%' AND pdf_url IS NOT NULL;
    GET DIAGNOSTICS updated_rows = ROW_COUNT; total_updated = total_updated + updated_rows;

    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'MIGRACIÓN FINALIZADA CON ÉXITO. Filas afectadas: %', total_updated;
    RAISE NOTICE '=====================================================';

EXCEPTION
    WHEN OTHERS THEN
        -- Rollback automático al haber una excepción dentro de DO $$
        RAISE EXCEPTION 'Error crítico durante la migración (Transacción revertida). Código: %, Mensaje: %', SQLSTATE, SQLERRM;
END $$;
