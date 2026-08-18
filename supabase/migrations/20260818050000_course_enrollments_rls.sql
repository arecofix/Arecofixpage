-- Migration: Políticas RLS para Course Enrollments y Courses
-- Fecha: 2026-08-18

-- 1. FUNCIÓN HELPER SECURITY DEFINER PARA VALIDAR ADMINS POR TENANT
CREATE OR REPLACE FUNCTION public.is_admin_of_tenant(p_tenant_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND (
        role IN ('super_admin', 'tenant_owner')
        OR (role = 'admin' AND (tenant_id = p_tenant_id OR p_tenant_id IS NULL))
      )
  );
$$;

-- 2. HABILITAR RLS
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- 3. POLÍTICAS PARA course_enrollments
DROP POLICY IF EXISTS "course_enrollments_select_policy" ON public.course_enrollments;
DROP POLICY IF EXISTS "course_enrollments_insert_policy" ON public.course_enrollments;
DROP POLICY IF EXISTS "course_enrollments_update_policy" ON public.course_enrollments;
DROP POLICY IF EXISTS "course_enrollments_all_policy" ON public.course_enrollments;

-- 3.1 Lectura: Permite al alumno ver solo sus propias inscripciones y a los administradores ver las de su tenant
CREATE POLICY "course_enrollments_select_policy"
ON public.course_enrollments
FOR SELECT
TO authenticated, anon
USING (
  lower(email) = lower(auth.jwt() ->> 'email')
  OR public.is_admin_of_tenant(tenant_id)
);

-- 3.2 Gestión (Insert/Update/Delete): Alumnos gestionan lo suyo, admins gestionan su tenant
CREATE POLICY "course_enrollments_all_policy"
ON public.course_enrollments
FOR ALL
TO authenticated
USING (
  lower(email) = lower(auth.jwt() ->> 'email')
  OR public.is_admin_of_tenant(tenant_id)
)
WITH CHECK (
  lower(email) = lower(auth.jwt() ->> 'email')
  OR public.is_admin_of_tenant(tenant_id)
);

-- 4. POLÍTICA PARA courses 
DROP POLICY IF EXISTS "courses_select_policy" ON public.courses;

-- 4.1 Lectura de Catálogo: Todo el mundo (anon/auth) puede ver los cursos ACTIVOS.
-- Los administradores pueden ver todos (incluyendo inactivos/borradores de su tenant).
CREATE POLICY "courses_select_policy"
ON public.courses
FOR SELECT
TO authenticated, anon
USING (
  is_active = true 
  OR public.is_admin_of_tenant(tenant_id)
);

-- 5. RECARGAR SCHEMA
NOTIFY pgrst, 'reload schema';
