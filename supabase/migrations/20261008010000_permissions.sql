-- ==============================================================================
-- TSK-05: Implementar Permisos (DB)
-- DB es la fuente de permisos. Crear tablas de roles y UDF has_permission().
-- ==============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS public.roles (
  id text PRIMARY KEY,
  description text
);

INSERT INTO public.roles (id, description) VALUES
('super_admin', 'Super Administrador Global'),
('tenant_owner', 'Dueño del Tenant'),
('admin', 'Administrador de Sucursal'),
('staff', 'Staff de Sucursal'),
('technician', 'Técnico de Sucursal'),
('user', 'Cliente/Usuario final')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id text REFERENCES public.roles(id) ON DELETE CASCADE,
  permission text NOT NULL,
  UNIQUE(role_id, permission)
);

-- Insert atomic permissions
INSERT INTO public.role_permissions (role_id, permission) VALUES
-- Admin
('admin', 'admin.panel:access:branch'),
('admin', 'repairs:create:branch'),
('admin', 'repairs:edit:branch'),
('admin', 'repairs:read:branch'),
('admin', 'products:read:branch'),
('admin', 'customers:manage:branch'),
('admin', 'users:manage:branch'),
-- Staff
('staff', 'admin.panel:access:branch'),
('staff', 'repairs:create:branch'),
('staff', 'repairs:edit:branch'),
('staff', 'repairs:read:branch'),
('staff', 'products:read:branch'),
('staff', 'customers:manage:branch'),
-- Technician
('technician', 'admin.panel:access:branch'),
('technician', 'repairs:edit:branch'),
('technician', 'repairs:read:branch'),
('technician', 'products:read:branch'),
-- Tenant Owner (Global scopes)
('tenant_owner', 'admin.panel:access:global'),
('tenant_owner', 'company.identity:edit:global'),
('tenant_owner', 'users:manage:global'),
('tenant_owner', 'repairs:read:global'),
('tenant_owner', 'repairs:edit:global'),
('tenant_owner', 'repairs:create:global'),
('tenant_owner', 'products:read:global'),
('tenant_owner', 'products:manage:global'),
('tenant_owner', 'customers:manage:global'),
-- Super Admin
('super_admin', 'admin.panel:access:global'),
('super_admin', 'system:manage:global')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_id text REFERENCES public.roles(id) ON DELETE CASCADE,
  branch_id uuid REFERENCES public.branches(id) ON DELETE CASCADE,
  tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, role_id, branch_id)
);

-- Migrate existing data
INSERT INTO public.user_roles (user_id, role_id, branch_id, tenant_id)
SELECT id, role, branch_id, tenant_id
FROM public.profiles
WHERE role != 'user' AND role IS NOT NULL
ON CONFLICT DO NOTHING;

-- The UDF
CREATE OR REPLACE FUNCTION public.has_permission(p_permission text, p_branch_id uuid DEFAULT NULL)
RETURNS boolean
LANGUAGE sql SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.role_permissions rp ON ur.role_id = rp.role_id
    WHERE ur.user_id = auth.uid() 
      AND (ur.branch_id = p_branch_id OR ur.branch_id IS NULL OR p_branch_id IS NULL)
      AND rp.permission = p_permission
  );
$$;

-- Allow reading permissions for UI Cache (TSK-06)
CREATE OR REPLACE FUNCTION public.get_my_permissions()
RETURNS TABLE (permission text)
LANGUAGE sql SECURITY DEFINER
AS $$
  SELECT rp.permission 
  FROM public.user_roles ur
  JOIN public.role_permissions rp ON ur.role_id = rp.role_id
  WHERE ur.user_id = auth.uid();
$$;

COMMIT;
