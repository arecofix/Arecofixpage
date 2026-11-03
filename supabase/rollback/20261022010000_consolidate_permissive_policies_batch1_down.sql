-- ==============================================================================
-- Migration: 20261022010000_consolidate_permissive_policies_batch1_down.sql
-- Description: Revert Batch 1 policy consolidation
-- ==============================================================================

BEGIN;

-- Restore super_admin_all_access on audit_logs
CREATE POLICY "super_admin_all_access" ON public.audit_logs FOR ALL TO authenticated USING (get_user_role() = 'super_admin'::text) WITH CHECK (get_user_role() = 'super_admin'::text);
CREATE POLICY "super_admin_all_access" ON public.auth_logs FOR ALL TO authenticated USING (get_user_role() = 'super_admin'::text) WITH CHECK (get_user_role() = 'super_admin'::text);
CREATE POLICY "super_admin_all_access" ON public.bank_reconciliations FOR ALL TO authenticated USING (get_user_role() = 'super_admin'::text) WITH CHECK (get_user_role() = 'super_admin'::text);
CREATE POLICY "super_admin_all_access" ON public.customer_devices FOR ALL TO authenticated USING (get_user_role() = 'super_admin'::text) WITH CHECK (get_user_role() = 'super_admin'::text);
CREATE POLICY "super_admin_all_access" ON public.invoices FOR ALL TO authenticated USING (get_user_role() = 'super_admin'::text) WITH CHECK (get_user_role() = 'super_admin'::text);
CREATE POLICY "super_admin_all_access" ON public.page_templates FOR ALL TO authenticated USING (get_user_role() = 'super_admin'::text) WITH CHECK (get_user_role() = 'super_admin'::text);
CREATE POLICY "super_admin_all_access" ON public.pages FOR ALL TO authenticated USING (get_user_role() = 'super_admin'::text) WITH CHECK (get_user_role() = 'super_admin'::text);
CREATE POLICY "super_admin_all_access" ON public.purchase_items FOR ALL TO authenticated USING (get_user_role() = 'super_admin'::text) WITH CHECK (get_user_role() = 'super_admin'::text);
CREATE POLICY "super_admin_all_access" ON public.repair_images FOR ALL TO authenticated USING (get_user_role() = 'super_admin'::text) WITH CHECK (get_user_role() = 'super_admin'::text);
CREATE POLICY "super_admin_all_access" ON public.repair_parts_used FOR ALL TO authenticated USING (get_user_role() = 'super_admin'::text) WITH CHECK (get_user_role() = 'super_admin'::text);
CREATE POLICY "super_admin_all_access" ON public.repair_status_history FOR ALL TO authenticated USING (get_user_role() = 'super_admin'::text) WITH CHECK (get_user_role() = 'super_admin'::text);
CREATE POLICY "stock_history_super_admin" ON public.stock_history FOR ALL TO authenticated USING (get_user_role() = 'super_admin'::text) WITH CHECK (get_user_role() = 'super_admin'::text);
CREATE POLICY "super_admin_all_access" ON public.technical_solutions FOR ALL TO authenticated USING (get_user_role() = 'super_admin'::text) WITH CHECK (get_user_role() = 'super_admin'::text);
CREATE POLICY "super_admin_all_access" ON public.blog_categories FOR ALL TO authenticated USING (get_user_role() = 'super_admin'::text) WITH CHECK (get_user_role() = 'super_admin'::text);
CREATE POLICY "super_admin_all_access" ON public.blog_post_tags FOR ALL TO authenticated USING (get_user_role() = 'super_admin'::text) WITH CHECK (get_user_role() = 'super_admin'::text);
CREATE POLICY "super_admin_all_access" ON public.blog_tags FOR ALL TO authenticated USING (get_user_role() = 'super_admin'::text) WITH CHECK (get_user_role() = 'super_admin'::text);
CREATE POLICY "super_admin_all_access" ON public.blog_posts FOR ALL TO authenticated USING (get_user_role() = 'super_admin'::text) WITH CHECK (get_user_role() = 'super_admin'::text);
CREATE POLICY "super_admin_all_access" ON public.models FOR ALL TO authenticated USING (get_user_role() = 'super_admin'::text) WITH CHECK (get_user_role() = 'super_admin'::text);
CREATE POLICY "super_admin_all_access" ON public.product_images FOR ALL TO authenticated USING (get_user_role() = 'super_admin'::text) WITH CHECK (get_user_role() = 'super_admin'::text);
CREATE POLICY "super_admin_all_access" ON public.product_reviews FOR ALL TO authenticated USING (get_user_role() = 'super_admin'::text) WITH CHECK (get_user_role() = 'super_admin'::text);

-- Restore brands and categories write admin policy
DROP POLICY IF EXISTS "brands_unified_insert_admin" ON public.brands;
DROP POLICY IF EXISTS "brands_unified_update_admin" ON public.brands;
DROP POLICY IF EXISTS "brands_unified_delete_admin" ON public.brands;
CREATE POLICY "brands_unified_write_admin" ON public.brands FOR ALL TO authenticated USING (is_admin() OR is_super_admin()) WITH CHECK (is_admin() OR is_super_admin());

DROP POLICY IF EXISTS "categories_unified_insert_admin" ON public.categories;
DROP POLICY IF EXISTS "categories_unified_update_admin" ON public.categories;
DROP POLICY IF EXISTS "categories_unified_delete_admin" ON public.categories;
CREATE POLICY "categories_unified_write_admin" ON public.categories FOR ALL TO authenticated USING (is_admin() OR is_super_admin()) WITH CHECK (is_admin() OR is_super_admin());

COMMIT;
