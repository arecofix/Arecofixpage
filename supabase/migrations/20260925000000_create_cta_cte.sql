-- Migration: Create Cuenta Corriente (CTA_CTE) Tables
-- Description: Adds customer_accounts and account_transactions tables with full RLS.

-- 1. Create customer_accounts table
CREATE TABLE IF NOT EXISTS customer_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    balance DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    credit_limit DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(tenant_id, customer_id)
);

-- 2. Create account_transactions table
CREATE TABLE IF NOT EXISTS account_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    account_id UUID NOT NULL REFERENCES customer_accounts(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('charge', 'payment', 'adjustment')),
    amount DECIMAL(12, 2) NOT NULL,
    reference_type TEXT CHECK (reference_type IN ('sale', 'repair', 'manual', 'initial_balance')),
    reference_id UUID,
    description TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_customer_accounts_tenant_customer ON customer_accounts(tenant_id, customer_id);
CREATE INDEX IF NOT EXISTS idx_account_transactions_account ON account_transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_account_transactions_tenant ON account_transactions(tenant_id);

-- Trigger to update updated_at on customer_accounts
CREATE OR REPLACE FUNCTION update_customer_accounts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_customer_accounts_updated_at_trigger
    BEFORE UPDATE ON customer_accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_customer_accounts_updated_at();

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE customer_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_transactions ENABLE ROW LEVEL SECURITY;

-- POLICIES FOR customer_accounts
CREATE POLICY "Users can view accounts of their tenant"
ON customer_accounts FOR SELECT
USING (auth.uid() IN (
    SELECT user_id FROM staff_profiles WHERE staff_profiles.tenant_id = customer_accounts.tenant_id
));

CREATE POLICY "Users can insert accounts to their tenant"
ON customer_accounts FOR INSERT
WITH CHECK (auth.uid() IN (
    SELECT user_id FROM staff_profiles WHERE staff_profiles.tenant_id = customer_accounts.tenant_id
));

CREATE POLICY "Users can update accounts of their tenant"
ON customer_accounts FOR UPDATE
USING (auth.uid() IN (
    SELECT user_id FROM staff_profiles WHERE staff_profiles.tenant_id = customer_accounts.tenant_id
));

CREATE POLICY "Users can delete accounts of their tenant"
ON customer_accounts FOR DELETE
USING (auth.uid() IN (
    SELECT user_id FROM staff_profiles WHERE staff_profiles.tenant_id = customer_accounts.tenant_id
));

-- POLICIES FOR account_transactions
CREATE POLICY "Users can view transactions of their tenant"
ON account_transactions FOR SELECT
USING (auth.uid() IN (
    SELECT user_id FROM staff_profiles WHERE staff_profiles.tenant_id = account_transactions.tenant_id
));

CREATE POLICY "Users can insert transactions to their tenant"
ON account_transactions FOR INSERT
WITH CHECK (auth.uid() IN (
    SELECT user_id FROM staff_profiles WHERE staff_profiles.tenant_id = account_transactions.tenant_id
));

CREATE POLICY "Users can update transactions of their tenant"
ON account_transactions FOR UPDATE
USING (auth.uid() IN (
    SELECT user_id FROM staff_profiles WHERE staff_profiles.tenant_id = account_transactions.tenant_id
));

CREATE POLICY "Users can delete transactions of their tenant"
ON account_transactions FOR DELETE
USING (auth.uid() IN (
    SELECT user_id FROM staff_profiles WHERE staff_profiles.tenant_id = account_transactions.tenant_id
));

-- Grant access to authenticated users
GRANT ALL ON customer_accounts TO authenticated;
GRANT ALL ON account_transactions TO authenticated;
