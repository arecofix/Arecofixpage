-- ==============================================================================
-- MIGRATION: 20261103210000_p1_fix_branches_credential_leak.sql
-- DESCRIPTION: P1 Hotfix - Eliminate cross-tenant & public leak of bank_info & tax_id in public.branches
-- ==============================================================================

BEGIN;

-- 1. Eliminar la política branches_select_anon
DROP POLICY IF EXISTS "branches_select_anon" ON public.branches;

-- 2. Reescribir branches_select_authenticated para que solo permita el tenant propio, branch asignado o super_admin
DROP POLICY IF EXISTS "branches_select_authenticated" ON public.branches;

CREATE POLICY "branches_select_authenticated"
ON public.branches
FOR SELECT
TO authenticated
USING (
    tenant_id = get_current_tenant_id() 
    OR id = get_auth_user_branch() 
    OR is_super_admin()
);

-- 3. Crear vista pública segura con solo atributos no sensibles de sucursales (excluye bank_info y tax_id)
CREATE OR REPLACE VIEW public.public_branch_profile AS
SELECT 
    id, 
    name, 
    official_name,
    slug, 
    address, 
    contact_phone, 
    whatsapp_number, 
    contact_email, 
    branding_settings, 
    modules_config, 
    global_markup_percentage,
    is_active, 
    tenant_id, 
    updated_at
FROM public.branches
WHERE is_active = true;

-- Conceder acceso SELECT a la vista pública segura
GRANT SELECT ON public.public_branch_profile TO anon, authenticated, service_role;

-- 4. Notificar a PostgREST para recargar el esquema en caliente
NOTIFY pgrst, 'reload schema';

COMMIT;
