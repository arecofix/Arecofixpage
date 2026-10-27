-- ==============================================================================
-- MIGRACIÓN: SISTEMA DE COBRO Y GESTIÓN DE MEMBRESÍAS DE ACADEMIA
-- ==============================================================================
-- 1. Tabla de Planes de Suscripción (academy_plans)
-- 2. Tabla de Suscripciones de Alumnos (academy_subscriptions)
-- 3. Tabla de Pagos de Membresía (academy_payments)
-- 4. Función RPC: check_and_update_membership_status
-- 5. Blindaje de RPC: submit_exam con validación de membresía
-- 6. Blindaje de RPC: mark_content_completed con validación de membresía
-- 7. Políticas de Seguridad RLS
-- ==============================================================================

-- 1. TABLA DE PLANES (academy_plans)
CREATE TABLE IF NOT EXISTS public.academy_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    currency_id TEXT NOT NULL DEFAULT 'ARS',
    interval_days INTEGER NOT NULL DEFAULT 30,
    grace_days INTEGER NOT NULL DEFAULT 7,
    features JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Plan base por defecto
INSERT INTO public.academy_plans (id, name, slug, description, price, currency_id, interval_days, grace_days, features, is_active)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Membresía Mensual Academia Pro',
    'mensual-academia-pro',
    'Acceso ilimitado a todos los cursos, campus virtual, exámenes con temporizador y certificados oficiales.',
    15000.00,
    'ARS',
    30,
    7,
    '["Acceso a todas las clases", "Exámenes y certificaciones", "Soporte de instructores"]'::jsonb,
    true
)
ON CONFLICT (slug) DO UPDATE
SET price = EXCLUDED.price,
    description = EXCLUDED.description,
    is_active = true,
    updated_at = now();

-- 2. TABLA DE SUSCRIPCIONES (academy_subscriptions)
CREATE TABLE IF NOT EXISTS public.academy_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES public.academy_plans(id),
    status TEXT NOT NULL CHECK (status IN ('active', 'grace_period', 'suspended', 'expired')) DEFAULT 'active',
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL,
    grace_period_ends_at TIMESTAMPTZ NOT NULL,
    mp_preapproval_id TEXT,
    mp_preference_id TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_academy_subscriptions_user_unique
ON public.academy_subscriptions (user_id);

CREATE INDEX IF NOT EXISTS idx_academy_subscriptions_status
ON public.academy_subscriptions (status);

-- 3. TABLA DE PAGOS DE MEMBRESÍA (academy_payments)
CREATE TABLE IF NOT EXISTS public.academy_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    subscription_id UUID NOT NULL REFERENCES public.academy_subscriptions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES public.academy_plans(id),
    amount NUMERIC(10,2) NOT NULL,
    currency_id TEXT NOT NULL DEFAULT 'ARS',
    status TEXT NOT NULL CHECK (status IN ('approved', 'pending', 'rejected', 'cancelled', 'refunded')),
    status_detail TEXT,
    mp_payment_id TEXT UNIQUE NOT NULL,
    payment_method_id TEXT,
    payment_type_id TEXT,
    paid_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    raw_payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_academy_payments_user
ON public.academy_payments (user_id);

CREATE INDEX IF NOT EXISTS idx_academy_payments_sub
ON public.academy_payments (subscription_id);

-- 4. FUNCIÓN RPC: check_and_update_membership_status
CREATE OR REPLACE FUNCTION public.check_and_update_membership_status(p_user_id UUID DEFAULT auth.uid())
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    v_target_user UUID;
    v_sub RECORD;
    v_new_status TEXT;
    v_now TIMESTAMPTZ := now();
    v_plan_name TEXT := 'Sin Plan';
    v_plan_price NUMERIC := 0;
BEGIN
    v_target_user := COALESCE(p_user_id, auth.uid());

    IF v_target_user IS NULL THEN
        RETURN jsonb_build_object(
            'has_subscription', false,
            'status', 'none',
            'is_allowed', false,
            'error', 'Usuario no especificado'
        );
    END IF;

    -- Admins y superadmins siempre tienen acceso total
    IF EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = v_target_user
          AND role IN ('admin', 'staff', 'super_admin', 'tenant_owner')
    ) THEN
        RETURN jsonb_build_object(
            'has_subscription', true,
            'status', 'active',
            'is_allowed', true,
            'is_admin', true,
            'expires_at', (v_now + INTERVAL '365 days')
        );
    END IF;

    -- Obtener la suscripción del usuario
    SELECT s.*, p.name as plan_name, p.price as plan_price
    INTO v_sub
    FROM public.academy_subscriptions s
    LEFT JOIN public.academy_plans p ON p.id = s.plan_id
    WHERE s.user_id = v_target_user
    LIMIT 1;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'has_subscription', false,
            'status', 'none',
            'is_allowed', false
        );
    END IF;

    -- Evaluación temporal estricta con now() del servidor (previene manipulación del reloj cliente)
    IF v_now < v_sub.expires_at THEN
        v_new_status := 'active';
    ELSIF v_now <= v_sub.grace_period_ends_at THEN
        v_new_status := 'grace_period';
    ELSIF v_now <= (v_sub.grace_period_ends_at + INTERVAL '30 days') THEN
        v_new_status := 'suspended';
    ELSE
        v_new_status := 'expired';
    END IF;

    -- Actualizar estado si cambió
    IF v_new_status IS DISTINCT FROM v_sub.status THEN
        UPDATE public.academy_subscriptions
        SET status = v_new_status,
            updated_at = v_now
        WHERE id = v_sub.id;
    END IF;

    RETURN jsonb_build_object(
        'has_subscription', true,
        'subscription_id', v_sub.id,
        'status', v_new_status,
        'expires_at', v_sub.expires_at,
        'grace_period_ends_at', v_sub.grace_period_ends_at,
        'plan_name', COALESCE(v_sub.plan_name, 'Membresía Academia'),
        'plan_price', COALESCE(v_sub.plan_price, 0),
        'is_allowed', (v_new_status IN ('active', 'grace_period'))
    );
END;
$$;

-- 5. BLINDAJE DE RPC: submit_exam CON VALIDACIÓN DE MEMBRESÍA
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
    v_passing_score NUMERIC := 60.0;
    v_total_questions INTEGER := 0;
    v_correct_answers INTEGER := 0;
    v_score NUMERIC := 0.0;
    v_passed BOOLEAN := false;
    v_metadata JSONB;
    v_answer JSONB;
    v_q_id UUID;
    v_q_idx INTEGER;
    v_real_idx INTEGER;
    v_progress_result JSONB;
    v_has_access BOOLEAN := false;
    v_sub_status TEXT;
BEGIN
    v_email := auth.jwt() ->> 'email';
    v_uid := auth.uid();

    IF v_email IS NULL AND v_uid IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- VALIDACIÓN DE MEMBRESÍA (Golden Rule: Si está suspended o expired, rechazar)
    IF v_uid IS NOT NULL AND NOT EXISTS (
        SELECT 1 FROM public.profiles WHERE id = v_uid AND role IN ('admin', 'staff', 'super_admin', 'tenant_owner')
    ) THEN
        SELECT status INTO v_sub_status
        FROM public.academy_subscriptions
        WHERE user_id = v_uid
        LIMIT 1;

        IF v_sub_status IS NOT NULL AND v_sub_status IN ('suspended', 'expired') THEN
            RAISE EXCEPTION 'Membership expired. Cannot submit exam.' USING ERRCODE = '42501';
        END IF;
    END IF;

    -- Obtener metadata del examen
    SELECT m.tenant_id, c.metadata INTO v_tenant_id, v_metadata
    FROM public.course_lessons c
    JOIN public.course_modules m ON m.id = c.module_id
    WHERE c.id = p_content_id;

    IF v_tenant_id IS NULL THEN
        RAISE EXCEPTION 'Exam content not found';
    END IF;

    -- Comprobar permisos del usuario
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

-- 6. BLINDAJE DE RPC: mark_content_completed CON VALIDACIÓN DE MEMBRESÍA
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
    v_sub_status TEXT;
BEGIN
    v_email := auth.jwt() ->> 'email';
    v_uid := auth.uid();

    IF v_email IS NULL AND v_uid IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- VALIDACIÓN DE MEMBRESÍA (Golden Rule)
    IF v_uid IS NOT NULL AND NOT EXISTS (
        SELECT 1 FROM public.profiles WHERE id = v_uid AND role IN ('admin', 'staff', 'super_admin', 'tenant_owner')
    ) THEN
        SELECT status INTO v_sub_status
        FROM public.academy_subscriptions
        WHERE user_id = v_uid
        LIMIT 1;

        IF v_sub_status IS NOT NULL AND v_sub_status IN ('suspended', 'expired') THEN
            RAISE EXCEPTION 'Membership expired. Cannot complete lessons.' USING ERRCODE = '42501';
        END IF;
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

-- 7. POLÍTICAS DE SEGURIDAD RLS
ALTER TABLE public.academy_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy_payments ENABLE ROW LEVEL SECURITY;

-- 7.1 academy_plans RLS
DROP POLICY IF EXISTS "academy_plans_select_policy" ON public.academy_plans;
CREATE POLICY "academy_plans_select_policy" ON public.academy_plans
FOR SELECT USING (
    is_active = true 
    OR public.is_admin() 
    OR EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff', 'super_admin', 'tenant_owner')
    )
);

DROP POLICY IF EXISTS "academy_plans_admin_manage_policy" ON public.academy_plans;
CREATE POLICY "academy_plans_admin_manage_policy" ON public.academy_plans
FOR ALL USING (
    public.is_admin() 
    OR EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff', 'super_admin', 'tenant_owner')
    )
);

-- 7.2 academy_subscriptions RLS
DROP POLICY IF EXISTS "academy_subscriptions_select_policy" ON public.academy_subscriptions;
CREATE POLICY "academy_subscriptions_select_policy" ON public.academy_subscriptions
FOR SELECT USING (
    user_id = auth.uid() 
    OR public.is_admin() 
    OR EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff', 'super_admin', 'tenant_owner')
    )
);

DROP POLICY IF EXISTS "academy_subscriptions_admin_manage_policy" ON public.academy_subscriptions;
CREATE POLICY "academy_subscriptions_admin_manage_policy" ON public.academy_subscriptions
FOR ALL USING (
    public.is_admin() 
    OR EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff', 'super_admin', 'tenant_owner')
    )
);

-- 7.3 academy_payments RLS
DROP POLICY IF EXISTS "academy_payments_select_policy" ON public.academy_payments;
CREATE POLICY "academy_payments_select_policy" ON public.academy_payments
FOR SELECT USING (
    user_id = auth.uid() 
    OR public.is_admin() 
    OR EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff', 'super_admin', 'tenant_owner')
    )
);

DROP POLICY IF EXISTS "academy_payments_admin_manage_policy" ON public.academy_payments;
CREATE POLICY "academy_payments_admin_manage_policy" ON public.academy_payments
FOR ALL USING (
    public.is_admin() 
    OR EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff', 'super_admin', 'tenant_owner')
    )
);
