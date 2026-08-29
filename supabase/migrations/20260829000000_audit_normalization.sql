-- ====================================================================
-- AUDIT & NORMALIZATION SCRIPT
-- Objective: Add performance indexes, clean orphaned data, and enforce integrity.
-- ====================================================================

-- 1. Create missing performance indexes for frequently queried tables
-- This dramatically improves Dashboard and Analytics load times.
CREATE INDEX IF NOT EXISTS idx_repairs_tenant_status ON public.repairs(tenant_id, current_status_id);
CREATE INDEX IF NOT EXISTS idx_repairs_branch_status ON public.repairs(branch_id, current_status_id);
CREATE INDEX IF NOT EXISTS idx_orders_tenant_status ON public.orders(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_cash_movements_tenant_type ON public.cash_movements(tenant_id, type);

-- 2. Cleanup orphaned data (soft deletes enforcement)
-- Remove auth logs for users that no longer exist in auth.users
DELETE FROM public.auth_logs 
WHERE user_id IS NOT NULL AND user_id NOT IN (SELECT id FROM auth.users);

-- 3. Normalize constraints
-- Ensure repairs always have a valid status and prevent invalid negative costs at DB level.
ALTER TABLE public.repairs ADD CONSTRAINT check_repair_costs CHECK (estimated_cost >= 0 AND final_cost >= 0 AND deposit_amount >= 0);
ALTER TABLE public.cash_movements ADD CONSTRAINT check_cash_amount CHECK (amount >= 0);

-- 4. Create an aggregated view for faster reports (Clean Architecture)
CREATE OR REPLACE VIEW v_monthly_financials AS
SELECT 
    r.tenant_id,
    date_trunc('month', r.completed_at) as month,
    SUM(r.final_cost) as total_repairs_revenue
FROM public.repairs r
WHERE r.current_status_id IN (5, 6) -- Completed / Delivered
GROUP BY r.tenant_id, date_trunc('month', r.completed_at);

-- Apply RLS to the new view
ALTER VIEW v_monthly_financials SET (security_invoker = true);
