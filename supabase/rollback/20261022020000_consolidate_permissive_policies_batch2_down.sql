-- ==============================================================================
-- Migration: 20261022020000_consolidate_permissive_policies_batch2_down.sql
-- Description: Revert Batch 2 policy consolidation
-- ==============================================================================

BEGIN;

-- 1. Academy tables
DROP POLICY IF EXISTS "academy_payments_unified_isolation" ON public.academy_payments;
CREATE POLICY "academy_payments_tenant_isolation" ON public.academy_payments FOR ALL TO authenticated USING (tenant_id = get_current_tenant_id()) WITH CHECK (tenant_id = get_current_tenant_id());
CREATE POLICY "academy_payments_admin_manage_policy" ON public.academy_payments FOR ALL TO authenticated USING (is_admin() OR is_super_admin()) WITH CHECK (is_admin() OR is_super_admin());

DROP POLICY IF EXISTS "academy_plans_write_admin" ON public.academy_plans;
DROP POLICY IF EXISTS "academy_plans_update_admin" ON public.academy_plans;
DROP POLICY IF EXISTS "academy_plans_delete_admin" ON public.academy_plans;
CREATE POLICY "academy_plans_admin_manage_policy" ON public.academy_plans FOR ALL TO authenticated USING (is_admin() OR is_super_admin()) WITH CHECK (is_admin() OR is_super_admin());

DROP POLICY IF EXISTS "academy_subscriptions_select_unified" ON public.academy_subscriptions;
DROP POLICY IF EXISTS "academy_subscriptions_insert_admin" ON public.academy_subscriptions;
DROP POLICY IF EXISTS "academy_subscriptions_update_admin" ON public.academy_subscriptions;
DROP POLICY IF EXISTS "academy_subscriptions_delete_admin" ON public.academy_subscriptions;
CREATE POLICY "academy_subscriptions_read_own" ON public.academy_subscriptions FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
CREATE POLICY "academy_subscriptions_admin_manage_policy" ON public.academy_subscriptions FOR ALL TO authenticated USING (is_admin() OR is_super_admin()) WITH CHECK (is_admin() OR is_super_admin());

DROP POLICY IF EXISTS "course_certificates_select_unified" ON public.course_certificates;
DROP POLICY IF EXISTS "course_certificates_write_admin" ON public.course_certificates;
DROP POLICY IF EXISTS "course_certificates_update_admin" ON public.course_certificates;
DROP POLICY IF EXISTS "course_certificates_delete_admin" ON public.course_certificates;
CREATE POLICY "Users can view their own certificates" ON public.course_certificates FOR SELECT TO authenticated USING (lower(email) = lower((SELECT auth.jwt() ->> 'email'::text)));
CREATE POLICY "Admins can manage all certificates" ON public.course_certificates FOR ALL TO authenticated USING (is_admin() OR is_super_admin()) WITH CHECK (is_admin() OR is_super_admin());

DROP POLICY IF EXISTS "course_enrollments_select_unified" ON public.course_enrollments;
DROP POLICY IF EXISTS "course_enrollments_insert_unified" ON public.course_enrollments;
DROP POLICY IF EXISTS "course_enrollments_update_admin" ON public.course_enrollments;
DROP POLICY IF EXISTS "course_enrollments_delete_admin" ON public.course_enrollments;
CREATE POLICY "course_enrollments_select_policy" ON public.course_enrollments FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()) OR lower(email) = lower((SELECT auth.jwt() ->> 'email'::text)));
CREATE POLICY "course_enrollments_all_policy" ON public.course_enrollments FOR ALL TO authenticated USING (is_admin() OR is_super_admin()) WITH CHECK (is_admin() OR is_super_admin());

DROP POLICY IF EXISTS "course_exam_submissions_select_unified" ON public.course_exam_submissions;
DROP POLICY IF EXISTS "course_exam_submissions_insert_auth" ON public.course_exam_submissions;
DROP POLICY IF EXISTS "course_exam_submissions_write_admin" ON public.course_exam_submissions;
DROP POLICY IF EXISTS "course_exam_submissions_delete_admin" ON public.course_exam_submissions;
CREATE POLICY "Students can view their own submissions" ON public.course_exam_submissions FOR SELECT TO authenticated USING (lower(email) = lower((SELECT auth.jwt() ->> 'email'::text)));
CREATE POLICY "Admins can view exam submissions" ON public.course_exam_submissions FOR ALL TO authenticated USING (is_admin() OR is_super_admin()) WITH CHECK (is_admin() OR is_super_admin());

DROP POLICY IF EXISTS "course_instructors_insert_admin" ON public.course_instructors;
DROP POLICY IF EXISTS "course_instructors_update_admin" ON public.course_instructors;
DROP POLICY IF EXISTS "course_instructors_delete_admin" ON public.course_instructors;
CREATE POLICY "Escritura para usuarios autenticados" ON public.course_instructors FOR ALL TO authenticated USING (is_admin() OR is_super_admin()) WITH CHECK (is_admin() OR is_super_admin());

DROP POLICY IF EXISTS "course_lessons_select_unified" ON public.course_lessons;
DROP POLICY IF EXISTS "course_lessons_insert_admin" ON public.course_lessons;
DROP POLICY IF EXISTS "course_lessons_update_admin" ON public.course_lessons;
DROP POLICY IF EXISTS "course_lessons_delete_admin" ON public.course_lessons;
CREATE POLICY "course_lessons_select_policy" ON public.course_lessons FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY "Authors can manage course contents" ON public.course_lessons FOR ALL TO authenticated USING (is_admin() OR is_super_admin()) WITH CHECK (is_admin() OR is_super_admin());

DROP POLICY IF EXISTS "course_modules_select_unified" ON public.course_modules;
DROP POLICY IF EXISTS "course_modules_insert_admin" ON public.course_modules;
DROP POLICY IF EXISTS "course_modules_update_admin" ON public.course_modules;
DROP POLICY IF EXISTS "course_modules_delete_admin" ON public.course_modules;
CREATE POLICY "course_modules_select_policy" ON public.course_modules FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY "Admins can manage course modules" ON public.course_modules FOR ALL TO authenticated USING (is_admin() OR is_super_admin()) WITH CHECK (is_admin() OR is_super_admin());

DROP POLICY IF EXISTS "courses_unified_insert_admin" ON public.courses;
DROP POLICY IF EXISTS "courses_unified_update_admin" ON public.courses;
DROP POLICY IF EXISTS "courses_unified_delete_admin" ON public.courses;
CREATE POLICY "courses_unified_write_admin" ON public.courses FOR ALL TO authenticated USING (is_admin() OR is_super_admin()) WITH CHECK (is_admin() OR is_super_admin());

-- 2. Services, Leads, and Feedback
DROP POLICY IF EXISTS "service_blocks_insert_admin" ON public.service_blocks;
DROP POLICY IF EXISTS "service_blocks_update_admin" ON public.service_blocks;
DROP POLICY IF EXISTS "service_blocks_delete_admin" ON public.service_blocks;
CREATE POLICY "service_blocks_admin_all" ON public.service_blocks FOR ALL TO authenticated USING (is_admin() OR is_super_admin()) WITH CHECK (is_admin() OR is_super_admin());

DROP POLICY IF EXISTS "service_categories_insert_admin" ON public.service_categories;
DROP POLICY IF EXISTS "service_categories_update_admin" ON public.service_categories;
DROP POLICY IF EXISTS "service_categories_delete_admin" ON public.service_categories;
CREATE POLICY "service_categories_admin_all" ON public.service_categories FOR ALL TO authenticated USING (is_admin() OR is_super_admin()) WITH CHECK (is_admin() OR is_super_admin());

DROP POLICY IF EXISTS "service_features_insert_admin" ON public.service_features;
DROP POLICY IF EXISTS "service_features_update_admin" ON public.service_features;
DROP POLICY IF EXISTS "service_features_delete_admin" ON public.service_features;
CREATE POLICY "service_features_admin_all" ON public.service_features FOR ALL TO authenticated USING (is_admin() OR is_super_admin()) WITH CHECK (is_admin() OR is_super_admin());

DROP POLICY IF EXISTS "service_leads_select_admin" ON public.service_leads;
DROP POLICY IF EXISTS "service_leads_update_admin" ON public.service_leads;
DROP POLICY IF EXISTS "service_leads_delete_admin" ON public.service_leads;
CREATE POLICY "service_leads_admin_all" ON public.service_leads FOR ALL TO authenticated USING (is_admin() OR is_super_admin()) WITH CHECK (is_admin() OR is_super_admin());

DROP POLICY IF EXISTS "services_unified_insert_admin" ON public.services;
DROP POLICY IF EXISTS "services_unified_update_admin" ON public.services;
DROP POLICY IF EXISTS "services_unified_delete_admin" ON public.services;
CREATE POLICY "services_unified_write_admin" ON public.services FOR ALL TO authenticated USING (is_admin() OR is_super_admin()) WITH CHECK (is_admin() OR is_super_admin());

DROP POLICY IF EXISTS "slug_redirects_insert_admin" ON public.slug_redirects;
DROP POLICY IF EXISTS "slug_redirects_update_admin" ON public.slug_redirects;
DROP POLICY IF EXISTS "slug_redirects_delete_admin" ON public.slug_redirects;
CREATE POLICY "slug_redirects_admin_all" ON public.slug_redirects FOR ALL TO authenticated USING (is_admin() OR is_super_admin()) WITH CHECK (is_admin() OR is_super_admin());

DROP POLICY IF EXISTS "post_comments_select_unified" ON public.post_comments;
DROP POLICY IF EXISTS "post_comments_insert_unified" ON public.post_comments;
DROP POLICY IF EXISTS "post_comments_update_admin" ON public.post_comments;
DROP POLICY IF EXISTS "post_comments_delete_admin" ON public.post_comments;
CREATE POLICY "post_comments_select_policy" ON public.post_comments FOR SELECT TO public USING (status = 'approved');
CREATE POLICY "post_comments_insert_policy" ON public.post_comments FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "post_comments_admin_manage_policy" ON public.post_comments FOR ALL TO authenticated USING (is_admin() OR is_super_admin()) WITH CHECK (is_admin() OR is_super_admin());

-- 3. Operations
DROP POLICY IF EXISTS "contact_messages_select_admin" ON public.contact_messages;
DROP POLICY IF EXISTS "contact_messages_update_admin" ON public.contact_messages;
DROP POLICY IF EXISTS "contact_messages_delete_admin" ON public.contact_messages;
CREATE POLICY "contact_messages_admin_all" ON public.contact_messages FOR ALL TO authenticated USING (is_admin() OR is_super_admin()) WITH CHECK (is_admin() OR is_super_admin());

DROP POLICY IF EXISTS "stock_insert_admin" ON public.product_stock_per_branch;
DROP POLICY IF EXISTS "stock_update_admin" ON public.product_stock_per_branch;
DROP POLICY IF EXISTS "stock_delete_admin" ON public.product_stock_per_branch;
CREATE POLICY "Stock_Tenant_Isolation" ON public.product_stock_per_branch FOR ALL TO authenticated USING (tenant_id = get_current_tenant_id()) WITH CHECK (tenant_id = get_current_tenant_id());

DROP POLICY IF EXISTS "role_permissions_insert_admin" ON public.role_permissions;
DROP POLICY IF EXISTS "role_permissions_update_admin" ON public.role_permissions;
DROP POLICY IF EXISTS "role_permissions_delete_admin" ON public.role_permissions;
CREATE POLICY "role_permissions_write_super_admin" ON public.role_permissions FOR ALL TO authenticated USING (is_super_admin()) WITH CHECK (is_super_admin());

DROP POLICY IF EXISTS "roles_insert_admin" ON public.roles;
DROP POLICY IF EXISTS "roles_update_admin" ON public.roles;
DROP POLICY IF EXISTS "roles_delete_admin" ON public.roles;
CREATE POLICY "roles_write_super_admin" ON public.roles FOR ALL TO authenticated USING (is_super_admin()) WITH CHECK (is_super_admin());

-- 4. Orders, Order Items, Repairs, Payments, Branches, Tenants, Profiles
DROP POLICY IF EXISTS "order_items_unified_authenticated" ON public.order_items;
CREATE POLICY "Users can manage their own order items" ON public.order_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "orders_select_authenticated" ON public.orders;
DROP POLICY IF EXISTS "orders_insert_authenticated" ON public.orders;
DROP POLICY IF EXISTS "orders_update_authenticated" ON public.orders;
DROP POLICY IF EXISTS "orders_delete_authenticated" ON public.orders;
CREATE POLICY "Branch Staff Isolation" ON public.orders FOR ALL TO authenticated USING (branch_id = get_auth_user_branch());

DROP POLICY IF EXISTS "payments_select_authenticated" ON public.payments;
DROP POLICY IF EXISTS "payments_write_authenticated" ON public.payments;
DROP POLICY IF EXISTS "payments_update_authenticated" ON public.payments;
DROP POLICY IF EXISTS "payments_delete_authenticated" ON public.payments;
CREATE POLICY "Users can view their own payments" ON public.payments FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
CREATE POLICY "Staff and tenant owners can manage payments" ON public.payments FOR ALL TO authenticated USING (tenant_id = get_current_tenant_id()) WITH CHECK (tenant_id = get_current_tenant_id());

DROP POLICY IF EXISTS "repairs_select_authenticated" ON public.repairs;
DROP POLICY IF EXISTS "repairs_insert_authenticated" ON public.repairs;
DROP POLICY IF EXISTS "repairs_update_authenticated" ON public.repairs;
DROP POLICY IF EXISTS "repairs_delete_authenticated" ON public.repairs;
CREATE POLICY "repairs_tenant_isolation_all" ON public.repairs FOR ALL TO authenticated USING (tenant_id = get_current_tenant_id()) WITH CHECK (tenant_id = get_current_tenant_id());

DROP POLICY IF EXISTS "branches_select_authenticated" ON public.branches;
DROP POLICY IF EXISTS "branches_insert_admin" ON public.branches;
DROP POLICY IF EXISTS "branches_update_admin" ON public.branches;
DROP POLICY IF EXISTS "branches_delete_admin" ON public.branches;
CREATE POLICY "branches_tenant_isolation_all" ON public.branches FOR ALL TO authenticated USING (tenant_id = get_current_tenant_id()) WITH CHECK (tenant_id = get_current_tenant_id());

DROP POLICY IF EXISTS "tenants_select_unified" ON public.tenants;
CREATE POLICY "tenants_select" ON public.tenants FOR SELECT TO anon, authenticated USING (id IS NOT NULL);

DROP POLICY IF EXISTS "profiles_select_unified" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_unified" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_unified" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_unified" ON public.profiles;
CREATE POLICY "profiles_read_own" ON public.profiles FOR SELECT TO authenticated USING (id = (SELECT auth.uid()));
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = (SELECT auth.uid()));
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (id = (SELECT auth.uid())) WITH CHECK (id = (SELECT auth.uid()));

COMMIT;
