-- ==============================================================================
-- Migration: 20261019020000_add_tracking_code_to_orders.sql
-- Description: Add missing tracking_code column and index to public.orders
-- Issue: Schema Drift causing checkout/cart failure (P0)
-- ==============================================================================

-- 1. Add tracking_code column safely without downtime
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS tracking_code TEXT;

-- 2. Create index on tracking_code for fast order lookup by tracking reference
CREATE INDEX IF NOT EXISTS idx_orders_tracking_code 
ON public.orders (tracking_code);

-- 3. Document column purpose
COMMENT ON COLUMN public.orders.tracking_code IS 'Shipment courier tracking number or dispatch tracking reference.';
