-- Fix RLS policy for course_enrollments to check both email and user_id

-- 1. Drop existing policies
DROP POLICY IF EXISTS "course_enrollments_select_policy" ON public.course_enrollments;
DROP POLICY IF EXISTS "course_enrollments_all_policy" ON public.course_enrollments;

-- 2. Create new SELECT policy
CREATE POLICY "course_enrollments_select_policy"
ON public.course_enrollments
FOR SELECT
TO authenticated, anon
USING (
  lower(email) = lower(auth.jwt() ->> 'email')
  OR user_id = auth.uid()
  OR public.is_admin_of_tenant(tenant_id)
);

-- 3. Create new ALL policy
CREATE POLICY "course_enrollments_all_policy"
ON public.course_enrollments
FOR ALL
TO authenticated
USING (
  lower(email) = lower(auth.jwt() ->> 'email')
  OR user_id = auth.uid()
  OR public.is_admin_of_tenant(tenant_id)
)
WITH CHECK (
  lower(email) = lower(auth.jwt() ->> 'email')
  OR user_id = auth.uid()
  OR public.is_admin_of_tenant(tenant_id)
);

-- Notify postgrest to reload schema
NOTIFY pgrst, 'reload schema';
