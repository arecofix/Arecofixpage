-- Enable read access for all users to the courses table (already done, but good to reaffirm)
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
