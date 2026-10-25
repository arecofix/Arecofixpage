-- ==============================================================================
-- Rollback Migration: 20261019020000_add_tracking_code_to_orders_down.sql
-- ==============================================================================

DROP INDEX IF EXISTS public.idx_orders_tracking_code;
ALTER TABLE public.orders DROP COLUMN IF EXISTS tracking_code;
