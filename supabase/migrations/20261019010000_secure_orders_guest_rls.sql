-- ==============================================================================
-- Migration: Secure Orders and Order Items Guest RLS with x-guest-session
-- Description:
--   Binds anonymous guest orders access (SELECT, INSERT, UPDATE, DELETE) to the
--   canonical 'x-guest-session' HTTP header transmitted by the client.
--   Prevents anonymous cart leakage and cross-session cart manipulation.
-- ==============================================================================

BEGIN;

-- Helper function to extract and sanitize x-guest-session header
CREATE OR REPLACE FUNCTION public.get_request_guest_session()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT NULLIF(TRIM(current_setting('request.headers', true)::json->>'x-guest-session'), '');
$$;

-- -----------------------------------------------------------------------------
-- 1. SECURE POLICIES ON ORDERS FOR ANON
-- -----------------------------------------------------------------------------

DROP POLICY IF EXISTS "Anon can view guest orders" ON public.orders;
DROP POLICY IF EXISTS "Anon can insert guest orders" ON public.orders;
DROP POLICY IF EXISTS "Anon can update guest orders" ON public.orders;
DROP POLICY IF EXISTS "Anon can delete guest carts" ON public.orders;

-- SELECT: Only see the cart belonging to the active guest session
CREATE POLICY "Anon can view guest orders"
    ON public.orders FOR SELECT
    TO anon
    USING (
        session_id IS NOT NULL 
        AND user_id IS NULL 
        AND session_id = public.get_request_guest_session()
    );

-- INSERT: Can only insert orders with their own active session_id
CREATE POLICY "Anon can insert guest orders"
    ON public.orders FOR INSERT
    TO anon
    WITH CHECK (
        session_id IS NOT NULL 
        AND user_id IS NULL 
        AND session_id = public.get_request_guest_session()
    );

-- UPDATE: Can only update cart belonging to their active session_id
CREATE POLICY "Anon can update guest orders"
    ON public.orders FOR UPDATE
    TO anon
    USING (
        session_id IS NOT NULL 
        AND user_id IS NULL 
        AND session_id = public.get_request_guest_session()
    )
    WITH CHECK (
        session_id IS NOT NULL 
        AND user_id IS NULL 
        AND session_id = public.get_request_guest_session()
    );

-- DELETE: Can only delete cart belonging to their active session_id
CREATE POLICY "Anon can delete guest carts"
    ON public.orders FOR DELETE
    TO anon
    USING (
        session_id IS NOT NULL 
        AND user_id IS NULL 
        AND status = 'cart'
        AND session_id = public.get_request_guest_session()
    );

-- -----------------------------------------------------------------------------
-- 2. SECURE POLICIES ON ORDER_ITEMS FOR ANON
-- -----------------------------------------------------------------------------

DROP POLICY IF EXISTS "Anon can manage guest order items" ON public.order_items;

CREATE POLICY "Anon can manage guest order items"
    ON public.order_items FOR ALL
    TO anon
    USING (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = order_items.order_id
              AND o.session_id IS NOT NULL
              AND o.user_id IS NULL
              AND o.session_id = public.get_request_guest_session()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = order_items.order_id
              AND o.session_id IS NOT NULL
              AND o.user_id IS NULL
              AND o.session_id = public.get_request_guest_session()
        )
    );

COMMIT;
