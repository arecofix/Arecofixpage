-- Migration: 20260808000000_update_repair_tracking_rpc
-- Purpose: Ensures the tracking RPC returns all necessary fields such as issue_description, dni, security patterns, and brand info.

-- 1. Primero eliminamos la función anterior para poder cambiar la estructura de la tabla que devuelve
DROP FUNCTION IF EXISTS public.get_repair_tracking(text);

-- 2. Creamos la función con la nueva estructura
CREATE OR REPLACE FUNCTION public.get_repair_tracking(p_code text)
 RETURNS TABLE(
    id uuid,
    tracking_code text,
    customer_id uuid,
    client_id uuid,
    device_id uuid,
    device_type text,
    device_model text,
    brand_id uuid,
    imei text,
    issue_description text,
    current_status_id integer,
    estimated_cost numeric,
    final_cost numeric,
    deposit_amount numeric,
    technical_labor_cost numeric,
    technician_notes text,
    technical_report text,
    received_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    completed_at timestamp with time zone,
    images json,
    parts json,
    branch_id uuid,
    received_by uuid,
    assigned_technician_id uuid,
    checklist jsonb,
    security_pin text,
    security_pattern text,
    glass_upsell boolean,
    spare_part_cost numeric,
    whatsapp_notifications boolean,
    supplier_id uuid,
    warranty text,
    client json,
    device json
 )
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
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
    (SELECT COALESCE(json_agg(json_build_object('image_url', ri.image_url)), '[]'::json) FROM repair_images ri WHERE ri.repair_id = r.id) as images,
    (SELECT COALESCE(json_agg(row_to_json(rpu.*)), '[]'::json) FROM repair_parts_used rpu WHERE rpu.repair_id = r.id) as parts,
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
  FROM repairs r
  LEFT JOIN profiles p ON p.id = r.client_id
  LEFT JOIN customer_devices cd ON cd.id = r.device_id
  LEFT JOIN models m ON m.id = cd.model_id
  LEFT JOIN brands b ON b.id = m.brand_id
  WHERE r.tracking_code = p_code
  AND r.deleted_at IS NULL;
END;
$function$;

-- 3. Volvemos a otorgar los permisos de ejecución
REVOKE EXECUTE ON FUNCTION public.get_repair_tracking(text) FROM public;
GRANT EXECUTE ON FUNCTION public.get_repair_tracking(text) TO anon, authenticated;
