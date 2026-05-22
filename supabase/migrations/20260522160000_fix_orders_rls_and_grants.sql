-- Fix orders and order_items RLS and helper function grants

-- ─── 1. Re-grant EXECUTE on helper functions to anon and authenticated ─────
GRANT EXECUTE ON FUNCTION public.get_my_tenant() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_branch() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_role() TO anon, authenticated;

-- ─── 2. Enable RLS on orders and order_items ──────────────────────────────────
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- ─── 3. Grant DML permissions to anon and authenticated ──────────────────────
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_items TO anon, authenticated;

-- ─── 4. RLS Policies for orders ─────────────────────────────────────────────
DROP POLICY IF EXISTS "Allow select orders" ON public.orders;
CREATE POLICY "Allow select orders" ON public.orders
  FOR SELECT
  TO anon, authenticated
  USING (
    (
      (auth.role() = 'authenticated' AND tenant_id = public.get_my_tenant())
      OR
      (auth.role() = 'anon' AND tenant_id IS NOT NULL)
    )
    AND (
      (auth.role() = 'anon' AND user_id IS NULL AND session_id IS NOT NULL)
      OR
      (auth.role() = 'authenticated' AND (user_id = auth.uid() OR user_id IS NULL))
    )
  );

DROP POLICY IF EXISTS "Allow insert orders" ON public.orders;
CREATE POLICY "Allow insert orders" ON public.orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    (
      (auth.role() = 'authenticated' AND tenant_id = public.get_my_tenant())
      OR
      (auth.role() = 'anon' AND tenant_id IS NOT NULL)
    )
    AND (
      (auth.role() = 'anon' AND user_id IS NULL AND session_id IS NOT NULL)
      OR
      (auth.role() = 'authenticated' AND user_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Allow update orders" ON public.orders;
CREATE POLICY "Allow update orders" ON public.orders
  FOR UPDATE
  TO anon, authenticated
  USING (
    (
      (auth.role() = 'authenticated' AND tenant_id = public.get_my_tenant())
      OR
      (auth.role() = 'anon' AND tenant_id IS NOT NULL)
    )
    AND (
      (auth.role() = 'anon' AND user_id IS NULL AND session_id IS NOT NULL)
      OR
      (auth.role() = 'authenticated' AND (user_id = auth.uid() OR (user_id IS NULL AND session_id IS NOT NULL)))
    )
  )
  WITH CHECK (
    (
      (auth.role() = 'authenticated' AND tenant_id = public.get_my_tenant())
      OR
      (auth.role() = 'anon' AND tenant_id IS NOT NULL)
    )
    AND (
      (auth.role() = 'anon' AND user_id IS NULL AND session_id IS NOT NULL)
      OR
      (auth.role() = 'authenticated' AND (user_id = auth.uid() OR (user_id IS NULL AND session_id IS NOT NULL)))
    )
  );

DROP POLICY IF EXISTS "Allow delete orders" ON public.orders;
CREATE POLICY "Allow delete orders" ON public.orders
  FOR DELETE
  TO anon, authenticated
  USING (
    (
      (auth.role() = 'authenticated' AND tenant_id = public.get_my_tenant())
      OR
      (auth.role() = 'anon' AND tenant_id IS NOT NULL)
    )
    AND (
      (auth.role() = 'anon' AND user_id IS NULL AND session_id IS NOT NULL)
      OR
      (auth.role() = 'authenticated' AND (user_id = auth.uid() OR (user_id IS NULL AND session_id IS NOT NULL)))
    )
  );

-- ─── 5. RLS Policies for order_items ──────────────────────────────────────────
DROP POLICY IF EXISTS "Allow select order_items" ON public.order_items;
CREATE POLICY "Allow select order_items" ON public.order_items
  FOR SELECT
  TO anon, authenticated
  USING (
    (
      (auth.role() = 'authenticated' AND tenant_id = public.get_my_tenant())
      OR
      (auth.role() = 'anon' AND tenant_id IS NOT NULL)
    )
    AND EXISTS (
      SELECT 1 FROM public.orders
      WHERE public.orders.id = order_items.order_id
        AND public.orders.tenant_id = order_items.tenant_id
    )
  );

DROP POLICY IF EXISTS "Allow insert order_items" ON public.order_items;
CREATE POLICY "Allow insert order_items" ON public.order_items
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    (
      (auth.role() = 'authenticated' AND tenant_id = public.get_my_tenant())
      OR
      (auth.role() = 'anon' AND tenant_id IS NOT NULL)
    )
    AND EXISTS (
      SELECT 1 FROM public.orders
      WHERE public.orders.id = order_items.order_id
        AND public.orders.tenant_id = order_items.tenant_id
    )
  );

DROP POLICY IF EXISTS "Allow update order_items" ON public.order_items;
CREATE POLICY "Allow update order_items" ON public.order_items
  FOR UPDATE
  TO anon, authenticated
  USING (
    (
      (auth.role() = 'authenticated' AND tenant_id = public.get_my_tenant())
      OR
      (auth.role() = 'anon' AND tenant_id IS NOT NULL)
    )
    AND EXISTS (
      SELECT 1 FROM public.orders
      WHERE public.orders.id = order_items.order_id
        AND public.orders.tenant_id = order_items.tenant_id
    )
  )
  WITH CHECK (
    (
      (auth.role() = 'authenticated' AND tenant_id = public.get_my_tenant())
      OR
      (auth.role() = 'anon' AND tenant_id IS NOT NULL)
    )
    AND EXISTS (
      SELECT 1 FROM public.orders
      WHERE public.orders.id = order_items.order_id
        AND public.orders.tenant_id = order_items.tenant_id
    )
  );

DROP POLICY IF EXISTS "Allow delete order_items" ON public.order_items;
CREATE POLICY "Allow delete order_items" ON public.order_items
  FOR DELETE
  TO anon, authenticated
  USING (
    (
      (auth.role() = 'authenticated' AND tenant_id = public.get_my_tenant())
      OR
      (auth.role() = 'anon' AND tenant_id IS NOT NULL)
    )
    AND EXISTS (
      SELECT 1 FROM public.orders
      WHERE public.orders.id = order_items.order_id
        AND public.orders.tenant_id = order_items.tenant_id
    )
  );
