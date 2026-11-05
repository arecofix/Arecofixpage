-- ==============================================================================
-- Migration: 20261104140000_refund_deposit_on_repair_cancellation.sql
-- Description: Ticket ARX-804 - Reversión financiera automática y egreso de caja
--              al cancelar una orden de reparación (current_status_id = 7).
--              Garantiza que la seña devuelta al cliente no permanezca sumada en el
--              Dashboard ni en el balance de tesorería.
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.fn_refund_deposit_on_repair_cancellation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions', 'pg_temp'
AS $function$
DECLARE
    v_refund_amount numeric := 0;
    v_branch_id uuid;
    v_payment_method text;
    v_notes text;
BEGIN
    -- Se dispara cuando el estado cambia a 7 (CANCELLED) y antes no era 7
    IF OLD.current_status_id IS DISTINCT FROM 7 AND NEW.current_status_id = 7 THEN
        -- Si la orden estaba entregada (6), el total cobrado fue final_cost (o deposit_amount);
        -- de lo contrario, la seña inicial registrada
        IF OLD.current_status_id = 6 AND COALESCE(NEW.final_cost, OLD.final_cost, 0) > 0 THEN
            v_refund_amount := COALESCE(NEW.final_cost, OLD.final_cost, 0);
        ELSE
            v_refund_amount := COALESCE(NEW.deposit_amount, OLD.deposit_amount, 0);
        END IF;

        IF v_refund_amount > 0 THEN
            -- Idempotencia estricta: evitar duplicar el egreso si ya fue registrado previamente
            IF NOT EXISTS (
                SELECT 1 FROM public.cash_movements
                WHERE reference_id = NEW.id
                  AND type = 'expense'
                  AND category = 'repair'
            ) THEN
                v_branch_id := COALESCE(
                    NEW.branch_id, 
                    OLD.branch_id,
                    (SELECT id FROM public.branches WHERE tenant_id = NEW.tenant_id ORDER BY is_active DESC LIMIT 1)
                );

                -- Buscar el método de pago original de la seña si existió
                SELECT payment_method INTO v_payment_method
                FROM public.cash_movements
                WHERE reference_id = NEW.id AND type = 'income'
                ORDER BY created_at ASC
                LIMIT 1;

                v_payment_method := COALESCE(v_payment_method, 'efectivo');

                v_notes := format(
                    'Devolución de seña por reparación cancelada #%s', 
                    COALESCE(NEW.tracking_code, OLD.tracking_code, NEW.id::text)
                );

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
                    v_branch_id,
                    v_refund_amount,
                    'expense',
                    'repair',
                    v_payment_method,
                    NEW.id,
                    v_notes
                );
            END IF;
        END IF;
    END IF;

    RETURN NEW;
END;
$function$;

-- Crear Trigger en la tabla repairs
DROP TRIGGER IF EXISTS trg_refund_deposit_on_repair_cancellation ON public.repairs;
CREATE TRIGGER trg_refund_deposit_on_repair_cancellation
AFTER UPDATE OF current_status_id ON public.repairs
FOR EACH ROW
EXECUTE FUNCTION public.fn_refund_deposit_on_repair_cancellation();

-- Backfill histórico seguro:
-- Reconcilia reparaciones ya canceladas en el pasado que tenían seña > 0 y no tenían egreso registrado en caja
INSERT INTO public.cash_movements (
    tenant_id,
    branch_id,
    amount,
    type,
    category,
    payment_method,
    reference_id,
    notes,
    created_at
)
SELECT 
    r.tenant_id,
    COALESCE(r.branch_id, (SELECT b.id FROM public.branches b WHERE b.tenant_id = r.tenant_id LIMIT 1)),
    r.deposit_amount,
    'expense',
    'repair',
    COALESCE(
        (SELECT cm.payment_method FROM public.cash_movements cm WHERE cm.reference_id = r.id AND cm.type = 'income' LIMIT 1),
        'efectivo'
    ),
    r.id,
    format('Devolución de seña por reparación cancelada #%s (Ajuste retroactivo)', COALESCE(r.tracking_code, r.id::text)),
    COALESCE(r.updated_at, r.created_at)
FROM public.repairs r
WHERE r.current_status_id = 7
  AND COALESCE(r.deposit_amount, 0) > 0
  AND NOT EXISTS (
      SELECT 1 FROM public.cash_movements cm
      WHERE cm.reference_id = r.id
        AND cm.type = 'expense'
        AND cm.category = 'repair'
  );
