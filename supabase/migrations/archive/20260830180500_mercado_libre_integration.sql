-- Add Mercado Libre Integration fields to tenants
ALTER TABLE public.tenants
ADD COLUMN IF NOT EXISTS ml_access_token text,
ADD COLUMN IF NOT EXISTS ml_refresh_token text,
ADD COLUMN IF NOT EXISTS ml_user_id text,
ADD COLUMN IF NOT EXISTS ml_markup_percentage numeric DEFAULT 5,
ADD COLUMN IF NOT EXISTS ml_expires_in integer,
ADD COLUMN IF NOT EXISTS ml_token_updated_at timestamp with time zone;

-- Add Mercado Libre Integration fields to products
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS ml_item_id text,
ADD COLUMN IF NOT EXISTS ml_sync_status text DEFAULT 'pending' CHECK (ml_sync_status IN ('pending', 'synced', 'error')),
ADD COLUMN IF NOT EXISTS ml_last_sync timestamp with time zone,
ADD COLUMN IF NOT EXISTS ml_category_id text; -- Required to sync a product
