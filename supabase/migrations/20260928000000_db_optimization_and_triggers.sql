-- 1. Indexing frequently queried columns
CREATE INDEX IF NOT EXISTS idx_repairs_tracking ON public.repairs(tracking_code);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);

-- 2. Trigger function to synchronize customer_phone in repairs when a profile is updated
CREATE OR REPLACE FUNCTION sync_profile_to_repairs()
RETURNS TRIGGER AS $DEBUG$
BEGIN
  IF NEW.phone IS DISTINCT FROM OLD.phone THEN
    UPDATE public.repairs
    SET customer_phone = NEW.phone
    WHERE customer_id = NEW.id;
  END IF;
  
  IF NEW.first_name IS DISTINCT FROM OLD.first_name OR NEW.last_name IS DISTINCT FROM OLD.last_name THEN
    UPDATE public.repairs
    SET customer_name = TRIM(COALESCE(NEW.first_name, '') || ' ' || COALESCE(NEW.last_name, ''))
    WHERE customer_id = NEW.id;
  END IF;

  RETURN NEW;
END;
$DEBUG$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Attach the trigger to profiles
DROP TRIGGER IF EXISTS trg_sync_profile_to_repairs ON public.profiles;
CREATE TRIGGER trg_sync_profile_to_repairs
AFTER UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION sync_profile_to_repairs();
