-- ==============================================================================
-- Rollback Migration: 20261021130000_drop_safe_unused_indexes_down.sql
-- Description: Recreate dropped unused indexes with exact original definitions
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_models_active ON public.models USING btree (tenant_id, brand_id) WHERE (deleted_at IS NULL);
CREATE INDEX IF NOT EXISTS idx_services_is_published ON public.services USING btree (is_published) WHERE (deleted_at IS NULL);
CREATE INDEX IF NOT EXISTS idx_products_total_units_sold ON public.products USING btree (total_units_sold);
