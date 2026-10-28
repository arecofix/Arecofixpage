-- Migration: 20261028000000_arx_804_orders_origin.sql
-- Description: Ticket ARX-804 - Add origin column to public.orders with check constraint and backfill

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'orders' 
          AND column_name = 'origin'
    ) THEN
        ALTER TABLE public.orders 
        ADD COLUMN origin text DEFAULT 'ecommerce';

        ALTER TABLE public.orders 
        ADD CONSTRAINT orders_origin_check 
        CHECK (origin IN ('admin', 'ecommerce', 'pos'));

        -- Backfill existing orders based on metadata
        UPDATE public.orders 
        SET origin = CASE 
            WHEN notes ILIKE '%pos%' OR notes ILIKE '%terminal%' THEN 'pos'
            WHEN session_id IS NULL AND customer_name ILIKE '%admin%' THEN 'admin'
            ELSE 'ecommerce'
        END
        WHERE origin IS NULL;

        ALTER TABLE public.orders 
        ALTER COLUMN origin SET NOT NULL;

        CREATE INDEX IF NOT EXISTS idx_orders_origin ON public.orders(tenant_id, origin);
    END IF;
END $$;
