-- ==============================================================================
-- Migration: Fix Cart and Checkout RLS, Stock Triggers & Multi-tenant Policies
-- Description:
--   1. Permissive SELECT, INSERT, UPDATE, DELETE policies on orders for:
--      - Authenticated users (own orders: user_id = auth.uid())
--      - Anonymous visitors (guest cart: session_id IS NOT NULL)
--   2. Permissive policies on order_items for:
--      - Authenticated users (matching user's orders)
--      - Anonymous visitors (matching guest orders)
--   3. SECURITY DEFINER on update_order_total() trigger function
--   4. SECURITY DEFINER on sync_order_items_stock() + ignore 'cart' status
--   5. Trigger on orders to deduct stock when order transitions from 'cart' to active
-- ==============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- 1. POLICIES ON ORDERS
-- -----------------------------------------------------------------------------

-- Drop existing overlapping policies to ensure clean state
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON public.orders;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Anon can view guest orders" ON public.orders;
DROP POLICY IF EXISTS "Anon can insert guest orders" ON public.orders;
DROP POLICY IF EXISTS "Anon can update guest orders" ON public.orders;
DROP POLICY IF EXISTS "Users can delete their own carts" ON public.orders;
DROP POLICY IF EXISTS "Anon can delete guest carts" ON public.orders;

-- SELECT
CREATE POLICY "Users can view their own orders"
    ON public.orders FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Anon can view guest orders"
    ON public.orders FOR SELECT
    TO anon
    USING (session_id IS NOT NULL AND user_id IS NULL);

-- INSERT
CREATE POLICY "Users can insert their own orders"
    ON public.orders FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anon can insert guest orders"
    ON public.orders FOR INSERT
    TO anon
    WITH CHECK (session_id IS NOT NULL AND user_id IS NULL);

-- UPDATE
CREATE POLICY "Users can update their own orders"
    ON public.orders FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anon can update guest orders"
    ON public.orders FOR UPDATE
    TO anon
    USING (session_id IS NOT NULL AND user_id IS NULL)
    WITH CHECK (session_id IS NOT NULL AND user_id IS NULL);

-- DELETE (Allow emptying / removing cart orders)
CREATE POLICY "Users can delete their own carts"
    ON public.orders FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id AND status = 'cart');

CREATE POLICY "Anon can delete guest carts"
    ON public.orders FOR DELETE
    TO anon
    USING (session_id IS NOT NULL AND user_id IS NULL AND status = 'cart');


-- -----------------------------------------------------------------------------
-- 2. POLICIES ON ORDER_ITEMS
-- -----------------------------------------------------------------------------

DROP POLICY IF EXISTS "Users can manage their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Anon can manage guest order items" ON public.order_items;
DROP POLICY IF EXISTS "Seguridad heredada para Order Items" ON public.order_items;

-- Authenticated can manage items of their own orders
CREATE POLICY "Users can manage their own order items"
    ON public.order_items FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = order_items.order_id
              AND o.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = order_items.order_id
              AND o.user_id = auth.uid()
        )
    );

-- Anon can manage items of guest orders (with session_id)
CREATE POLICY "Anon can manage guest order items"
    ON public.order_items FOR ALL
    TO anon
    USING (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = order_items.order_id
              AND o.session_id IS NOT NULL
              AND o.user_id IS NULL
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = order_items.order_id
              AND o.session_id IS NOT NULL
              AND o.user_id IS NULL
        )
    );


-- -----------------------------------------------------------------------------
-- 3. TRIGGER FUNCTION: update_order_total (SECURITY DEFINER)
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.update_order_total()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.orders
    SET 
        subtotal = (SELECT COALESCE(SUM(subtotal), 0) FROM public.order_items WHERE order_id = COALESCE(NEW.order_id, OLD.order_id)),
        total_amount = (SELECT COALESCE(SUM(subtotal), 0) FROM public.order_items WHERE order_id = COALESCE(NEW.order_id, OLD.order_id)),
        total = (SELECT COALESCE(SUM(subtotal), 0) FROM public.order_items WHERE order_id = COALESCE(NEW.order_id, OLD.order_id))
    WHERE id = COALESCE(NEW.order_id, OLD.order_id);
    RETURN NEW;
END;
$$;


-- -----------------------------------------------------------------------------
-- 4. TRIGGER FUNCTION: sync_order_items_stock (SECURITY DEFINER + 'cart' check)
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.sync_order_items_stock()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_order_status text;
BEGIN
    -- Determine parent order status
    SELECT status INTO v_order_status 
    FROM public.orders 
    WHERE id = COALESCE(NEW.order_id, OLD.order_id);

    -- If order is still in draft cart state, DO NOT alter product stock yet
    IF v_order_status = 'cart' THEN
        RETURN COALESCE(NEW, OLD);
    END IF;

    -- CASO INSERT: Producto comprado en orden activa/confirmada -> descontar stock
    IF (TG_OP = 'INSERT') THEN
        IF NEW.product_id IS NOT NULL THEN
            UPDATE public.products 
            SET stock = GREATEST(COALESCE(stock, 0) - NEW.quantity, 0),
                updated_at = NOW()
            WHERE id = NEW.product_id;
        END IF;
        RETURN NEW;
    END IF;

    -- CASO DELETE: Ítem eliminado de orden activa -> devolver stock
    IF (TG_OP = 'DELETE') THEN
        IF OLD.product_id IS NOT NULL THEN
            UPDATE public.products 
            SET stock = COALESCE(stock, 0) + OLD.quantity,
                updated_at = NOW()
            WHERE id = OLD.product_id;
        END IF;
        RETURN OLD;
    END IF;

    -- CASO UPDATE: Cambio de cantidad o producto en orden activa
    IF (TG_OP = 'UPDATE') THEN
        IF (OLD.product_id != NEW.product_id) THEN
            IF OLD.product_id IS NOT NULL THEN
                UPDATE public.products 
                SET stock = COALESCE(stock, 0) + OLD.quantity 
                WHERE id = OLD.product_id;
            END IF;
            IF NEW.product_id IS NOT NULL THEN
                UPDATE public.products 
                SET stock = GREATEST(COALESCE(stock, 0) - NEW.quantity, 0) 
                WHERE id = NEW.product_id;
            END IF;
        ELSE
            IF NEW.product_id IS NOT NULL THEN
                UPDATE public.products 
                SET stock = GREATEST(COALESCE(stock, 0) - (NEW.quantity - OLD.quantity), 0),
                    updated_at = NOW()
                WHERE id = NEW.product_id;
            END IF;
        END IF;
        RETURN NEW;
    END IF;

    RETURN NULL;
END;
$$;


-- -----------------------------------------------------------------------------
-- 5. TRIGGER ON ORDERS: Deduct stock when status transitions from 'cart' to confirmed
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_order_status_stock_transition()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    r RECORD;
BEGIN
    -- Transition FROM 'cart' TO confirmed/active status -> deduct stock for all items
    IF (OLD.status = 'cart' AND NEW.status != 'cart' AND NEW.status != 'cancelled') THEN
        FOR r IN SELECT product_id, quantity FROM public.order_items WHERE order_id = NEW.id LOOP
            IF r.product_id IS NOT NULL THEN
                UPDATE public.products
                SET stock = GREATEST(COALESCE(stock, 0) - r.quantity, 0),
                    updated_at = NOW()
                WHERE id = r.product_id;
            END IF;
        END LOOP;
    END IF;

    -- Transition to 'cancelled' from an active status -> restore stock
    IF (OLD.status != 'cart' AND OLD.status != 'cancelled' AND NEW.status = 'cancelled') THEN
        FOR r IN SELECT product_id, quantity FROM public.order_items WHERE order_id = NEW.id LOOP
            IF r.product_id IS NOT NULL THEN
                UPDATE public.products
                SET stock = COALESCE(stock, 0) + r.quantity,
                    updated_at = NOW()
                WHERE id = r.product_id;
            END IF;
        END LOOP;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_order_status_stock ON public.orders;
CREATE TRIGGER trg_order_status_stock
    AFTER UPDATE OF status ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_order_status_stock_transition();


-- -----------------------------------------------------------------------------
-- 6. SECURITY DEFINER ON enforce_retail_price_for_guests
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.enforce_retail_price_for_guests()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_uid uuid;
    prod public.products;
    calculated_retail_price numeric;
BEGIN
    current_uid := auth.uid();
    
    -- If guest (not logged in)
    IF current_uid IS NULL THEN
        -- Fetch the product
        SELECT * INTO prod FROM public.products WHERE id = NEW.product_id;
        
        IF FOUND THEN
            calculated_retail_price := public.retail_price(prod);
            NEW.unit_price := calculated_retail_price;
            NEW.subtotal := calculated_retail_price * NEW.quantity;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;

COMMIT;
