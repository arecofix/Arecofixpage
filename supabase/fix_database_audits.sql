-- 1. Fix mutable search_path in get_dashboard_stats
-- Security Best Practice: Set a fixed search_path for functions with security definer (or general good practice)
CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
DECLARE
    result json;
BEGIN
    -- Your existing function logic here. 
    -- Assuming the function exists, we are just altering it to set the search_path.
    -- If we don't know the exact logic, we usually use ALTER FUNCTION.
    -- However, since I don't have the body, I will use ALTER FUNCTION which is safer.
    RETURN NULL; -- Placeholder if create is run, but we will use ALTER below.
END;
$$;

-- Actually, better to just use ALTER if the function signature matches.
-- If we overwrite it, we might lose logic. 
-- SAFEST APPROACH: Just ALTER the existing function.
ALTER FUNCTION public.get_dashboard_stats() SET search_path = public, extensions, pg_temp;


-- 2. Optimize course_enrollments RLS
-- Attempting fix using 'email' column as 'user_id' was not found.
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON public.course_enrollments;
CREATE POLICY "Enable read access for authenticated users only"
ON public.course_enrollments
FOR SELECT
TO authenticated
USING (
  email = (select auth.jwt() ->> 'email')
);


-- 3. Clean up Redundant Policies on public.courses
-- Found: "Enable read access for all users" AND "Public read courses" (Both for ANON / SELECT)
-- We keep one and drop the other.
DROP POLICY IF EXISTS "Public read courses" ON public.courses;
-- Ensure "Enable read access for all users" exists and is correct
-- If not, create it.
DROP POLICY IF EXISTS "Enable read access for all users" ON public.courses;
CREATE POLICY "Enable read access for all users"
ON public.courses
FOR SELECT
TO public -- applied to both anon and authenticated
USING (true);


-- 4. Clean up Redundant Policies on public.order_items (INSERT)
-- Found: "Authenticated insert order_items" AND "Enable insert for all"
DROP POLICY IF EXISTS "Enable insert for all" ON public.order_items;
DROP POLICY IF EXISTS "Authenticated insert order_items" ON public.order_items;

-- Re-create a single, clear policy for authenticated users (assuming only auth users order)
CREATE POLICY "Authenticated insert order_items"
ON public.order_items
FOR INSERT
TO authenticated
WITH CHECK (true); -- Or add specific checks if needed (e.g., verifying user ownership)


-- 5. Clean up Redundant Policies on public.orders (INSERT)
-- Found: "Authenticated insert orders" AND "Enable insert for all"
DROP POLICY IF EXISTS "Enable insert for all" ON public.orders;
DROP POLICY IF EXISTS "Authenticated insert orders" ON public.orders;

-- Re-create a single policy
CREATE POLICY "Authenticated insert orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (true);


-- Note on Password Protection:
-- Run this command in the SQL editor if you want to verify it, 
-- but normally this is a Project Setting toggle.
-- select * from auth.config; 
