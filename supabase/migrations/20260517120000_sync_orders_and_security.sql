-- Sync orders workflow with application + harden RPC exposure
-- Safe to re-run: uses IF EXISTS / IF NOT EXISTS where possible

-- ─── Orders: extended status workflow + payment proof ───────────────────────
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_proof_url text;

ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE public.orders ADD CONSTRAINT orders_status_check CHECK (
  status = ANY (ARRAY[
    'pending'::text,
    'pending_payment'::text,
    'awaiting_verification'::text,
    'paid'::text,
    'preparing'::text,
    'shipped'::text,
    'completed'::text,
    'cancelled'::text
  ])
);

COMMENT ON COLUMN public.orders.payment_proof_url IS 'Public URL of transfer/payment proof uploaded at checkout';

-- ─── Invoices: drop legacy sale_id if it was added experimentally ────────────
ALTER TABLE public.invoices DROP COLUMN IF EXISTS sale_id;

-- ─── RPC: restrict SECURITY DEFINER helpers from anonymous API callers ─────
REVOKE EXECUTE ON FUNCTION public.get_my_tenant() FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_my_branch() FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_user_role() FROM anon;

-- Authenticated users may still invoke when needed by RLS policies / app
GRANT EXECUTE ON FUNCTION public.get_my_tenant() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_branch() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_role() TO authenticated;
