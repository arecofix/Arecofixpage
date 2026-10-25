-- ==============================================================================
-- Migration: 20261021090000_consolidate_permissive_policies.sql
-- Description: Consolidate multiple redundant permissive policies into unified policies
-- Severity: PERFORMANCE (P2)
-- Category: multiple_permissive_policies
-- Target Tables:
--   - public.categories
--   - public.brands
--   - public.services
--   - public.service_features
--   - public.service_blocks
--   - public.courses
-- ==============================================================================

BEGIN;

-- ------------------------------------------------------------------------------
-- 1. public.categories
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Authenticated View - Categories" ON public.categories;
DROP POLICY IF EXISTS "Branch Staff Isolation" ON public.categories;
DROP POLICY IF EXISTS "Filter_Soft_Deleted_Categories" ON public.categories;
DROP POLICY IF EXISTS "Public View - Categories" ON public.categories;
DROP POLICY IF EXISTS "SuperAdmin Bypass All" ON public.categories;
DROP POLICY IF EXISTS "SuperAdmin Bypass All - Categories" ON public.categories;
DROP POLICY IF EXISTS "Tenant Isolation - Categories" ON public.categories;
DROP POLICY IF EXISTS "Tenant Owner Isolation" ON public.categories;
DROP POLICY IF EXISTS "super_admin_all_access" ON public.categories;
DROP POLICY IF EXISTS "categories_unified_select_anon" ON public.categories;
DROP POLICY IF EXISTS "categories_unified_select_auth" ON public.categories;
DROP POLICY IF EXISTS "categories_unified_write_admin" ON public.categories;

CREATE POLICY "categories_unified_select_anon" ON public.categories
    FOR SELECT TO anon
    USING (deleted_at IS NULL AND tenant_id IS NOT NULL);

CREATE POLICY "categories_unified_select_auth" ON public.categories
    FOR SELECT TO authenticated
    USING (deleted_at IS NULL OR public.is_admin() OR public.is_super_admin());

CREATE POLICY "categories_unified_write_admin" ON public.categories
    FOR ALL TO authenticated
    USING (public.is_admin() OR public.is_super_admin())
    WITH CHECK (public.is_admin() OR public.is_super_admin());

-- ------------------------------------------------------------------------------
-- 2. public.brands
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Authenticated View - Brands" ON public.brands;
DROP POLICY IF EXISTS "Branch Staff Isolation" ON public.brands;
DROP POLICY IF EXISTS "Filter_Soft_Deleted_Brands" ON public.brands;
DROP POLICY IF EXISTS "Public View - Brands" ON public.brands;
DROP POLICY IF EXISTS "SuperAdmin Bypass All" ON public.brands;
DROP POLICY IF EXISTS "Tenant Owner Isolation" ON public.brands;
DROP POLICY IF EXISTS "super_admin_all_access" ON public.brands;
DROP POLICY IF EXISTS "brands_unified_select_anon" ON public.brands;
DROP POLICY IF EXISTS "brands_unified_select_auth" ON public.brands;
DROP POLICY IF EXISTS "brands_unified_write_admin" ON public.brands;

CREATE POLICY "brands_unified_select_anon" ON public.brands
    FOR SELECT TO anon
    USING (deleted_at IS NULL AND tenant_id IS NOT NULL);

CREATE POLICY "brands_unified_select_auth" ON public.brands
    FOR SELECT TO authenticated
    USING (deleted_at IS NULL OR public.is_admin() OR public.is_super_admin());

CREATE POLICY "brands_unified_write_admin" ON public.brands
    FOR ALL TO authenticated
    USING (public.is_admin() OR public.is_super_admin())
    WITH CHECK (public.is_admin() OR public.is_super_admin());

-- ------------------------------------------------------------------------------
-- 3. public.services & features & blocks
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Branch Staff Isolation" ON public.services;
DROP POLICY IF EXISTS "SuperAdmin Bypass All" ON public.services;
DROP POLICY IF EXISTS "Tenant Owner Isolation" ON public.services;
DROP POLICY IF EXISTS "services_admin_crud" ON public.services;
DROP POLICY IF EXISTS "services_anon_select" ON public.services;
DROP POLICY IF EXISTS "super_admin_all_access" ON public.services;
DROP POLICY IF EXISTS "services_unified_select_anon" ON public.services;
DROP POLICY IF EXISTS "services_unified_select_auth" ON public.services;
DROP POLICY IF EXISTS "services_unified_write_admin" ON public.services;

CREATE POLICY "services_unified_select_anon" ON public.services
    FOR SELECT TO anon
    USING (deleted_at IS NULL AND is_published = true);

CREATE POLICY "services_unified_select_auth" ON public.services
    FOR SELECT TO authenticated
    USING (deleted_at IS NULL OR public.is_admin() OR public.is_super_admin());

CREATE POLICY "services_unified_write_admin" ON public.services
    FOR ALL TO authenticated
    USING (public.is_admin() OR public.is_super_admin())
    WITH CHECK (public.is_admin() OR public.is_super_admin());

-- service_features
DROP POLICY IF EXISTS "service_features_anon_select" ON public.service_features;
DROP POLICY IF EXISTS "service_features_admin_crud" ON public.service_features;
DROP POLICY IF EXISTS "service_features_unified_select" ON public.service_features;
DROP POLICY IF EXISTS "service_features_unified_write" ON public.service_features;

CREATE POLICY "service_features_unified_select" ON public.service_features
    FOR SELECT TO anon, authenticated
    USING (tenant_id IS NOT NULL);

CREATE POLICY "service_features_unified_write" ON public.service_features
    FOR ALL TO authenticated
    USING (public.is_admin() OR public.is_super_admin())
    WITH CHECK (public.is_admin() OR public.is_super_admin());

-- service_blocks
DROP POLICY IF EXISTS "service_blocks_anon_select" ON public.service_blocks;
DROP POLICY IF EXISTS "service_blocks_admin_crud" ON public.service_blocks;
DROP POLICY IF EXISTS "service_blocks_unified_select" ON public.service_blocks;
DROP POLICY IF EXISTS "service_blocks_unified_write" ON public.service_blocks;

CREATE POLICY "service_blocks_unified_select" ON public.service_blocks
    FOR SELECT TO anon, authenticated
    USING (tenant_id IS NOT NULL);

CREATE POLICY "service_blocks_unified_write" ON public.service_blocks
    FOR ALL TO authenticated
    USING (public.is_admin() OR public.is_super_admin())
    WITH CHECK (public.is_admin() OR public.is_super_admin());

-- ------------------------------------------------------------------------------
-- 4. public.courses
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admins_All_Courses" ON public.courses;
DROP POLICY IF EXISTS "Public View - Courses" ON public.courses;
DROP POLICY IF EXISTS "courses_select_policy" ON public.courses;
DROP POLICY IF EXISTS "crs_delete" ON public.courses;
DROP POLICY IF EXISTS "crs_insert" ON public.courses;
DROP POLICY IF EXISTS "crs_select" ON public.courses;
DROP POLICY IF EXISTS "crs_update" ON public.courses;
DROP POLICY IF EXISTS "super_admin_all_access" ON public.courses;
DROP POLICY IF EXISTS "courses_unified_select_anon" ON public.courses;
DROP POLICY IF EXISTS "courses_unified_select_auth" ON public.courses;
DROP POLICY IF EXISTS "courses_unified_write_admin" ON public.courses;

CREATE POLICY "courses_unified_select_anon" ON public.courses
    FOR SELECT TO anon
    USING (is_active = true);

CREATE POLICY "courses_unified_select_auth" ON public.courses
    FOR SELECT TO authenticated
    USING (is_active = true OR instructor_id = (SELECT auth.uid()) OR public.is_admin() OR public.is_super_admin());

CREATE POLICY "courses_unified_write_admin" ON public.courses
    FOR ALL TO authenticated
    USING (instructor_id = (SELECT auth.uid()) OR public.is_admin() OR public.is_super_admin())
    WITH CHECK (instructor_id = (SELECT auth.uid()) OR public.is_admin() OR public.is_super_admin());

COMMIT;
