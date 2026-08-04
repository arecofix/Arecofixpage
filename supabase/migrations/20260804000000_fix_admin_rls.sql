-- Fix: Allow admins and staff to manage profiles
CREATE POLICY "Admins can manage all profiles" ON public.profiles
FOR ALL
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'staff', 'tenant_owner', 'super_admin')
);
