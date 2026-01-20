-- =============================================================================
-- Solución para el Error 400 en Contact Messages
-- =============================================================================
-- Este script asegura que la tabla de mensajes tenga todas las columnas requeridas.
--
-- Instrucciones:
-- 1. Ve al Dashboard de Supabase -> SQL Editor.
-- 2. Copia y pega este contenido.
-- 3. Ejecuta ("Run").
-- =============================================================================

-- 1. Crear tabla si no existe (por seguridad)
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

-- 2. Asegurar que existan las columnas críticas (ADD COLUMN IF NOT EXISTS)
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS subject text;

-- 3. Actualizar Permisos y Políticas (RLS)
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Borramos políticas anteriores conflictivas para recrearlas limpias
DROP POLICY IF EXISTS "permitir_insert_publico" ON public.contact_messages;
DROP POLICY IF EXISTS "permitir_select_auth" ON public.contact_messages;
DROP POLICY IF EXISTS "Enable insert for anon and authenticated" ON public.contact_messages;
DROP POLICY IF EXISTS "Enable read for authenticated only" ON public.contact_messages;

-- Borramos las políticas que vamos a crear ahora para evitar error "already exists"
DROP POLICY IF EXISTS "Enable insert for all" ON public.contact_messages;
DROP POLICY IF EXISTS "Enable read for authenticated" ON public.contact_messages;
DROP POLICY IF EXISTS "Enable update delete for authenticated" ON public.contact_messages;
DROP POLICY IF EXISTS "Enable delete for authenticated" ON public.contact_messages;

-- Política: Cualquiera (anon o logueado) puede Insertar mensajes
CREATE POLICY "Enable insert for all" ON public.contact_messages
FOR INSERT TO anon, authenticated
WITH CHECK (true);

-- Política: Solo usuarios logueados (admins) pueden Ver mensajes
CREATE POLICY "Enable read for authenticated" ON public.contact_messages
FOR SELECT TO authenticated
USING (true);

-- Política: Solo usuarios logueados pueden Borrar/Editar mensajes
CREATE POLICY "Enable update delete for authenticated" ON public.contact_messages
FOR UPDATE TO authenticated
USING (true);

CREATE POLICY "Enable delete for authenticated" ON public.contact_messages
FOR DELETE TO authenticated
USING (true);

-- Permisos básicos a roles de Supabase
GRANT ALL ON TABLE public.contact_messages TO authenticated;
GRANT ALL ON TABLE public.contact_messages TO service_role;
GRANT INSERT ON TABLE public.contact_messages TO anon;
