-- Enable read access for all users to the courses table
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON "public"."courses"
AS PERMISSIVE FOR SELECT
TO public
USING (true);
