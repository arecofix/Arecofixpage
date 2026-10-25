-- ==============================================================================
-- Rollback Migration: 20261021010000_fix_rls_always_true_down.sql
-- Description: Revert changes made by 20261021010000_fix_rls_always_true.sql
-- ==============================================================================

BEGIN;

-- 1. Restore cola_tiktok
DROP POLICY IF EXISTS "cola_tiktok_admin_select" ON public.cola_tiktok;
DROP POLICY IF EXISTS "cola_tiktok_admin_insert" ON public.cola_tiktok;
DROP POLICY IF EXISTS "cola_tiktok_admin_update" ON public.cola_tiktok;

CREATE POLICY "Permitir inserción en cola_tiktok" ON public.cola_tiktok
    FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Permitir lectura de cola_tiktok a roles de servicio" ON public.cola_tiktok
    FOR SELECT TO public USING (true);
CREATE POLICY "Permitir actualización de cola_tiktok a roles de servicio" ON public.cola_tiktok
    FOR UPDATE TO public USING (true);

-- 2. Restore course_certificates
DROP POLICY IF EXISTS "course_certificates_public_verify" ON public.course_certificates;
DROP POLICY IF EXISTS "course_certificates_instructor_insert" ON public.course_certificates;

CREATE POLICY "Instructors can insert course_certificates" ON public.course_certificates
    FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Public can view course_certificates" ON public.course_certificates
    FOR SELECT TO public USING (true);
CREATE POLICY "Public can verify certificates" ON public.course_certificates
    FOR SELECT TO public USING (true);

-- 3. Restore service_leads
DROP POLICY IF EXISTS "service_leads_anon_insert" ON public.service_leads;
CREATE POLICY "service_leads_anon_insert" ON public.service_leads
    FOR INSERT TO anon, authenticated WITH CHECK (true);

-- 4. Restore repair_number_sequences
DROP POLICY IF EXISTS "repair_number_sequences_admin_all" ON public.repair_number_sequences;
CREATE POLICY "service_role_all" ON public.repair_number_sequences
    FOR ALL TO public USING (true) WITH CHECK (true);

-- 5. Restore reference tables
DROP POLICY IF EXISTS "roles_read_authenticated" ON public.roles;
CREATE POLICY "roles_read_authenticated" ON public.roles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "role_permissions_read_authenticated" ON public.role_permissions;
CREATE POLICY "role_permissions_read_authenticated" ON public.role_permissions FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Public profiles can read app_settings" ON public.app_settings;
CREATE POLICY "Public profiles can read app_settings" ON public.app_settings FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "branches_select" ON public.branches;
CREATE POLICY "branches_select" ON public.branches FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "service_categories_public_select" ON public.service_categories;
CREATE POLICY "service_categories_public_select" ON public.service_categories FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "slug_redirects_anon_select" ON public.slug_redirects;
CREATE POLICY "slug_redirects_anon_select" ON public.slug_redirects FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "rst_unified_select" ON public.repair_status_types;
CREATE POLICY "rst_unified_select" ON public.repair_status_types FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "tenants_select" ON public.tenants;
CREATE POLICY "tenants_select" ON public.tenants FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Lectura publica de instructores" ON public.course_instructors;
CREATE POLICY "Lectura publica de instructores" ON public.course_instructors FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public View - Stock" ON public.product_stock_per_branch;
CREATE POLICY "Public View - Stock" ON public.product_stock_per_branch FOR SELECT TO anon, authenticated USING (true);

-- 6. Restore zarx wildcards (conditional)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'zarx') THEN
        DROP POLICY IF EXISTS "zarx_news_select" ON zarx.active_news;
        DROP POLICY IF EXISTS "zarx_news_admin_all" ON zarx.active_news;
        CREATE POLICY "zarx_news_all" ON zarx.active_news FOR ALL TO public USING (true) WITH CHECK (true);

        DROP POLICY IF EXISTS "zarx_tracking_scoped" ON zarx.active_tracking_sessions;
        CREATE POLICY "zarx_tracking_all" ON zarx.active_tracking_sessions FOR ALL TO public USING (true) WITH CHECK (true);

        DROP POLICY IF EXISTS "zarx_emergencies_scoped" ON zarx.emergencies;
        CREATE POLICY "zarx_emergencies_all" ON zarx.emergencies FOR ALL TO public USING (true) WITH CHECK (true);

        DROP POLICY IF EXISTS "zarx_notifications_scoped" ON zarx.notifications;
        CREATE POLICY "zarx_notifications_all" ON zarx.notifications FOR ALL TO public USING (true) WITH CHECK (true);

        DROP POLICY IF EXISTS "zarx_alerts_select" ON zarx.public_alerts;
        DROP POLICY IF EXISTS "zarx_alerts_admin_all" ON zarx.public_alerts;
        CREATE POLICY "zarx_public_alerts_all" ON zarx.public_alerts FOR ALL TO public USING (true) WITH CHECK (true);

        DROP POLICY IF EXISTS "zarx_reports_scoped" ON zarx.reports;
        CREATE POLICY "zarx_reports_all" ON zarx.reports FOR ALL TO public USING (true) WITH CHECK (true);

        DROP POLICY IF EXISTS "zarx_zones_select" ON zarx.zones;
        DROP POLICY IF EXISTS "zarx_zones_admin_all" ON zarx.zones;
        CREATE POLICY "zarx_zones_all" ON zarx.zones FOR ALL TO public USING (true) WITH CHECK (true);
    END IF;
END $$;

COMMIT;
