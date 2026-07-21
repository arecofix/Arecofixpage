-- ==============================================================================
-- RLS POLICIES FOR ACADEMY / INSTRUCTORS
-- ==============================================================================

-- 1. courses
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can do everything on courses" ON public.courses
  FOR ALL
  TO authenticated
  USING (
    -- Assuming a function `is_admin(tenant_id)` exists, or checking roles.
    -- We will check auth.jwt() for custom claims or use a public.users role column if exists.
    -- For this template, we assume admin has a way to be identified. A common approach:
    auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin' AND tenant_id = courses.tenant_id)
  )
  WITH CHECK (
    auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin' AND tenant_id = courses.tenant_id)
  );

CREATE POLICY "Instructors can view assigned courses" ON public.courses
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.course_instructors 
      WHERE course_id = courses.id 
      AND instructor_id = auth.uid()
    )
  );

-- 2. course_instructors
ALTER TABLE public.course_instructors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage course_instructors" ON public.course_instructors
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin' AND tenant_id = course_instructors.tenant_id)
  );

CREATE POLICY "Instructors can view their own assignments" ON public.course_instructors
  FOR SELECT
  TO authenticated
  USING ( instructor_id = auth.uid() );


-- 3. lessons
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage lessons" ON public.lessons
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin' AND tenant_id = lessons.tenant_id)
  );

CREATE POLICY "Instructors can manage lessons of assigned courses" ON public.lessons
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.course_instructors 
      WHERE course_id = lessons.course_id 
      AND instructor_id = auth.uid()
    )
  );


-- 4. lesson_contents
ALTER TABLE public.lesson_contents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage lesson contents" ON public.lesson_contents
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin' AND tenant_id = lesson_contents.tenant_id)
  );

CREATE POLICY "Instructors can manage contents of assigned courses" ON public.lesson_contents
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.lessons
      JOIN public.course_instructors ON course_instructors.course_id = lessons.course_id
      WHERE lessons.id = lesson_contents.lesson_id
      AND course_instructors.instructor_id = auth.uid()
    )
  );
