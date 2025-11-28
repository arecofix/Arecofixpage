-- Ensure columns exist
ALTER TABLE repairs 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
ADD COLUMN IF NOT EXISTS received_at TIMESTAMP WITH TIME ZONE;

-- Backfill received_at with created_at where null
UPDATE repairs 
SET received_at = created_at 
WHERE received_at IS NULL;

-- Redefine the RPC function to ensure it returns all columns
CREATE OR REPLACE FUNCTION get_repair_by_tracking(code text)
RETURNS SETOF repairs
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT *
  FROM repairs
  WHERE tracking_code = code;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_repair_by_tracking(text) TO public;
GRANT EXECUTE ON FUNCTION get_repair_by_tracking(text) TO anon;
GRANT EXECUTE ON FUNCTION get_repair_by_tracking(text) TO authenticated;

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
