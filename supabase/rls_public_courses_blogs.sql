-- Habilitar lectura pública de cursos activos
DROP POLICY IF EXISTS "Public View - Courses" ON public.courses;
CREATE POLICY "Public View - Courses" ON public.courses
  FOR SELECT TO anon
  USING (is_active = true);

-- Asegurar lectura para authenticated general
DROP POLICY IF EXISTS "Authenticated View - Courses" ON public.courses;
CREATE POLICY "Authenticated View - Courses" ON public.courses
  FOR SELECT TO authenticated
  USING (is_active = true);

-- Habilitar lectura pública de artículos del blog publicados
DROP POLICY IF EXISTS "Public View - Blog Posts" ON public.blog_posts;
CREATE POLICY "Public View - Blog Posts" ON public.blog_posts
  FOR SELECT TO anon
  USING (status = 'published');

-- Asegurar lectura para authenticated general
DROP POLICY IF EXISTS "Authenticated View - Blog Posts" ON public.blog_posts;
CREATE POLICY "Authenticated View - Blog Posts" ON public.blog_posts
  FOR SELECT TO authenticated
  USING (status = 'published');
