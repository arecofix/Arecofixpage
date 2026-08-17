-- Migration: Course Exams (Questions and Submissions)
-- Description: Adds tables and RPCs for secure exam processing.

-- 1. Modify existing check constraint on course_module_contents to allow 'exam' type
ALTER TABLE public.course_module_contents DROP CONSTRAINT IF EXISTS course_module_contents_type_check;
ALTER TABLE public.course_module_contents ADD CONSTRAINT course_module_contents_type_check CHECK (type IN ('video', 'image', 'document', 'link', 'text', 'exam'));

-- 2. Create course_exam_questions table
CREATE TABLE IF NOT EXISTS public.course_exam_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL REFERENCES public.course_module_contents(id) ON DELETE CASCADE,
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
    content_id UUID NOT NULL REFERENCES public.course_module_contents(id) ON DELETE CASCADE,
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
            SELECT 1 FROM public.course_module_contents c
            JOIN public.course_modules cm ON cm.id = c.lesson_id
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
    FROM public.course_module_contents
    WHERE id = p_content_id;

    IF v_tenant_id IS NULL THEN
        RAISE EXCEPTION 'Exam not found';
    END IF;

    -- Check access
    IF EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff', 'super_admin', 'tenant_owner')) THEN
        v_has_access := true;
    ELSE
        IF EXISTS (
            SELECT 1 FROM public.course_module_contents c
            JOIN public.course_modules cm ON cm.id = c.lesson_id
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
