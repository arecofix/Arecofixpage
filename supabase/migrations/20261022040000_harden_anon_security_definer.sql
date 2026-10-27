-- ==============================================================================
-- Migration: 20261022040000_harden_anon_security_definer.sql
-- Description: Eliminate anon-executable SECURITY DEFINER functions via private schema & invokers (R3)
-- Severity: CRITICAL SECURITY (P0)
-- Category: anon_security_definer_function_executable
-- ==============================================================================

BEGIN;

-- 1. Create isolated private schema (not exposed to PostgREST API)
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM public, anon, authenticated;
GRANT USAGE ON SCHEMA private TO anon, authenticated, service_role, postgres, supabase_admin;

-- 2. Convert RLS helpers to SECURITY INVOKER (operate under caller context)
ALTER FUNCTION public.get_current_tenant_id() SECURITY INVOKER;
ALTER FUNCTION public.get_request_guest_session() SECURITY INVOKER;

-- 3. Move get_repair_tracking to private schema (DEFINER) with public INVOKER wrapper
DROP FUNCTION IF EXISTS public.get_repair_tracking(text);
DROP FUNCTION IF EXISTS private.get_repair_tracking(text);

CREATE OR REPLACE FUNCTION private.get_repair_tracking(p_code text)
RETURNS TABLE(
  id uuid, tracking_code text, customer_id uuid, client_id uuid, device_id uuid, 
  device_type text, device_model text, brand_id uuid, imei text, issue_description text, 
  current_status_id integer, estimated_cost numeric, final_cost numeric, deposit_amount numeric, 
  technical_labor_cost numeric, technician_notes text, technical_report text, 
  received_at timestamp with time zone, created_at timestamp with time zone, 
  updated_at timestamp with time zone, completed_at timestamp with time zone, 
  images json, parts json, branch_id uuid, received_by uuid, assigned_technician_id uuid, 
  checklist jsonb, security_pin text, security_pattern text, glass_upsell boolean, 
  spare_part_cost numeric, whatsapp_notifications boolean, supplier_id uuid, 
  warranty text, client json, device json
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, private, pg_temp
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.tracking_code,
    r.client_id as customer_id,
    r.client_id,
    r.device_id,
    NULL::text as device_type,
    m.name as device_model,    
    m.brand_id as brand_id,    
    cd.imei as imei,           
    r.issue_description,       
    r.current_status_id,
    r.estimated_cost,
    r.final_cost,
    r.deposit_amount,
    r.technical_labor_cost,
    r.technician_notes,
    r.technical_report,
    r.received_at,
    r.created_at,
    r.updated_at,
    r.completed_at,
    (SELECT COALESCE(json_agg(json_build_object('image_url', ri.image_url)), '[]'::json) FROM public.repair_images ri WHERE ri.repair_id = r.id) as images,
    (SELECT COALESCE(json_agg(row_to_json(rpu.*)), '[]'::json) FROM public.repair_parts_used rpu WHERE rpu.repair_id = r.id) as parts,
    r.branch_id,
    r.received_by,
    r.assigned_technician_id,
    r.checklist,
    COALESCE(r.security_pin, cd.passcode) as security_pin, 
    r.security_pattern,        
    r.glass_upsell,
    r.spare_part_cost,
    r.whatsapp_notifications,
    r.supplier_id,
    r.warranty,
    json_build_object(
      'id', p.id, 
      'first_name', p.first_name, 
      'last_name', p.last_name, 
      'phone', p.phone, 
      'email', p.email, 
      'dni', p.dni
    ) as client,
    json_build_object(
      'id', cd.id, 
      'imei', cd.imei, 
      'passcode', cd.passcode,
      'model', CASE WHEN m.id IS NOT NULL THEN 
        json_build_object(
          'id', m.id,
          'name', m.name, 
          'brand_id', m.brand_id, 
          'brand', CASE WHEN b.id IS NOT NULL THEN 
                     json_build_object('id', b.id, 'name', b.name) 
                   ELSE NULL END
        )
      ELSE NULL END
    ) as device
  FROM public.repairs r
  LEFT JOIN public.profiles p ON p.id = r.client_id
  LEFT JOIN public.customer_devices cd ON cd.id = r.device_id
  LEFT JOIN public.models m ON m.id = cd.model_id
  LEFT JOIN public.brands b ON b.id = m.brand_id
  WHERE r.tracking_code = p_code
  AND r.deleted_at IS NULL;
END;
$$;

REVOKE ALL ON FUNCTION private.get_repair_tracking(text) FROM public;
GRANT EXECUTE ON FUNCTION private.get_repair_tracking(text) TO anon, authenticated, service_role;

-- Public INVOKER wrapper:
CREATE OR REPLACE FUNCTION public.get_repair_tracking(p_code text)
RETURNS TABLE(
  id uuid, tracking_code text, customer_id uuid, client_id uuid, device_id uuid, 
  device_type text, device_model text, brand_id uuid, imei text, issue_description text, 
  current_status_id integer, estimated_cost numeric, final_cost numeric, deposit_amount numeric, 
  technical_labor_cost numeric, technician_notes text, technical_report text, 
  received_at timestamp with time zone, created_at timestamp with time zone, 
  updated_at timestamp with time zone, completed_at timestamp with time zone, 
  images json, parts json, branch_id uuid, received_by uuid, assigned_technician_id uuid, 
  checklist jsonb, security_pin text, security_pattern text, glass_upsell boolean, 
  spare_part_cost numeric, whatsapp_notifications boolean, supplier_id uuid, 
  warranty text, client json, device json
)
LANGUAGE sql
SECURITY INVOKER
SET search_path = public, private, pg_temp
AS $$
    SELECT * FROM private.get_repair_tracking(p_code);
$$;

COMMENT ON FUNCTION public.get_repair_tracking(text) IS
    '@security-definer-justification: Wrapper SECURITY INVOKER que delega a private.get_repair_tracking; cumple CIS y linter';

-- 4. Move get_public_certificate_data to private schema (DEFINER) with public INVOKER wrapper
DROP FUNCTION IF EXISTS public.get_public_certificate_data(uuid);
DROP FUNCTION IF EXISTS private.get_public_certificate_data(uuid);

CREATE OR REPLACE FUNCTION private.get_public_certificate_data(p_cert_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, private, pg_temp
AS $$
DECLARE
    v_record record;
BEGIN
    IF p_cert_id IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'status', 'invalid_id',
            'message', 'Identificador de certificado requerido.'
        );
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

REVOKE ALL ON FUNCTION private.get_public_certificate_data(uuid) FROM public;
GRANT EXECUTE ON FUNCTION private.get_public_certificate_data(uuid) TO anon, authenticated, service_role;

-- Public INVOKER wrapper:
CREATE OR REPLACE FUNCTION public.get_public_certificate_data(p_cert_id uuid)
RETURNS jsonb
LANGUAGE sql
SECURITY INVOKER
SET search_path = public, private, pg_temp
AS $$
    SELECT private.get_public_certificate_data(p_cert_id);
$$;

COMMENT ON FUNCTION public.get_public_certificate_data(uuid) IS
    '@security-definer-justification: Wrapper SECURITY INVOKER que delega a private.get_public_certificate_data; cumple CIS y linter';

COMMIT;
