-- ==============================================================================
-- Migration: 20261018020000_systemic_tenant_isolation_all_modules.sql
-- Description: Systemic Tenant Isolation across ALL Modules
--              (E-commerce, Repairs, Cash, Products, Academy, Roles)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Functions Update: Eliminate Insecure Hardcoded Fallbacks
-- ------------------------------------------------------------------------------

-- 1.1 Secure save_repair_order
CREATE OR REPLACE FUNCTION public.save_repair_order(p_payload jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
    new_record record;
    v_tenant_id uuid;
    v_branch_id uuid;
BEGIN
    -- Extract branch_id if present
    v_branch_id := NULLIF((p_payload->>'branch_id'), '')::uuid;

    -- Strict tenant resolution without hardcoded fallback
    v_tenant_id := COALESCE(
        public.get_current_tenant_id(),
        (SELECT tenant_id FROM public.branches WHERE id = v_branch_id LIMIT 1),
        NULLIF(p_payload->>'tenant_id', '')::uuid
    );

    IF v_tenant_id IS NULL OR v_tenant_id = '00000000-0000-0000-0000-000000000000'::uuid THEN
        RAISE EXCEPTION 'Aislamiento crítico: No se puede guardar una orden de reparación sin un tenant_id válido.';
    END IF;

    -- Non-superadmin cannot inject repairs into other tenants
    IF NOT public.is_super_admin() AND public.get_current_tenant_id() IS NOT NULL THEN
        IF v_tenant_id != public.get_current_tenant_id() THEN
            RAISE EXCEPTION 'Aislamiento crítico: No tiene permisos para guardar reparaciones en otra sucursal.';
        END IF;
    END IF;

    INSERT INTO public.repairs (
        id, tenant_id, branch_id, client_id, device_id, issue_description,
        current_status_id, estimated_cost, final_cost, deposit_amount, 
        technical_labor_cost, spare_part_cost, technical_report, technician_notes,
        security_pin, security_pattern, checklist, glass_upsell, whatsapp_notifications,
        assigned_technician_id, received_by, created_at, updated_at
    )
    SELECT 
        COALESCE((p_payload->>'id')::uuid, gen_random_uuid()),
        v_tenant_id,
        v_branch_id,
        NULLIF((p_payload->>'client_id'), '')::uuid,
        NULLIF((p_payload->>'device_id'), '')::uuid,
        p_payload->>'issue_description',
        COALESCE((p_payload->>'current_status_id')::bigint, 1),
        COALESCE((p_payload->>'estimated_cost')::numeric, 0),
        COALESCE((p_payload->>'final_cost')::numeric, 0),
        COALESCE((p_payload->>'deposit_amount')::numeric, 0),
        COALESCE((p_payload->>'technical_labor_cost')::numeric, 0),
        COALESCE((p_payload->>'spare_part_cost')::numeric, 0),
        p_payload->>'technical_report',
        COALESCE(p_payload->>'technician_notes', p_payload->>'notes'),
        p_payload->>'security_pin',
        p_payload->>'security_pattern',
        COALESCE((p_payload->>'checklist')::jsonb, '{}'::jsonb),
        COALESCE((p_payload->>'glass_upsell')::boolean, false),
        COALESCE((p_payload->>'whatsapp_notifications')::boolean, true),
        NULLIF((p_payload->>'assigned_technician_id'), '')::uuid,
        NULLIF((p_payload->>'received_by'), '')::uuid,
        COALESCE((p_payload->>'created_at')::timestamp with time zone, now()),
        now()
    RETURNING * INTO new_record;
    
    RETURN row_to_json(new_record)::jsonb;
END;
$function$;

-- 1.2 Secure is_admin_of_tenant (remove target_tenant_id IS NULL leak)
CREATE OR REPLACE FUNCTION public.is_admin_of_tenant(p_tenant_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND (
        role = 'super_admin'
        OR (role IN ('admin', 'tenant_owner') AND tenant_id = p_tenant_id AND p_tenant_id IS NOT NULL)
      )
  );
$$;

-- 1.3 Secure get_admin_business_dashboard_metrics (enforce tenant isolation)
CREATE OR REPLACE FUNCTION public.get_admin_business_dashboard_metrics(
    p_tenant_id uuid DEFAULT NULL::uuid,
    p_range text DEFAULT 'month'::text,
    p_start_date timestamp with time zone DEFAULT NULL::timestamp with time zone,
    p_end_date timestamp with time zone DEFAULT NULL::timestamp with time zone,
    p_branch_id uuid DEFAULT NULL::uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
    v_tenant_id uuid;
    v_start_date timestamptz;
    v_end_date timestamptz;
    v_income_total numeric := 0;
    v_expense_total numeric := 0;
    v_net_cashflow numeric := 0;
    v_ecommerce_paid_count bigint := 0;
    v_ecommerce_paid_revenue numeric := 0;
    v_active_repairs_count bigint := 0;
    v_delayed_repairs_count bigint := 0;
    v_active_subscriptions_count bigint := 0;
    v_academy_revenue numeric := 0;
    v_critical_stock_count bigint := 0;
    v_critical_stock_items jsonb := '[]'::jsonb;
    v_overdue_pickup_repairs jsonb := '[]'::jsonb;
    v_expiring_grace_subscriptions jsonb := '[]'::jsonb;
    v_trend_6_months jsonb := '[]'::jsonb;
    v_repairs_revenue numeric := 0;
    v_revenue_by_origin jsonb;
BEGIN
    -- 1. Enforce Tenant Isolation for non-superadmin
    IF NOT public.is_super_admin() THEN
        v_tenant_id := public.get_current_tenant_id();
    ELSE
        v_tenant_id := COALESCE(p_tenant_id, public.get_current_tenant_id());
    END IF;

    -- If no tenant could be resolved and not superadmin, abort cleanly
    IF v_tenant_id IS NULL AND NOT public.is_super_admin() THEN
        RETURN jsonb_build_object(
            'error', 'Tenant context required'
        );
    END IF;

    -- 2. Date Boundaries
    IF p_start_date IS NOT NULL AND p_end_date IS NOT NULL THEN
        v_start_date := p_start_date;
        v_end_date := p_end_date;
    ELSE
        CASE p_range
            WHEN 'today' THEN
                v_start_date := date_trunc('day', now());
                v_end_date := now();
            WHEN 'week' THEN
                v_start_date := date_trunc('week', now());
                v_end_date := now();
            WHEN 'quarter' THEN
                v_start_date := date_trunc('quarter', now());
                v_end_date := now();
            WHEN 'year' THEN
                v_start_date := date_trunc('year', now());
                v_end_date := now();
            ELSE -- 'month'
                v_start_date := date_trunc('month', now());
                v_end_date := now();
        END CASE;
    END IF;

    -- 3. Incomes & Expenses (Cash Movements)
    SELECT
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0)
    INTO v_income_total, v_expense_total
    FROM public.cash_movements
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
      AND (p_branch_id IS NULL OR branch_id = p_branch_id)
      AND created_at >= v_start_date
      AND created_at <= v_end_date;

    v_net_cashflow := v_income_total - v_expense_total;

    -- 4. E-commerce Sales
    SELECT
        COUNT(*),
        COALESCE(SUM(total_amount), 0)
    INTO v_ecommerce_paid_count, v_ecommerce_paid_revenue
    FROM public.orders
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
      AND (p_branch_id IS NULL OR branch_id = p_branch_id)
      AND status IN ('paid', 'completed', 'delivered')
      AND created_at >= v_start_date
      AND created_at <= v_end_date;

    -- 5. Active and Delayed Repairs
    SELECT
        COUNT(*),
        COALESCE(SUM(CASE WHEN estimated_completion_date IS NOT NULL AND estimated_completion_date < now() THEN 1 ELSE 0 END), 0)
    INTO v_active_repairs_count, v_delayed_repairs_count
    FROM public.repairs
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
      AND (p_branch_id IS NULL OR branch_id = p_branch_id)
      AND current_status_id NOT IN (5, 6);

    -- Repairs Revenue (completed within range)
    SELECT COALESCE(SUM(COALESCE(final_cost, estimated_cost, 0)), 0)
    INTO v_repairs_revenue
    FROM public.repairs
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
      AND (p_branch_id IS NULL OR branch_id = p_branch_id)
      AND current_status_id IN (5, 6)
      AND updated_at >= v_start_date
      AND updated_at <= v_end_date;

    -- 6. Academy Subscriptions & Revenue
    SELECT COUNT(*)
    INTO v_active_subscriptions_count
    FROM public.academy_subscriptions
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
      AND status = 'active';

    SELECT COALESCE(SUM(amount), 0)
    INTO v_academy_revenue
    FROM public.academy_payments
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
      AND status = 'approved'
      AND created_at >= v_start_date
      AND created_at <= v_end_date;

    -- 7. Operational Alerts
    -- Critical stock
    SELECT COALESCE(jsonb_agg(item), '[]'::jsonb)
    INTO v_critical_stock_items
    FROM (
        SELECT p.id, p.name, p.sku, p.stock, p.min_stock_alert, p.price
        FROM public.products p
        WHERE (v_tenant_id IS NULL OR p.tenant_id = v_tenant_id)
          AND p.deleted_at IS NULL
          AND p.is_active = true
          AND p.stock <= COALESCE(p.min_stock_alert, 3)
        ORDER BY p.stock ASC
        LIMIT 10
    ) item;

    v_critical_stock_count := jsonb_array_length(v_critical_stock_items);

    -- Overdue pickup repairs
    SELECT COALESCE(jsonb_agg(rep), '[]'::jsonb)
    INTO v_overdue_pickup_repairs
    FROM (
        SELECT r.id, r.repair_number, r.customer_name, r.device_model, r.completed_at,
               ROUND(EXTRACT(EPOCH FROM (now() - r.completed_at)) / 86400) AS days_waiting
        FROM public.repairs r
        WHERE (v_tenant_id IS NULL OR r.tenant_id = v_tenant_id)
          AND (p_branch_id IS NULL OR r.branch_id = p_branch_id)
          AND r.current_status_id = 5
          AND r.completed_at < (now() - interval '7 days')
        ORDER BY r.completed_at ASC
        LIMIT 10
    ) rep;

    -- Expiring subscriptions in grace period
    SELECT COALESCE(jsonb_agg(sub), '[]'::jsonb)
    INTO v_expiring_grace_subscriptions
    FROM (
        SELECT s.id, s.user_id, p.email AS student_email, p.first_name, p.last_name,
               s.status, s.grace_period_until
        FROM public.academy_subscriptions s
        LEFT JOIN public.profiles p ON p.id = s.user_id
        WHERE (v_tenant_id IS NULL OR s.tenant_id = v_tenant_id)
          AND s.status = 'grace_period'
          AND s.grace_period_until <= (now() + interval '3 days')
        ORDER BY s.grace_period_until ASC
        LIMIT 10
    ) sub;

    -- 8. 6-Month Trend Data
    SELECT COALESCE(jsonb_agg(trend ORDER BY trend->>'month' ASC), '[]'::jsonb)
    INTO v_trend_6_months
    FROM (
        SELECT
            to_char(date_trunc('month', d), 'YYYY-MM') AS month,
            COALESCE((
                SELECT SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END)
                FROM public.cash_movements
                WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
                  AND (p_branch_id IS NULL OR branch_id = p_branch_id)
                  AND date_trunc('month', created_at) = date_trunc('month', d)
            ), 0) AS income,
            COALESCE((
                SELECT SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END)
                FROM public.cash_movements
                WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
                  AND (p_branch_id IS NULL OR branch_id = p_branch_id)
                  AND date_trunc('month', created_at) = date_trunc('month', d)
            ), 0) AS expense
        FROM generate_series(
            date_trunc('month', now() - interval '5 months'),
            date_trunc('month', now()),
            interval '1 month'
        ) d
    ) trend;

    -- 9. Revenue by Origin
    v_revenue_by_origin := jsonb_build_object(
        'ecommerce', v_ecommerce_paid_revenue,
        'repairs', v_repairs_revenue,
        'academy', v_academy_revenue
    );

    RETURN jsonb_build_object(
        'metrics', jsonb_build_object(
            'total_income', v_income_total,
            'total_expense', v_expense_total,
            'net_cashflow', v_net_cashflow,
            'ecommerce_paid_count', v_ecommerce_paid_count,
            'ecommerce_paid_revenue', v_ecommerce_paid_revenue,
            'active_repairs_count', v_active_repairs_count,
            'delayed_repairs_count', v_delayed_repairs_count,
            'active_subscriptions_count', v_active_subscriptions_count,
            'academy_revenue', v_academy_revenue
        ),
        'revenue_by_origin', v_revenue_by_origin,
        'alerts', jsonb_build_object(
            'critical_stock_count', v_critical_stock_count,
            'critical_stock_items', v_critical_stock_items,
            'overdue_pickup_repairs', v_overdue_pickup_repairs,
            'expiring_grace_subscriptions', v_expiring_grace_subscriptions
        ),
        'trend', v_trend_6_months
    );
END;
$function$;

-- 1.4 Secure get_dashboard_stats_v2
CREATE OR REPLACE FUNCTION public.get_dashboard_stats_v2(p_branch_id uuid DEFAULT NULL::uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
    result json;
    v_tenant_id uuid;
    v_central_branch_id uuid;
BEGIN
    v_tenant_id := public.get_current_tenant_id();

    IF v_tenant_id IS NULL AND NOT public.is_super_admin() THEN
        RETURN '{}'::json;
    END IF;

    SELECT id INTO v_central_branch_id
    FROM public.branches
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
      AND is_active = true
    ORDER BY (slug IN ('arecofix', 'principal', 'central', 'main')) DESC, id ASC
    LIMIT 1;

    SELECT json_build_object(
        'users', (SELECT count(*) FROM public.profiles WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)),
        'products', (SELECT count(*) FROM public.products WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id) AND deleted_at IS NULL),
        'sales', (SELECT count(*) FROM public.orders
                  WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
                    AND status IN ('paid', 'shipped', 'completed', 'delivered')
                    AND (
                        p_branch_id IS NULL
                        OR branch_id = p_branch_id
                        OR (branch_id IS NULL AND p_branch_id = v_central_branch_id)
                    )),
        'devices_fixed', (SELECT count(*) FROM public.repairs
                          WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
                            AND current_status_id IN (5, 6)
                            AND (
                                p_branch_id IS NULL
                                OR branch_id = p_branch_id
                                OR (branch_id IS NULL AND p_branch_id = v_central_branch_id)
                            )),
        'active_repairs', (SELECT count(*) FROM public.repairs
                           WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
                             AND current_status_id NOT IN (5, 6)
                             AND (
                                 p_branch_id IS NULL
                                 OR branch_id = p_branch_id
                                 OR (branch_id IS NULL AND p_branch_id = v_central_branch_id)
                             ))
    ) INTO result;

    RETURN result;
END;
$function$;

-- ------------------------------------------------------------------------------
-- 2. Fix Views: Enable security_invoker on vw_cashflow_real
-- ------------------------------------------------------------------------------

ALTER VIEW public.vw_cashflow_real SET (security_invoker = true);

-- ------------------------------------------------------------------------------
-- 3. Schema Completeness: Add tenant_id & Backfill on post_comments
-- ------------------------------------------------------------------------------

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'post_comments' AND column_name = 'tenant_id'
    ) THEN
        ALTER TABLE public.post_comments ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Backfill post_comments.tenant_id from blog_posts
UPDATE public.post_comments pc
SET tenant_id = bp.tenant_id
FROM public.blog_posts bp
WHERE pc.post_id = bp.id AND pc.tenant_id IS NULL;

-- ------------------------------------------------------------------------------
-- 4. FORCE ROW LEVEL SECURITY Across ALL Tables with tenant_id
-- ------------------------------------------------------------------------------

ALTER TABLE public.academy_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy_payments FORCE ROW LEVEL SECURITY;

ALTER TABLE public.academy_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy_plans FORCE ROW LEVEL SECURITY;

ALTER TABLE public.academy_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy_subscriptions FORCE ROW LEVEL SECURITY;

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs FORCE ROW LEVEL SECURITY;

ALTER TABLE public.bank_reconciliations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_reconciliations FORCE ROW LEVEL SECURITY;

ALTER TABLE public.cash_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cash_movements FORCE ROW LEVEL SECURITY;

ALTER TABLE public.course_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_certificates FORCE ROW LEVEL SECURITY;

ALTER TABLE public.course_exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_exam_questions FORCE ROW LEVEL SECURITY;

ALTER TABLE public.course_exam_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_exam_submissions FORCE ROW LEVEL SECURITY;

ALTER TABLE public.course_instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_instructors FORCE ROW LEVEL SECURITY;

ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons FORCE ROW LEVEL SECURITY;

ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_progress FORCE ROW LEVEL SECURITY;

ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base FORCE ROW LEVEL SECURITY;

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments FORCE ROW LEVEL SECURITY;

ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews FORCE ROW LEVEL SECURITY;

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants FORCE ROW LEVEL SECURITY;

ALTER TABLE public.repair_number_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repair_number_sequences FORCE ROW LEVEL SECURITY;

ALTER TABLE public.technical_solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technical_solutions FORCE ROW LEVEL SECURITY;

ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments FORCE ROW LEVEL SECURITY;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles FORCE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 5. Correct Vulnerable Policies (Eliminate "OR get_my_tenant() IS NULL")
-- ------------------------------------------------------------------------------

-- 5.1 Products
DROP POLICY IF EXISTS "Products_Tenant_Isolation" ON public.products;
CREATE POLICY "Products_Tenant_Isolation"
ON public.products
FOR ALL
TO authenticated
USING (tenant_id = public.get_current_tenant_id() OR public.is_super_admin())
WITH CHECK (tenant_id = public.get_current_tenant_id() OR public.is_super_admin());

-- 5.2 Product Variants
DROP POLICY IF EXISTS "Variants_Tenant_Isolation" ON public.product_variants;
CREATE POLICY "Variants_Tenant_Isolation"
ON public.product_variants
FOR ALL
TO authenticated
USING (tenant_id = public.get_current_tenant_id() OR public.is_super_admin())
WITH CHECK (tenant_id = public.get_current_tenant_id() OR public.is_super_admin());

-- 5.3 Product Stock Per Branch
DROP POLICY IF EXISTS "Stock_Tenant_Isolation" ON public.product_stock_per_branch;
CREATE POLICY "Stock_Tenant_Isolation"
ON public.product_stock_per_branch
FOR ALL
TO authenticated
USING (tenant_id = public.get_current_tenant_id() OR public.is_super_admin())
WITH CHECK (tenant_id = public.get_current_tenant_id() OR public.is_super_admin());

-- 5.4 Order Items
DROP POLICY IF EXISTS "staff_tenant_order_items" ON public.order_items;
CREATE POLICY "staff_tenant_order_items"
ON public.order_items
FOR ALL
TO authenticated
USING (tenant_id = public.get_current_tenant_id() OR public.is_super_admin())
WITH CHECK (tenant_id = public.get_current_tenant_id() OR public.is_super_admin());

-- 5.5 Stock History
DROP POLICY IF EXISTS "stock_history_tenant_isolation" ON public.stock_history;
CREATE POLICY "stock_history_tenant_isolation"
ON public.stock_history
FOR ALL
TO authenticated
USING (tenant_id = public.get_current_tenant_id() OR public.is_super_admin())
WITH CHECK (tenant_id = public.get_current_tenant_id() OR public.is_super_admin());

-- 5.6 Course Modules
DROP POLICY IF EXISTS "modules_select" ON public.course_modules;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON public.course_modules;
DROP POLICY IF EXISTS "modules_tenant_isolation" ON public.course_modules;
CREATE POLICY "modules_tenant_isolation"
ON public.course_modules
FOR ALL
TO authenticated
USING (tenant_id = public.get_current_tenant_id() OR public.is_super_admin())
WITH CHECK (tenant_id = public.get_current_tenant_id() OR public.is_super_admin());

-- 5.7 Cash Movements
DROP POLICY IF EXISTS "cash_master_isolation" ON public.cash_movements;
DROP POLICY IF EXISTS "cash_movements_tenant_isolation" ON public.cash_movements;
CREATE POLICY "cash_movements_tenant_isolation"
ON public.cash_movements
FOR ALL
TO authenticated
USING (tenant_id = public.get_current_tenant_id() OR public.is_super_admin())
WITH CHECK (tenant_id = public.get_current_tenant_id() OR public.is_super_admin());

-- 5.8 Repairs
DROP POLICY IF EXISTS "Force_My_Tenant_On_Insert_Repairs" ON public.repairs;
DROP POLICY IF EXISTS "repairs_tenant_isolation_restrictive" ON public.repairs;
DROP POLICY IF EXISTS "repairs_tenant_isolation_all" ON public.repairs;
CREATE POLICY "repairs_tenant_isolation_all"
ON public.repairs
FOR ALL
TO authenticated
USING (tenant_id = public.get_current_tenant_id() OR public.is_super_admin())
WITH CHECK (tenant_id = public.get_current_tenant_id() OR public.is_super_admin());

-- 5.9 Invoices
DROP POLICY IF EXISTS "invoices_master_isolation" ON public.invoices;
DROP POLICY IF EXISTS "invoices_tenant_isolation_all" ON public.invoices;
CREATE POLICY "invoices_tenant_isolation_all"
ON public.invoices
FOR ALL
TO authenticated
USING (tenant_id = public.get_current_tenant_id() OR public.is_super_admin())
WITH CHECK (tenant_id = public.get_current_tenant_id() OR public.is_super_admin());

-- 5.10 Orders (Secure Inserts)
DROP POLICY IF EXISTS "Anon can insert guest orders" ON public.orders;
CREATE POLICY "Anon can insert guest orders"
ON public.orders
FOR INSERT
TO anon
WITH CHECK (
    session_id IS NOT NULL 
    AND user_id IS NULL 
    AND tenant_id IS NOT NULL 
    AND EXISTS (SELECT 1 FROM public.tenants t WHERE t.id = orders.tenant_id AND t.is_active = true)
);

DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
CREATE POLICY "Users can insert their own orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (
    ((auth.uid() = user_id) OR (user_id IS NULL))
    AND (tenant_id = public.get_current_tenant_id() OR public.is_super_admin())
);

-- 5.11 User Roles
DROP POLICY IF EXISTS "user_roles_tenant_isolation" ON public.user_roles;
CREATE POLICY "user_roles_tenant_isolation"
ON public.user_roles
FOR ALL
TO authenticated
USING (
    public.is_super_admin() 
    OR tenant_id = public.get_current_tenant_id()
    OR user_id = auth.uid()
)
WITH CHECK (
    public.is_super_admin()
    OR (
        tenant_id = public.get_current_tenant_id()
        AND public.get_auth_user_role() IN ('admin', 'tenant_owner')
    )
);

-- 5.12 Post Comments
DROP POLICY IF EXISTS "post_comments_tenant_isolation" ON public.post_comments;
DROP POLICY IF EXISTS "Insertar comentarios" ON public.post_comments;
DROP POLICY IF EXISTS "Ver comentarios aprobados" ON public.post_comments;
DROP POLICY IF EXISTS "post_comments_select_policy" ON public.post_comments;
DROP POLICY IF EXISTS "post_comments_insert_policy" ON public.post_comments;
DROP POLICY IF EXISTS "post_comments_admin_manage_policy" ON public.post_comments;

CREATE POLICY "post_comments_select_policy"
ON public.post_comments
FOR SELECT
TO public
USING (
    (status = 'approved' AND EXISTS (SELECT 1 FROM public.tenants t WHERE t.id = post_comments.tenant_id AND t.is_active = true))
    OR tenant_id = public.get_current_tenant_id()
    OR public.is_super_admin()
);

CREATE POLICY "post_comments_insert_policy"
ON public.post_comments
FOR INSERT
TO public
WITH CHECK (
    tenant_id IS NOT NULL
    AND EXISTS (SELECT 1 FROM public.tenants t WHERE t.id = post_comments.tenant_id AND t.is_active = true)
);

CREATE POLICY "post_comments_admin_manage_policy"
ON public.post_comments
FOR ALL
TO authenticated
USING (
    public.is_super_admin()
    OR (
        tenant_id = public.get_current_tenant_id()
        AND public.get_auth_user_role() IN ('admin', 'tenant_owner')
    )
)
WITH CHECK (
    public.is_super_admin()
    OR (
        tenant_id = public.get_current_tenant_id()
        AND public.get_auth_user_role() IN ('admin', 'tenant_owner')
    )
);

-- ------------------------------------------------------------------------------
-- 5.13 Security update for has_permission & repairs permissions
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.has_permission(p_permission text, p_branch_id uuid DEFAULT NULL::uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.role_permissions rp ON ur.role_id = rp.role_id
    WHERE ur.user_id = auth.uid()
      AND (ur.tenant_id = public.get_current_tenant_id() OR public.is_super_admin())
      AND (ur.branch_id = p_branch_id OR ur.branch_id IS NULL OR p_branch_id IS NULL)
      AND rp.permission = p_permission
  );
$$;

DROP POLICY IF EXISTS "repairs_read_permission" ON public.repairs;
CREATE POLICY "repairs_read_permission"
ON public.repairs
FOR SELECT
TO authenticated
USING (
  (tenant_id = public.get_current_tenant_id() OR public.is_super_admin())
  AND (
    has_permission('repairs:read:branch', branch_id) 
    OR has_permission('repairs:read:global', NULL) 
    OR public.is_super_admin()
  )
);

DROP POLICY IF EXISTS "repairs_insert_permission" ON public.repairs;
CREATE POLICY "repairs_insert_permission"
ON public.repairs
FOR INSERT
TO authenticated
WITH CHECK (
  (tenant_id = public.get_current_tenant_id() OR public.is_super_admin())
  AND (
    has_permission('repairs:create:branch', branch_id) 
    OR has_permission('repairs:create:global', NULL) 
    OR public.is_super_admin()
  )
);

DROP POLICY IF EXISTS "repairs_update_permission" ON public.repairs;
CREATE POLICY "repairs_update_permission"
ON public.repairs
FOR UPDATE
TO authenticated
USING (
  (tenant_id = public.get_current_tenant_id() OR public.is_super_admin())
  AND (
    has_permission('repairs:edit:branch', branch_id) 
    OR has_permission('repairs:edit:global', NULL) 
    OR public.is_super_admin()
  )
)
WITH CHECK (
  (tenant_id = public.get_current_tenant_id() OR public.is_super_admin())
  AND (
    has_permission('repairs:edit:branch', branch_id) 
    OR has_permission('repairs:edit:global', NULL) 
    OR public.is_super_admin()
  )
);

