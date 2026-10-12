-- Migration: 20261012020000_add_invoice_draft_and_arca_fields.sql
-- Description: Adds draft support, ARCA fields, repair order linking and fixes sequence generator for invoices.

-- 1. Fix get_next_tenant_sequence: remove illegal FOR UPDATE on aggregate function
CREATE OR REPLACE FUNCTION public.get_next_tenant_sequence(p_tenant_id uuid, p_table_name text, p_column_name text)
RETURNS integer
LANGUAGE plpgsql
AS $function$
DECLARE
  next_val INTEGER;
BEGIN
  EXECUTE format(
    'SELECT COALESCE(MAX(%I), 0) + 1 FROM public.%I WHERE tenant_id = $1',
    p_column_name, p_table_name
  ) INTO next_val USING p_tenant_id;
  RETURN next_val;
END;
$function$;

-- 2. Add columns to public.invoices
ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'issued',
  ADD COLUMN IF NOT EXISTS advance_payment numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS balance_due numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS repair_order_id text,
  ADD COLUMN IF NOT EXISTS repair_order_number text,
  ADD COLUMN IF NOT EXISTS customer_doc_type text,
  ADD COLUMN IF NOT EXISTS customer_vat_condition text,
  ADD COLUMN IF NOT EXISTS payment_method text,
  ADD COLUMN IF NOT EXISTS sale_condition text,
  ADD COLUMN IF NOT EXISTS internal_notes text;

-- 3. Add performance indexes
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_invoices_repair_order_id ON public.invoices(tenant_id, repair_order_id);

-- 4. Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
