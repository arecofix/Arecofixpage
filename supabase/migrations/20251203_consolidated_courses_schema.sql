-- CONSOLIDATED COURSES SCHEMA AND RLS
-- This migration ensures courses table policies are correctly set up.

-- 1. Enable RLS (if not already enabled)
ALTER TABLE IF EXISTS "public"."courses" ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to ensure clean slate
DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."courses";
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "public"."courses";
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON "public"."courses";
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON "public"."courses";

-- 3. Create Policies

-- Enable read access for all users
CREATE POLICY "Enable read access for all users" ON "public"."courses"
AS PERMISSIVE FOR SELECT
TO public
USING (true);

-- Enable insert access for authenticated users only
CREATE POLICY "Enable insert for authenticated users only" ON "public"."courses"
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK (true);

-- Enable update access for authenticated users only
CREATE POLICY "Enable update for authenticated users only" ON "public"."courses"
AS PERMISSIVE FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Enable delete access for authenticated users only
CREATE POLICY "Enable delete for authenticated users only" ON "public"."courses"
AS PERMISSIVE FOR DELETE
TO authenticated
USING (true);
