-- ==============================================================================
-- Migration: 20261021110000_drop_duplicate_indexes.sql
-- Description: Drop redundant duplicate indexes across public schema
-- Severity: PERFORMANCE / STORAGE (P2)
-- Category: duplicate_index
-- ==============================================================================

-- 1. course_lessons (module_id)
DROP INDEX IF EXISTS public.idx_course_lessons_module;
DROP INDEX IF EXISTS public.idx_course_module_contents_lesson_id;

-- 2. course_modules (course_id)
DROP INDEX IF EXISTS public.idx_course_modules_course;

-- 3. courses (tenant_id)
DROP INDEX IF EXISTS public.idx_courses_tenant;

-- 4. product_stock_per_branch
DROP INDEX IF EXISTS public.idx_stock_product_id;
DROP INDEX IF EXISTS public.idx_product_stock_tenant_id;
DROP INDEX IF EXISTS public.idx_product_stock_branch_product;

-- 5. products (tenant_id, slug)
DROP INDEX IF EXISTS public.idx_products_tenant_slug;

-- 6. repairs (tracking_code & tenant_status)
DROP INDEX IF EXISTS public.idx_repairs_tracking;
DROP INDEX IF EXISTS public.idx_repairs_tracking_code;
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'repairs_tracking_code_key') THEN
        ALTER TABLE public.repairs DROP CONSTRAINT repairs_tracking_code_key;
    ELSE
        DROP INDEX IF EXISTS public.repairs_tracking_code_key;
    END IF;
END $$;

DROP INDEX IF EXISTS public.idx_repairs_dashboard_lookup;

-- 7. schema_migrations
DROP INDEX IF EXISTS public.schema_migrations_version_idx;
