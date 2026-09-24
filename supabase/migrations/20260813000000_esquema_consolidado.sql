-- Fix 1: Add composite index for product filtering (solves the 500 timeout)
CREATE INDEX IF NOT EXISTS idx_products_tenant_deleted_created 
ON public.products (tenant_id, deleted_at, created_at DESC);

-- Fix 2: Add GIN index for search_tsv (prevents full text search timeouts)
CREATE INDEX IF NOT EXISTS idx_products_search_tsv 
ON public.products USING GIN (search_tsv);

-- Fix 3: Enforce unique slugs for tenants to prevent sub-domain collisions
ALTER TABLE public.tenants ADD CONSTRAINT unique_tenant_slug UNIQUE (slug);

-- Fix 4: Add index on foreign keys for joined tables (prevents 500 timeouts when fetching products with stock)
CREATE INDEX IF NOT EXISTS idx_product_stock_product_id ON public.product_stock_per_branch(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_repair_parts_used_product_id ON public.repair_parts_used(product_id);
-- Solución Definitiva y Segura para Supabase (Sin errores de permisos)
-- Reemplaza la función que usa todas tus tablas en la columna "DEFAULT get_my_tenant()"
-- para que cuando PostgREST no envíe la variable 'app.current_tenant', devuelva NULL
-- de forma silenciosa en lugar de arrojar el error 42704.

CREATE OR REPLACE FUNCTION public.get_my_tenant() 
RETURNS uuid AS $$
DECLARE
  tenant_val text;
BEGIN
  -- IMPORTANTE: El parámetro 'true' hace que PostgreSQL ignore la ausencia de la variable
  tenant_val := current_setting('app.current_tenant', true);
  
  IF tenant_val IS NULL OR tenant_val = '' THEN
    RETURN NULL;
  END IF;

  RETURN tenant_val::uuid;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE;
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

-- 2. Create course_lessons table
CREATE TABLE IF NOT EXISTS public.course_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES public.course_modules(id) ON DELETE CASCADE,
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
CREATE INDEX IF NOT EXISTS idx_course_lessons_module_id ON public.course_lessons(module_id);

-- Enable RLS
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;

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


-- 4. RLS Policies for course_lessons

-- Admin can do everything on contents
DROP POLICY IF EXISTS "Admins can manage course contents" ON public.course_lessons;
CREATE POLICY "Admins can manage course contents" 
ON public.course_lessons 
FOR ALL 
TO authenticated 
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'staff', 'super_admin', 'tenant_owner')
);

-- Enrolled students can read contents
DROP POLICY IF EXISTS "Students can view contents" ON public.course_lessons;
CREATE POLICY "Students can view contents" 
ON public.course_lessons 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
      SELECT 1 FROM public.course_modules cm
      JOIN public.course_enrollments ce ON ce.course_id = cm.course_id
      WHERE cm.id = course_lessons.module_id
      AND ce.status = 'confirmed'
      AND ce.email = (auth.jwt() ->> 'email')
  )
  OR
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'staff', 'super_admin', 'tenant_owner')
);

-- NOTE: We don't allow public to view contents by default. They must be enrolled.

-- Migration: Course Exams (Questions and Submissions)
-- Description: Adds tables and RPCs for secure exam processing.

-- 1. Modify existing check constraint on course_lessons to allow 'exam' type
ALTER TABLE public.course_lessons DROP CONSTRAINT IF EXISTS course_lessons_type_check;
ALTER TABLE public.course_lessons ADD CONSTRAINT course_lessons_type_check CHECK (type IN ('video', 'image', 'document', 'link', 'text', 'exam'));

-- 2. Create course_exam_questions table
CREATE TABLE IF NOT EXISTS public.course_exam_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of strings
    correct_option_index INTEGER NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_course_exam_questions_content_id ON public.course_exam_questions(content_id);

ALTER TABLE public.course_exam_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage exam questions" ON public.course_exam_questions;
CREATE POLICY "Admins can manage exam questions" 
ON public.course_exam_questions 
FOR ALL 
TO authenticated 
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'staff', 'super_admin', 'tenant_owner')
);
-- Students do NOT get direct SELECT access. They use the RPC get_exam_questions to prevent seeing correct_option_index.

-- 3. Create course_exam_submissions table
CREATE TABLE IF NOT EXISTS public.course_exam_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    answers JSONB NOT NULL, -- Array of selected option indexes
    score NUMERIC NOT NULL,
    passed BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_course_exam_submissions_content_id ON public.course_exam_submissions(content_id);
CREATE INDEX IF NOT EXISTS idx_course_exam_submissions_email ON public.course_exam_submissions(email);

ALTER TABLE public.course_exam_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view exam submissions" ON public.course_exam_submissions;
CREATE POLICY "Admins can view exam submissions" 
ON public.course_exam_submissions 
FOR ALL 
TO authenticated 
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'staff', 'super_admin', 'tenant_owner')
);

DROP POLICY IF EXISTS "Students can view their own submissions" ON public.course_exam_submissions;
CREATE POLICY "Students can view their own submissions" 
ON public.course_exam_submissions 
FOR SELECT 
TO authenticated
USING (
  email = (auth.jwt() ->> 'email')
);

-- 4. RPC: get_exam_questions (Secure fetch for students)
CREATE OR REPLACE FUNCTION public.get_exam_questions(p_content_id UUID)
RETURNS TABLE (id UUID, question_text TEXT, options JSONB, order_index INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_email TEXT;
    v_has_access BOOLEAN := false;
BEGIN
    v_email := auth.jwt() ->> 'email';
    
    -- Check if user is admin
    IF EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff', 'super_admin', 'tenant_owner')) THEN
        v_has_access := true;
    ELSE
        -- Check if student is enrolled
        IF v_email IS NOT NULL AND EXISTS (
            SELECT 1 FROM public.course_lessons c
            JOIN public.course_modules cm ON cm.id = c.module_id
            JOIN public.course_enrollments ce ON ce.course_id = cm.course_id
            WHERE c.id = p_content_id AND ce.email = v_email AND ce.status = 'confirmed'
        ) THEN
            v_has_access := true;
        END IF;
    END IF;

    IF NOT v_has_access THEN
        RAISE EXCEPTION 'Access denied';
    END IF;

    RETURN QUERY
    SELECT q.id, q.question_text, q.options, q.order_index
    FROM public.course_exam_questions q
    WHERE q.content_id = p_content_id
    ORDER BY q.order_index ASC;
END;
$$;

-- 5. RPC: submit_exam (Secure grading)
CREATE OR REPLACE FUNCTION public.submit_exam(
    p_content_id UUID,
    p_answers JSONB -- format: [{"question_id": "uuid", "selected_index": 0}]
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_tenant_id UUID;
    v_email TEXT;
    v_passing_score NUMERIC;
    v_total_questions INTEGER;
    v_correct_answers INTEGER := 0;
    v_score NUMERIC;
    v_passed BOOLEAN;
    v_answer JSONB;
    v_q_id UUID;
    v_q_idx INTEGER;
    v_real_idx INTEGER;
    v_metadata JSONB;
    v_has_access BOOLEAN := false;
BEGIN
    v_email := auth.jwt() ->> 'email';
    IF v_email IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Get content details
    SELECT tenant_id, metadata INTO v_tenant_id, v_metadata
    FROM public.course_lessons
    WHERE id = p_content_id;

    IF v_tenant_id IS NULL THEN
        RAISE EXCEPTION 'Exam not found';
    END IF;

    -- Check access
    IF EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff', 'super_admin', 'tenant_owner')) THEN
        v_has_access := true;
    ELSE
        IF EXISTS (
            SELECT 1 FROM public.course_lessons c
            JOIN public.course_modules cm ON cm.id = c.module_id
            JOIN public.course_enrollments ce ON ce.course_id = cm.course_id
            WHERE c.id = p_content_id AND ce.email = v_email AND ce.status = 'confirmed'
        ) THEN
            v_has_access := true;
        END IF;
    END IF;

    IF NOT v_has_access THEN
        RAISE EXCEPTION 'Access denied';
    END IF;

    -- Get passing score
    v_passing_score := COALESCE((v_metadata->>'passing_score')::NUMERIC, 60.0);

    -- Get total questions
    SELECT count(*) INTO v_total_questions
    FROM public.course_exam_questions
    WHERE content_id = p_content_id;

    IF v_total_questions = 0 THEN
        RAISE EXCEPTION 'Exam has no questions';
    END IF;

    -- Calculate score
    FOR v_answer IN SELECT * FROM jsonb_array_elements(p_answers)
    LOOP
        v_q_id := (v_answer->>'question_id')::UUID;
        v_q_idx := (v_answer->>'selected_index')::INTEGER;

        SELECT correct_option_index INTO v_real_idx
        FROM public.course_exam_questions
        WHERE id = v_q_id AND content_id = p_content_id;

        IF v_real_idx IS NOT NULL AND v_real_idx = v_q_idx THEN
            v_correct_answers := v_correct_answers + 1;
        END IF;
    END LOOP;

    v_score := (v_correct_answers::NUMERIC / v_total_questions::NUMERIC) * 100.0;
    v_passed := v_score >= v_passing_score;

    -- Insert submission
    INSERT INTO public.course_exam_submissions (content_id, tenant_id, email, answers, score, passed)
    VALUES (p_content_id, v_tenant_id, v_email, p_answers, v_score, v_passed);

    RETURN jsonb_build_object(
        'score', v_score,
        'passed', v_passed,
        'correct_answers', v_correct_answers,
        'total_questions', v_total_questions
    );
END;
$$;
-- Migration to fix orders RLS for customers
-- We drop the overly restrictive Force_My_Tenant_On_Insert_Orders policy

DROP POLICY IF EXISTS "Force_My_Tenant_On_Insert_Orders" ON public.orders;

-- Ensure users can insert orders if they are creating it for themselves
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
CREATE POLICY "Users can insert their own orders"
    ON public.orders FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Ensure users can update their own orders
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;
CREATE POLICY "Users can update their own orders"
    ON public.orders FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Ensure admins/staff can still insert orders via the staff policies
-- We'll add a policy that allows staff to insert if the order's tenant matches their tenant
DROP POLICY IF EXISTS "Staff can insert orders for their tenant" ON public.orders;
CREATE POLICY "Staff can insert orders for their tenant"
    ON public.orders FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles s 
            WHERE s.id = auth.uid() 
            AND s.tenant_id = orders.tenant_id
            AND s.role IN ('staff', 'admin', 'super_admin', 'tenant_owner')
        )
    );

-- Also fix order_items RLS
DROP POLICY IF EXISTS "Force_My_Tenant_On_Insert_Order_Items" ON public.order_items;

DROP POLICY IF EXISTS "Users can manage their own order items" ON public.order_items;
CREATE POLICY "Users can manage their own order items"
    ON public.order_items FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = order_items.order_id
            AND o.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = order_items.order_id
            AND o.user_id = auth.uid()
        )
    );
-- Migration: Course Progress and Certificates
-- Description: Tracking student progress and generating certificates

-- 1. Create course_progress table
CREATE TABLE IF NOT EXISTS public.course_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    content_id UUID NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
    completed_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(email, content_id)
);

CREATE INDEX IF NOT EXISTS idx_course_progress_email ON public.course_progress(email);
CREATE INDEX IF NOT EXISTS idx_course_progress_course_id ON public.course_progress(course_id);

ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;

-- Admins can view all progress
DROP POLICY IF EXISTS "Admins can view progress" ON public.course_progress;
CREATE POLICY "Admins can view progress" 
ON public.course_progress FOR ALL TO authenticated 
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'staff', 'super_admin', 'tenant_owner'));

-- Students can view and insert their own progress
DROP POLICY IF EXISTS "Students manage own progress" ON public.course_progress;
CREATE POLICY "Students manage own progress" 
ON public.course_progress FOR ALL TO authenticated 
USING (email = (auth.jwt() ->> 'email'));

-- 2. Create course_certificates table
CREATE TABLE IF NOT EXISTS public.course_certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    student_name TEXT NOT NULL,
    issued_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(email, course_id)
);

CREATE INDEX IF NOT EXISTS idx_course_certificates_email ON public.course_certificates(email);

ALTER TABLE public.course_certificates ENABLE ROW LEVEL SECURITY;

-- Admins can view all certificates
DROP POLICY IF EXISTS "Admins can view certificates" ON public.course_certificates;
CREATE POLICY "Admins can view certificates" 
ON public.course_certificates FOR ALL TO authenticated
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'staff', 'super_admin', 'tenant_owner'));

-- Public can view certificates to verify them, or students can view their own
DROP POLICY IF EXISTS "Public can verify certificates" ON public.course_certificates;
CREATE POLICY "Public can verify certificates" 
ON public.course_certificates FOR SELECT TO public
USING (true);

-- 3. RPC to mark content as completed
CREATE OR REPLACE FUNCTION public.mark_content_completed(p_content_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_email TEXT;
    v_tenant_id UUID;
    v_course_id UUID;
    v_student_name TEXT;
    v_total_contents INTEGER;
    v_completed_contents INTEGER;
    v_progress NUMERIC;
    v_cert_id UUID;
BEGIN
    v_email := auth.jwt() ->> 'email';
    IF v_email IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Get user name from profiles or enrollment
    SELECT full_name INTO v_student_name FROM public.profiles WHERE email = v_email LIMIT 1;
    IF v_student_name IS NULL THEN
        SELECT full_name INTO v_student_name FROM public.course_enrollments WHERE email = v_email AND status = 'confirmed' LIMIT 1;
    END IF;
    IF v_student_name IS NULL THEN
        v_student_name := split_part(v_email, '@', 1);
    END IF;

    -- Get content details
    SELECT c.tenant_id, m.course_id INTO v_tenant_id, v_course_id
    FROM public.course_lessons c
    JOIN public.course_modules m ON m.id = c.module_id
    WHERE c.id = p_content_id;

    IF v_tenant_id IS NULL THEN
        RAISE EXCEPTION 'Content not found';
    END IF;

    -- Check if enrolled
    IF NOT EXISTS (
        SELECT 1 FROM public.course_enrollments 
        WHERE course_id = v_course_id AND email = v_email AND status = 'confirmed'
    ) AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff', 'super_admin', 'tenant_owner')) THEN
        RAISE EXCEPTION 'Not enrolled in this course';
    END IF;

    -- Insert progress if not exists
    INSERT INTO public.course_progress (tenant_id, email, course_id, content_id)
    VALUES (v_tenant_id, v_email, v_course_id, p_content_id)
    ON CONFLICT (email, content_id) DO NOTHING;

    -- Calculate progress
    SELECT COUNT(*) INTO v_total_contents
    FROM public.course_lessons c
    JOIN public.course_modules m ON m.id = c.module_id
    WHERE m.course_id = v_course_id;

    SELECT COUNT(*) INTO v_completed_contents
    FROM public.course_progress
    WHERE course_id = v_course_id AND email = v_email;

    v_progress := (v_completed_contents::NUMERIC / NULLIF(v_total_contents, 0)::NUMERIC) * 100.0;
    
    -- Issue certificate if 100% and doesn't exist
    IF v_completed_contents >= v_total_contents THEN
        v_progress := 100.0;
        
        SELECT id INTO v_cert_id FROM public.course_certificates WHERE course_id = v_course_id AND email = v_email;
        
        IF v_cert_id IS NULL THEN
            INSERT INTO public.course_certificates (tenant_id, course_id, email, student_name)
            VALUES (v_tenant_id, v_course_id, v_email, v_student_name)
            RETURNING id INTO v_cert_id;
        END IF;
    END IF;

    RETURN jsonb_build_object(
        'progress', v_progress,
        'completed', v_completed_contents,
        'total', v_total_contents,
        'certificate_id', v_cert_id
    );
END;
$$;

-- 4. Update submit_exam to auto-mark content as completed if passed
CREATE OR REPLACE FUNCTION public.submit_exam(
    p_content_id UUID,
    p_answers JSONB
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_tenant_id UUID;
    v_email TEXT;
    v_passing_score NUMERIC;
    v_total_questions INTEGER;
    v_correct_answers INTEGER := 0;
    v_score NUMERIC;
    v_passed BOOLEAN;
    v_answer JSONB;
    v_q_id UUID;
    v_q_idx INTEGER;
    v_real_idx INTEGER;
    v_metadata JSONB;
    v_has_access BOOLEAN := false;
    v_progress_result JSONB;
BEGIN
    v_email := auth.jwt() ->> 'email';
    IF v_email IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    SELECT tenant_id, metadata INTO v_tenant_id, v_metadata
    FROM public.course_lessons WHERE id = p_content_id;

    IF v_tenant_id IS NULL THEN RAISE EXCEPTION 'Exam not found'; END IF;

    IF EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff', 'super_admin', 'tenant_owner')) THEN
        v_has_access := true;
    ELSE
        IF EXISTS (
            SELECT 1 FROM public.course_lessons c
            JOIN public.course_modules cm ON cm.id = c.module_id
            JOIN public.course_enrollments ce ON ce.course_id = cm.course_id
            WHERE c.id = p_content_id AND ce.email = v_email AND ce.status = 'confirmed'
        ) THEN v_has_access := true; END IF;
    END IF;

    IF NOT v_has_access THEN RAISE EXCEPTION 'Access denied'; END IF;

    v_passing_score := COALESCE((v_metadata->>'passing_score')::NUMERIC, 60.0);

    SELECT count(*) INTO v_total_questions FROM public.course_exam_questions WHERE content_id = p_content_id;
    IF v_total_questions = 0 THEN RAISE EXCEPTION 'Exam has no questions'; END IF;

    FOR v_answer IN SELECT * FROM jsonb_array_elements(p_answers)
    LOOP
        v_q_id := (v_answer->>'question_id')::UUID;
        v_q_idx := (v_answer->>'selected_index')::INTEGER;
        SELECT correct_option_index INTO v_real_idx FROM public.course_exam_questions WHERE id = v_q_id AND content_id = p_content_id;
        IF v_real_idx IS NOT NULL AND v_real_idx = v_q_idx THEN v_correct_answers := v_correct_answers + 1; END IF;
    END LOOP;

    v_score := (v_correct_answers::NUMERIC / v_total_questions::NUMERIC) * 100.0;
    v_passed := v_score >= v_passing_score;

    INSERT INTO public.course_exam_submissions (content_id, tenant_id, email, answers, score, passed)
    VALUES (p_content_id, v_tenant_id, v_email, p_answers, v_score, v_passed);

    -- Auto-mark content as completed if passed
    IF v_passed THEN
        SELECT public.mark_content_completed(p_content_id) INTO v_progress_result;
    END IF;

    RETURN jsonb_build_object(
        'score', v_score,
        'passed', v_passed,
        'correct_answers', v_correct_answers,
        'total_questions', v_total_questions,
        'progress', v_progress_result
    );
END;
$$;
-- Add author_id to courses for instructor assignment
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
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
DROP POLICY IF EXISTS "Authors can manage course contents" ON public.course_lessons;
CREATE POLICY "Authors can manage course contents" 
ON public.course_lessons 
FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.course_modules cm
    JOIN public.courses c ON c.id = cm.course_id
    WHERE cm.id = course_lessons.module_id AND c.author_id = auth.uid()
  )
);

-- Recargar caché de PostgREST
NOTIFY pgrst, 'reload schema';
-- 1. FUNCIÓN DE SINCRONIZACIÓN AUTOMÁTICA (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_first_name text;
  v_last_name text;
  v_full_name text;
  v_avatar_url text;
  v_phone text;
  v_role text;
  v_tenant_id uuid;
  v_branch_id uuid;
  v_raw_meta jsonb;
  v_email text;
BEGIN
  v_raw_meta := COALESCE(NEW.raw_user_meta_data, '{}'::jsonb);
  v_email := COALESCE(NEW.email, v_raw_meta->>'email', '');

  -- 1.1 Extracción de Nombre Completo y Nombres/Apellidos para separarlos
  v_full_name := NULLIF(TRIM(COALESCE(
    v_raw_meta->>'full_name',
    v_raw_meta->>'name',
    ''
  )), '');

  v_first_name := NULLIF(TRIM(COALESCE(
    v_raw_meta->>'first_name',
    v_raw_meta->>'given_name',
    CASE 
      WHEN v_full_name IS NOT NULL AND position(' ' IN v_full_name) > 0 
      THEN split_part(v_full_name, ' ', 1)
      ELSE v_full_name
    END,
    split_part(v_email, '@', 1)
  )), '');

  v_last_name := NULLIF(TRIM(COALESCE(
    v_raw_meta->>'last_name',
    v_raw_meta->>'family_name',
    CASE 
      WHEN v_full_name IS NOT NULL AND position(' ' IN v_full_name) > 0 
      THEN substr(v_full_name, length(split_part(v_full_name, ' ', 1)) + 2)
      ELSE ''
    END
  )), '');

  -- 1.2 Avatar y Teléfono
  v_avatar_url := NULLIF(TRIM(COALESCE(
    v_raw_meta->>'avatar_url',
    v_raw_meta->>'picture',
    ''
  )), '');

  v_phone := NULLIF(TRIM(COALESCE(
    NEW.phone,
    v_raw_meta->>'phone',
    ''
  )), '');

  -- 1.3 Asignación de Rol
  IF v_email IN ('ezequielenrico15@gmail.com', 'ezequielenrico1015@hotmail.com') THEN
    v_role := 'super_admin';
  ELSIF v_raw_meta->>'role' IN ('admin', 'super_admin', 'tenant_owner', 'staff', 'technician', 'instructor') THEN
    v_role := v_raw_meta->>'role';
  ELSE
    v_role := 'user';
  END IF;

  -- 1.4 Resolución de Tenant ID
  IF v_raw_meta->>'tenant_id' IS NOT NULL AND v_raw_meta->>'tenant_id' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
    SELECT id INTO v_tenant_id FROM public.tenants WHERE id = (v_raw_meta->>'tenant_id')::uuid;
  END IF;

  IF v_tenant_id IS NULL THEN
    SELECT id INTO v_tenant_id 
    FROM public.tenants 
    WHERE slug = 'arecofix' OR id = 'bba26ccd-59ce-471c-aac0-4c1f5513de3b'::uuid
    LIMIT 1;
    
    IF v_tenant_id IS NULL THEN
      SELECT t.id INTO v_tenant_id FROM public.tenants t WHERE t.is_active = true ORDER BY t.created_at ASC LIMIT 1;
    END IF;
  END IF;

  -- 1.5 Resolución de Branch ID
  IF v_raw_meta->>'branch_id' IS NOT NULL AND v_raw_meta->>'branch_id' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
    SELECT id INTO v_branch_id FROM public.branches WHERE id = (v_raw_meta->>'branch_id')::uuid;
  END IF;

  IF v_branch_id IS NULL THEN
    SELECT id INTO v_branch_id 
    FROM public.branches 
    WHERE id = 'de967f68-7b15-44c0-bc98-952ccf06e1e5'::uuid OR tenant_id = v_tenant_id
    LIMIT 1;
  END IF;

  -- 1.6 Inserción o Actualización Atómica (UPSERT)
  INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name,
    avatar_url,
    phone,
    role,
    tenant_id,
    branch_id,
    is_active,
    is_guest,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    v_email,
    v_first_name,
    v_last_name,
    v_avatar_url,
    v_phone,
    v_role,
    v_tenant_id,
    v_branch_id,
    true,
    false,
    COALESCE(NEW.created_at, NOW()),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = COALESCE(EXCLUDED.email, public.profiles.email),
    first_name = COALESCE(EXCLUDED.first_name, public.profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, public.profiles.last_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
    phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
    tenant_id = COALESCE(public.profiles.tenant_id, EXCLUDED.tenant_id),
    branch_id = COALESCE(public.profiles.branch_id, EXCLUDED.branch_id),
    updated_at = NOW();

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error en handle_new_user() para usuario %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- 2. TRIGGER EN auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 3. MIGRACIÓN RETROACTIVA (BACKFILL HISTÓRICO)
INSERT INTO public.profiles (
  id,
  email,
  first_name,
  last_name,
  avatar_url,
  phone,
  role,
  tenant_id,
  branch_id,
  is_active,
  is_guest,
  created_at,
  updated_at
)
SELECT
  u.id,
  u.email,
  COALESCE(
    u.raw_user_meta_data->>'first_name',
    u.raw_user_meta_data->>'given_name',
    split_part(COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', split_part(u.email, '@', 1)), ' ', 1)
  ) AS first_name,
  COALESCE(
    u.raw_user_meta_data->>'last_name',
    u.raw_user_meta_data->>'family_name',
    NULLIF(substr(COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', ''), length(split_part(COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', ''), ' ', 1)) + 2), '')
  ) AS last_name,
  COALESCE(u.raw_user_meta_data->>'avatar_url', u.raw_user_meta_data->>'picture', NULL) AS avatar_url,
  COALESCE(u.phone, u.raw_user_meta_data->>'phone', NULL) AS phone,
  CASE
    WHEN u.email IN ('ezequielenrico15@gmail.com', 'ezequielenrico1015@hotmail.com') THEN 'super_admin'
    WHEN u.raw_user_meta_data->>'role' IN ('admin', 'super_admin', 'tenant_owner', 'staff', 'technician', 'instructor') THEN u.raw_user_meta_data->>'role'
    ELSE 'user'
  END AS role,
  COALESCE(
    NULLIF(u.raw_user_meta_data->>'tenant_id', '')::uuid,
    (SELECT t.id FROM public.tenants t WHERE t.slug = 'arecofix' OR t.id = 'bba26ccd-59ce-471c-aac0-4c1f5513de3b'::uuid LIMIT 1),
    (SELECT t.id FROM public.tenants t WHERE t.is_active = true ORDER BY t.created_at ASC LIMIT 1)
  ) AS tenant_id,
  COALESCE(
    NULLIF(u.raw_user_meta_data->>'branch_id', '')::uuid,
    (SELECT b.id FROM public.branches b WHERE b.id = 'de967f68-7b15-44c0-bc98-952ccf06e1e5'::uuid LIMIT 1),
    (SELECT b.id FROM public.branches b WHERE b.is_active = true ORDER BY b.updated_at ASC LIMIT 1)
  ) AS branch_id,
  true AS is_active,
  false AS is_guest,
  COALESCE(u.created_at, NOW()),
  NOW()
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- 3.2 Repara registros existentes con tenant_id nulos o nombres faltantes
UPDATE public.profiles p
SET
  tenant_id = COALESCE(
    p.tenant_id,
    (SELECT t.id FROM public.tenants t WHERE t.slug = 'arecofix' OR t.id = 'bba26ccd-59ce-471c-aac0-4c1f5513de3b'::uuid LIMIT 1),
    (SELECT t.id FROM public.tenants t WHERE t.is_active = true ORDER BY t.created_at ASC LIMIT 1)
  ),
  branch_id = COALESCE(
    p.branch_id,
    (SELECT b.id FROM public.branches b WHERE b.id = 'de967f68-7b15-44c0-bc98-952ccf06e1e5'::uuid LIMIT 1),
    (SELECT b.id FROM public.branches b WHERE b.is_active = true ORDER BY b.updated_at ASC LIMIT 1)
  ),
  email = COALESCE(p.email, u.email),
  first_name = COALESCE(
    p.first_name,
    u.raw_user_meta_data->>'first_name',
    u.raw_user_meta_data->>'given_name',
    split_part(COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', split_part(u.email, '@', 1)), ' ', 1)
  ),
  last_name = COALESCE(
    p.last_name,
    u.raw_user_meta_data->>'last_name',
    u.raw_user_meta_data->>'family_name',
    NULLIF(substr(COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', ''), length(split_part(COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', ''), ' ', 1)) + 2), '')
  ),
  avatar_url = COALESCE(p.avatar_url, u.raw_user_meta_data->>'avatar_url', u.raw_user_meta_data->>'picture'),
  role = CASE
    WHEN u.email IN ('ezequielenrico15@gmail.com', 'ezequielenrico1015@hotmail.com') THEN 'super_admin'
    ELSE COALESCE(p.role, 'user')
  END,
  updated_at = NOW()
FROM auth.users u
WHERE p.id = u.id
  AND (
    p.tenant_id IS NULL 
    OR p.first_name IS NULL 
    OR (u.email IN ('ezequielenrico15@gmail.com', 'ezequielenrico1015@hotmail.com') AND p.role != 'super_admin')
  );

-- 4. FUNCIÓN HELPER NO RECURSIVA PARA VERIFICAR ADMINS (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('super_admin', 'tenant_owner', 'admin')
  );
$$;

-- 5. POLÍTICAS RLS EN public.profiles (SIN RECURSIÓN)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users and Admins can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage profiles in tenant" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;

-- 5.1 Lectura: Permitida para todos los usuarios autenticados y anónimos (evita recursión infinita en cascada)
CREATE POLICY "profiles_select_policy"
ON public.profiles
FOR SELECT
TO authenticated, anon
USING (true);

-- 5.2 Inserción: El propio usuario o administradores
CREATE POLICY "profiles_insert_policy"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id OR public.is_admin_user());

-- 5.3 Actualización: El propio usuario o administradores
CREATE POLICY "profiles_update_policy"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id OR public.is_admin_user())
WITH CHECK (auth.uid() = id OR public.is_admin_user());

-- 6. RECARGA DE CACHÉ DE POSTGREST
NOTIFY pgrst, 'reload schema';
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
-- Migration: Drip Content — Liberación Progresiva de Módulos
-- Fecha: 2026-08-18
-- Descripción: Agrega `unlock_date` a course_modules y actualiza las políticas RLS.

-- ─────────────────────────────────────────────────────────────
-- 1. AGREGAR COLUMNA unlock_date A course_modules
-- ─────────────────────────────────────────────────────────────
-- NULL        = bloqueado indefinidamente (sin fecha programada aún)
-- fecha futura = programado para ese momento
-- fecha pasada = ya desbloqueado
ALTER TABLE public.course_modules
  ADD COLUMN IF NOT EXISTS unlock_date TIMESTAMPTZ NULL;

-- Índice para optimizar consultas de "módulos actualmente desbloqueados"
CREATE INDEX IF NOT EXISTS idx_course_modules_unlock_date
  ON public.course_modules(unlock_date)
  WHERE unlock_date IS NOT NULL;

-- ─────────────────────────────────────────────────────────────
-- 2. ACTUALIZAR RLS DE course_modules (TEMARIO)
-- ─────────────────────────────────────────────────────────────
-- Una sola política de SELECT:
-- Todo el mundo ve el temario de cursos activos; admins ven todos los de su tenant.
DROP POLICY IF EXISTS "Public can view syllabus" ON public.course_modules;
DROP POLICY IF EXISTS "Students can view modules" ON public.course_modules;

CREATE POLICY "course_modules_select_policy"
ON public.course_modules
FOR SELECT
TO authenticated, anon
USING (
  EXISTS (
    SELECT 1 FROM public.courses c
    WHERE c.id = course_modules.course_id
      AND c.is_active = true
  )
  OR public.is_admin_of_tenant(tenant_id)
);

-- ─────────────────────────────────────────────────────────────
-- 3. ACTUALIZAR RLS DE course_lessons (CONTENIDO REAL)
-- ─────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Students can view contents" ON public.course_lessons;
DROP POLICY IF EXISTS "Admins can manage course contents" ON public.course_lessons;

-- 3.1 LECTURA: Solo alumnos inscriptos con fecha cumplida, o administradores
CREATE POLICY "module_contents_select_policy"
ON public.course_lessons
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.course_modules cm
    JOIN public.course_enrollments ce ON ce.course_id = cm.course_id
    WHERE cm.id = course_lessons.module_id
      AND ce.status = 'confirmed'
      AND lower(ce.email) = lower(auth.jwt() ->> 'email')
      AND cm.unlock_date IS NOT NULL
      AND cm.unlock_date <= now()
  )
  OR public.is_admin_of_tenant(tenant_id)
);

-- 3.2 GESTIÓN: Solo los admins pueden insertar, actualizar o borrar contenido
CREATE POLICY "module_contents_all_admin_policy"
ON public.course_lessons
FOR ALL
TO authenticated
USING (public.is_admin_of_tenant(tenant_id))
WITH CHECK (public.is_admin_of_tenant(tenant_id));

-- ─────────────────────────────────────────────────────────────
-- 4. RECARGAR SCHEMA DE POSTGREST
-- ─────────────────────────────────────────────────────────────
NOTIFY pgrst, 'reload schema';
-- Migration: E-Learning Architecture Cleanup & Optimization
-- Fecha: 2026-08-19

BEGIN;

-- ─────────────────────────────────────────────────────────────
-- PASO 1: RESCATAR DATOS DE LA RAMA DUPLICADA Y UNIFICAR
-- Si creaste contenido en la tabla vieja "lessons", esto lo pasa 
-- automáticamente a módulos para no perder ni un solo archivo.
-- ─────────────────────────────────────────────────────────────
DO $$ 
DECLARE
  v_lesson RECORD;
  v_new_module_id UUID;
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'lessons') THEN
      FOR v_lesson IN SELECT * FROM public.lessons LOOP
        -- Crea un módulo equivalente para esta lección paralela
        v_new_module_id := gen_random_uuid();
        INSERT INTO public.course_modules (id, course_id, title, description, tenant_id, order_index)
        VALUES (v_new_module_id, v_lesson.course_id, v_lesson.title, 'Módulo recuperado de lecciones antiguas', v_lesson.tenant_id, v_lesson.order_index);
        
        -- Mueve los contenidos a la tabla principal
        INSERT INTO public.course_lessons (id, module_id, tenant_id, type, title, url, metadata, order_index, created_at)
        SELECT id, v_new_module_id, tenant_id, type, title, url, metadata, order_index, created_at
        FROM public.lesson_contents
        WHERE module_id = v_lesson.id;
      END LOOP;
  END IF;
END $$;

-- Eliminar de forma segura la rama duplicada y obsoleta
DROP TABLE IF EXISTS public.lesson_contents CASCADE;
DROP TABLE IF EXISTS public.lessons CASCADE;

-- ─────────────────────────────────────────────────────────────
-- PASO 2: RENOMBRAR TABLA Y COLUMNAS A ESTÁNDAR LMS
-- Estructura final: courses -> course_modules -> course_lessons
-- ─────────────────────────────────────────────────────────────
-- Arreglamos la columna confusa (ahora los contenidos apuntan al module_id)
-- ALTER TABLE public.course_lessons RENAME COLUMN module_id TO module_id;

-- Renombramos la tabla para que el código frontend sea más limpio
-- ALTER TABLE public.course_lessons RENAME TO course_lessons;

-- ─────────────────────────────────────────────────────────────
-- PASO 3: BORRADO EN CASCADA (ON DELETE CASCADE)
-- Permitirá borrar un curso desde el Admin y que se limpien solos sus módulos y videos.
-- ─────────────────────────────────────────────────────────────
-- Cascada: Módulos -> Cursos
ALTER TABLE public.course_modules DROP CONSTRAINT IF EXISTS course_modules_course_id_fkey;
ALTER TABLE public.course_modules 
  ADD CONSTRAINT course_modules_course_id_fkey 
  FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;

-- Cascada: Lecciones -> Módulos
ALTER TABLE public.course_lessons DROP CONSTRAINT IF EXISTS course_lessons_module_id_fkey;
ALTER TABLE public.course_lessons 
  ADD CONSTRAINT course_lessons_module_id_fkey 
  FOREIGN KEY (module_id) REFERENCES public.course_modules(id) ON DELETE CASCADE;

-- Cascada: Progreso del alumno -> Lecciones
ALTER TABLE public.course_progress DROP CONSTRAINT IF EXISTS course_progress_content_id_fkey;
ALTER TABLE public.course_progress 
  ADD CONSTRAINT course_progress_content_id_fkey 
  FOREIGN KEY (content_id) REFERENCES public.course_lessons(id) ON DELETE CASCADE;

-- ─────────────────────────────────────────────────────────────
-- PASO 4: VINCULACIÓN FUERTE POR UUID (NO POR EMAIL)
-- Evita perder el progreso de los alumnos si cambian de correo
-- ─────────────────────────────────────────────────────────────
-- Agregar columnas UUID
ALTER TABLE public.course_enrollments ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.course_progress ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.course_certificates ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Migrar / Relacionar los datos existentes usando el correo que ya tienen
UPDATE public.course_enrollments ce
SET user_id = p.id
FROM public.profiles p
WHERE lower(ce.email) = lower(p.email) AND ce.user_id IS NULL;

UPDATE public.course_progress cp
SET user_id = p.id
FROM public.profiles p
WHERE lower(cp.email) = lower(p.email) AND cp.user_id IS NULL;

UPDATE public.course_certificates cc
SET user_id = p.id
FROM public.profiles p
WHERE lower(cc.email) = lower(p.email) AND cc.user_id IS NULL;

COMMIT;

-- Recargar esquema API
NOTIFY pgrst, 'reload schema';
