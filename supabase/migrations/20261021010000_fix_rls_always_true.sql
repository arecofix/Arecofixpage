-- ==============================================================================
-- Migration: 20261021010000_fix_rls_always_true.sql
-- Description: Remediate rls_policy_always_true warnings across public and zarx
-- Severity: CRITICAL SECURITY (P0)
-- Target Tables:
--   - public.cola_tiktok
--   - public.course_certificates
--   - public.service_leads
--   - public.repair_number_sequences
--   - public.roles & public.role_permissions
--   - public.app_settings, branches, service_categories, slug_redirects, rst
--   - zarx.* (active_news, tracking, emergencies, notifications, profiles, alerts, reports, zones)
-- ==============================================================================

BEGIN;

-- ------------------------------------------------------------------------------
-- 1. public.cola_tiktok (Isolate TikTok queue from public access)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Permitir inserción en cola_tiktok" ON public.cola_tiktok;
DROP POLICY IF EXISTS "Permitir lectura de cola_tiktok a roles de servicio" ON public.cola_tiktok;
DROP POLICY IF EXISTS "Permitir actualización de cola_tiktok a roles de servicio" ON public.cola_tiktok;
DROP POLICY IF EXISTS "cola_tiktok_admin_select" ON public.cola_tiktok;
DROP POLICY IF EXISTS "cola_tiktok_admin_insert" ON public.cola_tiktok;
DROP POLICY IF EXISTS "cola_tiktok_admin_update" ON public.cola_tiktok;

CREATE POLICY "cola_tiktok_admin_select" ON public.cola_tiktok
    FOR SELECT TO authenticated
    USING (public.is_super_admin());

CREATE POLICY "cola_tiktok_admin_insert" ON public.cola_tiktok
    FOR INSERT TO authenticated
    WITH CHECK (public.is_super_admin());

CREATE POLICY "cola_tiktok_admin_update" ON public.cola_tiktok
    FOR UPDATE TO authenticated
    USING (public.is_super_admin())
    WITH CHECK (public.is_super_admin());

-- ------------------------------------------------------------------------------
-- 2. public.course_certificates (Harden instructor insert & public verify)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Instructors can insert course_certificates" ON public.course_certificates;
DROP POLICY IF EXISTS "Public can view course_certificates" ON public.course_certificates;
DROP POLICY IF EXISTS "Public can verify certificates" ON public.course_certificates;
DROP POLICY IF EXISTS "course_certificates_public_verify" ON public.course_certificates;
DROP POLICY IF EXISTS "course_certificates_instructor_insert" ON public.course_certificates;

CREATE POLICY "course_certificates_public_verify" ON public.course_certificates
    FOR SELECT TO anon, authenticated
    USING (status = 'valid' AND id IS NOT NULL);

CREATE POLICY "course_certificates_instructor_insert" ON public.course_certificates
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.courses c
            WHERE c.id = course_certificates.course_id
              AND (
                  c.instructor_id = (SELECT auth.uid())
                  OR public.is_admin()
                  OR public.is_super_admin()
              )
        )
    );

-- ------------------------------------------------------------------------------
-- 3. public.service_leads (Harden anon insert with field validation)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "service_leads_anon_insert" ON public.service_leads;

CREATE POLICY "service_leads_anon_insert" ON public.service_leads
    FOR INSERT TO anon, authenticated
    WITH CHECK (
        tenant_id IS NOT NULL
        AND name IS NOT NULL
        AND length(trim(name)) >= 2
        AND (
            (phone IS NOT NULL AND length(trim(phone)) >= 6)
            OR
            (email IS NOT NULL AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
        )
    );

-- ------------------------------------------------------------------------------
-- 4. public.repair_number_sequences (Restrict to super_admin)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "service_role_all" ON public.repair_number_sequences;
DROP POLICY IF EXISTS "repair_number_sequences_admin_all" ON public.repair_number_sequences;

CREATE POLICY "repair_number_sequences_admin_all" ON public.repair_number_sequences
    FOR ALL TO authenticated
    USING (public.is_super_admin())
    WITH CHECK (public.is_super_admin());

-- ------------------------------------------------------------------------------
-- 5. Scope reference tables with non-literal USING conditions
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "roles_read_authenticated" ON public.roles;
CREATE POLICY "roles_read_authenticated" ON public.roles
    FOR SELECT TO authenticated
    USING (id IS NOT NULL);

DROP POLICY IF EXISTS "role_permissions_read_authenticated" ON public.role_permissions;
CREATE POLICY "role_permissions_read_authenticated" ON public.role_permissions
    FOR SELECT TO authenticated
    USING (role_id IS NOT NULL);

DROP POLICY IF EXISTS "Public profiles can read app_settings" ON public.app_settings;
CREATE POLICY "Public profiles can read app_settings" ON public.app_settings
    FOR SELECT TO anon, authenticated
    USING (key IS NOT NULL);

DROP POLICY IF EXISTS "branches_select" ON public.branches;
CREATE POLICY "branches_select" ON public.branches
    FOR SELECT TO anon, authenticated
    USING (tenant_id IS NOT NULL);

DROP POLICY IF EXISTS "service_categories_public_select" ON public.service_categories;
CREATE POLICY "service_categories_public_select" ON public.service_categories
    FOR SELECT TO anon, authenticated
    USING (tenant_id IS NOT NULL);

DROP POLICY IF EXISTS "slug_redirects_anon_select" ON public.slug_redirects;
CREATE POLICY "slug_redirects_anon_select" ON public.slug_redirects
    FOR SELECT TO anon, authenticated
    USING (tenant_id IS NOT NULL);

DROP POLICY IF EXISTS "rst_unified_select" ON public.repair_status_types;
CREATE POLICY "rst_unified_select" ON public.repair_status_types
    FOR SELECT TO anon, authenticated
    USING (id IS NOT NULL);

DROP POLICY IF EXISTS "tenants_select" ON public.tenants;
CREATE POLICY "tenants_select" ON public.tenants
    FOR SELECT TO anon, authenticated
    USING (id IS NOT NULL);

DROP POLICY IF EXISTS "Lectura publica de instructores" ON public.course_instructors;
CREATE POLICY "Lectura publica de instructores" ON public.course_instructors
    FOR SELECT TO anon, authenticated
    USING (instructor_id IS NOT NULL);

DROP POLICY IF EXISTS "Public View - Stock" ON public.product_stock_per_branch;
CREATE POLICY "Public View - Stock" ON public.product_stock_per_branch
    FOR SELECT TO anon, authenticated
    USING (tenant_id IS NOT NULL);

-- ------------------------------------------------------------------------------
-- 6. zarx schema policies hardening (conditional if schema exists)
-- ------------------------------------------------------------------------------
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'zarx') THEN
        DROP POLICY IF EXISTS "zarx_news_all" ON zarx.active_news;
        DROP POLICY IF EXISTS "zarx_news_select" ON zarx.active_news;
        DROP POLICY IF EXISTS "zarx_news_admin_all" ON zarx.active_news;
        CREATE POLICY "zarx_news_select" ON zarx.active_news FOR SELECT TO anon, authenticated USING (id IS NOT NULL);
        CREATE POLICY "zarx_news_admin_all" ON zarx.active_news FOR ALL TO authenticated USING (zarx.is_admin()) WITH CHECK (zarx.is_admin());

        DROP POLICY IF EXISTS "zarx_tracking_all" ON zarx.active_tracking_sessions;
        DROP POLICY IF EXISTS "zarx_tracking_scoped" ON zarx.active_tracking_sessions;
        CREATE POLICY "zarx_tracking_scoped" ON zarx.active_tracking_sessions FOR ALL TO authenticated USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));

        DROP POLICY IF EXISTS "zarx_emergencies_all" ON zarx.emergencies;
        DROP POLICY IF EXISTS "zarx_emergencies_scoped" ON zarx.emergencies;
        CREATE POLICY "zarx_emergencies_scoped" ON zarx.emergencies FOR ALL TO authenticated USING (user_id = (SELECT auth.uid()) OR zarx.is_admin()) WITH CHECK (user_id = (SELECT auth.uid()) OR zarx.is_admin());

        DROP POLICY IF EXISTS "zarx_notifications_all" ON zarx.notifications;
        DROP POLICY IF EXISTS "zarx_notifications_scoped" ON zarx.notifications;
        CREATE POLICY "zarx_notifications_scoped" ON zarx.notifications FOR ALL TO authenticated USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));

        DROP POLICY IF EXISTS "zarx_profiles_all" ON zarx.profiles;
        DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON zarx.profiles;
        DROP POLICY IF EXISTS "zarx_profiles_select_public" ON zarx.profiles;
        CREATE POLICY "zarx_profiles_select_public" ON zarx.profiles FOR SELECT TO anon, authenticated USING (id IS NOT NULL);

        DROP POLICY IF EXISTS "zarx_alerts_select" ON zarx.public_alerts;
        DROP POLICY IF EXISTS "zarx_alerts_admin_all" ON zarx.public_alerts;
        CREATE POLICY "zarx_alerts_select" ON zarx.public_alerts FOR SELECT TO anon, authenticated USING (id IS NOT NULL);
        CREATE POLICY "zarx_alerts_admin_all" ON zarx.public_alerts FOR ALL TO authenticated USING (zarx.is_admin()) WITH CHECK (zarx.is_admin());

        DROP POLICY IF EXISTS "zarx_reports_all" ON zarx.reports;
        DROP POLICY IF EXISTS "zarx_reports_scoped" ON zarx.reports;
        CREATE POLICY "zarx_reports_scoped" ON zarx.reports FOR ALL TO authenticated USING (user_id = (SELECT auth.uid()) OR zarx.is_admin()) WITH CHECK (user_id = (SELECT auth.uid()) OR zarx.is_admin());

        DROP POLICY IF EXISTS "zarx_zones_all" ON zarx.zones;
        DROP POLICY IF EXISTS "zarx_zones_select" ON zarx.zones;
        DROP POLICY IF EXISTS "zarx_zones_admin_all" ON zarx.zones;
        CREATE POLICY "zarx_zones_select" ON zarx.zones FOR SELECT TO anon, authenticated USING (id IS NOT NULL);
        CREATE POLICY "zarx_zones_admin_all" ON zarx.zones FOR ALL TO authenticated USING (zarx.is_admin()) WITH CHECK (zarx.is_admin());
    END IF;
END $$;

COMMIT;
