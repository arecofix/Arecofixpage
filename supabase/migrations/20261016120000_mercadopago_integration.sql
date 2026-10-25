-- ==============================================================================
-- ARECOFIX - MERCADO PAGO INTEGRATION SCHEMA MIGRATION
-- ==============================================================================
-- 1. Añade preference_id y payment_id a la tabla orders para trazabilidad de pago.
-- 2. Crea la tabla payments para auditoría, idempotencia y registro de webhooks de MP.
-- 3. Habilita RLS y políticas de acceso multi-tenant seguras.
-- ==============================================================================

-- 1. Columnas en orders
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS preference_id text,
ADD COLUMN IF NOT EXISTS payment_id text;

CREATE INDEX IF NOT EXISTS idx_orders_preference_id ON public.orders(preference_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON public.orders(payment_id);

-- 2. Tabla payments para idempotencia y registro de auditoría de pagos
CREATE TABLE IF NOT EXISTS public.payments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE DEFAULT get_my_tenant(),
    order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
    payment_id text NOT NULL,
    status text NOT NULL,
    status_detail text,
    payment_type_id text,
    payment_method_id text,
    transaction_amount numeric(10,2) NOT NULL,
    currency_id text DEFAULT 'ARS',
    payer_email text,
    raw_payload jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Constraint de unicidad para evitar procesar dos veces el mismo pago de Mercado Pago (Idempotencia)
ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS uq_payments_payment_id;
ALTER TABLE public.payments ADD CONSTRAINT uq_payments_payment_id UNIQUE (payment_id);

-- Índices de consulta rápida
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_tenant_id ON public.payments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

-- Función y trigger de updated_at para payments
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_payments_updated_at ON public.payments;
CREATE TRIGGER trg_update_payments_updated_at 
BEFORE UPDATE ON public.payments 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. Habilitar RLS en payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Política de lectura para usuarios sobre sus propios pagos (a través de la orden)
DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;
CREATE POLICY "Users can view their own payments"
ON public.payments FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.orders o
        WHERE o.id = payments.order_id
        AND o.user_id = auth.uid()
    )
);

-- Política para personal administrativo y tenant owner
DROP POLICY IF EXISTS "Staff and tenant owners can manage payments" ON public.payments;
CREATE POLICY "Staff and tenant owners can manage payments"
ON public.payments FOR ALL
TO authenticated
USING (
    (get_auth_user_role() = ANY (ARRAY['admin'::text, 'staff'::text, 'super_admin'::text, 'tenant_owner'::text]))
    AND (tenant_id = get_auth_user_tenant())
)
WITH CHECK (
    (get_auth_user_role() = ANY (ARRAY['admin'::text, 'staff'::text, 'super_admin'::text, 'tenant_owner'::text]))
    AND (tenant_id = get_auth_user_tenant())
);

-- Bypass para SuperAdmin
DROP POLICY IF EXISTS "SuperAdmin bypass payments" ON public.payments;
CREATE POLICY "SuperAdmin bypass payments"
ON public.payments FOR ALL
TO authenticated
USING (get_auth_user_role() = 'super_admin'::text)
WITH CHECK (get_auth_user_role() = 'super_admin'::text);
