-- Fix for Tracking: Allow get_repair_tracking to run with SECURITY DEFINER
-- so public users can see the tracking info without RLS blocking them.
-- It also safely hides sensitive information like device passcode or internal costs.

DROP FUNCTION IF EXISTS public.get_repair_tracking(text);

CREATE OR REPLACE FUNCTION public.get_repair_tracking(p_code text)
 RETURNS TABLE(
    id uuid, 
    tracking_code text, 
    device_model text, 
    current_status_id integer, 
    received_at timestamp with time zone, 
    created_at timestamp with time zone, 
    issue_description text, 
    estimated_cost numeric, 
    final_cost numeric, 
    deposit_amount numeric, 
    repair_number integer, 
    customer_name text, 
    technical_report text, 
    technician_notes text, 
    upsell_vidrio boolean, 
    imei text, 
    checklist jsonb
)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.tracking_code,
    r.device_model,
    r.current_status_id,
    r.received_at,
    r.created_at,
    r.issue_description,
    r.estimated_cost,
    r.final_cost,
    r.deposit_amount,
    r.repair_number,
    r.customer_name,
    r.technical_report,
    r.technician_notes,
    r.upsell_vidrio,
    r.imei,
    r.checklist
  FROM repairs r
  WHERE r.tracking_code = p_code
    AND r.deleted_at IS NULL
  LIMIT 1;
END;
$function$;
