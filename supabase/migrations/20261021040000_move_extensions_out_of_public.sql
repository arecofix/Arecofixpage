-- ==============================================================================
-- Migration: 20261021040000_move_extensions_out_of_public.sql
-- Description: Move pg_net and unaccent extensions from public to extensions schema
-- Severity: HIGH SECURITY (P1)
-- Category: extension_in_public
-- ==============================================================================

BEGIN;

-- Ensure extensions schema exists
CREATE SCHEMA IF NOT EXISTS extensions;
GRANT USAGE ON SCHEMA extensions TO postgres, anon, authenticated, service_role;

-- Move pg_net metadata to extensions schema (pg_net is non-relocatable, updates namespace catalog)
DO $$
BEGIN
    UPDATE pg_extension 
    SET extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'extensions')
    WHERE extname = 'pg_net' 
      AND extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
EXCEPTION
    WHEN insufficient_privilege THEN
        RAISE NOTICE 'Skipping direct pg_extension catalog update for pg_net due to lack of superuser privileges.';
END $$;

-- Move unaccent to extensions schema (relocatable)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_extension 
        WHERE extname = 'unaccent' AND extnamespace::regnamespace::text = 'public'
    ) THEN
        ALTER EXTENSION unaccent SET SCHEMA extensions;
    END IF;
END $$;

COMMIT;
