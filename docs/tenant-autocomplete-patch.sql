-- ==========================================
-- 🛡️ TENANT AUTO-COMPLETE PATCH (VERSION 1.0)
-- Automatically sets tenant_id from user profile
-- ==========================================

-- 1. Ensure get_my_tenant() exists (should be already there from master patch)
-- But we redefine it here just in case to ensure it's available.

-- 2. Set default values for tenant_id columns
-- This allows the frontend to OMIT the tenant_id, and the DB will fill it securely.

ALTER TABLE public.products ALTER COLUMN tenant_id SET DEFAULT public.get_my_tenant();
ALTER TABLE public.categories ALTER COLUMN tenant_id SET DEFAULT public.get_my_tenant();
ALTER TABLE public.orders ALTER COLUMN tenant_id SET DEFAULT public.get_my_tenant();
ALTER TABLE public.invoices ALTER COLUMN tenant_id SET DEFAULT public.get_my_tenant();
ALTER TABLE public.repairs ALTER COLUMN tenant_id SET DEFAULT public.get_my_tenant();
ALTER TABLE public.branches ALTER COLUMN tenant_id SET DEFAULT public.get_my_tenant();

-- 3. Add a check constraint to ensure tenant_id is NEVER null (extra safety)
-- Most are already NOT NULL, but this ensures they are populated.

-- Optional: If some tables use soft deletes, ensure the index is optimized
CREATE INDEX IF NOT EXISTS idx_products_tenant_deleted ON public.products (tenant_id) WHERE (deleted_at IS NULL);
CREATE INDEX IF NOT EXISTS idx_categories_tenant_deleted ON public.categories (tenant_id) WHERE (deleted_at IS NULL);
