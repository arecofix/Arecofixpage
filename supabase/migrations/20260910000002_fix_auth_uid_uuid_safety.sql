-- Migration: 20260910000002_fix_auth_uid_uuid_safety.sql
-- Problem: auth.uid() was doing an unsafe ::uuid cast on request.jwt.claim.sub.
-- When Google OAuth is used, the 'sub' claim is a large numeric string like
-- '102054404203624373789' (not a UUID). This caused:
--   ERROR: invalid input syntax for type uuid: "102054404203624373789"
-- during the OAuth callback, which GoTrue caught and redirected as server_error.
--
-- Fix: Replace auth.uid() with a version that validates the UUID format
-- before casting, returning NULL instead of throwing for non-UUID subs.

CREATE OR REPLACE FUNCTION auth.uid()
RETURNS uuid
LANGUAGE sql STABLE
AS $func$
  SELECT 
    CASE 
      WHEN coalesce(
        nullif(current_setting('request.jwt.claim.sub', true), ''),
        (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
      ) ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
      THEN coalesce(
        nullif(current_setting('request.jwt.claim.sub', true), ''),
        (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
      )::uuid
      ELSE NULL
    END
$func$;
