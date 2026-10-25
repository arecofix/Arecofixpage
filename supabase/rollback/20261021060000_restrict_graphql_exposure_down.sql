-- ==============================================================================
-- Rollback Migration: 20261021060000_restrict_graphql_exposure_down.sql
-- Description: Revert table permissions and reactivate pg_graphql
-- ==============================================================================

BEGIN;

GRANT SELECT ON TABLE
    public.audit_logs,
    public.auth_logs,
    public.bank_reconciliations,
    public.cash_movements,
    public.cola_tiktok,
    public.invoices,
    public.purchases,
    public.purchase_items,
    public.repair_number_sequences,
    public.schema_migrations,
    public.stock_history
TO anon;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'zarx') THEN
        GRANT USAGE ON SCHEMA zarx TO anon, authenticated;
        GRANT SELECT ON ALL TABLES IN SCHEMA zarx TO anon, authenticated;
    END IF;
END $$;

CREATE EXTENSION IF NOT EXISTS pg_graphql SCHEMA graphql;

COMMIT;
