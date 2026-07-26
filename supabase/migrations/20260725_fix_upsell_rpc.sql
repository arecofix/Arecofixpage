-- Fix tracking upsell function permissions
-- Since anonymous users (clients) need to add accessories to their repairs,
-- this function must bypass RLS on the repair_parts_used and repairs tables.

DROP FUNCTION IF EXISTS add_upsell_item_to_repair(text, uuid);
DROP FUNCTION IF EXISTS add_upsell_item_to_repair(character varying, uuid);

CREATE OR REPLACE FUNCTION add_upsell_item_to_repair(p_tracking_code text, p_product_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARElisto ya lo puse reisa y hace las pruebas correspondientes

    v_repair_id uuid;
    v_product_price numeric;
BEGIN
    -- Get repair id based on tracking code
    SELECT id INTO v_repair_id
    FROM repairs
    WHERE tracking_code = p_tracking_code;

    IF v_repair_id IS NULL THEN
        RAISE EXCEPTION 'Repair not found';
    END IF;

    -- Get product price
    SELECT price INTO v_product_price
    FROM products
    WHERE id = p_product_id AND is_active = true;

    IF v_product_price IS NULL THEN
        RAISE EXCEPTION 'Product not found or inactive';
    END IF;

    -- Insert into repair_parts_used
    INSERT INTO repair_parts_used (
        repair_id,
        product_id,
        quantity,
        unit_price,
        tenant_id
    )
    SELECT
        v_repair_id,
        p_product_id,
        1,
        v_product_price,
        tenant_id
    FROM repairs
    WHERE id = v_repair_id;

    -- Note: updating the repairs table (final_cost / balance_to_pay)
    -- should be handled by the trigger `trg_update_repair_costs` which
    -- recalculates the costs whenever a part is added.

    RETURN true;
END;
$$;
