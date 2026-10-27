-- ==============================================================================
-- Migration: 20261021060000_restrict_graphql_exposure.sql
-- Description: Restrict table exposure and deactivate unused pg_graphql extension
-- Severity: HIGH / MEDIUM (P1 / P2)
-- Categories: pg_graphql_anon_table_exposed, pg_graphql_authenticated_table_exposed
-- ==============================================================================

BEGIN;

-- 1. Revoke access from anon on strictly internal/back-office tables if they exist
DO $$
DECLARE
    tbl text;
    tables text[] := ARRAY[
        'audit_logs',
        'auth_logs',
        'bank_reconciliations',
        'cash_movements',
        'cola_tiktok',
        'invoices',
        'purchases',
        'purchase_items',
        'repair_number_sequences',
        'schema_migrations',
        'stock_history'
    ];
BEGIN
    FOREACH tbl IN ARRAY tables LOOP
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = tbl) THEN
            EXECUTE format('REVOKE ALL ON TABLE public.%I FROM anon;', tbl);
        END IF;
    END LOOP;
END $$;

-- 2. Completely isolate secondary project schema 'zarx' from Arecofix API roles
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'zarx') THEN
        REVOKE ALL ON ALL TABLES IN SCHEMA zarx FROM anon, authenticated, public;
        REVOKE USAGE ON SCHEMA zarx FROM anon, authenticated, public;
    END IF;
END $$;

-- 3. Deactivate pg_graphql exposure since Arecofix operates exclusively via PostgREST REST API
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'graphql_public') THEN
        REVOKE USAGE ON SCHEMA graphql_public FROM anon, authenticated, public;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_graphql') THEN
        DROP EXTENSION IF EXISTS pg_graphql CASCADE;
    END IF;
EXCEPTION WHEN OTHERS THEN
    -- If pg_graphql is managed by supabase_admin, ensure usage is revoked
    IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'graphql_public') THEN
        REVOKE USAGE ON SCHEMA graphql_public FROM anon, authenticated, public;
    END IF;
END $$;

COMMIT;
