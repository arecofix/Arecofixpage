-- ==============================================================================
-- Migration: 20261021100000_add_fk_indexes.sql
-- Description: Add covering indexes for 31 unindexed foreign keys
-- Severity: PERFORMANCE (P1 / P2)
-- Category: unindexed_foreign_keys
-- ==============================================================================

DO $$
DECLARE
    target_indexes text[][] := ARRAY[
        ARRAY['academy_email_notifications', 'tenant_id', 'idx_fk_academy_email_notifications_tenant_id'],
        ARRAY['academy_email_notifications', 'user_id', 'idx_fk_academy_email_notifications_user_id'],
        ARRAY['academy_payments', 'plan_id', 'idx_fk_academy_payments_plan_id'],
        ARRAY['academy_payments', 'tenant_id', 'idx_fk_academy_payments_tenant_id'],
        ARRAY['academy_plans', 'tenant_id', 'idx_fk_academy_plans_tenant_id'],
        ARRAY['academy_subscriptions', 'plan_id', 'idx_fk_academy_subscriptions_plan_id'],
        ARRAY['academy_subscriptions', 'tenant_id', 'idx_fk_academy_subscriptions_tenant_id'],
        ARRAY['blog_posts', 'author_id', 'idx_fk_blog_posts_author_id'],
        ARRAY['post_comments', 'post_id', 'idx_fk_post_comments_post_id'],
        ARRAY['post_comments', 'tenant_id', 'idx_fk_post_comments_tenant_id'],
        ARRAY['brands', 'branch_id', 'idx_fk_brands_branch_id'],
        ARRAY['categories', 'branch_id', 'idx_fk_categories_branch_id'],
        ARRAY['products', 'branch_id', 'idx_fk_products_branch_id'],
        ARRAY['suppliers', 'branch_id', 'idx_fk_suppliers_branch_id'],
        ARRAY['course_certificates', 'tenant_id', 'idx_fk_course_certificates_tenant_id'],
        ARRAY['course_exam_questions', 'tenant_id', 'idx_fk_course_exam_questions_tenant_id'],
        ARRAY['course_exam_submissions', 'tenant_id', 'idx_fk_course_exam_submissions_tenant_id'],
        ARRAY['course_lessons', 'tenant_id', 'idx_fk_course_lessons_tenant_id'],
        ARRAY['course_progress', 'tenant_id', 'idx_fk_course_progress_tenant_id'],
        ARRAY['course_progress', 'content_id', 'idx_fk_course_progress_content_id'],
        ARRAY['repairs', 'supplier_id', 'idx_fk_repairs_supplier_id'],
        ARRAY['stock_history', 'branch_id', 'idx_fk_stock_history_branch_id'],
        ARRAY['stock_history', 'created_by', 'idx_fk_stock_history_created_by'],
        ARRAY['services', 'branch_id', 'idx_fk_services_branch_id'],
        ARRAY['service_blocks', 'tenant_id', 'idx_fk_service_blocks_tenant_id'],
        ARRAY['service_features', 'tenant_id', 'idx_fk_service_features_tenant_id'],
        ARRAY['service_leads', 'tenant_id', 'idx_fk_service_leads_tenant_id'],
        ARRAY['user_roles', 'role_id', 'idx_fk_user_roles_role_id'],
        ARRAY['user_roles', 'branch_id', 'idx_fk_user_roles_branch_id'],
        ARRAY['user_roles', 'tenant_id', 'idx_fk_user_roles_tenant_id']
    ];
    i int;
    t_name text;
    c_name text;
    idx_name text;
BEGIN
    FOR i IN 1..array_length(target_indexes, 1) LOOP
        t_name := target_indexes[i][1];
        c_name := target_indexes[i][2];
        idx_name := target_indexes[i][3];
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' AND table_name = t_name AND column_name = c_name
        ) THEN
            EXECUTE format('CREATE INDEX IF NOT EXISTS %I ON public.%I(%I);', idx_name, t_name, c_name);
        END IF;
    END LOOP;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'zarx' AND table_name = 'reports') THEN
        CREATE INDEX IF NOT EXISTS idx_fk_zarx_reports_user_id ON zarx.reports(user_id);
    END IF;
END $$;
