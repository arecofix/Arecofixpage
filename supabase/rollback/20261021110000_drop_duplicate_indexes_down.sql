-- ==============================================================================
-- Rollback Migration: 20261021110000_drop_duplicate_indexes_down.sql
-- Description: Recreate duplicate indexes if needed for rollback
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_course_lessons_module ON public.course_lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_course_modules_course ON public.course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_courses_tenant ON public.courses(tenant_id);
CREATE INDEX IF NOT EXISTS idx_stock_product_id ON public.product_stock_per_branch(product_id);
CREATE INDEX IF NOT EXISTS idx_products_tenant_slug ON public.products(tenant_id, slug);
CREATE INDEX IF NOT EXISTS idx_repairs_tracking ON public.repairs(tracking_code);
CREATE INDEX IF NOT EXISTS idx_repairs_dashboard_lookup ON public.repairs(tenant_id, current_status_id);
CREATE INDEX IF NOT EXISTS schema_migrations_version_idx ON public.schema_migrations(version);
