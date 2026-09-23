
CREATE OR REPLACE FUNCTION public.can_edit_profile(target_role text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
      AND (
        p.role IN ('super_admin', 'tenant_owner', 'admin')
        OR (p.role IN ('staff', 'technician') AND target_role = 'user')
      )
  );
$$;

DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
CREATE POLICY "profiles_update_policy" ON public.profiles
FOR UPDATE TO authenticated
USING (
  auth.uid() = id 
  OR public.is_admin_user() 
  OR public.can_edit_profile(role)
)
WITH CHECK (
  auth.uid() = id 
  OR public.is_admin_user() 
  OR public.can_edit_profile(role)
);

NOTIFY pgrst, 'reload schema';

