-- ==============================================================================
-- Migration: 20261022010000_consolidate_permissive_policies_batch1.sql
-- Description: Consolidate multiple permissive policies on standard multi-tenant & catalog tables (R1 Batch 1)
-- Severity: PERFORMANCE (P2)
-- Category: multiple_permissive_policies
-- ==============================================================================

BEGIN;

-- ------------------------------------------------------------------------------
-- 1. Redundant super_admin_all_access on tables with tenant_isolation
-- ------------------------------------------------------------------------------

-- audit_logs
DROP POLICY IF EXISTS "Deny all client access on audit_logs" ON public.audit_logs;
DROP POLICY IF EXISTS "super_admin_all_access" ON public.audit_logs;

-- auth_logs
DROP POLICY IF EXISTS "super_admin_all_access" ON public.auth_logs;

-- bank_reconciliations
DROP POLICY IF EXISTS "super_admin_all_access" ON public.bank_reconciliations;

-- customer_devices
DROP POLICY IF EXISTS "super_admin_all_access" ON public.customer_devices;

-- invoices
DROP POLICY IF EXISTS "super_admin_all_access" ON public.invoices;

-- page_templates
DROP POLICY IF EXISTS "super_admin_all_access" ON public.page_templates;

-- pages
DROP POLICY IF EXISTS "super_admin_all_access" ON public.pages;

-- purchase_items
DROP POLICY IF EXISTS "super_admin_all_access" ON public.purchase_items;

-- repair_images
DROP POLICY IF EXISTS "super_admin_all_access" ON public.repair_images;

-- repair_number_sequences
DROP POLICY IF EXISTS "super_admin_all_access" ON public.repair_number_sequences;
DROP POLICY IF EXISTS "repair_number_sequences_admin_all" ON public.repair_number_sequences;

-- repair_parts_used
DROP POLICY IF EXISTS "super_admin_all_access" ON public.repair_parts_used;

-- repair_status_history
DROP POLICY IF EXISTS "super_admin_all_access" ON public.repair_status_history;

-- stock_history
DROP POLICY IF EXISTS "stock_history_super_admin" ON public.stock_history;

-- technical_solutions
DROP POLICY IF EXISTS "super_admin_all_access" ON public.technical_solutions;

-- blog_categories
DROP POLICY IF EXISTS "super_admin_all_access" ON public.blog_categories;

-- blog_post_tags
DROP POLICY IF EXISTS "super_admin_all_access" ON public.blog_post_tags;

-- blog_tags
DROP POLICY IF EXISTS "super_admin_all_access" ON public.blog_tags;

-- ------------------------------------------------------------------------------
-- 2. Consolidate purchases, cash_movements, suppliers
-- ------------------------------------------------------------------------------

-- purchases
DROP POLICY IF EXISTS "Branch Staff Isolation" ON public.purchases;
DROP POLICY IF EXISTS "SuperAdmin Bypass All" ON public.purchases;
DROP POLICY IF EXISTS "Tenant Owner Isolation" ON public.purchases;
DROP POLICY IF EXISTS "super_admin_all_access" ON public.purchases;
DROP POLICY IF EXISTS "purchases_tenant_isolation" ON public.purchases;
DROP POLICY IF EXISTS "purchases_unified_isolation" ON public.purchases;

CREATE POLICY "purchases_unified_isolation" ON public.purchases
FOR ALL TO authenticated
USING (
    public.is_super_admin()
    OR (get_auth_user_role() = 'super_admin'::text)
    OR (branch_id = get_my_branch())
    OR ((get_auth_user_role() = 'tenant_owner'::text) AND (tenant_id = get_auth_user_tenant()))
    OR (tenant_id = public.get_current_tenant_id())
)
WITH CHECK (
    public.is_super_admin()
    OR (get_auth_user_role() = 'super_admin'::text)
    OR (branch_id = get_my_branch())
    OR ((get_auth_user_role() = 'tenant_owner'::text) AND (tenant_id = get_auth_user_tenant()))
    OR (tenant_id = public.get_current_tenant_id())
);

-- cash_movements
DROP POLICY IF EXISTS "Branch Staff Isolation" ON public.cash_movements;
DROP POLICY IF EXISTS "SuperAdmin Bypass All" ON public.cash_movements;
DROP POLICY IF EXISTS "Tenant Owner Isolation" ON public.cash_movements;
DROP POLICY IF EXISTS "cash_movements_tenant_isolation" ON public.cash_movements;
DROP POLICY IF EXISTS "super_admin_all_access" ON public.cash_movements;
DROP POLICY IF EXISTS "cash_movements_unified_isolation" ON public.cash_movements;

CREATE POLICY "cash_movements_unified_isolation" ON public.cash_movements
FOR ALL TO authenticated
USING (
    public.is_super_admin()
    OR (get_auth_user_role() = 'super_admin'::text)
    OR ((get_auth_user_role() = ANY (ARRAY['admin'::text, 'staff'::text])) AND (branch_id = get_auth_user_branch()))
    OR ((get_auth_user_role() = 'tenant_owner'::text) AND (tenant_id = get_auth_user_tenant()))
    OR (tenant_id = public.get_current_tenant_id())
)
WITH CHECK (
    public.is_super_admin()
    OR (get_auth_user_role() = 'super_admin'::text)
    OR ((get_auth_user_role() = ANY (ARRAY['admin'::text, 'staff'::text])) AND (branch_id = get_auth_user_branch()))
    OR ((get_auth_user_role() = 'tenant_owner'::text) AND (tenant_id = get_auth_user_tenant()))
    OR (tenant_id = public.get_current_tenant_id())
);

-- suppliers
DROP POLICY IF EXISTS "Branch Staff Isolation" ON public.suppliers;
DROP POLICY IF EXISTS "SuperAdmin Bypass All" ON public.suppliers;
DROP POLICY IF EXISTS "Tenant Owner Isolation" ON public.suppliers;
DROP POLICY IF EXISTS "super_admin_all_access" ON public.suppliers;
DROP POLICY IF EXISTS "suppliers_tenant_isolation" ON public.suppliers;
DROP POLICY IF EXISTS "suppliers_unified_isolation" ON public.suppliers;

CREATE POLICY "suppliers_unified_isolation" ON public.suppliers
FOR ALL TO authenticated
USING (
    public.is_super_admin()
    OR (get_auth_user_role() = 'super_admin'::text)
    OR ((get_auth_user_role() = ANY (ARRAY['admin'::text, 'staff'::text, 'technician'::text])) AND (branch_id = get_auth_user_branch()))
    OR ((get_auth_user_role() = 'tenant_owner'::text) AND (tenant_id = get_auth_user_tenant()))
    OR (tenant_id = public.get_current_tenant_id())
)
WITH CHECK (
    public.is_super_admin()
    OR (get_auth_user_role() = 'super_admin'::text)
    OR ((get_auth_user_role() = ANY (ARRAY['admin'::text, 'staff'::text, 'technician'::text])) AND (branch_id = get_auth_user_branch()))
    OR ((get_auth_user_role() = 'tenant_owner'::text) AND (tenant_id = get_auth_user_tenant()))
    OR (tenant_id = public.get_current_tenant_id())
);

-- ------------------------------------------------------------------------------
-- 3. Catalog tables (drop redundant super_admin_all_access and scope SELECT)
-- ------------------------------------------------------------------------------

-- blog_posts
DROP POLICY IF EXISTS "super_admin_all_access" ON public.blog_posts;

-- models
DROP POLICY IF EXISTS "super_admin_all_access" ON public.models;

-- product_images
DROP POLICY IF EXISTS "super_admin_all_access" ON public.product_images;

-- product_reviews
DROP POLICY IF EXISTS "super_admin_all_access" ON public.product_reviews;

-- repair_status_types: change super_admin_all_access to write-only
DROP POLICY IF EXISTS "super_admin_all_access" ON public.repair_status_types;
CREATE POLICY "repair_status_types_write_admin" ON public.repair_status_types
FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());

CREATE POLICY "repair_status_types_update_admin" ON public.repair_status_types
FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

CREATE POLICY "repair_status_types_delete_admin" ON public.repair_status_types
FOR DELETE TO authenticated USING (public.is_super_admin());

-- brands: convert brands_unified_write_admin to INSERT, UPDATE, DELETE (not ALL)
DROP POLICY IF EXISTS "brands_unified_write_admin" ON public.brands;

CREATE POLICY "brands_unified_insert_admin" ON public.brands
FOR INSERT TO authenticated WITH CHECK (public.is_admin() OR public.is_super_admin());

CREATE POLICY "brands_unified_update_admin" ON public.brands
FOR UPDATE TO authenticated USING (public.is_admin() OR public.is_super_admin()) WITH CHECK (public.is_admin() OR public.is_super_admin());

CREATE POLICY "brands_unified_delete_admin" ON public.brands
FOR DELETE TO authenticated USING (public.is_admin() OR public.is_super_admin());

-- categories: convert categories_unified_write_admin to INSERT, UPDATE, DELETE (not ALL)
DROP POLICY IF EXISTS "categories_unified_write_admin" ON public.categories;

CREATE POLICY "categories_unified_insert_admin" ON public.categories
FOR INSERT TO authenticated WITH CHECK (public.is_admin() OR public.is_super_admin());

CREATE POLICY "categories_unified_update_admin" ON public.categories
FOR UPDATE TO authenticated USING (public.is_admin() OR public.is_super_admin()) WITH CHECK (public.is_admin() OR public.is_super_admin());

CREATE POLICY "categories_unified_delete_admin" ON public.categories
FOR DELETE TO authenticated USING (public.is_admin() OR public.is_super_admin());

COMMIT;
