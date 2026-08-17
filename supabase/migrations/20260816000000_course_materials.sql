-- Migration: Course Materials (Modules & Contents)
-- Description: Adds tables and RLS policies for managing course curriculum and study materials.

-- 1. Create course_modules table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.course_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create course_module_contents table
CREATE TABLE IF NOT EXISTS public.course_module_contents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES public.course_modules(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('video', 'image', 'document', 'link', 'text')),
    title TEXT,
    url TEXT,
    metadata JSONB,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_course_modules_course_id ON public.course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_course_module_contents_lesson_id ON public.course_module_contents(lesson_id);

-- Enable RLS
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_module_contents ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies for course_modules

-- Admin can do everything on modules
DROP POLICY IF EXISTS "Admins can manage course modules" ON public.course_modules;
CREATE POLICY "Admins can manage course modules" 
ON public.course_modules 
FOR ALL 
TO authenticated 
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'staff', 'super_admin', 'tenant_owner')
);

-- Enrolled students can read modules
DROP POLICY IF EXISTS "Students can view modules" ON public.course_modules;
CREATE POLICY "Students can view modules" 
ON public.course_modules 
FOR SELECT 
TO public
USING (
  EXISTS (
      SELECT 1 FROM public.course_enrollments ce
      WHERE ce.course_id = course_modules.course_id
      AND ce.status = 'confirmed'
      AND ce.email = (auth.jwt() ->> 'email')
  )
  OR
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'staff', 'super_admin', 'tenant_owner')
);

-- Public can view modules if course is public (useful for syllabus preview)
DROP POLICY IF EXISTS "Public can view syllabus" ON public.course_modules;
CREATE POLICY "Public can view syllabus" 
ON public.course_modules 
FOR SELECT 
TO public
USING (
  EXISTS (
      SELECT 1 FROM public.courses c
      WHERE c.id = course_modules.course_id
      AND c.is_active = true
  )
);


-- 4. RLS Policies for course_module_contents

-- Admin can do everything on contents
DROP POLICY IF EXISTS "Admins can manage course contents" ON public.course_module_contents;
CREATE POLICY "Admins can manage course contents" 
ON public.course_module_contents 
FOR ALL 
TO authenticated 
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'staff', 'super_admin', 'tenant_owner')
);

-- Enrolled students can read contents
DROP POLICY IF EXISTS "Students can view contents" ON public.course_module_contents;
CREATE POLICY "Students can view contents" 
ON public.course_module_contents 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
      SELECT 1 FROM public.course_modules cm
      JOIN public.course_enrollments ce ON ce.course_id = cm.course_id
      WHERE cm.id = course_module_contents.lesson_id
      AND ce.status = 'confirmed'
      AND ce.email = (auth.jwt() ->> 'email')
  )
  OR
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'staff', 'super_admin', 'tenant_owner')
);

-- NOTE: We don't allow public to view contents by default. They must be enrolled.

