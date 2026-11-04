-- ==============================================================================
-- MIGRATION: 20261104130000_add_get_public_branch_by_id.sql
-- DESCRIPTION: Anti-enumeration RPC to resolve public branch profile by ID for anon/storefront
-- ==============================================================================

BEGIN;

CREATE OR REPLACE FUNCTION public.get_public_branch_by_id(p_id uuid)
RETURNS TABLE (
    id uuid,
    name text,
    official_name text,
    slug text,
    address text,
    contact_phone text,
    whatsapp_number text,
    contact_email text,
    branding_settings jsonb,
    tenant_id uuid,
    updated_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        b.id,
        b.name,
        b.official_name,
        b.slug,
        b.address,
        b.contact_phone,
        b.whatsapp_number,
        b.contact_email,
        b.branding_settings,
        b.tenant_id,
        b.updated_at
    FROM public.branches b
    WHERE b.id = p_id 
      AND b.is_active = true
      AND EXISTS (
          SELECT 1 FROM public.tenants t 
          WHERE t.id = b.tenant_id AND t.is_active = true
      )
    LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_public_branch_by_id(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_branch_by_id(uuid) TO anon, authenticated, service_role;

NOTIFY pgrst, 'reload schema';

COMMIT;
