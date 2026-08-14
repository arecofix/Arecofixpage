-- Fix 1: Add composite index for product filtering (solves the 500 timeout)
CREATE INDEX IF NOT EXISTS idx_products_tenant_deleted_created 
ON public.products (tenant_id, deleted_at, created_at DESC);

-- Fix 2: Add GIN index for search_tsv (prevents full text search timeouts)
CREATE INDEX IF NOT EXISTS idx_products_search_tsv 
ON public.products USING GIN (search_tsv);

-- Fix 3: Enforce unique slugs for tenants to prevent sub-domain collisions
ALTER TABLE public.tenants ADD CONSTRAINT unique_tenant_slug UNIQUE (slug);

-- Fix 4: Add index on foreign keys for joined tables (prevents 500 timeouts when fetching products with stock)
CREATE INDEX IF NOT EXISTS idx_product_stock_product_id ON public.product_stock_per_branch(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_repair_parts_used_product_id ON public.repair_parts_used(product_id);
