-- Migration: Course Progress and Certificates
-- Description: Tracking student progress and generating certificates

-- 1. Create course_progress table
CREATE TABLE IF NOT EXISTS public.course_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    content_id UUID NOT NULL REFERENCES public.course_module_contents(id) ON DELETE CASCADE,
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
    FROM public.course_module_contents c
    JOIN public.course_modules m ON m.id = c.lesson_id
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
    FROM public.course_module_contents c
    JOIN public.course_modules m ON m.id = c.lesson_id
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
    FROM public.course_module_contents WHERE id = p_content_id;

    IF v_tenant_id IS NULL THEN RAISE EXCEPTION 'Exam not found'; END IF;

    IF EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff', 'super_admin', 'tenant_owner')) THEN
        v_has_access := true;
    ELSE
        IF EXISTS (
            SELECT 1 FROM public.course_module_contents c
            JOIN public.course_modules cm ON cm.id = c.lesson_id
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
