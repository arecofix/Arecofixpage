-- =============================================================================
-- Soluciones de Seguridad y Rendimiento para Arecofix (Supabase RLS)
-- =============================================================================
-- Instrucciones: 
-- Copia y pega el contenido de este archivo en el Editor SQL de tu proyecto en Supabase (Dashboard -> SQL Editor).
-- Ejecuta el script para aplicar las correcciones.
-- =============================================================================

-- 1. CORRECCIÓN DE RENDIMIENTO EN PUBLIC.COURSE_ENROLLMENTS
-- El problema era que auth.uid() se re-evaluaba por cada fila.
-- Solución: Usar (select auth.uid()) para que se evalúe una sola vez por consulta.
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON public.course_enrollments;
CREATE POLICY "Enable read access for authenticated users only" ON public.course_enrollments
FOR SELECT TO authenticated USING (
  user_id = (select auth.uid())
);


-- 2. SEGURIDAD: RESTRINGIR BORRADO (DELETE) SÓLO A ADMINS
-- Antes estaba abierto a todos los usuarios autenticados. Ahora verificamos el rol 'admin'.

-- Brands
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.brands;
CREATE POLICY "Enable delete for admins only" ON public.brands
FOR DELETE TO authenticated USING (
  exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid())
    and profiles.role = 'admin'
  )
);

-- Categories
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.categories;
CREATE POLICY "Enable delete for admins only" ON public.categories
FOR DELETE TO authenticated USING (
  exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid())
    and profiles.role = 'admin'
  )
);

-- Courses
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.courses;
CREATE POLICY "Enable delete for admins only" ON public.courses
FOR DELETE TO authenticated USING (
  exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid())
    and profiles.role = 'admin'
  )
);


-- 3. SEGURIDAD: RESTRINGIR INSERCIÓN DE PEDIDOS (ORDERS)
-- Asegura que un usuario solo pueda crear pedidos a su propio nombre (customer_id = su user_id).
-- Si es guest (customer_id null), esta política específica de 'authenticated' no aplica (o debe manejarse aparte).
-- Aquí endurecemos la política para usuarios logueados.

DROP POLICY IF EXISTS "Authenticated insert orders" ON public.orders;
CREATE POLICY "Authenticated insert orders" ON public.orders
FOR INSERT TO authenticated WITH CHECK (
  customer_id = (select auth.uid())
);

-- 4. SEGURIDAD: RESTRINGIR INSERCIÓN DE ITEMS DE PEDIDO
-- Asegura que los items pertenezcan a una orden que pertenece al usuario.

DROP POLICY IF EXISTS "Authenticated insert order_items" ON public.order_items;
CREATE POLICY "Authenticated insert order_items" ON public.order_items
FOR INSERT TO authenticated WITH CHECK (
  exists (
    select 1 from public.orders
    where orders.id = order_id
    and orders.customer_id = (select auth.uid())
  )
);
