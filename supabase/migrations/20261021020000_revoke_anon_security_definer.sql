-- ==============================================================================
-- Migration: 20261021020000_revoke_anon_security_definer.sql
-- Description: Revoke EXECUTE on SECURITY DEFINER functions from anon / public
-- Severity: CRITICAL SECURITY (P0 / P1)
-- Categories: anon_security_definer_function_executable,
--             authenticated_security_definer_function_executable
-- ==============================================================================

BEGIN;

-- ------------------------------------------------------------------------------
-- 1. Trigger functions: Internal to Postgres, revoke from all API roles
-- ------------------------------------------------------------------------------
DO $$
DECLARE
    fn_record RECORD;
    v_triggers TEXT[] := ARRAY[
        'auto_assign_cash_branch',
        'auto_assign_order_branch',
        'auto_assign_repair_branch',
        'enforce_retail_price_for_guests',
        'fn_sync_d1_webhook',
        'force_tenant_isolation',
        'handle_new_user',
        'handle_order_status_change',
        'notify_n8n_new_product',
        'protect_sensitive_profile_columns',
        'sync_order_items_stock',
        'trg_contact_message_notify_admin',
        'trigger_payment_status_change',
        'update_order_total'
    ];
    t_name TEXT;
BEGIN
    FOREACH t_name IN ARRAY v_triggers LOOP
        FOR fn_record IN 
            SELECT p.oid, n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) AS args
            FROM pg_proc p
            JOIN pg_namespace n ON n.oid = p.pronamespace
            WHERE n.nspname = 'public' AND p.proname = t_name
        LOOP
            EXECUTE format('REVOKE EXECUTE ON FUNCTION %I.%I(%s) FROM public, anon, authenticated;', 
                           fn_record.nspname, fn_record.proname, fn_record.args);
        END LOOP;
    END LOOP;
END $$;

-- zarx trigger function
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'zarx' AND p.proname = 'handle_new_user') THEN
        REVOKE EXECUTE ON FUNCTION zarx.handle_new_user() FROM public, anon, authenticated;
    END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 2. Auth hook: Only supabase_auth_admin should execute custom_access_token_hook
-- ------------------------------------------------------------------------------
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'public' AND p.proname = 'custom_access_token_hook') THEN
        REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook(event jsonb) FROM public, anon, authenticated;
        GRANT EXECUTE ON FUNCTION public.custom_access_token_hook(event jsonb) TO supabase_auth_admin;
    END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 3. Maintenance / Cron functions: Revoke from API, grant to service_role
-- ------------------------------------------------------------------------------
DO $$
DECLARE
    fn_record RECORD;
    v_crons TEXT[] := ARRAY[
        'delete_old_audit_logs',
        'expire_stale_enrollments',
        'process_course_enrollments',
        'refresh_course_metrics',
        'check_and_notify_expiring_subscriptions'
    ];
    c_name TEXT;
BEGIN
    FOREACH c_name IN ARRAY v_crons LOOP
        FOR fn_record IN 
            SELECT p.oid, n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) AS args
            FROM pg_proc p
            JOIN pg_namespace n ON n.oid = p.pronamespace
            WHERE n.nspname = 'public' AND p.proname = c_name
        LOOP
            EXECUTE format('REVOKE EXECUTE ON FUNCTION %I.%I(%s) FROM public, anon, authenticated;', 
                           fn_record.nspname, fn_record.proname, fn_record.args);
            EXECUTE format('GRANT EXECUTE ON FUNCTION %I.%I(%s) TO service_role;', 
                           fn_record.nspname, fn_record.proname, fn_record.args);
        END LOOP;
    END LOOP;
END $$;

-- ------------------------------------------------------------------------------
-- 4. Admin & Authenticated-only functions: Revoke from anon, allow authenticated
-- ------------------------------------------------------------------------------
DO $$
DECLARE
    fn_record RECORD;
    v_admin_funcs TEXT[] := ARRAY[
        'create_employee',
        'assign_user_as_employee',
        'admin_reactivate_certificate',
        'admin_revoke_certificate',
        'get_admin_database_health',
        'get_admin_dashboard_analytics',
        'get_financial_analytics_v3',
        'get_admin_business_dashboard_metrics',
        'get_dashboard_stats_v2',
        'create_guest_profile',
        'is_super_admin',
        'is_admin',
        'is_admin_user',
        'is_admin_of_tenant',
        'has_permission',
        'get_auth_user_branch',
        'get_auth_user_role',
        'get_auth_user_tenant',
        'get_current_tenant_id',
        'get_my_permissions',
        'get_my_tenant',
        'get_secure_branch_id',
        'get_secure_tenant_id',
        'can_edit_profile',
        'submit_exam',
        'mark_content_completed',
        'check_and_update_membership_status',
        'increment_product_sales',
        'get_exam_questions',
        'save_repair_order',
        'get_request_guest_session',
        'accept_upsell_vidrio',
        'add_upsell_item_to_repair'
    ];
    a_name TEXT;
BEGIN
    FOREACH a_name IN ARRAY v_admin_funcs LOOP
        FOR fn_record IN 
            SELECT p.oid, n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) AS args
            FROM pg_proc p
            JOIN pg_namespace n ON n.oid = p.pronamespace
            WHERE n.nspname = 'public' AND p.proname = a_name
        LOOP
            EXECUTE format('REVOKE EXECUTE ON FUNCTION %I.%I(%s) FROM public, anon;', 
                           fn_record.nspname, fn_record.proname, fn_record.args);
            EXECUTE format('GRANT EXECUTE ON FUNCTION %I.%I(%s) TO authenticated, service_role;', 
                           fn_record.nspname, fn_record.proname, fn_record.args);
        END LOOP;
    END LOOP;
END $$;

-- ------------------------------------------------------------------------------
-- 5. zarx schema functions: Revoke from anon, allow authenticated
-- ------------------------------------------------------------------------------
DO $$
DECLARE
    fn_record RECORD;
BEGIN
    FOR fn_record IN 
        SELECT p.oid, n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) AS args
        FROM pg_proc p
        JOIN pg_namespace n ON n.oid = p.pronamespace
        WHERE n.nspname = 'zarx'
    LOOP
        EXECUTE format('REVOKE EXECUTE ON FUNCTION %I.%I(%s) FROM public, anon;', 
                       fn_record.nspname, fn_record.proname, fn_record.args);
        EXECUTE format('GRANT EXECUTE ON FUNCTION %I.%I(%s) TO authenticated, service_role;', 
                       fn_record.nspname, fn_record.proname, fn_record.args);
    END LOOP;
END $$;

-- ------------------------------------------------------------------------------
-- 6. Convert match_documents to SECURITY INVOKER (does not need definer)
-- ------------------------------------------------------------------------------
DO $$
DECLARE
    fn_record RECORD;
BEGIN
    FOR fn_record IN 
        SELECT p.oid, n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) AS args
        FROM pg_proc p
        JOIN pg_namespace n ON n.oid = p.pronamespace
        WHERE n.nspname = 'public' AND p.proname = 'match_documents'
    LOOP
        EXECUTE format('ALTER FUNCTION %I.%I(%s) SECURITY INVOKER;', 
                       fn_record.nspname, fn_record.proname, fn_record.args);
    END LOOP;
END $$;

-- ------------------------------------------------------------------------------
-- 7. RLS Helper functions required by anon/authenticated for guest carts and tenant resolution
-- ------------------------------------------------------------------------------
GRANT EXECUTE ON FUNCTION public.get_request_guest_session() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_tenant_id() TO anon, authenticated;

-- Note on Justified Public Endpoints:
-- public.get_public_certificate_data(uuid) and public.get_repair_tracking(text)
-- remain SECURITY DEFINER and executable by anon, as required by public verification design.

COMMIT;

