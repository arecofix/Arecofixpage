-- ==============================================================================
-- Rollback Migration: 20261021080000_optimize_rls_initplan_down.sql
-- Description: Revert scalar subquery optimizations in RLS policies
-- ==============================================================================

BEGIN;

-- 1. Profiles
DROP POLICY IF EXISTS "profiles_read_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_tenant_isolation_restrictive" ON public.profiles;

CREATE POLICY "profiles_read_own" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_tenant_isolation_restrictive" ON public.profiles AS RESTRICTIVE FOR ALL TO authenticated USING (id = auth.uid() OR tenant_id = public.get_auth_user_tenant() OR public.is_super_admin());

-- 2. Orders
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can delete their own carts" ON public.orders;
DROP POLICY IF EXISTS "Staff can insert orders for their tenant" ON public.orders;

CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert their own orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own orders" ON public.orders FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own carts" ON public.orders FOR DELETE TO authenticated USING (user_id = auth.uid() AND status = 'cart');
CREATE POLICY "Staff can insert orders for their tenant" ON public.orders FOR INSERT TO authenticated WITH CHECK (tenant_id = public.get_auth_user_tenant() AND (public.is_admin() OR public.is_super_admin()));

-- 3. Order items
DROP POLICY IF EXISTS "Users can manage their own order items" ON public.order_items;
CREATE POLICY "Users can manage their own order items" ON public.order_items FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_items.order_id AND o.user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;
CREATE POLICY "Users can view their own payments" ON public.payments 
    FOR SELECT TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = payments.order_id AND o.user_id = auth.uid()));

COMMIT;
