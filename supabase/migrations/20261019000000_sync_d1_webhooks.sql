-- ==============================================================================
-- D1 FAILOVER REAL-TIME SYNCHRONIZATION WEBHOOK TRIGGERS (SUPABASE -> D1)
-- ==============================================================================

CREATE OR REPLACE FUNCTION fn_sync_d1_webhook()
RETURNS trigger AS $$
DECLARE
  payload jsonb;
  target_record jsonb;
BEGIN
  IF (TG_OP = 'DELETE') THEN
    target_record := row_to_json(OLD)::jsonb;
    payload := jsonb_build_object(
      'type', TG_OP,
      'table', TG_TABLE_NAME,
      'schema', TG_TABLE_SCHEMA,
      'old_record', target_record,
      'record', target_record
    );
  ELSE
    target_record := row_to_json(NEW)::jsonb;
    payload := jsonb_build_object(
      'type', TG_OP,
      'table', TG_TABLE_NAME,
      'schema', TG_TABLE_SCHEMA,
      'record', target_record,
      'old_record', CASE WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD)::jsonb ELSE NULL END
    );
  END IF;

  PERFORM net.http_post(
    url := 'https://arecofix-d1-failover.ezequielenrico15.workers.dev/sync',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer arecofix-d1-sync-secret-20261019'
    ),
    body := payload,
    timeout_milliseconds := 5000
  );

  IF (TG_OP = 'DELETE') THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'D1 Sync webhook dispatch failed: %', SQLERRM;
    IF (TG_OP = 'DELETE') THEN
      RETURN OLD;
    ELSE
      RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_sync_d1_products ON products;
CREATE TRIGGER trg_sync_d1_products
  AFTER INSERT OR UPDATE OR DELETE ON products
  FOR EACH ROW
  EXECUTE FUNCTION fn_sync_d1_webhook();

DROP TRIGGER IF EXISTS trg_sync_d1_categories ON categories;
CREATE TRIGGER trg_sync_d1_categories
  AFTER INSERT OR UPDATE OR DELETE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION fn_sync_d1_webhook();
