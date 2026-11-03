-- Migration: 20261028030000_arx_801_outsourced_parts_and_purchases.sql
-- Description: Ticket ARX-801 - Outsourced repair parts and automated purchase/expense generation

DO $$
BEGIN
    -- 1. Agregar columnas a repair_parts_used
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'repair_parts_used' AND column_name = 'is_outsourced'
    ) THEN
        ALTER TABLE public.repair_parts_used ADD COLUMN is_outsourced boolean NOT NULL DEFAULT false;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'repair_parts_used' AND column_name = 'supplier_id'
    ) THEN
        ALTER TABLE public.repair_parts_used ADD COLUMN supplier_id uuid REFERENCES public.suppliers(id) ON DELETE SET NULL;
        CREATE INDEX IF NOT EXISTS idx_repair_parts_used_supplier_id ON public.repair_parts_used(supplier_id);
    END IF;

    -- 2. Agregar repair_id a purchases
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'purchases' AND column_name = 'repair_id'
    ) THEN
        ALTER TABLE public.purchases ADD COLUMN repair_id uuid REFERENCES public.repairs(id) ON DELETE SET NULL;
        CREATE INDEX IF NOT EXISTS idx_purchases_repair_id ON public.purchases(repair_id);
    END IF;
END $$;

-- 3. Actualizar función de stock para ignorar repuestos tercerizados (no consumen inventario local)
CREATE OR REPLACE FUNCTION public.fn_manage_stock_on_repair_part()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public', 'extensions', 'pg_temp'
AS $function$
DECLARE
    v_branch_id uuid;
    v_current_stock INTEGER;
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Si el repuesto es tercerizado o no tiene producto asociado, no consume stock interno
        IF NEW.is_outsourced IS TRUE OR NEW.product_id IS NULL THEN
            RETURN NEW;
        END IF;

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
        -- Si era tercerizado o sin producto, no reingresa al inventario
        IF OLD.is_outsourced IS TRUE OR OLD.product_id IS NULL THEN
            RETURN OLD;
        END IF;

        SELECT branch_id INTO v_branch_id FROM public.repairs WHERE id = OLD.repair_id;
        
        UPDATE public.product_stock_per_branch 
        SET quantity = quantity + OLD.quantity, updated_at = NOW()
        WHERE product_id = OLD.product_id AND branch_id = v_branch_id;
        
        RETURN OLD;
        
    ELSIF TG_OP = 'UPDATE' THEN
        -- Caso 1: Pasó de interno a tercerizado -> Restaurar stock
        IF (OLD.is_outsourced IS NOT TRUE) AND (NEW.is_outsourced IS TRUE) THEN
            IF OLD.product_id IS NOT NULL THEN
                SELECT branch_id INTO v_branch_id FROM public.repairs WHERE id = OLD.repair_id;
                UPDATE public.product_stock_per_branch 
                SET quantity = quantity + OLD.quantity, updated_at = NOW()
                WHERE product_id = OLD.product_id AND branch_id = v_branch_id;
            END IF;
            RETURN NEW;
        END IF;

        -- Caso 2: Pasó de tercerizado a interno -> Deducir nuevo stock
        IF (OLD.is_outsourced IS TRUE) AND (NEW.is_outsourced IS NOT TRUE) THEN
            IF NEW.product_id IS NOT NULL THEN
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
            END IF;
            RETURN NEW;
        END IF;

        -- Caso 3: Ambos tercerizados -> No tocar stock
        IF (OLD.is_outsourced IS TRUE) AND (NEW.is_outsourced IS TRUE) THEN
            RETURN NEW;
        END IF;

        -- Caso 4: Ambos internos y cambió cantidad o producto
        IF OLD.quantity != NEW.quantity OR OLD.product_id != NEW.product_id THEN
            SELECT branch_id INTO v_branch_id FROM public.repairs WHERE id = NEW.repair_id;
            
            IF OLD.product_id IS NOT NULL THEN
                UPDATE public.product_stock_per_branch 
                SET quantity = quantity + OLD.quantity
                WHERE product_id = OLD.product_id AND branch_id = v_branch_id;
            END IF;
            
            IF NEW.product_id IS NOT NULL THEN
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
        END IF;
        
        RETURN NEW;
    END IF;
END;
$function$;

-- 4. Trigger para creación automática de compra y egreso financiero de repuestos tercerizados
CREATE OR REPLACE FUNCTION public.fn_create_outsourced_repair_part_expense()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public', 'extensions', 'pg_temp'
AS $function$
DECLARE
    v_repair RECORD;
    v_supplier_id uuid;
    v_supplier_name text;
    v_cost numeric;
    v_purchase_id uuid;
BEGIN
    -- Solo aplica si el repuesto es tercerizado y tiene costo
    IF NEW.is_outsourced IS TRUE AND COALESCE(NEW.cost_at_time, 0) > 0 THEN
        SELECT id, tracking_code, branch_id, supplier_id INTO v_repair
        FROM public.repairs 
        WHERE id = NEW.repair_id;

        -- Determinar proveedor (el del repuesto o fallback al de la orden)
        v_supplier_id := COALESCE(NEW.supplier_id, v_repair.supplier_id);
        
        IF v_supplier_id IS NOT NULL THEN
            SELECT name INTO v_supplier_name FROM public.suppliers WHERE id = v_supplier_id;
        ELSE
            v_supplier_name := 'Proveedor Externo';
        END IF;

        v_cost := NEW.cost_at_time * COALESCE(NEW.quantity, 1);

        -- Registrar compra en purchases
        INSERT INTO public.purchases (
            tenant_id,
            branch_id,
            supplier_id,
            repair_id,
            total_amount,
            status,
            payment_method,
            notes
        ) VALUES (
            NEW.tenant_id,
            v_repair.branch_id,
            v_supplier_id,
            NEW.repair_id,
            v_cost,
            'completed',
            'cash',
            format('Compra automática de repuesto tercerizado para orden %s (Proveedor: %s)', COALESCE(v_repair.tracking_code, NEW.repair_id::text), v_supplier_name)
        ) RETURNING id INTO v_purchase_id;

        -- Registrar egreso de caja en cash_movements
        INSERT INTO public.cash_movements (
            tenant_id,
            branch_id,
            amount,
            type,
            category,
            payment_method,
            reference_id,
            notes
        ) VALUES (
            NEW.tenant_id,
            v_repair.branch_id,
            v_cost,
            'expense',
            'repair',
            'cash',
            NEW.repair_id,
            format('Egreso automático: Repuesto tercerizado orden %s (Proveedor: %s, Compra: %s)', COALESCE(v_repair.tracking_code, NEW.repair_id::text), v_supplier_name, v_purchase_id::text)
        );
    END IF;

    RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trg_create_outsourced_repair_part_expense ON public.repair_parts_used;
CREATE TRIGGER trg_create_outsourced_repair_part_expense
AFTER INSERT ON public.repair_parts_used
FOR EACH ROW
EXECUTE FUNCTION public.fn_create_outsourced_repair_part_expense();
