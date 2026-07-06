-- Habilitar lectura pública de modulos de cursos
DROP POLICY IF EXISTS "Public View - Course Modules" ON public.course_modules;
CREATE POLICY "Public View - Course Modules" ON public.course_modules
  FOR SELECT TO anon
  USING (true);

-- Asegurar lectura para authenticated general
DROP POLICY IF EXISTS "Authenticated View - Course Modules" ON public.course_modules;
CREATE POLICY "Authenticated View - Course Modules" ON public.course_modules
  FOR SELECT TO authenticated
  USING (true);
