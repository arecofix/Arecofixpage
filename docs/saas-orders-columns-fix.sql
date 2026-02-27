-- Add missing customer metadata columns to orders table
-- These are needed to store customer information directly on the order

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_name text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_email text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_phone text;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
