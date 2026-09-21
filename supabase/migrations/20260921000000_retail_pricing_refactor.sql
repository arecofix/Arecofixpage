-- 1. Create app_settings if it doesn't exist
CREATE TABLE IF NOT EXISTS public.app_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed retail_markup (21%)
INSERT INTO public.app_settings (key, value)
VALUES ('retail_markup', '{"percentage": 21}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Enable RLS for app_settings
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to app_settings (if needed by UI)
DROP POLICY IF EXISTS "Public profiles can read app_settings" ON public.app_settings;
CREATE POLICY "Public profiles can read app_settings" ON public.app_settings
FOR SELECT USING (true);


-- 2. Create the computed column function for retail_price
-- Function must take a single argument of the table type
CREATE OR REPLACE FUNCTION public.retail_price(product_row public.products)
RETURNS numeric AS $$
DECLARE
    markup numeric;
    cat_name text;
    is_technical boolean := false;
BEGIN
    -- Check if category is technical (e.g., Repuestos)
    SELECT name INTO cat_name FROM public.categories WHERE id = product_row.category_id;
    
    IF cat_name ILIKE '%repuesto%' OR cat_name ILIKE '%microelectronica%' THEN
        is_technical := true;
    END IF;

    -- Also check product name for technical keywords just in case
    IF NOT is_technical THEN
        IF product_row.name ILIKE ANY (ARRAY['%módulo%', '%modulo%', '%pantalla%', '%batería%', '%bateria%', '%flex%', '%ic %']) THEN
            is_technical := true;
        END IF;
    END IF;

    IF is_technical THEN
        -- Get markup from settings
        SELECT (value->>'percentage')::numeric INTO markup FROM public.app_settings WHERE key = 'retail_markup';
        IF markup IS NULL THEN
            markup := 21; -- Fallback
        END IF;
        RETURN product_row.price * (1 + (markup / 100));
    ELSE
        RETURN product_row.price;
    END IF;
END;
$$ LANGUAGE plpgsql STABLE;

-- 3. Create the BEFORE INSERT trigger on order_items
-- When an order item is inserted, we check if it's a guest. If so, enforce retail price.
-- Note: Supabase RLS functions like auth.uid() can be used to detect logged-in users.
CREATE OR REPLACE FUNCTION public.enforce_retail_price_for_guests()
RETURNS TRIGGER AS $$
DECLARE
    current_uid uuid;
    prod public.products;
    calculated_retail_price numeric;
BEGIN
    current_uid := auth.uid();
    
    -- If guest (not logged in)
    IF current_uid IS NULL THEN
        -- Fetch the product
        SELECT * INTO prod FROM public.products WHERE id = NEW.product_id;
        
        IF FOUND THEN
            -- Calculate retail price using our computed column function
            calculated_retail_price := public.retail_price(prod);
            
            -- Override the unit_price and subtotal
            NEW.unit_price := calculated_retail_price;
            NEW.subtotal := calculated_retail_price * NEW.quantity;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it exists to allow re-running
DROP TRIGGER IF EXISTS enforce_retail_price_trigger ON public.order_items;

CREATE TRIGGER enforce_retail_price_trigger
BEFORE INSERT ON public.order_items
FOR EACH ROW
EXECUTE FUNCTION public.enforce_retail_price_for_guests();


-- 4. Create an AFTER INSERT OR UPDATE trigger on order_items to keep orders total in sync
CREATE OR REPLACE FUNCTION public.update_order_total()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.orders
    SET 
        subtotal = (SELECT COALESCE(SUM(subtotal), 0) FROM public.order_items WHERE order_id = COALESCE(NEW.order_id, OLD.order_id)),
        total_amount = (SELECT COALESCE(SUM(subtotal), 0) FROM public.order_items WHERE order_id = COALESCE(NEW.order_id, OLD.order_id)),
        total = (SELECT COALESCE(SUM(subtotal), 0) FROM public.order_items WHERE order_id = COALESCE(NEW.order_id, OLD.order_id))
    WHERE id = COALESCE(NEW.order_id, OLD.order_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_order_total_trigger ON public.order_items;

CREATE TRIGGER update_order_total_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.order_items
FOR EACH ROW EXECUTE FUNCTION public.update_order_total();
