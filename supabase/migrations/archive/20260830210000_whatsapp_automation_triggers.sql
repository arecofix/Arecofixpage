-- Triggers to automate WhatsApp notifications using pg_net webhooks

-- 1. Trigger for Repair Status Changes
CREATE OR REPLACE FUNCTION public.handle_repair_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  payload jsonb;
  webhook_url text;
BEGIN
  webhook_url := current_setting('app.settings.webhook_url', true);
  
  -- Fallback to local URL for testing if not set
  IF webhook_url IS NULL OR webhook_url = '' THEN
    webhook_url := 'http://host.docker.internal:54421/functions/v1/webhook-whatsapp';
  END IF;

  payload := jsonb_build_object(
    'type', 'INSERT',
    'table', 'repair_status_history',
    'schema', 'public',
    'record', row_to_json(NEW),
    'old_record', null
  );

  -- We use pg_net directly (which is installed by default in Supabase)
  PERFORM net.http_post(
    url := webhook_url,
    body := payload,
    headers := '{"Content-Type": "application/json"}'::jsonb
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Prevent webhook errors from blocking the main transaction
    RAISE WARNING 'Failed to trigger webhook: %', SQLERRM;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_repair_status_change ON public.repair_status_history;
CREATE TRIGGER on_repair_status_change
  AFTER INSERT ON public.repair_status_history
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_repair_status_change();


-- 2. Trigger for Order Status Changes
CREATE OR REPLACE FUNCTION public.handle_order_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  payload jsonb;
  webhook_url text;
BEGIN
  -- Only trigger if status changed
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;

  webhook_url := current_setting('app.settings.webhook_url', true);
  
  -- Fallback to local URL for testing if not set
  IF webhook_url IS NULL OR webhook_url = '' THEN
    webhook_url := 'http://host.docker.internal:54421/functions/v1/webhook-whatsapp';
  END IF;

  payload := jsonb_build_object(
    'type', 'UPDATE',
    'table', 'orders',
    'schema', 'public',
    'record', row_to_json(NEW),
    'old_record', row_to_json(OLD)
  );

  PERFORM net.http_post(
    url := webhook_url,
    body := payload,
    headers := '{"Content-Type": "application/json"}'::jsonb
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Failed to trigger webhook: %', SQLERRM;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_order_status_change ON public.orders;
CREATE TRIGGER on_order_status_change
  AFTER UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_order_status_change();
