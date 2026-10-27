-- ==============================================================================
-- Migration: 20261016140000_admin_products_stock_orders_refactor.sql
-- Purpose:
-- 1. Create stock_history table for auditing inventory adjustments
-- 2. Expand orders.status check constraint with lifecycle statuses ('refunded', 'returned', 'delivered')
-- 3. Enhance RLS policies on order_items and stock_history for admin and staff
-- 4. Enhance handle_order_status_stock_transition to audit order stock changes
-- ==============================================================================

-- 1. Tabla de histórico de stock
CREATE TABLE IF NOT EXISTS public.stock_history (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    delta integer NOT NULL,
    previous_stock integer NOT NULL,
    new_stock integer NOT NULL,
    reason text NOT NULL, -- 'manual_adjustment', 'sale', 'cancellation', 'restock', 'return'
    order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
    branch_id uuid REFERENCES public.branches(id) ON DELETE SET NULL,
    tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
    created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT stock_history_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_stock_history_product_id ON public.stock_history(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_history_tenant_id ON public.stock_history(tenant_id);
CREATE INDEX IF NOT EXISTS idx_stock_history_created_at ON public.stock_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stock_history_order_id ON public.stock_history(order_id);

ALTER TABLE public.stock_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_history FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "stock_history_tenant_isolation" ON public.stock_history;
CREATE POLICY "stock_history_tenant_isolation" ON public.stock_history
    TO authenticated
    USING ((tenant_id = get_my_tenant()) OR (get_my_tenant() IS NULL))
    WITH CHECK ((tenant_id = get_my_tenant()) OR (get_my_tenant() IS NULL));

DROP POLICY IF EXISTS "stock_history_super_admin" ON public.stock_history;
CREATE POLICY "stock_history_super_admin" ON public.stock_history
    TO authenticated
    USING (get_user_role() = 'super_admin'::text)
    WITH CHECK (get_user_role() = 'super_admin'::text);

-- 2. Permitir nuevos estados válidos en orders
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_status_check CHECK (
    status = ANY (ARRAY[
        'cart'::text,
        'pending'::text,
        'pending_payment'::text,
        'awaiting_verification'::text,
        'paid'::text,
        'preparing'::text,
        'shipped'::text,
        'completed'::text,
        'delivered'::text,
        'cancelled'::text,
        'refunded'::text,
        'returned'::text
    ])
);

-- 3. Políticas RLS en order_items para admin y personal de la tienda
DROP POLICY IF EXISTS "staff_tenant_order_items" ON public.order_items;
CREATE POLICY "staff_tenant_order_items" ON public.order_items
    TO authenticated
    USING (
        (tenant_id = get_my_tenant() OR get_my_tenant() IS NULL) AND
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid()
            AND p.role = ANY (ARRAY['admin'::text, 'staff'::text, 'super_admin'::text, 'tenant_owner'::text, 'technician'::text])
        )
    )
    WITH CHECK (
        (tenant_id = get_my_tenant() OR get_my_tenant() IS NULL) AND
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid()
            AND p.role = ANY (ARRAY['admin'::text, 'staff'::text, 'super_admin'::text, 'tenant_owner'::text, 'technician'::text])
        )
    );

-- 4. Trigger con trazabilidad histórica automática en transiciones de órdenes
CREATE OR REPLACE FUNCTION handle_order_status_stock_transition()
RETURNS trigger AS $$
DECLARE
    r RECORD;
    v_prev_stock INTEGER;
    v_new_stock INTEGER;
BEGIN
    -- Transición desde 'cart' hacia estado activo (pending, paid, etc.) -> Descontar stock y registrar en histórico
    IF (OLD.status = 'cart' AND NEW.status != 'cart' AND NEW.status != 'cancelled') THEN
        FOR r IN SELECT product_id, quantity FROM public.order_items WHERE order_id = NEW.id LOOP
            IF r.product_id IS NOT NULL THEN
                SELECT COALESCE(stock, 0) INTO v_prev_stock FROM public.products WHERE id = r.product_id;
                v_new_stock := GREATEST(v_prev_stock - r.quantity, 0);

                UPDATE public.products
                SET stock = v_new_stock,
                    updated_at = NOW()
                WHERE id = r.product_id;

                INSERT INTO public.stock_history (
                    product_id, delta, previous_stock, new_stock, reason, order_id, branch_id, tenant_id, created_at
                ) VALUES (
                    r.product_id, -r.quantity, v_prev_stock, v_new_stock, 'sale', NEW.id, NEW.branch_id, NEW.tenant_id, NOW()
                );
            END IF;
        END LOOP;
    END IF;

    -- Transición a 'cancelled' o 'refunded' desde un estado activo -> Reponer stock y registrar en histórico
    IF (OLD.status != 'cart' AND OLD.status != 'cancelled' AND (NEW.status = 'cancelled' OR NEW.status = 'refunded')) THEN
        FOR r IN SELECT product_id, quantity FROM public.order_items WHERE order_id = NEW.id LOOP
            IF r.product_id IS NOT NULL THEN
                SELECT COALESCE(stock, 0) INTO v_prev_stock FROM public.products WHERE id = r.product_id;
                v_new_stock := v_prev_stock + r.quantity;

                UPDATE public.products
                SET stock = v_new_stock,
                    updated_at = NOW()
                WHERE id = r.product_id;

                INSERT INTO public.stock_history (
                    product_id, delta, previous_stock, new_stock, reason, order_id, branch_id, tenant_id, created_at
                ) VALUES (
                    r.product_id, r.quantity, v_prev_stock, v_new_stock,
                    CASE WHEN NEW.status = 'refunded' THEN 'return' ELSE 'cancellation' END,
                    NEW.id, NEW.branch_id, NEW.tenant_id, NOW()
                );
            END IF;
        END LOOP;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
