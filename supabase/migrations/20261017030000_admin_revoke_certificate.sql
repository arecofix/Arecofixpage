-- ==============================================================================
-- MIGRATION: 20261017030000_admin_revoke_certificate.sql
-- DESCRIPTION: RPCs para revocar y reactivar certificados desde el Admin Panel
-- ==============================================================================

-- 1. Función RPC: admin_revoke_certificate
CREATE OR REPLACE FUNCTION public.admin_revoke_certificate(
    p_cert_id UUID,
    p_reason TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_admin_id UUID := auth.uid();
    v_is_admin BOOLEAN := false;
    v_cert RECORD;
BEGIN
    IF p_cert_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'ID de certificado requerido.');
    END IF;

    -- Verificar que el usuario tenga rol administrativo
    IF v_admin_id IS NOT NULL THEN
        SELECT EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = v_admin_id AND role IN ('admin', 'staff', 'super_admin', 'tenant_owner')
        ) INTO v_is_admin;
    ELSE
        -- Permitir invocación desde service_role
        v_is_admin := true;
    END IF;

    IF NOT v_is_admin THEN
        RETURN jsonb_build_object('success', false, 'error', 'No autorizado. Se requieren permisos de administrador.');
    END IF;

    -- Obtener datos del certificado
    SELECT * INTO v_cert FROM public.course_certificates WHERE id = p_cert_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Certificado no encontrado.');
    END IF;

    -- Actualizar a estado 'revoked'
    UPDATE public.course_certificates
    SET 
        status = 'revoked',
        updated_at = timezone('utc', now())
    WHERE id = p_cert_id;

    -- Registrar notificación administrativa para auditoría
    BEGIN
        INSERT INTO public.admin_notifications (
            tenant_id,
            title,
            message,
            type,
            source,
            is_read
        ) VALUES (
            v_cert.tenant_id,
            '🚫 Certificado Revocado',
            'El certificado de ' || v_cert.student_name || ' (ID: ' || v_cert.id || ') fue revocado por un administrador.' || COALESCE(' Motivo: ' || p_reason, ''),
            'warning',
            'academy',
            false
        );
    EXCEPTION WHEN OTHERS THEN
        -- Ignorar si la tabla admin_notifications no está disponible
    END;

    RETURN jsonb_build_object(
        'success', true,
        'certificate_id', p_cert_id,
        'status', 'revoked',
        'message', 'Certificado revocado exitosamente. La validación pública ahora es inválida.'
    );
END;
$$;

-- 2. Función RPC: admin_reactivate_certificate
CREATE OR REPLACE FUNCTION public.admin_reactivate_certificate(
    p_cert_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_admin_id UUID := auth.uid();
    v_is_admin BOOLEAN := false;
BEGIN
    IF p_cert_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'ID de certificado requerido.');
    END IF;

    IF v_admin_id IS NOT NULL THEN
        SELECT EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = v_admin_id AND role IN ('admin', 'staff', 'super_admin', 'tenant_owner')
        ) INTO v_is_admin;
    ELSE
        v_is_admin := true;
    END IF;

    IF NOT v_is_admin THEN
        RETURN jsonb_build_object('success', false, 'error', 'No autorizado.');
    END IF;

    UPDATE public.course_certificates
    SET 
        status = 'valid',
        updated_at = timezone('utc', now())
    WHERE id = p_cert_id;

    RETURN jsonb_build_object(
        'success', true,
        'certificate_id', p_cert_id,
        'status', 'valid',
        'message', 'Certificado reactivado exitosamente.'
    );
END;
$$;

-- Otorgar permisos
GRANT EXECUTE ON FUNCTION public.admin_revoke_certificate(UUID, TEXT) TO authenticated, service_role, anon;
GRANT EXECUTE ON FUNCTION public.admin_reactivate_certificate(UUID) TO authenticated, service_role, anon;
