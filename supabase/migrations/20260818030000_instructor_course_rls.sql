-- 1. Permisos para que el instructor (author_id) pueda editar el curso principal
DROP POLICY IF EXISTS "Authors can manage their courses" ON public.courses;
CREATE POLICY "Authors can manage their courses" 
ON public.courses 
FOR ALL 
TO authenticated 
USING (author_id = auth.uid());

-- 2. Permisos para que el instructor pueda crear/editar módulos de su curso
DROP POLICY IF EXISTS "Authors can manage course modules" ON public.course_modules;
CREATE POLICY "Authors can manage course modules" 
ON public.course_modules 
FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.courses c 
    WHERE c.id = course_modules.course_id AND c.author_id = auth.uid()
  )
);

-- 3. Permisos para que el instructor pueda subir videos/documentos a los módulos
DROP POLICY IF EXISTS "Authors can manage course contents" ON public.course_module_contents;
CREATE POLICY "Authors can manage course contents" 
ON public.course_module_contents 
FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.course_modules cm
    JOIN public.courses c ON c.id = cm.course_id
    WHERE cm.id = course_module_contents.lesson_id AND c.author_id = auth.uid()
  )
);

-- Recargar caché de PostgREST
NOTIFY pgrst, 'reload schema';
