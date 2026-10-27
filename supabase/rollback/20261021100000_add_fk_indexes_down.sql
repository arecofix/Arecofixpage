-- ==============================================================================
-- Rollback Migration: 20261021100000_add_fk_indexes_down.sql
-- Description: Drop indexes created for unindexed foreign keys
-- ==============================================================================

DROP INDEX IF EXISTS public.idx_fk_academy_email_notifications_tenant_id;
DROP INDEX IF EXISTS public.idx_fk_academy_email_notifications_user_id;
DROP INDEX IF EXISTS public.idx_fk_academy_payments_plan_id;
DROP INDEX IF EXISTS public.idx_fk_academy_payments_tenant_id;
DROP INDEX IF EXISTS public.idx_fk_academy_plans_tenant_id;
DROP INDEX IF EXISTS public.idx_fk_academy_subscriptions_plan_id;
DROP INDEX IF EXISTS public.idx_fk_academy_subscriptions_tenant_id;
DROP INDEX IF EXISTS public.idx_fk_blog_posts_author_id;
DROP INDEX IF EXISTS public.idx_fk_post_comments_post_id;
DROP INDEX IF EXISTS public.idx_fk_post_comments_tenant_id;
DROP INDEX IF EXISTS public.idx_fk_brands_branch_id;
DROP INDEX IF EXISTS public.idx_fk_categories_branch_id;
DROP INDEX IF EXISTS public.idx_fk_products_branch_id;
DROP INDEX IF EXISTS public.idx_fk_suppliers_branch_id;
DROP INDEX IF EXISTS public.idx_fk_course_certificates_tenant_id;
DROP INDEX IF EXISTS public.idx_fk_course_exam_questions_tenant_id;
DROP INDEX IF EXISTS public.idx_fk_course_exam_submissions_tenant_id;
DROP INDEX IF EXISTS public.idx_fk_course_lessons_tenant_id;
DROP INDEX IF EXISTS public.idx_fk_course_progress_tenant_id;
DROP INDEX IF EXISTS public.idx_fk_course_progress_content_id;
DROP INDEX IF EXISTS public.idx_fk_repairs_supplier_id;
DROP INDEX IF EXISTS public.idx_fk_stock_history_branch_id;
DROP INDEX IF EXISTS public.idx_fk_stock_history_created_by;
DROP INDEX IF EXISTS public.idx_fk_services_branch_id;
DROP INDEX IF EXISTS public.idx_fk_service_blocks_tenant_id;
DROP INDEX IF EXISTS public.idx_fk_service_features_tenant_id;
DROP INDEX IF EXISTS public.idx_fk_service_leads_tenant_id;
DROP INDEX IF EXISTS public.idx_fk_user_roles_role_id;
DROP INDEX IF EXISTS public.idx_fk_user_roles_branch_id;
DROP INDEX IF EXISTS public.idx_fk_user_roles_tenant_id;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'zarx' AND table_name = 'reports') THEN
        DROP INDEX IF EXISTS zarx.idx_fk_zarx_reports_user_id;
    END IF;
END $$;
