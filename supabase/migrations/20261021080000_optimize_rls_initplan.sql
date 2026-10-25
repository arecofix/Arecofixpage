-- ==============================================================================
-- Migration: 20261021080000_optimize_rls_initplan.sql
-- Description: Optimize RLS policies using scalar subquery (SELECT auth.uid())
-- Severity: PERFORMANCE / OPTIMIZATION (P1)
-- Category: auth_rls_initplan
-- ==============================================================================

BEGIN;

-- ------------------------------------------------------------------------------
-- 1. public.profiles
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "profiles_read_own" ON public.profiles;
DROP POLICY IF EXISTS "Users_ReadUpdate_Own_Profile" ON public.profiles;
DROP POLICY IF EXISTS "Users_Update_Own_Profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_tenant_isolation_restrictive" ON public.profiles;

CREATE POLICY "profiles_read_own" ON public.profiles
    FOR SELECT TO authenticated
    USING (id = (SELECT auth.uid()));

CREATE POLICY "profiles_update_own" ON public.profiles
    FOR UPDATE TO authenticated
    USING (id = (SELECT auth.uid()))
    WITH CHECK (id = (SELECT auth.uid()));

CREATE POLICY "profiles_insert_own" ON public.profiles
    FOR INSERT TO authenticated
    WITH CHECK (id = (SELECT auth.uid()));

CREATE POLICY "profiles_tenant_isolation_restrictive" ON public.profiles
    AS RESTRICTIVE
    FOR ALL TO authenticated
    USING (
        id = (SELECT auth.uid())
        OR tenant_id = public.get_auth_user_tenant()
        OR public.is_super_admin()
    );

-- ------------------------------------------------------------------------------
-- 2. public.orders
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can delete their own carts" ON public.orders;
DROP POLICY IF EXISTS "Staff can insert orders for their tenant" ON public.orders;

CREATE POLICY "Users can view their own orders" ON public.orders
    FOR SELECT TO authenticated
    USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert their own orders" ON public.orders
    FOR INSERT TO authenticated
    WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own orders" ON public.orders
    FOR UPDATE TO authenticated
    USING (user_id = (SELECT auth.uid()))
    WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete their own carts" ON public.orders
    FOR DELETE TO authenticated
    USING (user_id = (SELECT auth.uid()) AND status = 'cart');

CREATE POLICY "Staff can insert orders for their tenant" ON public.orders
    FOR INSERT TO authenticated
    WITH CHECK (
        tenant_id = public.get_auth_user_tenant()
        AND (public.is_admin() OR public.is_super_admin())
    );

-- ------------------------------------------------------------------------------
-- 3. public.order_items & public.payments
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can manage their own order items" ON public.order_items;
CREATE POLICY "Users can manage their own order items" ON public.order_items
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = order_items.order_id
              AND o.user_id = (SELECT auth.uid())
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = order_items.order_id
              AND o.user_id = (SELECT auth.uid())
        )
    );

DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;
CREATE POLICY "Users can view their own payments" ON public.payments
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = payments.order_id
              AND o.user_id = (SELECT auth.uid())
        )
    );

-- ------------------------------------------------------------------------------
-- 4. public.contact_messages & public.notifications
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "tenant_contact_messages_select" ON public.contact_messages;
DROP POLICY IF EXISTS "tenant_contact_messages_update" ON public.contact_messages;
DROP POLICY IF EXISTS "tenant_contact_messages_delete" ON public.contact_messages;

CREATE POLICY "tenant_contact_messages_select" ON public.contact_messages
    FOR SELECT TO authenticated
    USING (
        tenant_id = public.get_current_tenant_id()
        AND (EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = (SELECT auth.uid())
              AND p.role = ANY (ARRAY['admin'::text, 'staff'::text, 'technician'::text, 'tenant_owner'::text])
        ))
    );

CREATE POLICY "tenant_contact_messages_update" ON public.contact_messages
    FOR UPDATE TO authenticated
    USING (
        tenant_id = public.get_current_tenant_id()
        AND (EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = (SELECT auth.uid())
              AND p.role = ANY (ARRAY['admin'::text, 'staff'::text, 'technician'::text, 'tenant_owner'::text])
        ))
    )
    WITH CHECK (tenant_id = public.get_current_tenant_id());

CREATE POLICY "tenant_contact_messages_delete" ON public.contact_messages
    FOR DELETE TO authenticated
    USING (
        tenant_id = public.get_current_tenant_id()
        AND (EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = (SELECT auth.uid())
              AND p.role = ANY (ARRAY['admin'::text, 'tenant_owner'::text])
        ))
    );

DROP POLICY IF EXISTS "tenant_notifications_select" ON public.notifications;
DROP POLICY IF EXISTS "tenant_notifications_delete" ON public.notifications;

CREATE POLICY "tenant_notifications_select" ON public.notifications
    FOR SELECT TO authenticated
    USING (
        tenant_id = public.get_current_tenant_id()
        AND (
            (((scope)::text = 'user'::text) AND ((user_id IS NULL) OR (user_id = (SELECT auth.uid()))))
            OR
            (((scope)::text = 'admin'::text) AND (EXISTS (
                SELECT 1 FROM public.profiles p
                WHERE p.id = (SELECT auth.uid())
                  AND p.role = ANY (ARRAY['admin'::text, 'staff'::text, 'technician'::text, 'tenant_owner'::text])
            )))
        )
    );

CREATE POLICY "tenant_notifications_delete" ON public.notifications
    FOR DELETE TO authenticated
    USING (
        tenant_id = public.get_current_tenant_id()
        AND (EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = (SELECT auth.uid())
              AND p.role = ANY (ARRAY['admin'::text, 'tenant_owner'::text])
        ))
    );

-- ------------------------------------------------------------------------------
-- 5. Academy tables
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "tenant_academy_email_notifications_select" ON public.academy_email_notifications;
CREATE POLICY "tenant_academy_email_notifications_select" ON public.academy_email_notifications
    FOR SELECT TO authenticated
    USING (
        tenant_id = public.get_current_tenant_id()
        AND (
            user_id = (SELECT auth.uid())
            OR public.is_admin()
            OR public.is_super_admin()
        )
    );

DROP POLICY IF EXISTS "academy_payments_select_policy" ON public.academy_payments;
DROP POLICY IF EXISTS "academy_payments_admin_manage_policy" ON public.academy_payments;

CREATE POLICY "academy_payments_select_policy" ON public.academy_payments
    FOR SELECT TO authenticated
    USING (
        user_id = (SELECT auth.uid())
        OR public.is_admin()
        OR public.is_super_admin()
    );

CREATE POLICY "academy_payments_admin_manage_policy" ON public.academy_payments
    FOR ALL TO authenticated
    USING (public.is_admin() OR public.is_super_admin())
    WITH CHECK (public.is_admin() OR public.is_super_admin());

DROP POLICY IF EXISTS "academy_plans_select_policy" ON public.academy_plans;
DROP POLICY IF EXISTS "academy_plans_admin_manage_policy" ON public.academy_plans;

CREATE POLICY "academy_plans_select_policy" ON public.academy_plans
    FOR SELECT TO anon, authenticated
    USING (is_active = true OR public.is_admin() OR public.is_super_admin());

CREATE POLICY "academy_plans_admin_manage_policy" ON public.academy_plans
    FOR ALL TO authenticated
    USING (public.is_admin() OR public.is_super_admin())
    WITH CHECK (public.is_admin() OR public.is_super_admin());

DROP POLICY IF EXISTS "academy_subscriptions_select_policy" ON public.academy_subscriptions;
DROP POLICY IF EXISTS "academy_subscriptions_admin_manage_policy" ON public.academy_subscriptions;

CREATE POLICY "academy_subscriptions_select_policy" ON public.academy_subscriptions
    FOR SELECT TO authenticated
    USING (
        user_id = (SELECT auth.uid())
        OR public.is_admin()
        OR public.is_super_admin()
    );

CREATE POLICY "academy_subscriptions_admin_manage_policy" ON public.academy_subscriptions
    FOR ALL TO authenticated
    USING (public.is_admin() OR public.is_super_admin())
    WITH CHECK (public.is_admin() OR public.is_super_admin());

-- ------------------------------------------------------------------------------
-- 6. Course contents & progress
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Students can view their own certificates" ON public.course_certificates;
DROP POLICY IF EXISTS "Admins can view certificates" ON public.course_certificates;
DROP POLICY IF EXISTS "Admins can manage all certificates" ON public.course_certificates;

CREATE POLICY "Students can view their own certificates" ON public.course_certificates
    FOR SELECT TO authenticated
    USING (
        user_id = (SELECT auth.uid())
        OR (email IS NOT NULL AND lower(email) = lower(COALESCE(((SELECT auth.jwt()) ->> 'email'), '')))
    );

CREATE POLICY "Admins can manage all certificates" ON public.course_certificates
    FOR ALL TO authenticated
    USING (public.is_admin() OR public.is_super_admin())
    WITH CHECK (public.is_admin() OR public.is_super_admin());

DROP POLICY IF EXISTS "course_enrollments_select_policy" ON public.course_enrollments;
DROP POLICY IF EXISTS "course_enrollments_all_policy" ON public.course_enrollments;

CREATE POLICY "course_enrollments_select_policy" ON public.course_enrollments
    FOR SELECT TO authenticated
    USING (
        user_id = (SELECT auth.uid())
        OR lower(email) = lower(COALESCE(((SELECT auth.jwt()) ->> 'email'), ''))
        OR public.is_admin()
        OR public.is_super_admin()
    );

CREATE POLICY "course_enrollments_all_policy" ON public.course_enrollments
    FOR ALL TO authenticated
    USING (public.is_admin() OR public.is_super_admin())
    WITH CHECK (public.is_admin() OR public.is_super_admin());

DROP POLICY IF EXISTS "Students manage own progress" ON public.course_progress;
CREATE POLICY "Students manage own progress" ON public.course_progress
    FOR ALL TO authenticated
    USING (user_id = (SELECT auth.uid()))
    WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Authors can manage their courses" ON public.courses;
CREATE POLICY "Authors can manage their courses" ON public.courses
    FOR ALL TO authenticated
    USING (instructor_id = (SELECT auth.uid()) OR public.is_admin() OR public.is_super_admin())
    WITH CHECK (instructor_id = (SELECT auth.uid()) OR public.is_admin() OR public.is_super_admin());

-- ------------------------------------------------------------------------------
-- 10. Additional initplan optimizations (lessons, modules, exams, contact)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "tenant_contact_messages_update" ON public.contact_messages;
CREATE POLICY "tenant_contact_messages_update" ON public.contact_messages
    FOR UPDATE TO authenticated
    USING (
        (tenant_id = public.get_current_tenant_id())
        AND EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = (SELECT auth.uid())
              AND p.role = ANY (ARRAY['admin'::text, 'staff'::text, 'technician'::text, 'tenant_owner'::text])
        )
    )
    WITH CHECK (
        (tenant_id = public.get_current_tenant_id())
        AND EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = (SELECT auth.uid())
              AND p.role = ANY (ARRAY['admin'::text, 'staff'::text, 'technician'::text, 'tenant_owner'::text])
        )
    );

DROP POLICY IF EXISTS "Admins can manage exam questions" ON public.course_exam_questions;
CREATE POLICY "Admins can manage exam questions" ON public.course_exam_questions
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = (SELECT auth.uid())
              AND role = ANY (ARRAY['admin'::text, 'staff'::text, 'super_admin'::text, 'tenant_owner'::text])
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = (SELECT auth.uid())
              AND role = ANY (ARRAY['admin'::text, 'staff'::text, 'super_admin'::text, 'tenant_owner'::text])
        )
    );

DROP POLICY IF EXISTS "Admins can view exam submissions" ON public.course_exam_submissions;
CREATE POLICY "Admins can view exam submissions" ON public.course_exam_submissions
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = (SELECT auth.uid())
              AND role = ANY (ARRAY['admin'::text, 'staff'::text, 'super_admin'::text, 'tenant_owner'::text])
        )
    );

DROP POLICY IF EXISTS "Escritura para usuarios autenticados" ON public.course_instructors;
CREATE POLICY "Escritura para usuarios autenticados" ON public.course_instructors
    FOR ALL TO authenticated
    USING (
        (SELECT auth.uid()) IS NOT NULL
    )
    WITH CHECK (
        (SELECT auth.uid()) IS NOT NULL
    );

DROP POLICY IF EXISTS "Authors can manage course contents" ON public.course_lessons;
CREATE POLICY "Authors can manage course contents" ON public.course_lessons
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.course_modules cm
            JOIN public.courses c ON c.id = cm.course_id
            WHERE cm.id = course_lessons.module_id
              AND c.author_id = (SELECT auth.uid())
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.course_modules cm
            JOIN public.courses c ON c.id = cm.course_id
            WHERE cm.id = course_lessons.module_id
              AND c.author_id = (SELECT auth.uid())
        )
    );

DROP POLICY IF EXISTS "course_lessons_admin_all_policy" ON public.course_lessons;
CREATE POLICY "course_lessons_admin_all_policy" ON public.course_lessons
    FOR ALL TO authenticated
    USING (
        public.is_admin_of_tenant(tenant_id)
        OR public.is_admin()
        OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = (SELECT auth.uid())
              AND role = ANY (ARRAY['admin'::text, 'staff'::text, 'super_admin'::text, 'tenant_owner'::text])
        )
        OR EXISTS (
            SELECT 1 FROM public.course_modules cm
            JOIN public.courses c ON c.id = cm.course_id
            WHERE cm.id = course_lessons.module_id
              AND c.author_id = (SELECT auth.uid())
        )
    )
    WITH CHECK (
        public.is_admin_of_tenant(tenant_id)
        OR public.is_admin()
        OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = (SELECT auth.uid())
              AND role = ANY (ARRAY['admin'::text, 'staff'::text, 'super_admin'::text, 'tenant_owner'::text])
        )
        OR EXISTS (
            SELECT 1 FROM public.course_modules cm
            JOIN public.courses c ON c.id = cm.course_id
            WHERE cm.id = course_lessons.module_id
              AND c.author_id = (SELECT auth.uid())
        )
    );

DROP POLICY IF EXISTS "course_lessons_select_policy" ON public.course_lessons;
CREATE POLICY "course_lessons_select_policy" ON public.course_lessons
    FOR SELECT TO authenticated, anon
    USING (
        public.is_admin_of_tenant(tenant_id)
        OR public.is_admin()
        OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = (SELECT auth.uid())
              AND role = ANY (ARRAY['admin'::text, 'staff'::text, 'super_admin'::text, 'tenant_owner'::text])
        )
        OR EXISTS (
            SELECT 1 FROM public.course_modules cm
            JOIN public.course_enrollments ce ON ce.course_id = cm.course_id
            WHERE cm.id = course_lessons.module_id
              AND ce.status = 'confirmed'
              AND (
                  (lower(ce.email) = lower(COALESCE(((SELECT auth.jwt()) ->> 'email'), '')))
                  OR (ce.user_id IS NOT NULL AND ce.user_id = (SELECT auth.uid()))
              )
              AND (cm.unlock_date IS NULL OR cm.unlock_date <= now())
        )
        OR EXISTS (
            SELECT 1 FROM public.course_modules cm
            JOIN public.courses c ON c.id = cm.course_id
            WHERE cm.id = course_lessons.module_id
              AND c.author_id = (SELECT auth.uid())
        )
    );

DROP POLICY IF EXISTS "Admins can manage course modules" ON public.course_modules;
CREATE POLICY "Admins can manage course modules" ON public.course_modules
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = (SELECT auth.uid())
              AND role = ANY (ARRAY['admin'::text, 'staff'::text, 'super_admin'::text, 'tenant_owner'::text])
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = (SELECT auth.uid())
              AND role = ANY (ARRAY['admin'::text, 'staff'::text, 'super_admin'::text, 'tenant_owner'::text])
        )
    );

DROP POLICY IF EXISTS "Authors can manage course modules" ON public.course_modules;
CREATE POLICY "Authors can manage course modules" ON public.course_modules
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.courses c
            WHERE c.id = course_modules.course_id
              AND c.author_id = (SELECT auth.uid())
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.courses c
            WHERE c.id = course_modules.course_id
              AND c.author_id = (SELECT auth.uid())
        )
    );

DROP POLICY IF EXISTS "user_roles_tenant_isolation" ON public.user_roles;
CREATE POLICY "user_roles_tenant_isolation" ON public.user_roles
    FOR ALL TO authenticated
    USING (
        public.is_super_admin()
        OR (tenant_id = public.get_current_tenant_id())
        OR (user_id = (SELECT auth.uid()))
    )
    WITH CHECK (
        public.is_super_admin()
        OR (
            (tenant_id = public.get_current_tenant_id())
            AND (public.get_auth_user_role() = ANY (ARRAY['admin'::text, 'tenant_owner'::text]))
        )
    );

DROP POLICY IF EXISTS "Students can view their own submissions" ON public.course_exam_submissions;
CREATE POLICY "Students can view their own submissions" ON public.course_exam_submissions
    FOR SELECT TO authenticated
    USING (email = ((SELECT auth.jwt()) ->> 'email'::text));

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'zarx') THEN
        DROP POLICY IF EXISTS "Users can insert own profile" ON zarx.profiles;
        CREATE POLICY "Users can insert own profile" ON zarx.profiles
            FOR INSERT TO authenticated
            WITH CHECK (id = (SELECT auth.uid()));

        DROP POLICY IF EXISTS "Users can update own profile" ON zarx.profiles;
        CREATE POLICY "Users can update own profile" ON zarx.profiles
            FOR UPDATE TO authenticated
            USING (id = (SELECT auth.uid()))
            WITH CHECK (id = (SELECT auth.uid()));
    END IF;
END $$;

COMMIT;

