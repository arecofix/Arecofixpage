-- Migration Down: 20261023000000_add_cart_item_id_to_order_items_down.sql

DROP INDEX IF EXISTS public.idx_order_items_cart_item_id;

DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'order_items' 
      AND column_name = 'cart_item_id'
  ) THEN
    ALTER TABLE public.order_items DROP COLUMN cart_item_id;
  END IF;
END $$;
