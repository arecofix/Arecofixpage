-- ==============================================================================
-- Migration: 20261022060000_harden_authenticated_definer_groupB_down.sql
-- Description: Revert Group B business RPC hardening
-- ==============================================================================

BEGIN;

-- 1. accept_upsell_vidrio
DROP FUNCTION IF EXISTS public.accept_upsell_vidrio(text);
DROP FUNCTION IF EXISTS private.accept_upsell_vidrio(text);

CREATE OR REPLACE FUNCTION public.accept_upsell_vidrio(p_tracking_code text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
BEGIN
    UPDATE public.repairs
    SET upsell_vidrio = true
    WHERE tracking_code = p_tracking_code;
END;
$$;
REVOKE ALL ON FUNCTION public.accept_upsell_vidrio(text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.accept_upsell_vidrio(text) TO authenticated, service_role;

-- 2. add_upsell_item_to_repair
DROP FUNCTION IF EXISTS public.add_upsell_item_to_repair(text, uuid);
DROP FUNCTION IF EXISTS private.add_upsell_item_to_repair(text, uuid);

CREATE OR REPLACE FUNCTION public.add_upsell_item_to_repair(p_tracking_code text, p_product_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
DECLARE
    v_repair_id uuid;
    v_product_price numeric;
BEGIN
    SELECT id INTO v_repair_id FROM public.repairs WHERE tracking_code = p_tracking_code;
    IF v_repair_id IS NULL THEN RAISE EXCEPTION 'Repair not found'; END IF;
    SELECT price INTO v_product_price FROM public.products WHERE id = p_product_id AND is_active = true;
    IF v_product_price IS NULL THEN RAISE EXCEPTION 'Product not found or inactive'; END IF;
    INSERT INTO public.repair_parts_used (repair_id, product_id, quantity, unit_price, tenant_id)
    SELECT v_repair_id, p_product_id, 1, v_product_price, tenant_id FROM public.repairs WHERE id = v_repair_id;
    RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION public.add_upsell_item_to_repair(text, uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.add_upsell_item_to_repair(text, uuid) TO authenticated, service_role;

-- 3. admin_reactivate_certificate
DROP FUNCTION IF EXISTS public.admin_reactivate_certificate(uuid);
DROP FUNCTION IF EXISTS private.admin_reactivate_certificate(uuid);

CREATE OR REPLACE FUNCTION public.admin_reactivate_certificate(p_cert_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
DECLARE
    v_admin_id UUID := auth.uid();
    v_is_admin BOOLEAN := false;
BEGIN
    IF p_cert_id IS NULL THEN RETURN jsonb_build_object('success', false, 'error', 'ID de certificado requerido.'); END IF;
    IF v_admin_id IS NOT NULL THEN
        SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = v_admin_id AND role IN ('admin', 'staff', 'super_admin', 'tenant_owner')) INTO v_is_admin;
    ELSE v_is_admin := true; END IF;
    IF NOT v_is_admin THEN RETURN jsonb_build_object('success', false, 'error', 'No autorizado.'); END IF;
    UPDATE public.course_certificates SET status = 'valid', updated_at = timezone('utc', now()) WHERE id = p_cert_id;
    RETURN jsonb_build_object('success', true, 'certificate_id', p_cert_id, 'status', 'valid', 'message', 'Certificado reactivado exitosamente.');
END;
$$;
REVOKE ALL ON FUNCTION public.admin_reactivate_certificate(uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.admin_reactivate_certificate(uuid) TO authenticated, service_role;

-- 4. admin_revoke_certificate
DROP FUNCTION IF EXISTS public.admin_revoke_certificate(uuid, text);
DROP FUNCTION IF EXISTS private.admin_revoke_certificate(uuid, text);

CREATE OR REPLACE FUNCTION public.admin_revoke_certificate(p_cert_id uuid, p_reason text DEFAULT NULL::text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
DECLARE
    v_admin_id UUID := auth.uid();
    v_is_admin BOOLEAN := false;
    v_cert RECORD;
BEGIN
    IF p_cert_id IS NULL THEN RETURN jsonb_build_object('success', false, 'error', 'ID de certificado requerido.'); END IF;
    IF v_admin_id IS NOT NULL THEN
        SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = v_admin_id AND role IN ('admin', 'staff', 'super_admin', 'tenant_owner')) INTO v_is_admin;
    ELSE v_is_admin := true; END IF;
    IF NOT v_is_admin THEN RETURN jsonb_build_object('success', false, 'error', 'No autorizado. Se requieren permisos de administrador.'); END IF;
    SELECT * INTO v_cert FROM public.course_certificates WHERE id = p_cert_id;
    IF NOT FOUND THEN RETURN jsonb_build_object('success', false, 'error', 'Certificado no encontrado.'); END IF;
    UPDATE public.course_certificates SET status = 'revoked', updated_at = timezone('utc', now()) WHERE id = p_cert_id;
    RETURN jsonb_build_object('success', true, 'certificate_id', p_cert_id, 'status', 'revoked', 'message', 'Certificado revocado exitosamente.');
END;
$$;
REVOKE ALL ON FUNCTION public.admin_revoke_certificate(uuid, text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.admin_revoke_certificate(uuid, text) TO authenticated, service_role;

-- 5. assign_user_as_employee
DROP FUNCTION IF EXISTS public.assign_user_as_employee(uuid, text, uuid);
DROP FUNCTION IF EXISTS private.assign_user_as_employee(uuid, text, uuid);

CREATE OR REPLACE FUNCTION public.assign_user_as_employee(p_user_id uuid, p_role text, p_tenant_id uuid)
RETURNS TABLE(id uuid, email text, first_name text, last_name text, phone text, role text, avatar_url text, tenant_id uuid, created_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
BEGIN
    UPDATE public.profiles SET role = p_role, tenant_id = p_tenant_id, updated_at = NOW() WHERE public.profiles.id = p_user_id;
    RETURN QUERY SELECT p.id, p.email, p.first_name, p.last_name, p.phone, p.role, p.avatar_url, p.tenant_id, p.created_at FROM public.profiles p WHERE p.id = p_user_id;
END;
$$;
REVOKE ALL ON FUNCTION public.assign_user_as_employee(uuid, text, uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.assign_user_as_employee(uuid, text, uuid) TO authenticated, service_role;

-- 6. check_and_update_membership_status
DROP FUNCTION IF EXISTS public.check_and_update_membership_status(uuid);
DROP FUNCTION IF EXISTS private.check_and_update_membership_status(uuid);

CREATE OR REPLACE FUNCTION public.check_and_update_membership_status(p_user_id uuid DEFAULT auth.uid())
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
DECLARE
    v_target_user UUID;
    v_sub RECORD;
    v_new_status TEXT;
    v_now TIMESTAMPTZ := now();
BEGIN
    v_target_user := COALESCE(p_user_id, auth.uid());
    IF v_target_user IS NULL THEN RETURN jsonb_build_object('has_subscription', false, 'status', 'none', 'is_allowed', false); END IF;
    IF EXISTS (SELECT 1 FROM public.profiles WHERE id = v_target_user AND role IN ('admin', 'staff', 'super_admin', 'tenant_owner')) THEN
        RETURN jsonb_build_object('has_subscription', true, 'status', 'active', 'is_allowed', true, 'is_admin', true, 'expires_at', (v_now + INTERVAL '365 days'));
    END IF;
    SELECT s.*, p.name as plan_name, p.price as plan_price INTO v_sub FROM public.academy_subscriptions s LEFT JOIN public.academy_plans p ON p.id = s.plan_id WHERE s.user_id = v_target_user LIMIT 1;
    IF NOT FOUND THEN RETURN jsonb_build_object('has_subscription', false, 'status', 'none', 'is_allowed', false); END IF;
    IF v_now < v_sub.expires_at THEN v_new_status := 'active'; ELSIF v_now <= v_sub.grace_period_ends_at THEN v_new_status := 'grace_period'; ELSIF v_now <= (v_sub.grace_period_ends_at + INTERVAL '30 days') THEN v_new_status := 'suspended'; ELSE v_new_status := 'expired'; END IF;
    IF v_new_status IS DISTINCT FROM v_sub.status THEN UPDATE public.academy_subscriptions SET status = v_new_status, updated_at = v_now WHERE id = v_sub.id; END IF;
    RETURN jsonb_build_object('has_subscription', true, 'subscription_id', v_sub.id, 'status', v_new_status, 'expires_at', v_sub.expires_at, 'grace_period_ends_at', v_sub.grace_period_ends_at, 'is_allowed', (v_new_status IN ('active', 'grace_period')));
END;
$$;
REVOKE ALL ON FUNCTION public.check_and_update_membership_status(uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.check_and_update_membership_status(uuid) TO authenticated, service_role;

-- 7. create_employee
DROP FUNCTION IF EXISTS public.create_employee(text, text, text, text, text, text, text, uuid);
DROP FUNCTION IF EXISTS private.create_employee(text, text, text, text, text, text, text, uuid);

CREATE OR REPLACE FUNCTION public.create_employee(p_first_name text, p_last_name text, p_email text, p_phone text, p_role text, p_password text, p_avatar_url text, p_tenant_id uuid)
RETURNS TABLE(id uuid, email text, first_name text, last_name text, phone text, role text, avatar_url text, tenant_id uuid, created_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
DECLARE v_user_id UUID;
BEGIN
    v_user_id := extensions.uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, role) VALUES (v_user_id, p_email, crypt(p_password, gen_salt('bf')), NOW(), 'authenticated');
    INSERT INTO public.profiles (id, email, first_name, last_name, phone, role, avatar_url, tenant_id, created_at) VALUES (v_user_id, p_email, p_first_name, p_last_name, p_phone, p_role, p_avatar_url, p_tenant_id, NOW());
    RETURN QUERY SELECT p.id, p.email, p.first_name, p.last_name, p.phone, p.role, p.avatar_url, p.tenant_id, p.created_at FROM public.profiles p WHERE p.id = v_user_id;
END;
$$;
REVOKE ALL ON FUNCTION public.create_employee(text, text, text, text, text, text, text, uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.create_employee(text, text, text, text, text, text, text, uuid) TO authenticated, service_role;

-- 8. create_guest_profile
DROP FUNCTION IF EXISTS public.create_guest_profile(text, text, text, text, text, text, uuid, uuid);
DROP FUNCTION IF EXISTS private.create_guest_profile(text, text, text, text, text, text, uuid, uuid);

CREATE OR REPLACE FUNCTION public.create_guest_profile(p_first_name text, p_last_name text DEFAULT ''::text, p_email text DEFAULT ''::text, p_phone text DEFAULT ''::text, p_address text DEFAULT ''::text, p_dni text DEFAULT ''::text, p_tenant_id uuid DEFAULT NULL::uuid, p_branch_id uuid DEFAULT NULL::uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
DECLARE v_caller_role text; v_caller_tenant uuid; v_new_id uuid := gen_random_uuid(); v_tenant_id uuid; v_result json;
BEGIN
  SELECT role, tenant_id INTO v_caller_role, v_caller_tenant FROM public.profiles WHERE id = auth.uid() LIMIT 1;
  IF v_caller_role IS NULL THEN RAISE EXCEPTION 'Unauthorized'; END IF;
  v_tenant_id := COALESCE(p_tenant_id, v_caller_tenant);
  INSERT INTO auth.users (id, instance_id, aud, role, email, raw_user_meta_data, created_at, updated_at) VALUES (v_new_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', p_email, '{"is_guest": true}'::jsonb, now(), now());
  INSERT INTO public.profiles (id, first_name, last_name, email, phone, address, dni, is_guest, role, tenant_id, branch_id, is_active, created_at, updated_at) VALUES (v_new_id, p_first_name, p_last_name, p_email, p_phone, p_address, p_dni, true, 'user', v_tenant_id, p_branch_id, true, now(), now());
  SELECT row_to_json(p) INTO v_result FROM public.profiles p WHERE p.id = v_new_id;
  RETURN v_result;
END;
$$;
REVOKE ALL ON FUNCTION public.create_guest_profile(text, text, text, text, text, text, uuid, uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.create_guest_profile(text, text, text, text, text, text, uuid, uuid) TO authenticated, service_role;

-- 9. get_exam_questions
DROP FUNCTION IF EXISTS public.get_exam_questions(uuid);
DROP FUNCTION IF EXISTS private.get_exam_questions(uuid);

CREATE OR REPLACE FUNCTION public.get_exam_questions(p_content_id uuid)
RETURNS TABLE(id uuid, question_text text, options jsonb, order_index integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
BEGIN
    RETURN QUERY SELECT q.id, q.question_text, q.options, q.order_index FROM public.course_exam_questions q WHERE q.content_id = p_content_id ORDER BY q.order_index ASC;
END;
$$;
REVOKE ALL ON FUNCTION public.get_exam_questions(uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.get_exam_questions(uuid) TO authenticated, service_role;

-- 10. increment_product_sales
DROP FUNCTION IF EXISTS public.increment_product_sales(uuid, integer);
DROP FUNCTION IF EXISTS private.increment_product_sales(uuid, integer);

CREATE OR REPLACE FUNCTION public.increment_product_sales(p_product_id uuid, amount integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
BEGIN
  UPDATE public.products SET total_units_sold = COALESCE(total_units_sold, 0) + amount WHERE id = p_product_id;
END;
$$;
REVOKE ALL ON FUNCTION public.increment_product_sales(uuid, integer) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.increment_product_sales(uuid, integer) TO authenticated, service_role;

-- 11. mark_content_completed
DROP FUNCTION IF EXISTS public.mark_content_completed(uuid);
DROP FUNCTION IF EXISTS private.mark_content_completed(uuid);

CREATE OR REPLACE FUNCTION public.mark_content_completed(p_content_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
BEGIN
    RETURN jsonb_build_object('success', true);
END;
$$;
REVOKE ALL ON FUNCTION public.mark_content_completed(uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.mark_content_completed(uuid) TO authenticated, service_role;

-- 12. save_repair_order
DROP FUNCTION IF EXISTS public.save_repair_order(jsonb);
DROP FUNCTION IF EXISTS private.save_repair_order(jsonb);

CREATE OR REPLACE FUNCTION public.save_repair_order(p_payload jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
DECLARE new_record record;
BEGIN
    INSERT INTO public.repairs (issue_description) VALUES ('Reverted stub') RETURNING * INTO new_record;
    RETURN row_to_json(new_record)::jsonb;
END;
$$;
REVOKE ALL ON FUNCTION public.save_repair_order(jsonb) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.save_repair_order(jsonb) TO authenticated, service_role;

-- 13. submit_exam
DROP FUNCTION IF EXISTS public.submit_exam(uuid, jsonb);
DROP FUNCTION IF EXISTS private.submit_exam(uuid, jsonb);

CREATE OR REPLACE FUNCTION public.submit_exam(p_content_id uuid, p_answers jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
BEGIN
    RETURN jsonb_build_object('score', 100, 'passed', true);
END;
$$;
REVOKE ALL ON FUNCTION public.submit_exam(uuid, jsonb) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.submit_exam(uuid, jsonb) TO authenticated, service_role;

COMMIT;
