-- Permisos para que un ADMIN pueda editar roles y asignar sucursales a otros empleados de su mismo tenant.

-- 1. Habilitamos RLS en la tabla profiles (usualmente ya activa)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Asegurar lectura de perfiles (Los dueños y el equipo ven su lista)
DROP POLICY IF EXISTS "profiles_select_tenant" ON public.profiles;
DROP POLICY IF EXISTS "Usuarios pueden ver su propio perfil" ON public.profiles;
CREATE POLICY "profiles_select_tenant" ON public.profiles
  FOR SELECT TO authenticated
  USING (tenant_id = public.get_my_tenant() OR id = (select auth.uid()));

-- 3. Asegurar actualización de roles y sucursales (Sólo el admin o uno mismo)
DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;
CREATE POLICY "profiles_update_admin" ON public.profiles
  FOR UPDATE TO authenticated
  USING (
    -- El que edita soy yo mismo, O BIEN soy administrador de este mismo tenant
    id = (select auth.uid()) OR 
    (
        tenant_id = public.get_my_tenant() AND 
        EXISTS (
            SELECT 1 FROM public.profiles p2 
            WHERE p2.id = (select auth.uid()) AND p2.role = 'admin'
        )
    )
  )
  WITH CHECK (
    id = (select auth.uid()) OR 
    (
        tenant_id = public.get_my_tenant() AND 
        EXISTS (
            SELECT 1 FROM public.profiles p2 
            WHERE p2.id = (select auth.uid()) AND p2.role = 'admin'
        )
    )
  );
