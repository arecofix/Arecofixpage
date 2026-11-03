-- ==============================================================================
-- ARECOFIX ACADEMY: CERTIFICATES & NOTIFICATIONS SYSTEM MIGRATION
-- Migration: 20261017020000_academy_certificates_and_notifications.sql
-- ==============================================================================

-- 1. Actualizar y blindar la tabla public.course_certificates
CREATE TABLE IF NOT EXISTS public.course_certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    email TEXT NOT NULL,
    student_name TEXT NOT NULL,
    student_dni TEXT,
    pdf_url TEXT,
    status TEXT NOT NULL DEFAULT 'valid' CHECK (status IN ('valid', 'revoked')),
    issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Asegurar columnas si la tabla ya existía
ALTER TABLE public.course_certificates 
    ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'valid' CHECK (status IN ('valid', 'revoked')),
    ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS pdf_url TEXT,
    ADD COLUMN IF NOT EXISTS student_dni TEXT,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_course_certificates_status ON public.course_certificates(status);
CREATE INDEX IF NOT EXISTS idx_course_certificates_course_id ON public.course_certificates(course_id);
CREATE INDEX IF NOT EXISTS idx_course_certificates_user_id ON public.course_certificates(user_id);

-- 2. Configurar RLS estricto para proteger datos personales (email, DNI)
ALTER TABLE public.course_certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage all certificates" ON public.course_certificates;
CREATE POLICY "Admins can manage all certificates"
ON public.course_certificates
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles p 
        WHERE p.id = auth.uid() 
          AND p.role IN ('admin', 'staff', 'super_admin', 'tenant_owner')
    )
);

DROP POLICY IF EXISTS "Students can view their own certificates" ON public.course_certificates;
CREATE POLICY "Students can view their own certificates"
ON public.course_certificates
FOR SELECT
TO authenticated
USING (
    user_id = auth.uid() 
    OR (email IS NOT NULL AND lower(email) = lower(auth.jwt() ->> 'email'))
);

-- NOTA DE SEGURIDAD:
-- La tabla course_certificates NO tiene política de lectura directa para 'anon'.
-- La verificación pública se realiza EXCLUSIVAMENTE mediante la RPC get_public_certificate_data.

-- 3. RPC Pública Segura: get_public_certificate_data
-- Devuelve únicamente la información necesaria para certificar la validez del título
-- SIN exponer jamás email, DNI, teléfono ni datos de facturación.
CREATE OR REPLACE FUNCTION public.get_public_certificate_data(p_cert_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_record RECORD;
    v_instructor_name TEXT;
BEGIN
    IF p_cert_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'ID de certificado requerido.');
    END IF;

    SELECT 
        cc.id AS certificate_id,
        cc.student_name,
        cc.status,
        cc.issued_at,
        cc.pdf_url,
        c.title AS course_title,
        COALESCE(NULLIF(TRIM(c.instructor_name), ''), NULLIF(TRIM(CONCAT(p.first_name, ' ', p.last_name)), ''), 'Arecofix Academy') AS instructor_name
    INTO v_record
    FROM public.course_certificates cc
    JOIN public.courses c ON c.id = cc.course_id
    LEFT JOIN public.profiles p ON p.id = c.instructor_id
    WHERE cc.id = p_cert_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'status', 'not_found',
            'message', 'Certificado no encontrado o inexistente.'
        );
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'certificate_id', v_record.certificate_id,
        'student_name', v_record.student_name,
        'course_title', v_record.course_title,
        'instructor_name', v_record.instructor_name,
        'issued_at', v_record.issued_at,
        'status', v_record.status,
        'pdf_url', v_record.pdf_url,
        'is_valid', (v_record.status = 'valid')
    );
END;
$$;

-- Otorgar ejecución a usuarios anónimos (público) y autenticados
GRANT EXECUTE ON FUNCTION public.get_public_certificate_data(UUID) TO anon;
GRANT EXECUTE ON FUNCTION public.get_public_certificate_data(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_certificate_data(UUID) TO service_role;

-- 4. Tabla de Notificaciones por Email (Auditoría, Historial e Idempotencia)
CREATE TABLE IF NOT EXISTS public.academy_email_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    recipient_email TEXT NOT NULL,
    notification_type TEXT NOT NULL CHECK (notification_type IN ('payment_receipt', 'grace_period_warning', 'course_completed')),
    subject TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('pending', 'sent', 'failed')),
    reference_id TEXT, -- subscription_id, payment_id o certificate_id para idempotencia
    sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_academy_notifications_ref ON public.academy_email_notifications(notification_type, reference_id);

ALTER TABLE public.academy_email_notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view email notifications" ON public.academy_email_notifications;
CREATE POLICY "Admins can view email notifications"
ON public.academy_email_notifications
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles p 
        WHERE p.id = auth.uid() 
          AND p.role IN ('admin', 'staff', 'super_admin', 'tenant_owner')
    )
);

-- 5. RPC para Chequeo y Notificación de Período de Gracia (Cron Job Friendly)
CREATE OR REPLACE FUNCTION public.check_and_notify_expiring_subscriptions()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_sub RECORD;
    v_count INT := 0;
    v_results JSONB := '[]'::jsonb;
BEGIN
    FOR v_sub IN 
        SELECT 
            s.id AS subscription_id,
            s.user_id,
            s.status,
            s.expires_at,
            s.grace_period_ends_at,
            p.email,
            COALESCE(NULLIF(TRIM(CONCAT(p.first_name, ' ', p.last_name)), ''), 'Alumno Arecofix') AS student_name
        FROM public.academy_subscriptions s
        JOIN public.profiles p ON p.id = s.user_id
        WHERE s.expires_at <= now() 
          AND s.grace_period_ends_at > now()
          AND s.status IN ('grace_period', 'active')
          -- Asegurar idempotencia: no enviar más de una notificación de gracia para la misma expiración
          AND NOT EXISTS (
              SELECT 1 FROM public.academy_email_notifications n
              WHERE n.reference_id = s.id::text
                AND n.notification_type = 'grace_period_warning'
                AND n.sent_at >= s.expires_at
          )
    LOOP
        -- Actualizar estado a grace_period si aún figuraba active
        IF v_sub.status = 'active' THEN
            UPDATE public.academy_subscriptions
            SET status = 'grace_period', updated_at = now()
            WHERE id = v_sub.subscription_id;
        END IF;

        -- Registrar registro de notificación pendiente/enviada
        INSERT INTO public.academy_email_notifications (
            user_id,
            recipient_email,
            notification_type,
            subject,
            status,
            reference_id,
            metadata
        ) VALUES (
            v_sub.user_id,
            v_sub.email,
            'grace_period_warning',
            'Tu membresía de Arecofix Academy venció. Tienes 7 días de gracia.',
            'pending',
            v_sub.subscription_id::text,
            jsonb_build_object(
                'student_name', v_sub.student_name,
                'expires_at', v_sub.expires_at,
                'grace_period_ends_at', v_sub.grace_period_ends_at
            )
        );

        v_count := v_count + 1;
        v_results := v_results || jsonb_build_object(
            'subscription_id', v_sub.subscription_id,
            'email', v_sub.email,
            'student_name', v_sub.student_name,
            'expires_at', v_sub.expires_at,
            'grace_period_ends_at', v_sub.grace_period_ends_at
        );
    END LOOP;

    RETURN jsonb_build_object(
        'success', true,
        'notifications_queued', v_count,
        'subscriptions', v_results
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.check_and_notify_expiring_subscriptions() TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_and_notify_expiring_subscriptions() TO service_role;
