-- ==============================================================================
-- Migration: 20261021050000_harden_storage_buckets.sql
-- Description: Remove broad listing policies on public storage buckets
-- Severity: HIGH SECURITY (P1)
-- Category: public_bucket_allows_listing
-- ==============================================================================

BEGIN;

-- Drop broad public SELECT policies on storage.objects that permit file listing
DROP POLICY IF EXISTS "Avatar images are publicly accessible." ON storage.objects;
DROP POLICY IF EXISTS "Public can read avatars" ON storage.objects;
DROP POLICY IF EXISTS "Lectura Publica CVs" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public can read evidence" ON storage.objects;
DROP POLICY IF EXISTS "Public_Read_Covers" ON storage.objects;

-- Ensure idempotency for authenticated policies
DROP POLICY IF EXISTS "Authenticated users can select avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can select evidence" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can select cvs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can select certificates" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can select course covers" ON storage.objects;

-- Allow authenticated users to view avatars and evidence
CREATE POLICY "Authenticated users can select avatars" ON storage.objects
    FOR SELECT TO authenticated
    USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can select evidence" ON storage.objects
    FOR SELECT TO authenticated
    USING (bucket_id = 'evidence');

CREATE POLICY "Authenticated users can select cvs" ON storage.objects
    FOR SELECT TO authenticated
    USING (bucket_id = 'cv-generados');

CREATE POLICY "Authenticated users can select certificates" ON storage.objects
    FOR SELECT TO authenticated
    USING (bucket_id = 'academy_certificates');

CREATE POLICY "Authenticated users can select course covers" ON storage.objects
    FOR SELECT TO authenticated
    USING (bucket_id = 'course-covers');

COMMIT;
