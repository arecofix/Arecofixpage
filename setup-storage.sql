-- ============================================
-- STORAGE BUCKET SETUP
-- ============================================

-- Create the public-assets bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('public-assets', 'public-assets', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STORAGE POLICIES
-- ============================================

-- 1. Allow public read access to all files in public-assets
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'public-assets' );

-- 2. Allow authenticated users to upload files to public-assets
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'public-assets' );

-- 3. Allow authenticated users to update their own files (optional, good for management)
CREATE POLICY "Authenticated Update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'public-assets' );

-- 4. Allow authenticated users to delete files (optional)
CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'public-assets' );
