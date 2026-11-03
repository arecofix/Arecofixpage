-- ==============================================================================
-- Rollback Migration: 20261022040000_harden_anon_security_definer_down.sql
-- Description: Revert anon security definer functions to public schema
-- ==============================================================================

BEGIN;

ALTER FUNCTION public.get_current_tenant_id() SECURITY DEFINER;
ALTER FUNCTION public.get_request_guest_session() SECURITY DEFINER;

-- Revert get_repair_tracking to direct SECURITY DEFINER in public
DROP FUNCTION IF EXISTS public.get_repair_tracking(text);
DROP FUNCTION IF EXISTS private.get_repair_tracking(text);

CREATE OR REPLACE FUNCTION public.get_repair_tracking(p_code text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
DECLARE
    v_clean_code text;
    v_record record;
BEGIN
    v_clean_code := UPPER(TRIM(COALESCE(p_code, '')));
    IF v_clean_code = '' OR LENGTH(v_clean_code) < 3 OR LENGTH(v_clean_code) > 64 THEN
        RETURN jsonb_build_object('success', false, 'status', 'invalid_code');
    END IF;
    SELECT r.id, r.tracking_code INTO v_record FROM public.repairs r WHERE UPPER(r.tracking_code) = v_clean_code LIMIT 1;
    IF NOT FOUND THEN RETURN jsonb_build_object('success', false, 'status', 'not_found'); END IF;
    RETURN jsonb_build_object('success', true, 'tracking_code', v_record.tracking_code);
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_repair_tracking(text) TO anon, authenticated;

-- Revert get_public_certificate_data to direct SECURITY DEFINER in public
DROP FUNCTION IF EXISTS public.get_public_certificate_data(uuid);
DROP FUNCTION IF EXISTS private.get_public_certificate_data(uuid);

CREATE OR REPLACE FUNCTION public.get_public_certificate_data(p_cert_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
DECLARE
    v_record record;
BEGIN
    SELECT cc.id, cc.student_name, cc.status INTO v_record FROM public.course_certificates cc WHERE cc.id = p_cert_id;
    IF NOT FOUND THEN RETURN jsonb_build_object('success', false, 'status', 'not_found'); END IF;
    RETURN jsonb_build_object('success', true, 'student_name', v_record.student_name);
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_public_certificate_data(uuid) TO anon, authenticated;

COMMIT;
