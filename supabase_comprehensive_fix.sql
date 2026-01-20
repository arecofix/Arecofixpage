-- =============================================================================
-- SOLUCIÓN INTEGRAL Y DEFINITIVA (V3)
-- =============================================================================
-- Ejecuta este script UNA SOLA VEZ para arreglar TODOS los problemas de:
-- 1. Error 400 en Mensajes de Contacto (columnas faltantes).
-- 2. Error al guardar Pedidos (columnas faltantes).
-- 3. Pedidos no visibles en el Admin (Permisos RLS).
-- 4. Error de permisos "already exists".
-- =============================================================================

-- A. ARREGLO DE TABLA CONTACT_MESSAGES (Evita Error 400)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  name text,
  email text,
  phone text,
  subject text,
  message text,
  is_read boolean DEFAULT false
);

ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS subject text;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS is_read boolean DEFAULT false;

-- B. ARREGLO DE TABLA ORDERS (Evita Error de Checkout)
-- -----------------------------------------------------------------------------
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;


-- C. CONFIGURACIÓN DE SEGURIDAD (RLS) - "Borrón y Cuenta Nueva"
-- -----------------------------------------------------------------------------
-- Habilitamos RLS en todas las tablas críticas
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- --- 1. LIMPIEZA DE POLÍTICAS ANTIGUAS (Para evitar errores de duplicados) ---
DO $$ 
BEGIN
    -- Contact Messages
    DROP POLICY IF EXISTS "Enable insert for all" ON public.contact_messages;
    DROP POLICY IF EXISTS "Enable read for authenticated" ON public.contact_messages;
    DROP POLICY IF EXISTS "Enable update delete for authenticated" ON public.contact_messages;
    DROP POLICY IF EXISTS "Enable delete for authenticated" ON public.contact_messages;
    DROP POLICY IF EXISTS "permitir_insert_publico" ON public.contact_messages;
    DROP POLICY IF EXISTS "Enable read/write for authenticated" ON public.contact_messages;
    
    -- Orders
    DROP POLICY IF EXISTS "Enable insert for all" ON public.orders;
    DROP POLICY IF EXISTS "Enable insert for authenticated" ON public.orders;
    DROP POLICY IF EXISTS "Authenticated insert orders" ON public.orders;
    DROP POLICY IF EXISTS "Enable select for admins" ON public.orders;
    DROP POLICY IF EXISTS "Enable select for own orders" ON public.orders;
    
    -- Order Items
    DROP POLICY IF EXISTS "Enable insert for all" ON public.order_items;
    DROP POLICY IF EXISTS "Authenticated insert order_items" ON public.order_items;
    DROP POLICY IF EXISTS "Enable select for admins" ON public.order_items;
    DROP POLICY IF EXISTS "Enable select for own items" ON public.order_items;
END $$;


-- --- 2. CREACIÓN DE NUEVAS POLÍTICAS (Permisivas pero Seguras) ---

-- > CONTACT MESSAGES
-- Cualquiera puede escribirnos (Insert)
CREATE POLICY "Enable insert for all" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
-- Solo usuarios logueados (idealmente admins) pueden ver/editar
CREATE POLICY "Enable read/write for authenticated" ON public.contact_messages FOR ALL TO authenticated USING (true);


-- > ORDERS
-- Cualquiera puede Crear una orden (Checkout Guest o Logueado)
CREATE POLICY "Enable insert for all" ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Ver órdenes: Admins ven T0DO, Usuarios ven SUYO
CREATE POLICY "Enable select for admins" ON public.orders FOR SELECT TO authenticated 
USING (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);

CREATE POLICY "Enable select for own orders" ON public.orders FOR SELECT TO authenticated 
USING (
  customer_id = auth.uid()
);


-- > ORDER ITEMS
-- Cualquiera puede Crear items (Checkout)
CREATE POLICY "Enable insert for all" ON public.order_items FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Ver items: Admins ven T0DO, Usuarios ven lo SUYO (a través de la orden)
CREATE POLICY "Enable select for admins" ON public.order_items FOR SELECT TO authenticated 
USING (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);

CREATE POLICY "Enable select for own items" ON public.order_items FOR SELECT TO authenticated 
USING (
  exists (select 1 from public.orders where orders.id = order_items.order_id and orders.customer_id = auth.uid())
);


-- D. PERMISOS FINALES
-- -----------------------------------------------------------------------------
GRANT ALL ON TABLE public.contact_messages TO authenticated, service_role;
GRANT INSERT ON TABLE public.contact_messages TO anon;

GRANT ALL ON TABLE public.orders TO authenticated, service_role;
GRANT INSERT ON TABLE public.orders TO anon;

GRANT ALL ON TABLE public.order_items TO authenticated, service_role;
GRANT INSERT ON TABLE public.order_items TO anon;
