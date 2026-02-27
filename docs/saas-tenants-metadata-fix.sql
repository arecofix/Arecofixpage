-- Add missing columns to tenants table
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS tax_id text;
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS owner_name text;

-- Update existing data if necessary
-- For example, move data from tax_id_name to tax_id if it looks like a number
-- (This is just a precaution, usually tax_id_name should stay as 'CUIT/CUIL')

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';
