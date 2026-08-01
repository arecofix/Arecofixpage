-- Asegurarnos de que el script no falle si la política ya existe (idempotencia)
DO $$
BEGIN
    DROP POLICY IF EXISTS "Allow public insert on contact_messages" ON public.contact_messages;
    DROP POLICY IF EXISTS "Allow public insert on notifications" ON public.notifications;
EXCEPTION
    WHEN OTHERS THEN
        NULL;
END $$;

-- Permitir que usuarios anónimos y autenticados inserten mensajes de contacto (reservas)
CREATE POLICY "Allow public insert on contact_messages" 
ON public.contact_messages 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Permitir que usuarios anónimos inserten notificaciones para los admins (generado al reservar)
CREATE POLICY "Allow public insert on notifications" 
ON public.notifications 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Asegurarse de que el rol anon tenga permisos base para insertar en estas tablas
GRANT INSERT ON public.contact_messages TO anon;
GRANT INSERT ON public.notifications TO anon;
