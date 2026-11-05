-- Rollback for 20261104140000_refund_deposit_on_repair_cancellation.sql
DROP TRIGGER IF EXISTS trg_refund_deposit_on_repair_cancellation ON public.repairs;
DROP FUNCTION IF EXISTS public.fn_refund_deposit_on_repair_cancellation();
