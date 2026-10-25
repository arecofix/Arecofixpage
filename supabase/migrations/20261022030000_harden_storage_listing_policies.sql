-- ==============================================================================
-- Migration: 20261022030000_harden_storage_listing_policies.sql
-- Description: Eliminate broad SELECT listing policies on storage buckets (R2)
-- Severity: HIGH SECURITY (P1)
-- Category: public_bucket_allows_listing
-- ==============================================================================

BEGIN;

-- 1. Drop broad SELECT policies on storage.objects that permit file listing
DROP POLICY IF EXISTS "Authenticated users can select avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can select evidence" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can select cvs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can select certificates" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can select course covers" ON storage.objects;

-- 2. Scoped SELECT policies: only owners or administrators can list their files
CREATE POLICY "avatars_select_scoped" ON storage.objects
    FOR SELECT TO authenticated
    USING (
        bucket_id = 'avatars'
        AND (owner = (SELECT auth.uid()) OR public.is_admin() OR public.is_super_admin())
    );

CREATE POLICY "evidence_select_scoped" ON storage.objects
    FOR SELECT TO authenticated
    USING (
        bucket_id = 'evidence'
        AND (owner = (SELECT auth.uid()) OR public.is_admin() OR public.is_super_admin())
    );

CREATE POLICY "cvs_select_scoped" ON storage.objects
    FOR SELECT TO authenticated
    USING (
        bucket_id = 'cv-generados'
        AND (owner = (SELECT auth.uid()) OR public.is_admin() OR public.is_super_admin())
    );

CREATE POLICY "certificates_select_scoped" ON storage.objects
    FOR SELECT TO authenticated
    USING (
        bucket_id = 'academy_certificates'
        AND (owner = (SELECT auth.uid()) OR public.is_admin() OR public.is_super_admin())

    );

-- 3. Ensure sensitive buckets are marked as private in storage.buckets (if column exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'storage' AND table_name = 'buckets' AND column_name = 'public'
    ) THEN
        UPDATE storage.buckets SET public = false WHERE id IN ('evidence', 'cv-generados');
    END IF;
END $$;

COMMIT;

