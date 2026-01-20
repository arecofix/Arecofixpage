-- =============================================================================
-- Migration: Add customer_id to orders
-- Description: Adds a customer_id column to linked orders to users
-- =============================================================================

ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Make sure RLS policies can see this column (usually automatic, but good to be safe)
GRANT SELECT, INSERT, UPDATE ON TABLE public.orders TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.orders TO service_role;
