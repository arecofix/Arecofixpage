-- ==============================================================================
-- Rollback Migration: 20261022030000_harden_storage_listing_policies_down.sql
-- Description: Revert storage listing policies to previous state
-- ==============================================================================

BEGIN;

DROP POLICY IF EXISTS "avatars_select_scoped" ON storage.objects;
DROP POLICY IF EXISTS "evidence_select_scoped" ON storage.objects;
DROP POLICY IF EXISTS "cvs_select_scoped" ON storage.objects;
DROP POLICY IF EXISTS "certificates_select_scoped" ON storage.objects;

CREATE POLICY "Authenticated users can select avatars" ON storage.objects
    FOR SELECT TO authenticated USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can select evidence" ON storage.objects
    FOR SELECT TO authenticated USING (bucket_id = 'evidence');

CREATE POLICY "Authenticated users can select cvs" ON storage.objects
    FOR SELECT TO authenticated USING (bucket_id = 'cv-generados');

CREATE POLICY "Authenticated users can select certificates" ON storage.objects
    FOR SELECT TO authenticated USING (bucket_id = 'academy_certificates');

CREATE POLICY "Authenticated users can select course covers" ON storage.objects
    FOR SELECT TO authenticated USING (bucket_id = 'course-covers');

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'storage' AND table_name = 'buckets' AND column_name = 'public'
    ) THEN
        UPDATE storage.buckets SET public = true WHERE id IN ('evidence', 'cv-generados');
    END IF;
END $$;

COMMIT;

