-- Migration to fix duplicate triggers and handle stock restoration on delete

-- 1. Drop duplicate trigger
DROP TRIGGER IF EXISTS tr_update_stock_on_repair ON public.repair_parts_used;
DROP FUNCTION IF EXISTS handle_stock_on_repair_part() CASCADE;

-- 2. Drop existing BEFORE INSERT trigger
DROP TRIGGER IF EXISTS trg_discount_stock_on_repair ON public.repair_parts_used;
DROP FUNCTION IF EXISTS fn_discount_stock_on_repair() CASCADE;

-- 3. Create unified trigger function
CREATE OR REPLACE FUNCTION fn_manage_stock_on_repair_part()
RETURNS TRIGGER AS $$
DECLARE
    v_branch_id uuid;
    v_current_stock INTEGER;
BEGIN
    IF TG_OP = 'INSERT' THEN
        SELECT branch_id INTO v_branch_id FROM public.repairs WHERE id = NEW.repair_id;
        
        SELECT quantity INTO v_current_stock 
        FROM public.product_stock_per_branch 
        WHERE product_id = NEW.product_id AND branch_id = v_branch_id;
        
        IF v_current_stock IS NULL OR v_current_stock < NEW.quantity THEN
            RAISE EXCEPTION 'Stock insuficiente para el repuesto ID %. Disponible: %, Requerido: %', NEW.product_id, COALESCE(v_current_stock, 0), NEW.quantity;
        END IF;

        UPDATE public.product_stock_per_branch 
        SET quantity = quantity - NEW.quantity, updated_at = NOW()
        WHERE product_id = NEW.product_id AND branch_id = v_branch_id;
        
        RETURN NEW;
        
    ELSIF TG_OP = 'DELETE' THEN
        SELECT branch_id INTO v_branch_id FROM public.repairs WHERE id = OLD.repair_id;
        
        UPDATE public.product_stock_per_branch 
        SET quantity = quantity + OLD.quantity, updated_at = NOW()
        WHERE product_id = OLD.product_id AND branch_id = v_branch_id;
        
        RETURN OLD;
        
    ELSIF TG_OP = 'UPDATE' THEN
        -- Only if quantity or product changed
        IF OLD.quantity != NEW.quantity OR OLD.product_id != NEW.product_id THEN
            SELECT branch_id INTO v_branch_id FROM public.repairs WHERE id = NEW.repair_id;
            
            -- Restore old stock
            UPDATE public.product_stock_per_branch 
            SET quantity = quantity + OLD.quantity
            WHERE product_id = OLD.product_id AND branch_id = v_branch_id;
            
            -- Deduct new stock
            SELECT quantity INTO v_current_stock 
            FROM public.product_stock_per_branch 
            WHERE product_id = NEW.product_id AND branch_id = v_branch_id;
            
            IF v_current_stock IS NULL OR v_current_stock < NEW.quantity THEN
                RAISE EXCEPTION 'Stock insuficiente para el repuesto ID %. Disponible: %, Requerido: %', NEW.product_id, COALESCE(v_current_stock, 0), NEW.quantity;
            END IF;
            
            UPDATE public.product_stock_per_branch 
            SET quantity = quantity - NEW.quantity, updated_at = NOW()
            WHERE product_id = NEW.product_id AND branch_id = v_branch_id;
        END IF;
        
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 4. Create trigger
CREATE TRIGGER trg_manage_stock_on_repair
BEFORE INSERT OR UPDATE OR DELETE ON public.repair_parts_used
FOR EACH ROW EXECUTE FUNCTION fn_manage_stock_on_repair_part();
