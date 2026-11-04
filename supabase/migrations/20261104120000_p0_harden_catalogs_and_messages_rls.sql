-- ==============================================================================
-- MIGRATION: 20261104120000_p0_harden_catalogs_and_messages_rls.sql
-- DESCRIPTION: P0 Multi-Tenant Isolation - Eliminate anon leaks and strictly scope is_admin() policies by tenant_id
-- TABLES: brands, categories, services, courses, contact_messages
-- ==============================================================================

BEGIN;

-- ══════════════════════════════════════════════════════════════════════════════
-- 1. BRANDS: Eliminar anon y aislar por tenant_id
-- ══════════════════════════════════════════════════════════════════════════════
DROP POLICY IF EXISTS "brands_unified_select_anon" ON public.brands;
DROP POLICY IF EXISTS "brands_unified_select_auth" ON public.brands;
DROP POLICY IF EXISTS "brands_unified_insert_admin" ON public.brands;
DROP POLICY IF EXISTS "brands_unified_update_admin" ON public.brands;
DROP POLICY IF EXISTS "brands_unified_delete_admin" ON public.brands;

CREATE POLICY "brands_tenant_select"
ON public.brands
FOR SELECT
TO authenticated
USING (
    (tenant_id = get_current_tenant_id() AND deleted_at IS NULL)
    OR (tenant_id = get_current_tenant_id() AND (is_admin() OR is_super_admin()))
    OR is_super_admin()
);

CREATE POLICY "brands_tenant_insert"
ON public.brands
FOR INSERT
TO authenticated
WITH CHECK (
    (tenant_id = get_current_tenant_id() AND (is_admin() OR is_super_admin()))
    OR is_super_admin()
);

CREATE POLICY "brands_tenant_update"
ON public.brands
FOR UPDATE
TO authenticated
USING (
    (tenant_id = get_current_tenant_id() AND (is_admin() OR is_super_admin()))
    OR is_super_admin()
)
WITH CHECK (
    (tenant_id = get_current_tenant_id() AND (is_admin() OR is_super_admin()))
    OR is_super_admin()
);

CREATE POLICY "brands_tenant_delete"
ON public.brands
FOR DELETE
TO authenticated
USING (
    (tenant_id = get_current_tenant_id() AND (is_admin() OR is_super_admin()))
    OR is_super_admin()
);

-- ══════════════════════════════════════════════════════════════════════════════
-- 2. CATEGORIES: Eliminar anon y aislar por tenant_id
-- ══════════════════════════════════════════════════════════════════════════════
DROP POLICY IF EXISTS "categories_unified_select_anon" ON public.categories;
DROP POLICY IF EXISTS "categories_unified_select_auth" ON public.categories;
DROP POLICY IF EXISTS "categories_unified_insert_admin" ON public.categories;
DROP POLICY IF EXISTS "categories_unified_update_admin" ON public.categories;
DROP POLICY IF EXISTS "categories_unified_delete_admin" ON public.categories;

CREATE POLICY "categories_tenant_select"
ON public.categories
FOR SELECT
TO authenticated
USING (
    (tenant_id = get_current_tenant_id() AND deleted_at IS NULL)
    OR (tenant_id = get_current_tenant_id() AND (is_admin() OR is_super_admin()))
    OR is_super_admin()
);

CREATE POLICY "categories_tenant_insert"
ON public.categories
FOR INSERT
TO authenticated
WITH CHECK (
    (tenant_id = get_current_tenant_id() AND (is_admin() OR is_super_admin()))
    OR is_super_admin()
);

CREATE POLICY "categories_tenant_update"
ON public.categories
FOR UPDATE
TO authenticated
USING (
    (tenant_id = get_current_tenant_id() AND (is_admin() OR is_super_admin()))
    OR is_super_admin()
)
WITH CHECK (
    (tenant_id = get_current_tenant_id() AND (is_admin() OR is_super_admin()))
    OR is_super_admin()
);

CREATE POLICY "categories_tenant_delete"
ON public.categories
FOR DELETE
TO authenticated
USING (
    (tenant_id = get_current_tenant_id() AND (is_admin() OR is_super_admin()))
    OR is_super_admin()
);

-- ══════════════════════════════════════════════════════════════════════════════
-- 3. CONTACT_MESSAGES: Aislar lectura, edición y borrado por tenant_id
-- ══════════════════════════════════════════════════════════════════════════════
DROP POLICY IF EXISTS "contact_messages_select_admin" ON public.contact_messages;
DROP POLICY IF EXISTS "contact_messages_update_admin" ON public.contact_messages;
DROP POLICY IF EXISTS "contact_messages_delete_admin" ON public.contact_messages;

CREATE POLICY "contact_messages_tenant_select"
ON public.contact_messages
FOR SELECT
TO authenticated
USING (
    (tenant_id = get_current_tenant_id() AND (is_admin() OR is_super_admin()))
    OR is_super_admin()
);

CREATE POLICY "contact_messages_tenant_update"
ON public.contact_messages
FOR UPDATE
TO authenticated
USING (
    (tenant_id = get_current_tenant_id() AND (is_admin() OR is_super_admin()))
    OR is_super_admin()
)
WITH CHECK (
    (tenant_id = get_current_tenant_id() AND (is_admin() OR is_super_admin()))
    OR is_super_admin()
);

CREATE POLICY "contact_messages_tenant_delete"
ON public.contact_messages
FOR DELETE
TO authenticated
USING (
    (tenant_id = get_current_tenant_id() AND (is_admin() OR is_super_admin()))
    OR is_super_admin()
);

-- ══════════════════════════════════════════════════════════════════════════════
-- 4. COURSES: Eliminar anon y aislar por tenant_id
-- ══════════════════════════════════════════════════════════════════════════════
DROP POLICY IF EXISTS "courses_unified_select_anon" ON public.courses;
DROP POLICY IF EXISTS "courses_unified_select_auth" ON public.courses;
DROP POLICY IF EXISTS "courses_unified_insert_admin" ON public.courses;
DROP POLICY IF EXISTS "courses_unified_update_admin" ON public.courses;
DROP POLICY IF EXISTS "courses_unified_delete_admin" ON public.courses;

CREATE POLICY "courses_tenant_select"
ON public.courses
FOR SELECT
TO authenticated
USING (
    (tenant_id = get_current_tenant_id() AND is_active = true)
    OR (instructor_id = auth.uid())
    OR (tenant_id = get_current_tenant_id() AND (is_admin() OR is_super_admin()))
    OR is_super_admin()
);

CREATE POLICY "courses_tenant_insert"
ON public.courses
FOR INSERT
TO authenticated
WITH CHECK (
    (tenant_id = get_current_tenant_id() AND (is_admin() OR is_super_admin()))
    OR is_super_admin()
);

CREATE POLICY "courses_tenant_update"
ON public.courses
FOR UPDATE
TO authenticated
USING (
    (tenant_id = get_current_tenant_id() AND (is_admin() OR is_super_admin()))
    OR is_super_admin()
)
WITH CHECK (
    (tenant_id = get_current_tenant_id() AND (is_admin() OR is_super_admin()))
    OR is_super_admin()
);

CREATE POLICY "courses_tenant_delete"
ON public.courses
FOR DELETE
TO authenticated
USING (
    (tenant_id = get_current_tenant_id() AND (is_admin() OR is_super_admin()))
    OR is_super_admin()
);

-- ══════════════════════════════════════════════════════════════════════════════
-- 5. SERVICES: Eliminar anon y aislar por tenant_id
-- ══════════════════════════════════════════════════════════════════════════════
DROP POLICY IF EXISTS "services_unified_select_anon" ON public.services;
DROP POLICY IF EXISTS "services_unified_select_auth" ON public.services;
DROP POLICY IF EXISTS "services_unified_insert_admin" ON public.services;
DROP POLICY IF EXISTS "services_unified_update_admin" ON public.services;
DROP POLICY IF EXISTS "services_unified_delete_admin" ON public.services;

CREATE POLICY "services_tenant_select"
ON public.services
FOR SELECT
TO authenticated
USING (
    (tenant_id = get_current_tenant_id() AND deleted_at IS NULL AND is_published = true)
    OR (tenant_id = get_current_tenant_id() AND (is_admin() OR is_super_admin()))
    OR is_super_admin()
);

CREATE POLICY "services_tenant_insert"
ON public.services
FOR INSERT
TO authenticated
WITH CHECK (
    (tenant_id = get_current_tenant_id() AND (is_admin() OR is_super_admin()))
    OR is_super_admin()
);

CREATE POLICY "services_tenant_update"
ON public.services
FOR UPDATE
TO authenticated
USING (
    (tenant_id = get_current_tenant_id() AND (is_admin() OR is_super_admin()))
    OR is_super_admin()
)
WITH CHECK (
    (tenant_id = get_current_tenant_id() AND (is_admin() OR is_super_admin()))
    OR is_super_admin()
);

CREATE POLICY "services_tenant_delete"
ON public.services
FOR DELETE
TO authenticated
USING (
    (tenant_id = get_current_tenant_id() AND (is_admin() OR is_super_admin()))
    OR is_super_admin()
);

NOTIFY pgrst, 'reload schema';

COMMIT;
