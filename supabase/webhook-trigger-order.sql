-- 1. Habilitar pg_net si no está habilitado
create extension if not exists pg_net;

-- 2. Crear la función del webhoook
CREATE OR REPLACE FUNCTION trigger_process_completed_order()
RETURNS trigger AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://jftiyfnnaogmgvksgkbn.supabase.co/functions/v1/process-completed-order',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmdGl5Zm5uYW9nbWd2a3Nna2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NjQyMDgsImV4cCI6MjA2NzI0MDIwOH0.2hJUL3hRthqnOAETTlkdwdP5s39J4nwmWfaC180ixG0"}'::jsonb,
    body := row_to_json(NEW)::jsonb
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Crear el Trigger en la tabla orders
DROP TRIGGER IF EXISTS on_order_completed ON public.orders;
CREATE TRIGGER on_order_completed
AFTER UPDATE ON public.orders
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'COMPLETADO')
EXECUTE FUNCTION trigger_process_completed_order();
