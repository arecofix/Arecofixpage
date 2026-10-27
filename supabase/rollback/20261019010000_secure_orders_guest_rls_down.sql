-- ==============================================================================
-- Migration Down: Revert Orders and Order Items Guest RLS to Permissive State
-- ==============================================================================

BEGIN;

DROP POLICY IF EXISTS "Anon can view guest orders" ON public.orders;
DROP POLICY IF EXISTS "Anon can insert guest orders" ON public.orders;
DROP POLICY IF EXISTS "Anon can update guest orders" ON public.orders;
DROP POLICY IF EXISTS "Anon can delete guest carts" ON public.orders;

CREATE POLICY "Anon can view guest orders"
    ON public.orders FOR SELECT
    TO anon
    USING (session_id IS NOT NULL AND user_id IS NULL);

CREATE POLICY "Anon can insert guest orders"
    ON public.orders FOR INSERT
    TO anon
    WITH CHECK (session_id IS NOT NULL AND user_id IS NULL);

CREATE POLICY "Anon can update guest orders"
    ON public.orders FOR UPDATE
    TO anon
    USING (session_id IS NOT NULL AND user_id IS NULL)
    WITH CHECK (session_id IS NOT NULL AND user_id IS NULL);

CREATE POLICY "Anon can delete guest carts"
    ON public.orders FOR DELETE
    TO anon
    USING (session_id IS NOT NULL AND user_id IS NULL AND status = 'cart');

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

DROP FUNCTION IF EXISTS public.get_request_guest_session();

COMMIT;
