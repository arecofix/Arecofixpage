-- Fix: Allow admins and staff to manage profiles (Non-recursive)

-- 1. Create a SECURITY DEFINER function to bypass RLS when checking roles
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'staff', 'tenant_owner', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Drop the old recursive policy if the user applied it
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;

-- 3. Create the new policy using the function to prevent infinite recursion
CREATE POLICY "Admins can manage all profiles" ON public.profiles
FOR ALL
USING ( public.is_admin() );
