-- Migration: 20260809000000_fix_supabase_security_audit
-- Purpose: 
-- 1. Restrict SECURITY DEFINER functions from PUBLIC access.
-- 2. Make v_unified_clients a security invoker view.
-- 3. Cleanup duplicate indexes on repairs and courses.
-- 4. Fix RLS Policy Always True (contact_messages)

-- ==============================================================
-- 1. Fix SECURITY DEFINER functions (Prevent public execution)
-- ==============================================================

-- Revoke default public execute privileges
REVOKE EXECUTE ON FUNCTION public.accept_upsell_vidrio(text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.add_upsell_item_to_repair(text, uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.create_guest_profile(text, text, text, text, text, text, uuid, uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_my_tenant() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_repair_tracking(text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.save_repair_order(jsonb) FROM PUBLIC;

-- Re-grant execute privileges ONLY to authenticated users (and anon where strictly required)
GRANT EXECUTE ON FUNCTION public.accept_upsell_vidrio(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.add_upsell_item_to_repair(text, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_guest_profile(text, text, text, text, text, text, uuid, uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_tenant() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.get_repair_tracking(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.save_repair_order(jsonb) TO authenticated;

-- ==============================================================
-- 2. Fix SECURITY DEFINER View Bypass (v_unified_clients)
-- ==============================================================
-- In Postgres 15+, views can be made security invoker so they respect RLS of underlying tables.
ALTER VIEW public.v_unified_clients SET (security_invoker = true);

-- ==============================================================
-- 3. Cleanup Duplicate Indexes (courses, repairs)
-- ==============================================================
-- A simple script to find duplicate indexes and drop the redundant ones
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT 
            indrelid::regclass AS table_name,
            array_agg(indexrelid::regclass) AS indexes,
            indkey,
            indclass
        FROM pg_index
        WHERE indrelid::regclass::text IN ('public.courses', 'public.repairs')
        GROUP BY indrelid, indkey, indclass
        HAVING COUNT(*) > 1
    ) LOOP
        -- Keep the first index, drop the rest
        FOR i IN 2 .. array_length(r.indexes, 1) LOOP
            EXECUTE 'DROP INDEX IF EXISTS ' || r.indexes[i]::text;
        END LOOP;
    END LOOP;
END $$;

-- ==============================================================
-- 4. Fix RLS Policy Always True (contact_messages)
-- ==============================================================
DROP POLICY IF EXISTS "Allow public insert on contact_messages" ON public.contact_messages;
CREATE POLICY "Allow public insert on contact_messages" 
ON public.contact_messages 
FOR INSERT 
TO public 
WITH CHECK (tenant_id = get_my_tenant());