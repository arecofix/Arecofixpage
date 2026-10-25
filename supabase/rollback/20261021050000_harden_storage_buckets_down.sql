-- ==============================================================================
-- Rollback Migration: 20261021050000_harden_storage_buckets_down.sql
-- Description: Revert storage listing policies back to broad public access
-- ==============================================================================

BEGIN;

DROP POLICY IF EXISTS "Authenticated users can select avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can select evidence" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can select cvs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can select certificates" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can select course covers" ON storage.objects;

CREATE POLICY "Avatar images are publicly accessible." ON storage.objects
    FOR SELECT TO public USING (bucket_id = 'avatars');

CREATE POLICY "Lectura Publica CVs" ON storage.objects
    FOR SELECT TO public USING (bucket_id = 'cv-generados');

CREATE POLICY "Public Access" ON storage.objects
    FOR SELECT TO public USING (bucket_id = 'academy_certificates');

CREATE POLICY "Public can read evidence" ON storage.objects
    FOR SELECT TO public USING (bucket_id = 'evidence');

CREATE POLICY "Public_Read_Covers" ON storage.objects
    FOR SELECT TO public USING (bucket_id = 'course-covers');

COMMIT;
