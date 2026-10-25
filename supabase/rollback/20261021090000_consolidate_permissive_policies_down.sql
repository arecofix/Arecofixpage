-- ==============================================================================
-- Rollback Migration: 20261021090000_consolidate_permissive_policies_down.sql
-- Description: Revert consolidated policies back to individual policies
-- ==============================================================================

BEGIN;

-- Revert categories
DROP POLICY IF EXISTS "categories_unified_select_anon" ON public.categories;
DROP POLICY IF EXISTS "categories_unified_select_auth" ON public.categories;
DROP POLICY IF EXISTS "categories_unified_write_admin" ON public.categories;
DROP POLICY IF EXISTS "Public View - Categories" ON public.categories;
DROP POLICY IF EXISTS "Authenticated View - Categories" ON public.categories;
DROP POLICY IF EXISTS "super_admin_all_access" ON public.categories;

CREATE POLICY "Public View - Categories" ON public.categories FOR SELECT TO anon USING (deleted_at IS NULL);
CREATE POLICY "Authenticated View - Categories" ON public.categories FOR SELECT TO authenticated USING (deleted_at IS NULL);
CREATE POLICY "super_admin_all_access" ON public.categories FOR ALL TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

-- Revert brands
DROP POLICY IF EXISTS "brands_unified_select_anon" ON public.brands;
DROP POLICY IF EXISTS "brands_unified_select_auth" ON public.brands;
DROP POLICY IF EXISTS "brands_unified_write_admin" ON public.brands;
DROP POLICY IF EXISTS "Public View - Brands" ON public.brands;
DROP POLICY IF EXISTS "Authenticated View - Brands" ON public.brands;
DROP POLICY IF EXISTS "super_admin_all_access" ON public.brands;

CREATE POLICY "Public View - Brands" ON public.brands FOR SELECT TO anon USING (deleted_at IS NULL);
CREATE POLICY "Authenticated View - Brands" ON public.brands FOR SELECT TO authenticated USING (deleted_at IS NULL);
CREATE POLICY "super_admin_all_access" ON public.brands FOR ALL TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

-- Revert services
DROP POLICY IF EXISTS "services_unified_select_anon" ON public.services;
DROP POLICY IF EXISTS "services_unified_select_auth" ON public.services;
DROP POLICY IF EXISTS "services_unified_write_admin" ON public.services;
DROP POLICY IF EXISTS "service_features_unified_select" ON public.service_features;
DROP POLICY IF EXISTS "service_features_unified_write" ON public.service_features;
DROP POLICY IF EXISTS "service_blocks_unified_select" ON public.service_blocks;
DROP POLICY IF EXISTS "service_blocks_unified_write" ON public.service_blocks;
DROP POLICY IF EXISTS "services_anon_select" ON public.services;
DROP POLICY IF EXISTS "services_admin_crud" ON public.services;

CREATE POLICY "services_anon_select" ON public.services FOR SELECT TO anon, authenticated USING (deleted_at IS NULL AND is_published = true);
CREATE POLICY "services_admin_crud" ON public.services FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Revert courses
DROP POLICY IF EXISTS "courses_unified_select_anon" ON public.courses;
DROP POLICY IF EXISTS "courses_unified_select_auth" ON public.courses;
DROP POLICY IF EXISTS "courses_unified_write_admin" ON public.courses;
DROP POLICY IF EXISTS "Public View - Courses" ON public.courses;
DROP POLICY IF EXISTS "crs_select" ON public.courses;
DROP POLICY IF EXISTS "Authors can manage their courses" ON public.courses;

CREATE POLICY "Public View - Courses" ON public.courses FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "crs_select" ON public.courses FOR SELECT TO public USING (true);
CREATE POLICY "Authors can manage their courses" ON public.courses FOR ALL TO authenticated USING (instructor_id = auth.uid()) WITH CHECK (instructor_id = auth.uid());

COMMIT;
