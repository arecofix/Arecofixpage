-- ==============================================================================
-- Migration: 20261021130000_drop_safe_unused_indexes.sql
-- Description: Drop safe unused and low-cardinality boolean indexes
-- Severity: STORAGE / HYGIENE (P3)
-- Category: unused_index
-- Verification: Confirmed 0 scans in pg_stat_user_indexes and no constraint backing
-- ==============================================================================

-- 1. Drop low-cardinality boolean index on 25-row models table (optimizer always seq scans)
DROP INDEX IF EXISTS public.idx_models_active;

-- 2. Drop low-cardinality boolean index on 3-row services table
DROP INDEX IF EXISTS public.idx_services_is_published;

-- 3. Drop legacy unused counter index on products
DROP INDEX IF EXISTS public.idx_products_total_units_sold;
