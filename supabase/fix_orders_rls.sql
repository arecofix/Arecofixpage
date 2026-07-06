-- Habilitar inserción para usuarios anónimos y autenticados en orders
DROP POLICY IF EXISTS "Enable insert for all users" ON public.orders;
CREATE POLICY "Enable insert for all users" ON public.orders
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Habilitar inserción para usuarios anónimos y autenticados en order_items
DROP POLICY IF EXISTS "Enable insert for all users" ON public.order_items;
CREATE POLICY "Enable insert for all users" ON public.order_items
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);
