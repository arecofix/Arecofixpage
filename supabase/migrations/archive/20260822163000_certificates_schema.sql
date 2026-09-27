-- Migration: Certificates System Update
-- Description: Alters existing course_certificates table and sets up storage bucket.

-- 1. Alter course_certificates Table
ALTER TABLE public.course_certificates 
ADD COLUMN IF NOT EXISTS pdf_url TEXT,
ADD COLUMN IF NOT EXISTS student_dni TEXT;

-- Enable RLS (if not already enabled)
ALTER TABLE public.course_certificates ENABLE ROW LEVEL SECURITY;

-- 2. RLS Policies for course_certificates
DROP POLICY IF EXISTS "Public can view course_certificates" ON public.course_certificates;
CREATE POLICY "Public can view course_certificates" 
ON public.course_certificates 
FOR SELECT 
TO public
USING (true);

DROP POLICY IF EXISTS "Instructors can insert course_certificates" ON public.course_certificates;
CREATE POLICY "Instructors can insert course_certificates" 
ON public.course_certificates 
FOR INSERT 
TO authenticated
WITH CHECK (true); -- Ideally restrict to instructors/admins

-- 3. Create Storage Bucket for Certificates
INSERT INTO storage.buckets (id, name, public)
VALUES ('academy_certificates', 'academy_certificates', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 4. RLS Policies for Storage Bucket 'academy_certificates'

-- Allow public read access to certificates
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'academy_certificates');

-- Allow authenticated users (instructors/edge function) to upload certificates
DROP POLICY IF EXISTS "Authenticated Uploads" ON storage.objects;
CREATE POLICY "Authenticated Uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'academy_certificates');

DROP POLICY IF EXISTS "Authenticated Updates" ON storage.objects;
CREATE POLICY "Authenticated Updates"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'academy_certificates');
