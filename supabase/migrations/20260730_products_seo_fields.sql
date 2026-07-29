-- Añadir campos para Custom SEO
ALTER TABLE "public"."products"
ADD COLUMN meta_title TEXT NULL,
ADD COLUMN meta_description TEXT NULL,
ADD COLUMN og_image TEXT NULL;
