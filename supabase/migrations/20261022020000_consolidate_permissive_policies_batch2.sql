-- ==============================================================================
-- Migration: 20261022020000_consolidate_permissive_policies_batch2.sql
-- Description: Consolidate remaining multiple permissive policies across all modules (R1 Batch 2)
-- Severity: PERFORMANCE (P2)
-- Category: multiple_permissive_policies
-- ==============================================================================

BEGIN;

-- ------------------------------------------------------------------------------
-- 1. Academy tables
-- ------------------------------------------------------------------------------

-- academy_payments
DROP POLICY IF EXISTS "academy_payments_admin_manage_policy" ON public.academy_payments;
DROP POLICY IF EXISTS "super_admin_all_access" ON public.academy_payments;
DROP POLICY IF EXISTS "academy_payments_tenant_isolation" ON public.academy_payments;
DROP POLICY IF EXISTS "academy_payments_unified_isolation" ON public.academy_payments;

CREATE POLICY "academy_payments_unified_isolation" ON public.academy_payments
FOR ALL TO authenticated
USING (public.is_super_admin() OR (tenant_id = public.get_current_tenant_id()))
WITH CHECK (public.is_super_admin() OR (tenant_id = public.get_current_tenant_id()));

-- academy_plans
DROP POLICY IF EXISTS "academy_plans_admin_manage_policy" ON public.academy_plans;
DROP POLICY IF EXISTS "super_admin_all_access" ON public.academy_plans;

CREATE POLICY "academy_plans_write_admin" ON public.academy_plans
FOR INSERT TO authenticated WITH CHECK (public.is_admin() OR public.is_super_admin());

CREATE POLICY "academy_plans_update_admin" ON public.academy_plans
FOR UPDATE TO authenticated USING (public.is_admin() OR public.is_super_admin()) WITH CHECK (public.is_admin() OR public.is_super_admin());

CREATE POLICY "academy_plans_delete_admin" ON public.academy_plans
FOR DELETE TO authenticated USING (public.is_admin() OR public.is_super_admin());

-- academy_subscriptions
DROP POLICY IF EXISTS "academy_subscriptions_admin_manage_policy" ON public.academy_subscriptions;
DROP POLICY IF EXISTS "academy_subscriptions_read_own" ON public.academy_subscriptions;

CREATE POLICY "academy_subscriptions_select_unified" ON public.academy_subscriptions
FOR SELECT TO authenticated
USING (user_id = (SELECT auth.uid()) OR public.is_admin() OR public.is_super_admin());

CREATE POLICY "academy_subscriptions_insert_admin" ON public.academy_subscriptions
FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()) OR public.is_admin() OR public.is_super_admin());

CREATE POLICY "academy_subscriptions_update_admin" ON public.academy_subscriptions
FOR UPDATE TO authenticated USING (user_id = (SELECT auth.uid()) OR public.is_admin() OR public.is_super_admin()) WITH CHECK (user_id = (SELECT auth.uid()) OR public.is_admin() OR public.is_super_admin());

CREATE POLICY "academy_subscriptions_delete_admin" ON public.academy_subscriptions
FOR DELETE TO authenticated USING (public.is_admin() OR public.is_super_admin());

-- course_certificates
DROP POLICY IF EXISTS "Admins can manage all certificates" ON public.course_certificates;
DROP POLICY IF EXISTS "Users can view their own certificates" ON public.course_certificates;
DROP POLICY IF EXISTS "course_certificates_all_admin" ON public.course_certificates;

CREATE POLICY "course_certificates_select_unified" ON public.course_certificates
FOR SELECT TO authenticated
USING (
    ((lower(email) = lower((SELECT auth.jwt() ->> 'email'::text))))
    OR public.is_admin()
    OR public.is_super_admin()
);

CREATE POLICY "course_certificates_write_admin" ON public.course_certificates
FOR INSERT TO authenticated WITH CHECK (public.is_admin() OR public.is_super_admin());

CREATE POLICY "course_certificates_update_admin" ON public.course_certificates
FOR UPDATE TO authenticated USING (public.is_admin() OR public.is_super_admin()) WITH CHECK (public.is_admin() OR public.is_super_admin());

CREATE POLICY "course_certificates_delete_admin" ON public.course_certificates
FOR DELETE TO authenticated USING (public.is_admin() OR public.is_super_admin());

-- course_enrollments
DROP POLICY IF EXISTS "course_enrollments_all_policy" ON public.course_enrollments;
DROP POLICY IF EXISTS "course_enrollments_select_policy" ON public.course_enrollments;
DROP POLICY IF EXISTS "super_admin_all_access" ON public.course_enrollments;

CREATE POLICY "course_enrollments_select_unified" ON public.course_enrollments
FOR SELECT TO authenticated
USING (
    user_id = (SELECT auth.uid())
    OR lower(email) = lower((SELECT auth.jwt() ->> 'email'::text))
    OR public.is_admin()
    OR public.is_super_admin()
);

CREATE POLICY "course_enrollments_insert_unified" ON public.course_enrollments
FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()) OR public.is_admin() OR public.is_super_admin());

CREATE POLICY "course_enrollments_update_admin" ON public.course_enrollments
FOR UPDATE TO authenticated USING (public.is_admin() OR public.is_super_admin()) WITH CHECK (public.is_admin() OR public.is_super_admin());

CREATE POLICY "course_enrollments_delete_admin" ON public.course_enrollments
FOR DELETE TO authenticated USING (public.is_admin() OR public.is_super_admin());

-- course_exam_submissions
DROP POLICY IF EXISTS "Admins can view exam submissions" ON public.course_exam_submissions;
DROP POLICY IF EXISTS "Students can view their own submissions" ON public.course_exam_submissions;

CREATE POLICY "course_exam_submissions_select_unified" ON public.course_exam_submissions
FOR SELECT TO authenticated
USING (
    lower(email) = lower((SELECT auth.jwt() ->> 'email'::text))
    OR public.is_admin()
    OR public.is_super_admin()
);

CREATE POLICY "course_exam_submissions_insert_auth" ON public.course_exam_submissions
FOR INSERT TO authenticated WITH CHECK (
    lower(email) = lower((SELECT auth.jwt() ->> 'email'::text))
    OR public.is_admin()
    OR public.is_super_admin()
);

CREATE POLICY "course_exam_submissions_write_admin" ON public.course_exam_submissions
FOR UPDATE TO authenticated USING (public.is_admin() OR public.is_super_admin()) WITH CHECK (public.is_admin() OR public.is_super_admin());

CREATE POLICY "course_exam_submissions_delete_admin" ON public.course_exam_submissions
FOR DELETE TO authenticated USING (public.is_admin() OR public.is_super_admin());

-- course_instructors
DROP POLICY IF EXISTS "Escritura para usuarios autenticados" ON public.course_instructors;

CREATE POLICY "course_instructors_insert_admin" ON public.course_instructors
FOR INSERT TO authenticated WITH CHECK (public.is_admin() OR public.is_super_admin());

CREATE POLICY "course_instructors_update_admin" ON public.course_instructors
FOR UPDATE TO authenticated USING (public.is_admin() OR public.is_super_admin()) WITH CHECK (public.is_admin() OR public.is_super_admin());

CREATE POLICY "course_instructors_delete_admin" ON public.course_instructors
FOR DELETE TO authenticated USING (public.is_admin() OR public.is_super_admin());

-- course_lessons
DROP POLICY IF EXISTS "Authors can manage course contents" ON public.course_lessons;
DROP POLICY IF EXISTS "course_lessons_admin_all_policy" ON public.course_lessons;

CREATE POLICY "course_lessons_insert_admin" ON public.course_lessons
FOR INSERT TO authenticated WITH CHECK (public.is_admin_of_tenant(tenant_id) OR public.is_admin() OR public.is_super_admin() OR (tenant_id = public.get_current_tenant_id()));

CREATE POLICY "course_lessons_update_admin" ON public.course_lessons
FOR UPDATE TO authenticated USING (public.is_admin_of_tenant(tenant_id) OR public.is_admin() OR public.is_super_admin() OR (tenant_id = public.get_current_tenant_id())) WITH CHECK (public.is_admin_of_tenant(tenant_id) OR public.is_admin() OR public.is_super_admin() OR (tenant_id = public.get_current_tenant_id()));

CREATE POLICY "course_lessons_delete_admin" ON public.course_lessons
FOR DELETE TO authenticated USING (public.is_admin_of_tenant(tenant_id) OR public.is_admin() OR public.is_super_admin() OR (tenant_id = public.get_current_tenant_id()));

-- course_modules
DROP POLICY IF EXISTS "Admins can manage course modules" ON public.course_modules;
DROP POLICY IF EXISTS "Authors can manage course modules" ON public.course_modules;
DROP POLICY IF EXISTS "modules_tenant_isolation" ON public.course_modules;
DROP POLICY IF EXISTS "super_admin_all_access" ON public.course_modules;

CREATE POLICY "course_modules_insert_admin" ON public.course_modules
FOR INSERT TO authenticated WITH CHECK (public.is_admin_of_tenant(tenant_id) OR public.is_admin() OR public.is_super_admin() OR (tenant_id = public.get_current_tenant_id()));

CREATE POLICY "course_modules_update_admin" ON public.course_modules
FOR UPDATE TO authenticated USING (public.is_admin_of_tenant(tenant_id) OR public.is_admin() OR public.is_super_admin() OR (tenant_id = public.get_current_tenant_id())) WITH CHECK (public.is_admin_of_tenant(tenant_id) OR public.is_admin() OR public.is_super_admin() OR (tenant_id = public.get_current_tenant_id()));

CREATE POLICY "course_modules_delete_admin" ON public.course_modules
FOR DELETE TO authenticated USING (public.is_admin_of_tenant(tenant_id) OR public.is_admin() OR public.is_super_admin() OR (tenant_id = public.get_current_tenant_id()));

-- courses
DROP POLICY IF EXISTS "Authors can manage their courses" ON public.courses;
DROP POLICY IF EXISTS "courses_unified_write_admin" ON public.courses;

CREATE POLICY "courses_unified_insert_admin" ON public.courses
FOR INSERT TO authenticated WITH CHECK (public.is_admin() OR public.is_super_admin() OR (tenant_id = public.get_current_tenant_id()));

CREATE POLICY "courses_unified_update_admin" ON public.courses
FOR UPDATE TO authenticated USING (public.is_admin() OR public.is_super_admin() OR (tenant_id = public.get_current_tenant_id())) WITH CHECK (public.is_admin() OR public.is_super_admin() OR (tenant_id = public.get_current_tenant_id()));

CREATE POLICY "courses_unified_delete_admin" ON public.courses
FOR DELETE TO authenticated USING (public.is_admin() OR public.is_super_admin() OR (tenant_id = public.get_current_tenant_id()));

-- educacion_y_skills
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'educacion_y_skills') THEN
        DROP POLICY IF EXISTS "educacion_y_skills_admin_all" ON public.educacion_y_skills;

        CREATE POLICY "educacion_y_skills_insert_admin" ON public.educacion_y_skills
        FOR INSERT TO authenticated WITH CHECK (public.is_admin() OR public.is_super_admin());

        CREATE POLICY "educacion_y_skills_update_admin" ON public.educacion_y_skills
        FOR UPDATE TO authenticated USING (public.is_admin() OR public.is_super_admin()) WITH CHECK (public.is_admin() OR public.is_super_admin());

        CREATE POLICY "educacion_y_skills_delete_admin" ON public.educacion_y_skills
        FOR DELETE TO authenticated USING (public.is_admin() OR public.is_super_admin());
    END IF;

    -- experiencia_laboral
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'experiencia_laboral') THEN
        DROP POLICY IF EXISTS "experiencia_laboral_admin_all" ON public.experiencia_laboral;

        CREATE POLICY "experiencia_laboral_insert_admin" ON public.experiencia_laboral
        FOR INSERT TO authenticated WITH CHECK (public.is_admin() OR public.is_super_admin());

        CREATE POLICY "experiencia_laboral_update_admin" ON public.experiencia_laboral
        FOR UPDATE TO authenticated USING (public.is_admin() OR public.is_super_admin()) WITH CHECK (public.is_admin() OR public.is_super_admin());

        CREATE POLICY "experiencia_laboral_delete_admin" ON public.experiencia_laboral
        FOR DELETE TO authenticated USING (public.is_admin() OR public.is_super_admin());
    END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 2. Services, Leads, and Feedback
-- ------------------------------------------------------------------------------

-- service_blocks
DROP POLICY IF EXISTS "service_blocks_admin_all" ON public.service_blocks;
DROP POLICY IF EXISTS "service_blocks_unified_write" ON public.service_blocks;

CREATE POLICY "service_blocks_insert_admin" ON public.service_blocks
FOR INSERT TO authenticated WITH CHECK (public.is_admin() OR public.is_super_admin() OR (tenant_id = public.get_current_tenant_id()));

CREATE POLICY "service_blocks_update_admin" ON public.service_blocks
FOR UPDATE TO authenticated USING (public.is_admin() OR public.is_super_admin() OR (tenant_id = public.get_current_tenant_id())) WITH CHECK (public.is_admin() OR public.is_super_admin() OR (tenant_id = public.get_current_tenant_id()));

CREATE POLICY "service_blocks_delete_admin" ON public.service_blocks
FOR DELETE TO authenticated USING (public.is_admin() OR public.is_super_admin() OR (tenant_id = public.get_current_tenant_id()));

-- service_categories
DROP POLICY IF EXISTS "service_categories_admin_all" ON public.service_categories;

CREATE POLICY "service_categories_insert_admin" ON public.service_categories
FOR INSERT TO authenticated WITH CHECK (public.is_admin() OR public.is_super_admin());

CREATE POLICY "service_categories_update_admin" ON public.service_categories
FOR UPDATE TO authenticated USING (public.is_admin() OR public.is_super_admin()) WITH CHECK (public.is_admin() OR public.is_super_admin());

CREATE POLICY "service_categories_delete_admin" ON public.service_categories
FOR DELETE TO authenticated USING (public.is_admin() OR public.is_super_admin());

-- service_features
DROP POLICY IF EXISTS "service_features_admin_all" ON public.service_features;
DROP POLICY IF EXISTS "service_features_unified_write" ON public.service_features;

CREATE POLICY "service_features_insert_admin" ON public.service_features
FOR INSERT TO authenticated WITH CHECK (public.is_admin() OR public.is_super_admin() OR (tenant_id = public.get_current_tenant_id()));

CREATE POLICY "service_features_update_admin" ON public.service_features
FOR UPDATE TO authenticated USING (public.is_admin() OR public.is_super_admin() OR (tenant_id = public.get_current_tenant_id())) WITH CHECK (public.is_admin() OR public.is_super_admin() OR (tenant_id = public.get_current_tenant_id()));

CREATE POLICY "service_features_delete_admin" ON public.service_features
FOR DELETE TO authenticated USING (public.is_admin() OR public.is_super_admin() OR (tenant_id = public.get_current_tenant_id()));

-- service_leads
DROP POLICY IF EXISTS "service_leads_admin_all" ON public.service_leads;

CREATE POLICY "service_leads_select_admin" ON public.service_leads
FOR SELECT TO authenticated USING (public.is_admin() OR public.is_super_admin() OR (tenant_id = public.get_current_tenant_id()));

CREATE POLICY "service_leads_update_admin" ON public.service_leads
FOR UPDATE TO authenticated USING (public.is_admin() OR public.is_super_admin() OR (tenant_id = public.get_current_tenant_id())) WITH CHECK (public.is_admin() OR public.is_super_admin() OR (tenant_id = public.get_current_tenant_id()));

CREATE POLICY "service_leads_delete_admin" ON public.service_leads
FOR DELETE TO authenticated USING (public.is_admin() OR public.is_super_admin() OR (tenant_id = public.get_current_tenant_id()));

-- services
DROP POLICY IF EXISTS "services_unified_write_admin" ON public.services;

CREATE POLICY "services_unified_insert_admin" ON public.services
FOR INSERT TO authenticated WITH CHECK (public.is_admin() OR public.is_super_admin() OR (tenant_id = public.get_current_tenant_id()));

CREATE POLICY "services_unified_update_admin" ON public.services
FOR UPDATE TO authenticated USING (public.is_admin() OR public.is_super_admin() OR (tenant_id = public.get_current_tenant_id())) WITH CHECK (public.is_admin() OR public.is_super_admin() OR (tenant_id = public.get_current_tenant_id()));

CREATE POLICY "services_unified_delete_admin" ON public.services
FOR DELETE TO authenticated USING (public.is_admin() OR public.is_super_admin() OR (tenant_id = public.get_current_tenant_id()));

-- slug_redirects
DROP POLICY IF EXISTS "slug_redirects_admin_all" ON public.slug_redirects;

CREATE POLICY "slug_redirects_insert_admin" ON public.slug_redirects
FOR INSERT TO authenticated WITH CHECK (public.is_admin() OR public.is_super_admin());

CREATE POLICY "slug_redirects_update_admin" ON public.slug_redirects
FOR UPDATE TO authenticated USING (public.is_admin() OR public.is_super_admin()) WITH CHECK (public.is_admin() OR public.is_super_admin());

CREATE POLICY "slug_redirects_delete_admin" ON public.slug_redirects
FOR DELETE TO authenticated USING (public.is_admin() OR public.is_super_admin());

-- post_comments
DROP POLICY IF EXISTS "post_comments_admin_manage_policy" ON public.post_comments;
DROP POLICY IF EXISTS "post_comments_insert_policy" ON public.post_comments;
DROP POLICY IF EXISTS "post_comments_select_policy" ON public.post_comments;

CREATE POLICY "post_comments_select_unified" ON public.post_comments
FOR SELECT TO authenticated USING (status = 'approved' OR public.is_admin() OR public.is_super_admin());

CREATE POLICY "post_comments_insert_unified" ON public.post_comments
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "post_comments_update_admin" ON public.post_comments
FOR UPDATE TO authenticated USING (public.is_admin() OR public.is_super_admin()) WITH CHECK (public.is_admin() OR public.is_super_admin());

CREATE POLICY "post_comments_delete_admin" ON public.post_comments
FOR DELETE TO authenticated USING (public.is_admin() OR public.is_super_admin());

-- ------------------------------------------------------------------------------
-- 3. Operations: Notifications, Contact Messages, Stock
-- ------------------------------------------------------------------------------

-- notifications
DROP POLICY IF EXISTS "super_admin_notifications_all" ON public.notifications;
DROP POLICY IF EXISTS "zarx_notifications_scoped" ON public.notifications;

-- contact_messages
DROP POLICY IF EXISTS "super_admin_contact_messages_all" ON public.contact_messages;
DROP POLICY IF EXISTS "contact_messages_admin_all" ON public.contact_messages;

CREATE POLICY "contact_messages_select_admin" ON public.contact_messages
FOR SELECT TO authenticated USING (public.is_admin() OR public.is_super_admin());

CREATE POLICY "contact_messages_update_admin" ON public.contact_messages
FOR UPDATE TO authenticated USING (public.is_admin() OR public.is_super_admin()) WITH CHECK (public.is_admin() OR public.is_super_admin());

CREATE POLICY "contact_messages_delete_admin" ON public.contact_messages
FOR DELETE TO authenticated USING (public.is_admin() OR public.is_super_admin());

-- product_stock_per_branch
DROP POLICY IF EXISTS "Stock_Tenant_Isolation" ON public.product_stock_per_branch;

CREATE POLICY "stock_insert_admin" ON public.product_stock_per_branch
FOR INSERT TO authenticated WITH CHECK (public.is_admin() OR public.is_super_admin() OR (tenant_id = public.get_current_tenant_id()));

CREATE POLICY "stock_update_admin" ON public.product_stock_per_branch
FOR UPDATE TO authenticated USING (public.is_admin() OR public.is_super_admin() OR (tenant_id = public.get_current_tenant_id())) WITH CHECK (public.is_admin() OR public.is_super_admin() OR (tenant_id = public.get_current_tenant_id()));

CREATE POLICY "stock_delete_admin" ON public.product_stock_per_branch
FOR DELETE TO authenticated USING (public.is_admin() OR public.is_super_admin() OR (tenant_id = public.get_current_tenant_id()));

-- role_permissions
DROP POLICY IF EXISTS "role_permissions_write_super_admin" ON public.role_permissions;

CREATE POLICY "role_permissions_insert_admin" ON public.role_permissions
FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());

CREATE POLICY "role_permissions_update_admin" ON public.role_permissions
FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

CREATE POLICY "role_permissions_delete_admin" ON public.role_permissions
FOR DELETE TO authenticated USING (public.is_super_admin());

-- roles
DROP POLICY IF EXISTS "roles_write_super_admin" ON public.roles;

CREATE POLICY "roles_insert_admin" ON public.roles
FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());

CREATE POLICY "roles_update_admin" ON public.roles
FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

CREATE POLICY "roles_delete_admin" ON public.roles
FOR DELETE TO authenticated USING (public.is_super_admin());

-- ------------------------------------------------------------------------------
-- 4. Orders, Order Items, Repairs, Payments, Branches, Tenants, Profiles
-- ------------------------------------------------------------------------------

-- order_items
DROP POLICY IF EXISTS "Users can manage their own order items" ON public.order_items;
DROP POLICY IF EXISTS "staff_tenant_order_items" ON public.order_items;
DROP POLICY IF EXISTS "super_admin_all_access" ON public.order_items;
DROP POLICY IF EXISTS "order_items_unified_authenticated" ON public.order_items;

CREATE POLICY "order_items_unified_authenticated" ON public.order_items
FOR ALL TO authenticated
USING (
    public.is_super_admin()
    OR (tenant_id = public.get_current_tenant_id())
    OR EXISTS (
        SELECT 1 FROM public.orders o
        WHERE o.id = order_items.order_id
          AND (o.user_id = (SELECT auth.uid()) OR o.tenant_id = public.get_current_tenant_id())
    )
)
WITH CHECK (
    public.is_super_admin()
    OR (tenant_id = public.get_current_tenant_id())
    OR EXISTS (
        SELECT 1 FROM public.orders o
        WHERE o.id = order_items.order_id
          AND (o.user_id = (SELECT auth.uid()) OR o.tenant_id = public.get_current_tenant_id())
    )
);

-- orders
DROP POLICY IF EXISTS "Branch Staff Isolation" ON public.orders;
DROP POLICY IF EXISTS "Staff can insert orders for their tenant" ON public.orders;
DROP POLICY IF EXISTS "SuperAdmin Bypass All" ON public.orders;
DROP POLICY IF EXISTS "Tenant Owner Isolation" ON public.orders;
DROP POLICY IF EXISTS "Users can delete their own carts" ON public.orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "super_admin_all_access" ON public.orders;
DROP POLICY IF EXISTS "orders_select_authenticated" ON public.orders;
DROP POLICY IF EXISTS "orders_insert_authenticated" ON public.orders;
DROP POLICY IF EXISTS "orders_update_authenticated" ON public.orders;
DROP POLICY IF EXISTS "orders_delete_authenticated" ON public.orders;

CREATE POLICY "orders_select_authenticated" ON public.orders
FOR SELECT TO authenticated
USING (
    user_id = (SELECT auth.uid())
    OR public.is_super_admin()
    OR (get_auth_user_role() = 'super_admin'::text)
    OR (branch_id = get_auth_user_branch())
    OR ((get_auth_user_role() = 'tenant_owner'::text) AND (tenant_id = get_auth_user_tenant()))
    OR (tenant_id = public.get_current_tenant_id())
);

CREATE POLICY "orders_insert_authenticated" ON public.orders
FOR INSERT TO authenticated
WITH CHECK (
    user_id = (SELECT auth.uid())
    OR public.is_super_admin()
    OR (get_auth_user_role() = 'super_admin'::text)
    OR (branch_id = get_auth_user_branch())
    OR ((get_auth_user_role() = 'tenant_owner'::text) AND (tenant_id = get_auth_user_tenant()))
    OR (tenant_id = public.get_current_tenant_id())
);

CREATE POLICY "orders_update_authenticated" ON public.orders
FOR UPDATE TO authenticated
USING (
    user_id = (SELECT auth.uid())
    OR public.is_super_admin()
    OR (get_auth_user_role() = 'super_admin'::text)
    OR (branch_id = get_auth_user_branch())
    OR ((get_auth_user_role() = 'tenant_owner'::text) AND (tenant_id = get_auth_user_tenant()))
    OR (tenant_id = public.get_current_tenant_id())
)
WITH CHECK (
    user_id = (SELECT auth.uid())
    OR public.is_super_admin()
    OR (get_auth_user_role() = 'super_admin'::text)
    OR (branch_id = get_auth_user_branch())
    OR ((get_auth_user_role() = 'tenant_owner'::text) AND (tenant_id = get_auth_user_tenant()))
    OR (tenant_id = public.get_current_tenant_id())
);

CREATE POLICY "orders_delete_authenticated" ON public.orders
FOR DELETE TO authenticated
USING (
    (user_id = (SELECT auth.uid()) AND status = 'cart'::text)
    OR public.is_super_admin()
    OR (get_auth_user_role() = 'super_admin'::text)
    OR (branch_id = get_auth_user_branch())
    OR ((get_auth_user_role() = 'tenant_owner'::text) AND (tenant_id = get_auth_user_tenant()))
    OR (tenant_id = public.get_current_tenant_id())
);

-- payments
DROP POLICY IF EXISTS "Staff and tenant owners can manage payments" ON public.payments;
DROP POLICY IF EXISTS "SuperAdmin bypass payments" ON public.payments;
DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;
DROP POLICY IF EXISTS "payments_select_authenticated" ON public.payments;
DROP POLICY IF EXISTS "payments_write_authenticated" ON public.payments;
DROP POLICY IF EXISTS "payments_update_authenticated" ON public.payments;
DROP POLICY IF EXISTS "payments_delete_authenticated" ON public.payments;

CREATE POLICY "payments_select_authenticated" ON public.payments
FOR SELECT TO authenticated
USING (
    EXISTS (SELECT 1 FROM public.orders o WHERE o.id = payments.order_id AND o.user_id = (SELECT auth.uid()))
    OR public.is_super_admin()
    OR (get_auth_user_role() = 'super_admin'::text)
    OR (tenant_id = public.get_current_tenant_id())
    OR ((get_auth_user_role() = ANY (ARRAY['admin'::text, 'staff'::text, 'tenant_owner'::text])) AND (tenant_id = get_auth_user_tenant()))
);

CREATE POLICY "payments_write_authenticated" ON public.payments
FOR INSERT TO authenticated
WITH CHECK (
    public.is_super_admin()
    OR (get_auth_user_role() = 'super_admin'::text)
    OR (tenant_id = public.get_current_tenant_id())
    OR ((get_auth_user_role() = ANY (ARRAY['admin'::text, 'staff'::text, 'tenant_owner'::text])) AND (tenant_id = get_auth_user_tenant()))
);

CREATE POLICY "payments_update_authenticated" ON public.payments
FOR UPDATE TO authenticated
USING (public.is_super_admin() OR (tenant_id = public.get_current_tenant_id()))
WITH CHECK (public.is_super_admin() OR (tenant_id = public.get_current_tenant_id()));

CREATE POLICY "payments_delete_authenticated" ON public.payments
FOR DELETE TO authenticated
USING (public.is_super_admin() OR (tenant_id = public.get_current_tenant_id()));

-- repairs
DROP POLICY IF EXISTS "repairs_tenant_isolation_all" ON public.repairs;
DROP POLICY IF EXISTS "repairs_delete_permission" ON public.repairs;

CREATE POLICY "repairs_delete_authenticated" ON public.repairs
FOR DELETE TO authenticated
USING (
    public.is_super_admin()
    OR (get_auth_user_role() = 'super_admin'::text)
);

-- branches
DROP POLICY IF EXISTS "Branch Staff Isolation" ON public.branches;
DROP POLICY IF EXISTS "SuperAdmin Bypass All" ON public.branches;
DROP POLICY IF EXISTS "branches_public_select" ON public.branches;
DROP POLICY IF EXISTS "branches_select" ON public.branches;
DROP POLICY IF EXISTS "branches_tenant_isolation" ON public.branches;
DROP POLICY IF EXISTS "super_admin_all_access" ON public.branches;

CREATE POLICY "branches_select_anon" ON public.branches
FOR SELECT TO anon
USING (is_active = true AND tenant_id IS NOT NULL);

CREATE POLICY "branches_select_authenticated" ON public.branches
FOR SELECT TO authenticated
USING (
    is_active = true
    OR (tenant_id = public.get_current_tenant_id())
    OR (id = get_auth_user_branch())
    OR public.is_super_admin()
    OR (get_auth_user_role() = 'super_admin'::text)
);

CREATE POLICY "branches_insert_admin" ON public.branches
FOR INSERT TO authenticated WITH CHECK (public.is_super_admin() OR (tenant_id = public.get_current_tenant_id()));

CREATE POLICY "branches_update_admin" ON public.branches
FOR UPDATE TO authenticated USING (public.is_super_admin() OR (tenant_id = public.get_current_tenant_id())) WITH CHECK (public.is_super_admin() OR (tenant_id = public.get_current_tenant_id()));

CREATE POLICY "branches_delete_admin" ON public.branches
FOR DELETE TO authenticated USING (public.is_super_admin());

-- tenants
DROP POLICY IF EXISTS "super_admin_all_access" ON public.tenants;
DROP POLICY IF EXISTS "tenants_select" ON public.tenants;
DROP POLICY IF EXISTS "tenants_select_policy" ON public.tenants;
DROP POLICY IF EXISTS "Public View - Tenants" ON public.tenants;
DROP POLICY IF EXISTS "tenants_unified_update" ON public.tenants;

CREATE POLICY "tenants_select_anon" ON public.tenants
FOR SELECT TO anon
USING (is_active = true);

CREATE POLICY "tenants_select_authenticated" ON public.tenants
FOR SELECT TO authenticated
USING (is_active = true OR id = public.get_current_tenant_id() OR public.is_super_admin());

CREATE POLICY "tenants_insert_admin" ON public.tenants
FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());

CREATE POLICY "tenants_update_admin" ON public.tenants
FOR UPDATE TO authenticated USING (id = public.get_current_tenant_id() OR public.is_super_admin()) WITH CHECK (id = public.get_current_tenant_id() OR public.is_super_admin());

CREATE POLICY "tenants_delete_admin" ON public.tenants
FOR DELETE TO authenticated USING (public.is_super_admin());

-- profiles
DROP POLICY IF EXISTS "Admins_All_Profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete any profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_permission" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_permission" ON public.profiles;
DROP POLICY IF EXISTS "profiles_read_permission" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_permission" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_read_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "zarx_profiles_select_public" ON public.profiles;

CREATE POLICY "profiles_select_unified" ON public.profiles
FOR SELECT TO authenticated
USING (
    id = (SELECT auth.uid())
    OR public.is_admin()
    OR public.is_super_admin()
    OR (get_auth_user_role() = 'super_admin'::text)
    OR (has_permission('customers:manage:branch'::text, branch_id))
    OR (has_permission('customers:manage:global'::text, NULL::uuid))
);

CREATE POLICY "profiles_insert_unified" ON public.profiles
FOR INSERT TO authenticated
WITH CHECK (
    id = (SELECT auth.uid())
    OR public.is_admin()
    OR public.is_super_admin()
    OR (has_permission('customers:manage:branch'::text, branch_id))
    OR (has_permission('customers:manage:global'::text, NULL::uuid))
);

CREATE POLICY "profiles_update_unified" ON public.profiles
FOR UPDATE TO authenticated
USING (
    id = (SELECT auth.uid())
    OR public.is_admin()
    OR public.is_super_admin()
    OR (has_permission('customers:manage:branch'::text, branch_id))
    OR (has_permission('customers:manage:global'::text, NULL::uuid))
)
WITH CHECK (
    id = (SELECT auth.uid())
    OR public.is_admin()
    OR public.is_super_admin()
    OR (has_permission('customers:manage:branch'::text, branch_id))
    OR (has_permission('customers:manage:global'::text, NULL::uuid))
);

CREATE POLICY "profiles_delete_unified" ON public.profiles
FOR DELETE TO authenticated
USING (
    public.is_super_admin()
    OR (get_auth_user_role() = 'super_admin'::text)
);

-- Legacy duplicate policies drops
DROP POLICY IF EXISTS "academy_payments_select_policy" ON public.academy_payments;
DROP POLICY IF EXISTS "academy_subscriptions_select_policy" ON public.academy_subscriptions;
DROP POLICY IF EXISTS "tenant_contact_messages_delete" ON public.contact_messages;
DROP POLICY IF EXISTS "tenant_contact_messages_select" ON public.contact_messages;
DROP POLICY IF EXISTS "tenant_contact_messages_update" ON public.contact_messages;
DROP POLICY IF EXISTS "course_certificates_instructor_insert" ON public.course_certificates;
DROP POLICY IF EXISTS "Students can view their own certificates" ON public.course_certificates;
DROP POLICY IF EXISTS "course_certificates_public_verify" ON public.course_certificates;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- ------------------------------------------------------------------------------
-- 5. Zarx tables
-- ------------------------------------------------------------------------------
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'zarx') THEN
        IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'zarx' AND tablename = 'profiles') THEN
            DROP POLICY IF EXISTS "Admins can update any profile" ON zarx.profiles;
            DROP POLICY IF EXISTS "Admins can delete any profile" ON zarx.profiles;
            DROP POLICY IF EXISTS "Users can insert own profile" ON zarx.profiles;
            DROP POLICY IF EXISTS "Users can update own profile" ON zarx.profiles;

            CREATE POLICY "zarx_profiles_insert" ON zarx.profiles FOR INSERT TO authenticated WITH CHECK (id = (SELECT auth.uid()) OR zarx.is_admin());
            CREATE POLICY "zarx_profiles_update" ON zarx.profiles FOR UPDATE TO authenticated USING (id = (SELECT auth.uid()) OR zarx.is_admin()) WITH CHECK (id = (SELECT auth.uid()) OR zarx.is_admin());
            CREATE POLICY "zarx_profiles_delete" ON zarx.profiles FOR DELETE TO authenticated USING (zarx.is_admin());
        END IF;
        IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'zarx' AND tablename = 'active_news' AND policyname = 'zarx_news_admin_all') THEN
            DROP POLICY IF EXISTS "zarx_news_admin_all" ON zarx.active_news;
            CREATE POLICY "zarx_news_write_admin" ON zarx.active_news FOR INSERT TO authenticated WITH CHECK (zarx.is_admin());
            CREATE POLICY "zarx_news_update_admin" ON zarx.active_news FOR UPDATE TO authenticated USING (zarx.is_admin()) WITH CHECK (zarx.is_admin());
            CREATE POLICY "zarx_news_delete_admin" ON zarx.active_news FOR DELETE TO authenticated USING (zarx.is_admin());
        END IF;

        IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'zarx' AND tablename = 'public_alerts' AND policyname = 'zarx_alerts_admin_all') THEN
            DROP POLICY IF EXISTS "zarx_alerts_admin_all" ON zarx.public_alerts;
            CREATE POLICY "zarx_alerts_write_admin" ON zarx.public_alerts FOR INSERT TO authenticated WITH CHECK (zarx.is_admin());
            CREATE POLICY "zarx_alerts_update_admin" ON zarx.public_alerts FOR UPDATE TO authenticated USING (zarx.is_admin()) WITH CHECK (zarx.is_admin());
            CREATE POLICY "zarx_alerts_delete_admin" ON zarx.public_alerts FOR DELETE TO authenticated USING (zarx.is_admin());
        END IF;

        IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'zarx' AND tablename = 'zones' AND policyname = 'zarx_zones_admin_all') THEN
            DROP POLICY IF EXISTS "zarx_zones_admin_all" ON zarx.zones;
            CREATE POLICY "zarx_zones_write_admin" ON zarx.zones FOR INSERT TO authenticated WITH CHECK (zarx.is_admin());
            CREATE POLICY "zarx_zones_update_admin" ON zarx.zones FOR UPDATE TO authenticated USING (zarx.is_admin()) WITH CHECK (zarx.is_admin());
            CREATE POLICY "zarx_zones_delete_admin" ON zarx.zones FOR DELETE TO authenticated USING (zarx.is_admin());
        END IF;
    END IF;
END;
$$;

COMMIT;
