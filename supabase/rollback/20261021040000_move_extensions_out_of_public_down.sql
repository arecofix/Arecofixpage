-- ==============================================================================
-- Rollback Migration: 20261021040000_move_extensions_out_of_public_down.sql
-- Description: Revert pg_net and unaccent extensions back to public schema
-- ==============================================================================

BEGIN;

-- Revert pg_net metadata to public
UPDATE pg_extension 
SET extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
WHERE extname = 'pg_net' 
  AND extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'extensions');

-- Revert unaccent to public
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_extension 
        WHERE extname = 'unaccent' AND extnamespace::regnamespace::text = 'extensions'
    ) THEN
        ALTER EXTENSION unaccent SET SCHEMA public;
    END IF;
END $$;

COMMIT;
