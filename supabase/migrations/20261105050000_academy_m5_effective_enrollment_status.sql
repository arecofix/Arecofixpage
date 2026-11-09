-- ==============================================================================
-- MIGRATION M5: Function effective_enrollment_status (STABLE)
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.effective_enrollment_status(
  p_status text,
  p_next_due_date timestamptz
) RETURNS text
LANGUAGE sql
STABLE
SET search_path = public, pg_temp
AS $$
  SELECT CASE
    WHEN p_status IN ('cancelled', 'completed', 'scholarship') THEN p_status
    WHEN p_next_due_date IS NULL THEN COALESCE(p_status, 'active')
    WHEN now() <= p_next_due_date                      THEN 'active'
    WHEN now() <= p_next_due_date + INTERVAL '7 days'  THEN 'grace_period'
    ELSE 'suspended'
  END;
$$;

GRANT EXECUTE ON FUNCTION public.effective_enrollment_status(text, timestamptz) TO anon, authenticated, service_role;

