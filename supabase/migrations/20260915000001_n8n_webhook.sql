-- Habilitar extensión pg_net si no existe
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Crear función para enviar el Webhook a n8n
CREATE OR REPLACE FUNCTION public.notify_n8n_new_product()
RETURNS trigger AS $$
BEGIN
  -- Envía el POST a la URL de producción de n8n
  PERFORM net.http_post(
    url := 'https://n8n.arecofix.com.ar/webhook/nuevo-producto-crudo',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := json_build_object(
      'type', TG_OP,
      'table', TG_TABLE_NAME,
      'schema', TG_TABLE_SCHEMA,
      'record', row_to_json(NEW)
    )::jsonb
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Eliminar el trigger si ya existía para evitar duplicados
DROP TRIGGER IF EXISTS trigger_notify_n8n_new_product ON public.products;

-- Crear el trigger que se dispara al insertar un producto nuevo
CREATE TRIGGER trigger_notify_n8n_new_product
AFTER INSERT ON public.products
FOR EACH ROW
WHEN (NEW.description IS NULL)
EXECUTE FUNCTION public.notify_n8n_new_product();
