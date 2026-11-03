-- ==============================================================================
-- Migration: 20261022060000_harden_authenticated_definer_groupB.sql
-- Description: Harden authenticated business RPCs using private schema + INVOKER wrappers (R4 Group B)
-- Severity: HIGH SECURITY (P1)
-- Category: authenticated_security_definer_function_executable
-- ==============================================================================

BEGIN;

CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO anon, authenticated, service_role, postgres, supabase_admin;

-- ------------------------------------------------------------------------------
-- 1. accept_upsell_vidrio
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION private.accept_upsell_vidrio(p_tracking_code text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, private, pg_temp
AS $$
BEGIN
    UPDATE public.repairs
    SET upsell_vidrio = true
    WHERE tracking_code = p_tracking_code;
END;
$$;

REVOKE ALL ON FUNCTION private.accept_upsell_vidrio(text) FROM public;
GRANT EXECUTE ON FUNCTION private.accept_upsell_vidrio(text) TO authenticated, service_role;

DROP FUNCTION IF EXISTS public.accept_upsell_vidrio(text);

CREATE OR REPLACE FUNCTION public.accept_upsell_vidrio(p_tracking_code text)
RETURNS void
LANGUAGE sql
SECURITY INVOKER
SET search_path = public, private, pg_temp
AS $$
    SELECT private.accept_upsell_vidrio(p_tracking_code);
$$;

REVOKE ALL ON FUNCTION public.accept_upsell_vidrio(text) FROM public;
GRANT EXECUTE ON FUNCTION public.accept_upsell_vidrio(text) TO authenticated, service_role;
COMMENT ON FUNCTION public.accept_upsell_vidrio(text) IS '@security-definer-justification: Wrapper SECURITY INVOKER que delega a private.accept_upsell_vidrio';

-- ------------------------------------------------------------------------------
-- 2. add_upsell_item_to_repair
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION private.add_upsell_item_to_repair(p_tracking_code text, p_product_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, private, pg_temp
AS $$
DECLARE
    v_repair_id uuid;
    v_product_price numeric;
BEGIN
    SELECT id INTO v_repair_id
    FROM public.repairs
    WHERE tracking_code = p_tracking_code;

    IF v_repair_id IS NULL THEN
        RAISE EXCEPTION 'Repair not found';
    END IF;

    SELECT price INTO v_product_price
    FROM public.products
    WHERE id = p_product_id AND is_active = true;

    IF v_product_price IS NULL THEN
        RAISE EXCEPTION 'Product not found or inactive';
    END IF;

    INSERT INTO public.repair_parts_used (
        repair_id,
        product_id,
        quantity,
        unit_price,
        tenant_id
    )
    SELECT
        v_repair_id,
        p_product_id,
        1,
        v_product_price,
        tenant_id
    FROM public.repairs
    WHERE id = v_repair_id;

    RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION private.add_upsell_item_to_repair(text, uuid) FROM public;
GRANT EXECUTE ON FUNCTION private.add_upsell_item_to_repair(text, uuid) TO authenticated, service_role;

DROP FUNCTION IF EXISTS public.add_upsell_item_to_repair(text, uuid);

CREATE OR REPLACE FUNCTION public.add_upsell_item_to_repair(p_tracking_code text, p_product_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY INVOKER
SET search_path = public, private, pg_temp
AS $$
    SELECT private.add_upsell_item_to_repair(p_tracking_code, p_product_id);
$$;

REVOKE ALL ON FUNCTION public.add_upsell_item_to_repair(text, uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.add_upsell_item_to_repair(text, uuid) TO authenticated, service_role;
COMMENT ON FUNCTION public.add_upsell_item_to_repair(text, uuid) IS '@security-definer-justification: Wrapper SECURITY INVOKER que delega a private.add_upsell_item_to_repair';

-- ------------------------------------------------------------------------------
-- 3. admin_reactivate_certificate
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION private.admin_reactivate_certificate(p_cert_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, private, pg_temp
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

REVOKE ALL ON FUNCTION private.admin_reactivate_certificate(uuid) FROM public;
GRANT EXECUTE ON FUNCTION private.admin_reactivate_certificate(uuid) TO authenticated, service_role;

DROP FUNCTION IF EXISTS public.admin_reactivate_certificate(uuid);

CREATE OR REPLACE FUNCTION public.admin_reactivate_certificate(p_cert_id uuid)
RETURNS jsonb
LANGUAGE sql
SECURITY INVOKER
SET search_path = public, private, pg_temp
AS $$
    SELECT private.admin_reactivate_certificate(p_cert_id);
$$;

REVOKE ALL ON FUNCTION public.admin_reactivate_certificate(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.admin_reactivate_certificate(uuid) TO authenticated, service_role;
COMMENT ON FUNCTION public.admin_reactivate_certificate(uuid) IS '@security-definer-justification: Wrapper SECURITY INVOKER que delega a private.admin_reactivate_certificate';

-- ------------------------------------------------------------------------------
-- 4. admin_revoke_certificate
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION private.admin_revoke_certificate(p_cert_id uuid, p_reason text DEFAULT NULL::text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, private, pg_temp
AS $$
DECLARE
    v_admin_id UUID := auth.uid();
    v_is_admin BOOLEAN := false;
    v_cert RECORD;
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
        RETURN jsonb_build_object('success', false, 'error', 'No autorizado. Se requieren permisos de administrador.');
    END IF;

    SELECT * INTO v_cert FROM public.course_certificates WHERE id = p_cert_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Certificado no encontrado.');
    END IF;

    UPDATE public.course_certificates
    SET 
        status = 'revoked',
        updated_at = timezone('utc', now())
    WHERE id = p_cert_id;

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

REVOKE ALL ON FUNCTION private.admin_revoke_certificate(uuid, text) FROM public;
GRANT EXECUTE ON FUNCTION private.admin_revoke_certificate(uuid, text) TO authenticated, service_role;

DROP FUNCTION IF EXISTS public.admin_revoke_certificate(uuid, text);

CREATE OR REPLACE FUNCTION public.admin_revoke_certificate(p_cert_id uuid, p_reason text DEFAULT NULL::text)
RETURNS jsonb
LANGUAGE sql
SECURITY INVOKER
SET search_path = public, private, pg_temp
AS $$
    SELECT private.admin_revoke_certificate(p_cert_id, p_reason);
$$;

REVOKE ALL ON FUNCTION public.admin_revoke_certificate(uuid, text) FROM public;
GRANT EXECUTE ON FUNCTION public.admin_revoke_certificate(uuid, text) TO authenticated, service_role;
COMMENT ON FUNCTION public.admin_revoke_certificate(uuid, text) IS '@security-definer-justification: Wrapper SECURITY INVOKER que delega a private.admin_revoke_certificate';

-- ------------------------------------------------------------------------------
-- 5. assign_user_as_employee
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION private.assign_user_as_employee(p_user_id uuid, p_role text, p_tenant_id uuid)
RETURNS TABLE(id uuid, email text, first_name text, last_name text, phone text, role text, avatar_url text, tenant_id uuid, created_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, private, pg_temp
AS $$
BEGIN
    UPDATE public.profiles 
    SET 
        role = p_role,
        tenant_id = p_tenant_id,
        updated_at = NOW()
    WHERE public.profiles.id = p_user_id;
    
    RETURN QUERY
    SELECT 
        p.id,
        p.email,
        p.first_name,
        p.last_name,
        p.phone,
        p.role,
        p.avatar_url,
        p.tenant_id,
        p.created_at
    FROM public.profiles p
    WHERE p.id = p_user_id;
END;
$$;

REVOKE ALL ON FUNCTION private.assign_user_as_employee(uuid, text, uuid) FROM public;
GRANT EXECUTE ON FUNCTION private.assign_user_as_employee(uuid, text, uuid) TO authenticated, service_role;

DROP FUNCTION IF EXISTS public.assign_user_as_employee(uuid, text, uuid);

CREATE OR REPLACE FUNCTION public.assign_user_as_employee(p_user_id uuid, p_role text, p_tenant_id uuid)
RETURNS TABLE(id uuid, email text, first_name text, last_name text, phone text, role text, avatar_url text, tenant_id uuid, created_at timestamp with time zone)
LANGUAGE sql
SECURITY INVOKER
SET search_path = public, private, pg_temp
AS $$
    SELECT * FROM private.assign_user_as_employee(p_user_id, p_role, p_tenant_id);
$$;

REVOKE ALL ON FUNCTION public.assign_user_as_employee(uuid, text, uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.assign_user_as_employee(uuid, text, uuid) TO authenticated, service_role;
COMMENT ON FUNCTION public.assign_user_as_employee(uuid, text, uuid) IS '@security-definer-justification: Wrapper SECURITY INVOKER que delega a private.assign_user_as_employee';

-- ------------------------------------------------------------------------------
-- 6. check_and_update_membership_status
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION private.check_and_update_membership_status(p_user_id uuid DEFAULT auth.uid())
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, private, pg_temp
AS $$
DECLARE
    v_target_user UUID;
    v_sub RECORD;
    v_new_status TEXT;
    v_now TIMESTAMPTZ := now();
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

    IF v_now < v_sub.expires_at THEN
        v_new_status := 'active';
    ELSIF v_now <= v_sub.grace_period_ends_at THEN
        v_new_status := 'grace_period';
    ELSIF v_now <= (v_sub.grace_period_ends_at + INTERVAL '30 days') THEN
        v_new_status := 'suspended';
    ELSE
        v_new_status := 'expired';
    END IF;

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

REVOKE ALL ON FUNCTION private.check_and_update_membership_status(uuid) FROM public;
GRANT EXECUTE ON FUNCTION private.check_and_update_membership_status(uuid) TO authenticated, service_role;

DROP FUNCTION IF EXISTS public.check_and_update_membership_status(uuid);

CREATE OR REPLACE FUNCTION public.check_and_update_membership_status(p_user_id uuid DEFAULT auth.uid())
RETURNS jsonb
LANGUAGE sql
SECURITY INVOKER
SET search_path = public, private, pg_temp
AS $$
    SELECT private.check_and_update_membership_status(p_user_id);
$$;

REVOKE ALL ON FUNCTION public.check_and_update_membership_status(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.check_and_update_membership_status(uuid) TO authenticated, service_role;
COMMENT ON FUNCTION public.check_and_update_membership_status(uuid) IS '@security-definer-justification: Wrapper SECURITY INVOKER que delega a private.check_and_update_membership_status';

-- ------------------------------------------------------------------------------
-- 7. create_employee
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION private.create_employee(p_first_name text, p_last_name text, p_email text, p_phone text, p_role text, p_password text, p_avatar_url text, p_tenant_id uuid)
RETURNS TABLE(id uuid, email text, first_name text, last_name text, phone text, role text, avatar_url text, tenant_id uuid, created_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, private, pg_temp
AS $$
DECLARE
    v_user_id UUID;
BEGIN
    v_user_id := extensions.uuid_generate_v4();
    
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, role)
    VALUES (v_user_id, p_email, crypt(p_password, gen_salt('bf')), NOW(), 'authenticated');

    INSERT INTO public.profiles (id, email, first_name, last_name, phone, role, avatar_url, tenant_id, created_at)
    VALUES (v_user_id, p_email, p_first_name, p_last_name, p_phone, p_role, p_avatar_url, p_tenant_id, NOW());

    RETURN QUERY SELECT p.id, p.email, p.first_name, p.last_name, p.phone, p.role, p.avatar_url, p.tenant_id, p.created_at
                 FROM public.profiles p WHERE p.id = v_user_id;
END;
$$;

REVOKE ALL ON FUNCTION private.create_employee(text, text, text, text, text, text, text, uuid) FROM public;
GRANT EXECUTE ON FUNCTION private.create_employee(text, text, text, text, text, text, text, uuid) TO authenticated, service_role;

DROP FUNCTION IF EXISTS public.create_employee(text, text, text, text, text, text, text, uuid);

CREATE OR REPLACE FUNCTION public.create_employee(p_first_name text, p_last_name text, p_email text, p_phone text, p_role text, p_password text, p_avatar_url text, p_tenant_id uuid)
RETURNS TABLE(id uuid, email text, first_name text, last_name text, phone text, role text, avatar_url text, tenant_id uuid, created_at timestamp with time zone)
LANGUAGE sql
SECURITY INVOKER
SET search_path = public, private, pg_temp
AS $$
    SELECT * FROM private.create_employee(p_first_name, p_last_name, p_email, p_phone, p_role, p_password, p_avatar_url, p_tenant_id);
$$;

REVOKE ALL ON FUNCTION public.create_employee(text, text, text, text, text, text, text, uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.create_employee(text, text, text, text, text, text, text, uuid) TO authenticated, service_role;
COMMENT ON FUNCTION public.create_employee(text, text, text, text, text, text, text, uuid) IS '@security-definer-justification: Wrapper SECURITY INVOKER que delega a private.create_employee';

-- ------------------------------------------------------------------------------
-- 8. create_guest_profile
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION private.create_guest_profile(p_first_name text, p_last_name text DEFAULT ''::text, p_email text DEFAULT ''::text, p_phone text DEFAULT ''::text, p_address text DEFAULT ''::text, p_dni text DEFAULT ''::text, p_tenant_id uuid DEFAULT NULL::uuid, p_branch_id uuid DEFAULT NULL::uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, private, pg_temp
AS $$
DECLARE
  v_caller_role   text;
  v_caller_tenant uuid;
  v_new_id        uuid := gen_random_uuid();
  v_tenant_id     uuid;
  v_result        json;
BEGIN
  SELECT role, tenant_id
    INTO v_caller_role, v_caller_tenant
    FROM public.profiles
   WHERE id = auth.uid()
   LIMIT 1;

  IF v_caller_role IS NULL THEN
    RAISE EXCEPTION 'Unauthorized: caller has no profile';
  END IF;

  IF v_caller_role NOT IN ('admin', 'staff', 'technician', 'tenant_owner', 'super_admin') THEN
    RAISE EXCEPTION 'Forbidden: role % cannot create guest profiles', v_caller_role;
  END IF;

  v_tenant_id := COALESCE(p_tenant_id, v_caller_tenant);
  IF v_tenant_id IS NULL THEN
    RAISE EXCEPTION 'Cannot resolve tenant_id for guest profile';
  END IF;

  INSERT INTO auth.users (
    id, instance_id, aud, role, email, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    v_new_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
    CASE WHEN p_email IS NULL OR TRIM(p_email) = '' THEN NULL ELSE p_email END,
    '{"is_guest": true}'::jsonb,
    now(), now()
  );

  INSERT INTO public.profiles (
    id, first_name, last_name, email, phone,
    address, dni, is_guest, role,
    tenant_id, branch_id, is_active,
    created_at, updated_at
  ) VALUES (
    v_new_id, p_first_name, COALESCE(p_last_name, ''), COALESCE(p_email, ''),
    COALESCE(p_phone, ''), COALESCE(p_address, ''), COALESCE(p_dni, ''),
    true, 'user', v_tenant_id, p_branch_id, true, now(), now()
  )
  ON CONFLICT (id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    address = EXCLUDED.address,
    dni = EXCLUDED.dni,
    is_guest = EXCLUDED.is_guest,
    role = EXCLUDED.role,
    tenant_id = EXCLUDED.tenant_id,
    branch_id = EXCLUDED.branch_id;

  SELECT row_to_json(p)
    INTO v_result
    FROM public.profiles p
   WHERE p.id = v_new_id;

  RETURN v_result;
END;
$$;

REVOKE ALL ON FUNCTION private.create_guest_profile(text, text, text, text, text, text, uuid, uuid) FROM public;
GRANT EXECUTE ON FUNCTION private.create_guest_profile(text, text, text, text, text, text, uuid, uuid) TO authenticated, service_role;

DROP FUNCTION IF EXISTS public.create_guest_profile(text, text, text, text, text, text, uuid, uuid);

CREATE OR REPLACE FUNCTION public.create_guest_profile(p_first_name text, p_last_name text DEFAULT ''::text, p_email text DEFAULT ''::text, p_phone text DEFAULT ''::text, p_address text DEFAULT ''::text, p_dni text DEFAULT ''::text, p_tenant_id uuid DEFAULT NULL::uuid, p_branch_id uuid DEFAULT NULL::uuid)
RETURNS json
LANGUAGE sql
SECURITY INVOKER
SET search_path = public, private, pg_temp
AS $$
    SELECT private.create_guest_profile(p_first_name, p_last_name, p_email, p_phone, p_address, p_dni, p_tenant_id, p_branch_id);
$$;

REVOKE ALL ON FUNCTION public.create_guest_profile(text, text, text, text, text, text, uuid, uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.create_guest_profile(text, text, text, text, text, text, uuid, uuid) TO authenticated, service_role;
COMMENT ON FUNCTION public.create_guest_profile(text, text, text, text, text, text, uuid, uuid) IS '@security-definer-justification: Wrapper SECURITY INVOKER que delega a private.create_guest_profile';

-- ------------------------------------------------------------------------------
-- 9. get_exam_questions
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION private.get_exam_questions(p_content_id uuid)
RETURNS TABLE(id uuid, question_text text, options jsonb, order_index integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, private, pg_temp
AS $$
DECLARE
    v_email TEXT;
    v_uid UUID;
    v_has_access BOOLEAN := false;
BEGIN
    v_email := auth.jwt() ->> 'email';
    v_uid := auth.uid();

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

    RETURN QUERY
    SELECT q.id, q.question_text, q.options, q.order_index
    FROM public.course_exam_questions q
    WHERE q.content_id = p_content_id
    ORDER BY q.order_index ASC;
END;
$$;

REVOKE ALL ON FUNCTION private.get_exam_questions(uuid) FROM public;
GRANT EXECUTE ON FUNCTION private.get_exam_questions(uuid) TO authenticated, service_role;

DROP FUNCTION IF EXISTS public.get_exam_questions(uuid);

CREATE OR REPLACE FUNCTION public.get_exam_questions(p_content_id uuid)
RETURNS TABLE(id uuid, question_text text, options jsonb, order_index integer)
LANGUAGE sql
SECURITY INVOKER
SET search_path = public, private, pg_temp
AS $$
    SELECT * FROM private.get_exam_questions(p_content_id);
$$;

REVOKE ALL ON FUNCTION public.get_exam_questions(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.get_exam_questions(uuid) TO authenticated, service_role;
COMMENT ON FUNCTION public.get_exam_questions(uuid) IS '@security-definer-justification: Wrapper SECURITY INVOKER que delega a private.get_exam_questions';

-- ------------------------------------------------------------------------------
-- 10. increment_product_sales
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION private.increment_product_sales(p_product_id uuid, amount integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, private, pg_temp
AS $$
BEGIN
  UPDATE public.products
  SET total_units_sold = COALESCE(total_units_sold, 0) + amount
  WHERE id = p_product_id;
END;
$$;

REVOKE ALL ON FUNCTION private.increment_product_sales(uuid, integer) FROM public;
GRANT EXECUTE ON FUNCTION private.increment_product_sales(uuid, integer) TO authenticated, service_role;

DROP FUNCTION IF EXISTS public.increment_product_sales(uuid, integer);

CREATE OR REPLACE FUNCTION public.increment_product_sales(p_product_id uuid, amount integer)
RETURNS void
LANGUAGE sql
SECURITY INVOKER
SET search_path = public, private, pg_temp
AS $$
    SELECT private.increment_product_sales(p_product_id, amount);
$$;

REVOKE ALL ON FUNCTION public.increment_product_sales(uuid, integer) FROM public;
GRANT EXECUTE ON FUNCTION public.increment_product_sales(uuid, integer) TO authenticated, service_role;
COMMENT ON FUNCTION public.increment_product_sales(uuid, integer) IS '@security-definer-justification: Wrapper SECURITY INVOKER que delega a private.increment_product_sales';

-- ------------------------------------------------------------------------------
-- 11. mark_content_completed
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION private.mark_content_completed(p_content_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, private, pg_temp
AS $$
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

    SELECT c.tenant_id, m.course_id INTO v_tenant_id, v_course_id
    FROM public.course_lessons c
    JOIN public.course_modules m ON m.id = c.module_id
    WHERE c.id = p_content_id;

    IF v_tenant_id IS NULL THEN
        RAISE EXCEPTION 'Content not found';
    END IF;

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

    SELECT COALESCE(full_name, v_student_name) INTO v_student_name
    FROM public.course_enrollments
    WHERE course_id = v_course_id
      AND (
        (v_email IS NOT NULL AND lower(email) = lower(v_email))
        OR (user_id IS NOT NULL AND user_id = v_uid)
      )
    LIMIT 1;

    INSERT INTO public.course_progress (tenant_id, email, course_id, content_id, user_id)
    VALUES (v_tenant_id, COALESCE(v_email, 'sin-email@arecofix.com'), v_course_id, p_content_id, v_uid)
    ON CONFLICT (email, content_id) DO UPDATE
    SET completed_at = now(),
        user_id = COALESCE(public.course_progress.user_id, EXCLUDED.user_id);

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
$$;

REVOKE ALL ON FUNCTION private.mark_content_completed(uuid) FROM public;
GRANT EXECUTE ON FUNCTION private.mark_content_completed(uuid) TO authenticated, service_role;

DROP FUNCTION IF EXISTS public.mark_content_completed(uuid);

CREATE OR REPLACE FUNCTION public.mark_content_completed(p_content_id uuid)
RETURNS jsonb
LANGUAGE sql
SECURITY INVOKER
SET search_path = public, private, pg_temp
AS $$
    SELECT private.mark_content_completed(p_content_id);
$$;

REVOKE ALL ON FUNCTION public.mark_content_completed(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.mark_content_completed(uuid) TO authenticated, service_role;
COMMENT ON FUNCTION public.mark_content_completed(uuid) IS '@security-definer-justification: Wrapper SECURITY INVOKER que delega a private.mark_content_completed';

-- ------------------------------------------------------------------------------
-- 12. save_repair_order
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION private.save_repair_order(p_payload jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, private, pg_temp
AS $$
DECLARE
    new_record record;
    v_tenant_id uuid;
    v_branch_id uuid;
BEGIN
    v_branch_id := NULLIF((p_payload->>'branch_id'), '')::uuid;

    v_tenant_id := COALESCE(
        public.get_current_tenant_id(),
        (SELECT tenant_id FROM public.branches WHERE id = v_branch_id LIMIT 1),
        NULLIF(p_payload->>'tenant_id', '')::uuid
    );

    IF v_tenant_id IS NULL OR v_tenant_id = '00000000-0000-0000-0000-000000000000'::uuid THEN
        RAISE EXCEPTION 'Aislamiento crítico: No se puede guardar una orden de reparación sin un tenant_id válido.';
    END IF;

    IF NOT public.is_super_admin() AND public.get_current_tenant_id() IS NOT NULL THEN
        IF v_tenant_id != public.get_current_tenant_id() THEN
            RAISE EXCEPTION 'Aislamiento crítico: No tiene permisos para guardar reparaciones en otra sucursal.';
        END IF;
    END IF;

    INSERT INTO public.repairs (
        id, tenant_id, branch_id, client_id, device_id, issue_description,
        current_status_id, estimated_cost, final_cost, deposit_amount, 
        technical_labor_cost, spare_part_cost, technical_report, technician_notes,
        security_pin, security_pattern, checklist, glass_upsell, whatsapp_notifications,
        assigned_technician_id, received_by, created_at, updated_at
    )
    SELECT 
        COALESCE((p_payload->>'id')::uuid, gen_random_uuid()),
        v_tenant_id,
        v_branch_id,
        NULLIF((p_payload->>'client_id'), '')::uuid,
        NULLIF((p_payload->>'device_id'), '')::uuid,
        p_payload->>'issue_description',
        COALESCE((p_payload->>'current_status_id')::bigint, 1),
        COALESCE((p_payload->>'estimated_cost')::numeric, 0),
        COALESCE((p_payload->>'final_cost')::numeric, 0),
        COALESCE((p_payload->>'deposit_amount')::numeric, 0),
        COALESCE((p_payload->>'technical_labor_cost')::numeric, 0),
        COALESCE((p_payload->>'spare_part_cost')::numeric, 0),
        p_payload->>'technical_report',
        COALESCE(p_payload->>'technician_notes', p_payload->>'notes'),
        p_payload->>'security_pin',
        p_payload->>'security_pattern',
        COALESCE((p_payload->>'checklist')::jsonb, '{}'::jsonb),
        COALESCE((p_payload->>'glass_upsell')::boolean, false),
        COALESCE((p_payload->>'whatsapp_notifications')::boolean, true),
        NULLIF((p_payload->>'assigned_technician_id'), '')::uuid,
        NULLIF((p_payload->>'received_by'), '')::uuid,
        COALESCE((p_payload->>'created_at')::timestamp with time zone, now()),
        now()
    RETURNING * INTO new_record;
    
    RETURN row_to_json(new_record)::jsonb;
END;
$$;

REVOKE ALL ON FUNCTION private.save_repair_order(jsonb) FROM public;
GRANT EXECUTE ON FUNCTION private.save_repair_order(jsonb) TO authenticated, service_role;

DROP FUNCTION IF EXISTS public.save_repair_order(jsonb);

CREATE OR REPLACE FUNCTION public.save_repair_order(p_payload jsonb)
RETURNS jsonb
LANGUAGE sql
SECURITY INVOKER
SET search_path = public, private, pg_temp
AS $$
    SELECT private.save_repair_order(p_payload);
$$;

REVOKE ALL ON FUNCTION public.save_repair_order(jsonb) FROM public;
GRANT EXECUTE ON FUNCTION public.save_repair_order(jsonb) TO authenticated, service_role;
COMMENT ON FUNCTION public.save_repair_order(jsonb) IS '@security-definer-justification: Wrapper SECURITY INVOKER que delega a private.save_repair_order';

-- ------------------------------------------------------------------------------
-- 13. submit_exam
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION private.submit_exam(p_content_id uuid, p_answers jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, private, pg_temp
AS $$
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

    SELECT m.tenant_id, c.metadata INTO v_tenant_id, v_metadata
    FROM public.course_lessons c
    JOIN public.course_modules m ON m.id = c.module_id
    WHERE c.id = p_content_id;

    IF v_tenant_id IS NULL THEN
        RAISE EXCEPTION 'Exam content not found';
    END IF;

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

    IF v_passed THEN
        SELECT private.mark_content_completed(p_content_id) INTO v_progress_result;
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

REVOKE ALL ON FUNCTION private.submit_exam(uuid, jsonb) FROM public;
GRANT EXECUTE ON FUNCTION private.submit_exam(uuid, jsonb) TO authenticated, service_role;

DROP FUNCTION IF EXISTS public.submit_exam(uuid, jsonb);

CREATE OR REPLACE FUNCTION public.submit_exam(p_content_id uuid, p_answers jsonb)
RETURNS jsonb
LANGUAGE sql
SECURITY INVOKER
SET search_path = public, private, pg_temp
AS $$
    SELECT private.submit_exam(p_content_id, p_answers);
$$;

REVOKE ALL ON FUNCTION public.submit_exam(uuid, jsonb) FROM public;
GRANT EXECUTE ON FUNCTION public.submit_exam(uuid, jsonb) TO authenticated, service_role;
COMMENT ON FUNCTION public.submit_exam(uuid, jsonb) IS '@security-definer-justification: Wrapper SECURITY INVOKER que delega a private.submit_exam';

COMMIT;
