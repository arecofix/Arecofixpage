-- Migration: 20261028050000_arx_803_credit_note_on_cancellation.sql
-- Description: Ticket ARX-803 - Automated Credit Note (NC) generation and financial reversal upon invoice cancellation

CREATE OR REPLACE FUNCTION public.fn_generate_credit_note_on_cancellation()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public', 'extensions', 'pg_temp'
AS $function$
DECLARE
    v_nc_type text;
    v_next_number int;
    v_nc_id uuid;
    v_refund_amount numeric;
    v_branch_id uuid;
BEGIN
    -- Se dispara cuando una factura activa pasa a 'cancelled'
    IF OLD.status IN ('issued', 'paid') AND NEW.status = 'cancelled' THEN
        -- Si ya era una nota de crédito, no generar nota de crédito recursiva
        IF OLD.type LIKE 'NC-%' THEN
            RETURN NEW;
        END IF;

        -- Determinar tipo de comprobante de crédito según normativa AFIP
        v_nc_type := CASE 
            WHEN OLD.type = 'A' THEN 'NC-A'
            WHEN OLD.type = 'B' THEN 'NC-B'
            WHEN OLD.type = 'C' THEN 'NC-C'
            ELSE 'NC-' || COALESCE(OLD.type, 'B')
        END;

        -- Próximo número correlativo
        SELECT COALESCE(MAX(invoice_number), 0) + 1 INTO v_next_number 
        FROM public.invoices 
        WHERE tenant_id = OLD.tenant_id;

        -- Insertar Nota de Crédito vinculada
        INSERT INTO public.invoices (
            tenant_id,
            invoice_number,
            customer_id,
            customer_name,
            customer_tax_id,
            customer_address,
            customer_email,
            customer_doc_type,
            customer_vat_condition,
            order_id,
            repair_id,
            repair_order_id,
            repair_order_number,
            origin,
            type,
            subtotal,
            tax_amount,
            net_amount,
            discount,
            total_amount,
            advance_payment,
            balance_due,
            items,
            status,
            sale_condition,
            payment_method,
            notes,
            internal_notes
        ) VALUES (
            OLD.tenant_id,
            v_next_number,
            OLD.customer_id,
            OLD.customer_name,
            OLD.customer_tax_id,
            OLD.customer_address,
            OLD.customer_email,
            OLD.customer_doc_type,
            OLD.customer_vat_condition,
            OLD.order_id,
            OLD.repair_id,
            OLD.repair_order_id,
            OLD.repair_order_number,
            OLD.origin,
            v_nc_type,
            OLD.subtotal,
            OLD.tax_amount,
            OLD.net_amount,
            OLD.discount,
            OLD.total_amount,
            0,
            0,
            OLD.items,
            'issued',
            OLD.sale_condition,
            OLD.payment_method,
            format('Nota de Crédito automática emitida por anulación de Comprobante %s Nro %s (Ref ID: %s)', OLD.type, LPAD(COALESCE(OLD.invoice_number, 0)::text, 8, '0'), OLD.id),
            format('Auto-NC generada por trigger ARX-803. Factura original: %s', OLD.id)
        ) RETURNING id INTO v_nc_id;

        -- Reverso financiero en caja si ya se habían recibido fondos
        v_refund_amount := COALESCE(OLD.total_amount, 0) - COALESCE(OLD.balance_due, 0);
        
        IF v_refund_amount > 0 THEN
            SELECT id INTO v_branch_id FROM public.branches WHERE tenant_id = OLD.tenant_id LIMIT 1;
            
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
                OLD.tenant_id,
                v_branch_id,
                v_refund_amount,
                'expense',
                'sale',
                COALESCE(OLD.payment_method, 'cash'),
                v_nc_id,
                format('Reverso financiero automático: Emisión de %s Nro %s por anulación de Factura %s', v_nc_type, LPAD(v_next_number::text, 8, '0'), LPAD(COALESCE(OLD.invoice_number, 0)::text, 8, '0'))
            );
        END IF;
    END IF;

    RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trg_generate_credit_note_on_cancellation ON public.invoices;
CREATE TRIGGER trg_generate_credit_note_on_cancellation
AFTER UPDATE OF status ON public.invoices
FOR EACH ROW
EXECUTE FUNCTION public.fn_generate_credit_note_on_cancellation();
