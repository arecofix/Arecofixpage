-- ==============================================================================
-- ARECOFIX ACADEMY - CORE FIXES & SECURITY HARDENING MIGRATION
-- Fecha: 2026-10-17
-- Objetivos:
-- 1. Deduplicar inscripciones existentes y aplicar restricción UNIQUE(course_id, lower(email)).
-- 2. Sincronizar emails faltantes en profiles desde auth.users.
-- 3. Corregir y ampliar políticas RLS para course_enrollments, course_lessons y course_progress.
-- 4. Corregir RPCs submit_exam, mark_content_completed y get_exam_questions (tabla course_lessons).
-- 5. Agregar soporte para unlock_strategy ('ALL_AT_ONCE', 'SEQUENTIAL') en courses.
-- ==============================================================================

-- 1. SINCRONIZACIÓN DE EMAILS EN PROFILES
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id
  AND (p.email IS NULL OR p.email = '')
  AND u.email IS NOT NULL;

-- 2. DEDUPLICACIÓN DE COURSE_ENROLLMENTS
-- Eliminar duplicados físicos reteniendo la tupla primaria única
DELETE FROM public.course_enrollments a
WHERE a.ctid NOT IN (
    SELECT min(b.ctid)
    FROM public.course_enrollments b
    GROUP BY b.course_id, lower(b.email)
);

-- Crear índice único case-insensitive para prevenir futuras asignaciones duplicadas
DROP INDEX IF EXISTS idx_course_enrollments_unique_course_email;
CREATE UNIQUE INDEX idx_course_enrollments_unique_course_email
ON public.course_enrollments (course_id, lower(email));

-- 3. AGREGAR COLUMNA unlock_strategy EN COURSES
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS unlock_strategy text DEFAULT 'ALL_AT_ONCE';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'courses_unlock_strategy_check'
  ) THEN
    ALTER TABLE public.courses 
    ADD CONSTRAINT courses_unlock_strategy_check 
    CHECK (unlock_strategy IN ('ALL_AT_ONCE', 'SEQUENTIAL'));
  END IF;
END $$;

-- 4. RLS POLICIES PARA course_enrollments
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "course_enrollments_select_policy" ON public.course_enrollments;
DROP POLICY IF EXISTS "course_enrollments_all_policy" ON public.course_enrollments;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON public.course_enrollments;

CREATE POLICY "course_enrollments_select_policy"
ON public.course_enrollments
FOR SELECT
TO authenticated, anon
USING (
  lower(email) = lower(COALESCE(auth.jwt() ->> 'email', ''))
  OR (user_id IS NOT NULL AND user_id = auth.uid())
  OR public.is_admin_of_tenant(tenant_id)
  OR public.is_admin()
  OR EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
      AND role IN ('admin', 'staff', 'super_admin', 'tenant_owner')
  )
);

CREATE POLICY "course_enrollments_all_policy"
ON public.course_enrollments
FOR ALL
TO authenticated
USING (
  lower(email) = lower(COALESCE(auth.jwt() ->> 'email', ''))
  OR (user_id IS NOT NULL AND user_id = auth.uid())
  OR public.is_admin_of_tenant(tenant_id)
  OR public.is_admin()
  OR EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
      AND role IN ('admin', 'staff', 'super_admin', 'tenant_owner')
  )
)
WITH CHECK (
  lower(email) = lower(COALESCE(auth.jwt() ->> 'email', ''))
  OR (user_id IS NOT NULL AND user_id = auth.uid())
  OR public.is_admin_of_tenant(tenant_id)
  OR public.is_admin()
  OR EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
      AND role IN ('admin', 'staff', 'super_admin', 'tenant_owner')
  )
);

-- 5. RLS POLICIES PARA course_lessons
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "module_contents_select_policy" ON public.course_lessons;
DROP POLICY IF EXISTS "module_contents_select" ON public.course_lessons;
DROP POLICY IF EXISTS "module_contents_all_admin_policy" ON public.course_lessons;

CREATE POLICY "course_lessons_select_policy"
ON public.course_lessons
FOR SELECT
TO authenticated, anon
USING (
  public.is_admin_of_tenant(tenant_id)
  OR public.is_admin()
  OR EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
      AND role IN ('admin', 'staff', 'super_admin', 'tenant_owner')
  )
  OR EXISTS (
    SELECT 1 FROM public.course_modules cm
    JOIN public.course_enrollments ce ON ce.course_id = cm.course_id
    WHERE cm.id = course_lessons.module_id
      AND ce.status = 'confirmed'
      AND (
        lower(ce.email) = lower(COALESCE(auth.jwt() ->> 'email', ''))
        OR (ce.user_id IS NOT NULL AND ce.user_id = auth.uid())
      )
      AND (cm.unlock_date IS NULL OR cm.unlock_date <= now())
  )
  OR EXISTS (
    SELECT 1 FROM public.course_modules cm
    JOIN public.courses c ON c.id = cm.course_id
    WHERE cm.id = course_lessons.module_id
      AND c.author_id = auth.uid()
  )
);

CREATE POLICY "course_lessons_admin_all_policy"
ON public.course_lessons
FOR ALL
TO authenticated
USING (
  public.is_admin_of_tenant(tenant_id)
  OR public.is_admin()
  OR EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
      AND role IN ('admin', 'staff', 'super_admin', 'tenant_owner')
  )
  OR EXISTS (
    SELECT 1 FROM public.course_modules cm
    JOIN public.courses c ON c.id = cm.course_id
    WHERE cm.id = course_lessons.module_id
      AND c.author_id = auth.uid()
  )
)
WITH CHECK (
  public.is_admin_of_tenant(tenant_id)
  OR public.is_admin()
  OR EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
      AND role IN ('admin', 'staff', 'super_admin', 'tenant_owner')
  )
  OR EXISTS (
    SELECT 1 FROM public.course_modules cm
    JOIN public.courses c ON c.id = cm.course_id
    WHERE cm.id = course_lessons.module_id
      AND c.author_id = auth.uid()
  )
);

-- 6. RLS POLICIES PARA course_progress
ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students manage own progress" ON public.course_progress;
DROP POLICY IF EXISTS "Admins can view progress" ON public.course_progress;

CREATE POLICY "Students manage own progress"
ON public.course_progress
FOR ALL
TO authenticated
USING (
  lower(email) = lower(COALESCE(auth.jwt() ->> 'email', ''))
  OR (user_id IS NOT NULL AND user_id = auth.uid())
  OR public.is_admin_of_tenant(tenant_id)
  OR public.is_admin()
  OR EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
      AND role IN ('admin', 'staff', 'super_admin', 'tenant_owner')
  )
)
WITH CHECK (
  lower(email) = lower(COALESCE(auth.jwt() ->> 'email', ''))
  OR (user_id IS NOT NULL AND user_id = auth.uid())
  OR public.is_admin_of_tenant(tenant_id)
  OR public.is_admin()
  OR EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
      AND role IN ('admin', 'staff', 'super_admin', 'tenant_owner')
  )
);

-- 7. REPARACIÓN Y ACTUALIZACIÓN DE RPC: get_exam_questions
CREATE OR REPLACE FUNCTION public.get_exam_questions(p_content_id uuid)
RETURNS TABLE(id uuid, question_text text, options jsonb, order_index integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    v_email TEXT;
    v_uid UUID;
    v_has_access BOOLEAN := false;
BEGIN
    v_email := auth.jwt() ->> 'email';
    v_uid := auth.uid();

    -- 1. Verificar si es administrador o staff
    IF EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = v_uid 
          AND role IN ('admin', 'staff', 'super_admin', 'tenant_owner')
    ) THEN
        v_has_access := true;
    ELSE
        -- 2. Verificar si el estudiante está matriculado y confirmado
        IF EXISTS (
            SELECT 1 FROM public.course_lessons c
            JOIN public.course_modules cm ON cm.id = c.module_id
            JOIN public.course_enrollments ce ON ce.course_id = cm.course_id
            WHERE c.id = p_content_id 
              AND ce.status = 'confirmed'
              AND (
                (v_email IS NOT NULL AND lower(ce.email) = lower(v_email))
                OR (ce.user_id IS NOT NULL AND ce.user_id = v_uid)
              )
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
$function$;

-- 8. REPARACIÓN Y ACTUALIZACIÓN DE RPC: submit_exam
CREATE OR REPLACE FUNCTION public.submit_exam(p_content_id uuid, p_answers jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    v_email TEXT;
    v_uid UUID;
    v_tenant_id UUID;
    v_metadata JSONB;
    v_passing_score NUMERIC := 60.0;
    v_total_questions INTEGER := 0;
    v_correct_answers INTEGER := 0;
    v_score NUMERIC := 0.0;
    v_passed BOOLEAN := false;
    v_answer JSONB;
    v_q_id UUID;
    v_q_idx INTEGER;
    v_real_idx INTEGER;
    v_has_access BOOLEAN := false;
    v_progress_result JSONB;
BEGIN
    v_email := auth.jwt() ->> 'email';
    v_uid := auth.uid();

    IF v_email IS NULL AND v_uid IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Obtener detalles del examen desde course_lessons
    SELECT c.tenant_id, c.metadata INTO v_tenant_id, v_metadata
    FROM public.course_lessons c
    WHERE c.id = p_content_id;

    IF v_tenant_id IS NULL THEN 
        RAISE EXCEPTION 'Exam not found'; 
    END IF;

    -- Validar permisos de acceso (Admin o Matriculado)
    IF EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = v_uid 
          AND role IN ('admin', 'staff', 'super_admin', 'tenant_owner')
    ) THEN
        v_has_access := true;
    ELSE
        IF EXISTS (
            SELECT 1 FROM public.course_lessons c
            JOIN public.course_modules cm ON cm.id = c.module_id
            JOIN public.course_enrollments ce ON ce.course_id = cm.course_id
            WHERE c.id = p_content_id 
              AND ce.status = 'confirmed'
              AND (
                (v_email IS NOT NULL AND lower(ce.email) = lower(v_email))
                OR (ce.user_id IS NOT NULL AND ce.user_id = v_uid)
              )
        ) THEN 
            v_has_access := true; 
        END IF;
    END IF;

    IF NOT v_has_access THEN 
        RAISE EXCEPTION 'Access denied'; 
    END IF;

    v_passing_score := COALESCE((v_metadata->>'passing_score')::NUMERIC, 60.0);

    SELECT count(*) INTO v_total_questions 
    FROM public.course_exam_questions 
    WHERE content_id = p_content_id;

    IF v_total_questions = 0 THEN 
        RAISE EXCEPTION 'Exam has no questions'; 
    END IF;

    -- Evaluar respuestas enviadas
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

    INSERT INTO public.course_exam_submissions (content_id, tenant_id, email, answers, score, passed)
    VALUES (p_content_id, v_tenant_id, COALESCE(v_email, 'anonymous@arecofix.com'), p_answers, v_score, v_passed);

    -- Auto-completar el contenido en course_progress si aprobó
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
$function$;

-- 9. REPARACIÓN Y ACTUALIZACIÓN DE RPC: mark_content_completed
CREATE OR REPLACE FUNCTION public.mark_content_completed(p_content_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    v_email TEXT;
    v_uid UUID;
    v_tenant_id UUID;
    v_course_id UUID;
    v_total_contents INTEGER := 0;
    v_completed_contents INTEGER := 0;
    v_progress NUMERIC := 0.0;
    v_cert_id UUID;
    v_student_name TEXT := 'Estudiante Arecofix';
BEGIN
    v_email := auth.jwt() ->> 'email';
    v_uid := auth.uid();

    IF v_email IS NULL AND v_uid IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Obtener detalles del contenido desde course_lessons y course_modules
    SELECT c.tenant_id, m.course_id INTO v_tenant_id, v_course_id
    FROM public.course_lessons c
    JOIN public.course_modules m ON m.id = c.module_id
    WHERE c.id = p_content_id;

    IF v_tenant_id IS NULL THEN
        RAISE EXCEPTION 'Content not found';
    END IF;

    -- Validar si está matriculado o si es admin
    IF NOT EXISTS (
        SELECT 1 FROM public.course_enrollments
        WHERE course_id = v_course_id 
          AND (
            (v_email IS NOT NULL AND lower(email) = lower(v_email))
            OR (user_id IS NOT NULL AND user_id = v_uid)
          )
          AND status = 'confirmed'
    ) AND NOT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = v_uid 
          AND role IN ('admin', 'staff', 'super_admin', 'tenant_owner')
    ) THEN
        RAISE EXCEPTION 'Not enrolled in this course';
    END IF;

    -- Obtener nombre del estudiante
    SELECT COALESCE(full_name, v_student_name) INTO v_student_name
    FROM public.course_enrollments
    WHERE course_id = v_course_id
      AND (
        (v_email IS NOT NULL AND lower(email) = lower(v_email))
        OR (user_id IS NOT NULL AND user_id = v_uid)
      )
    LIMIT 1;

    -- Registrar el progreso sin duplicar
    INSERT INTO public.course_progress (tenant_id, email, course_id, content_id, user_id)
    VALUES (v_tenant_id, COALESCE(v_email, 'sin-email@arecofix.com'), v_course_id, p_content_id, v_uid)
    ON CONFLICT (email, content_id) DO UPDATE
    SET completed_at = now(),
        user_id = COALESCE(public.course_progress.user_id, EXCLUDED.user_id);

    -- Calcular progreso del curso
    SELECT COUNT(*) INTO v_total_contents
    FROM public.course_lessons c
    JOIN public.course_modules m ON m.id = c.module_id
    WHERE m.course_id = v_course_id;

    SELECT COUNT(*) INTO v_completed_contents
    FROM public.course_progress
    WHERE course_id = v_course_id 
      AND (
        (v_email IS NOT NULL AND lower(email) = lower(v_email))
        OR (user_id IS NOT NULL AND user_id = v_uid)
      );

    v_progress := (v_completed_contents::NUMERIC / NULLIF(v_total_contents, 0)::NUMERIC) * 100.0;

    -- Emitir certificado automático si completó 100% y no existe diploma previo
    IF v_completed_contents >= v_total_contents AND v_total_contents > 0 THEN
        v_progress := 100.0;

        SELECT id INTO v_cert_id 
        FROM public.course_certificates 
        WHERE course_id = v_course_id 
          AND (
            (v_email IS NOT NULL AND lower(email) = lower(v_email))
          );

        IF v_cert_id IS NULL THEN
            INSERT INTO public.course_certificates (tenant_id, course_id, email, student_name)
            VALUES (v_tenant_id, v_course_id, COALESCE(v_email, 'sin-email@arecofix.com'), v_student_name)
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
$function$;

-- 10. RECARGAR SCHEMA POSTGREST
NOTIFY pgrst, 'reload schema';
