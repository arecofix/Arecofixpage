-- Migration: 20261028010000_def_11_enforce_invoice_immutability.sql
-- Description: Ticket DEF-11 - Enforce immutability of issued, paid, or cancelled invoices

CREATE OR REPLACE FUNCTION public.enforce_invoice_immutability()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public', 'extensions', 'pg_temp'
AS $function$
BEGIN
    IF OLD.status IN ('issued', 'paid', 'cancelled') THEN
        -- Prevent alteration of core fiscal and identity fields
        IF (OLD.subtotal IS DISTINCT FROM NEW.subtotal) OR
           (OLD.total_amount IS DISTINCT FROM NEW.total_amount) OR
           (OLD.tax_amount IS DISTINCT FROM NEW.tax_amount) OR
           (OLD.net_amount IS DISTINCT FROM NEW.net_amount) OR
           (OLD.customer_tax_id IS DISTINCT FROM NEW.customer_tax_id) OR
           (OLD.customer_name IS DISTINCT FROM NEW.customer_name) OR
           (OLD.items IS DISTINCT FROM NEW.items) OR
           (OLD.invoice_number IS DISTINCT FROM NEW.invoice_number) OR
           (OLD.type IS DISTINCT FROM NEW.type) OR
           (OLD.issued_at IS DISTINCT FROM NEW.issued_at) THEN
            RAISE EXCEPTION 'VIOLACION FISCAL (DEF-11): No es posible modificar campos fiscales de una factura emitida (ID: %, Nro: %, Estado: %). Los comprobantes fiscales son inmutables por normativa tributaria.',
                OLD.id, OLD.invoice_number, OLD.status;
        END IF;

        -- Prevent reactivating a cancelled invoice
        IF OLD.status = 'cancelled' AND NEW.status != 'cancelled' THEN
            RAISE EXCEPTION 'VIOLACION FISCAL (DEF-11): No se puede reactivar una factura anulada (ID: %).', OLD.id;
        END IF;
    END IF;

    RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trg_enforce_invoice_immutability ON public.invoices;
CREATE TRIGGER trg_enforce_invoice_immutability
BEFORE UPDATE ON public.invoices
FOR EACH ROW
EXECUTE FUNCTION public.enforce_invoice_immutability();
