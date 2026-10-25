-- Migration: 20261023000000_add_cart_item_id_to_order_items.sql
-- Description: Non-blocking addition of cart_item_id column to order_items for unique line tracking (BUG-001 / ARCH-002)

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'order_items' 
      AND column_name = 'cart_item_id'
  ) THEN
    ALTER TABLE public.order_items 
      ADD COLUMN cart_item_id UUID DEFAULT gen_random_uuid();
      
    -- Backfill any existing records where cart_item_id is NULL
    UPDATE public.order_items 
    SET cart_item_id = gen_random_uuid() 
    WHERE cart_item_id IS NULL;

    -- Add unique index for high-performance lookup and constraint enforcement
    CREATE UNIQUE INDEX IF NOT EXISTS idx_order_items_cart_item_id 
      ON public.order_items (cart_item_id);

    COMMENT ON COLUMN public.order_items.cart_item_id IS 'Unique cart line identifier to allow discrete mutation and duplicate products (D-01/BUG-001)';
  END IF;
END $$;
