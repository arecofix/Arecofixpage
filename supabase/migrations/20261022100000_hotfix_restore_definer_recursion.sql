-- ==============================================================================
-- Migration: 20261022100000_hotfix_restore_definer_recursion.sql
-- Description: HOTFIX P0 - Restore SECURITY DEFINER on core RLS helper functions
--              to eradicate CWE-674 infinite recursion / stack depth limit exceeded.
-- Severity: CRITICAL / P0 (Production Down Mitigation)
-- ==============================================================================

BEGIN;

-- 1. is_admin()
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, private, extensions, pg_temp
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'staff', 'tenant_owner', 'super_admin')
  );
END;
$$;

-- 2. is_super_admin()
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, private, extensions, pg_temp
AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin',
    (SELECT p.role = 'super_admin' FROM public.profiles p WHERE p.id = auth.uid()),
    false
  );
$$;

-- 3. is_admin_user()
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, private, extensions, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('super_admin', 'tenant_owner', 'admin')
  );
$$;

-- 4. is_admin_of_tenant(p_tenant_id uuid)
CREATE OR REPLACE FUNCTION public.is_admin_of_tenant(p_tenant_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, private, extensions, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND (
        role = 'super_admin'
        OR (role IN ('admin', 'tenant_owner') AND tenant_id = p_tenant_id AND p_tenant_id IS NOT NULL)
      )
  );
$$;

-- 5. get_auth_user_role()
CREATE OR REPLACE FUNCTION public.get_auth_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, private, extensions, pg_temp
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- 6. get_auth_user_tenant()
CREATE OR REPLACE FUNCTION public.get_auth_user_tenant()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, private, extensions, pg_temp
AS $$
  SELECT tenant_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- 7. get_auth_user_branch()
CREATE OR REPLACE FUNCTION public.get_auth_user_branch()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, private, extensions, pg_temp
AS $$
  SELECT branch_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- 8. get_current_tenant_id()
CREATE OR REPLACE FUNCTION public.get_current_tenant_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, private, extensions, pg_temp
AS $$
  SELECT COALESCE(
    NULLIF(auth.jwt() -> 'app_metadata' ->> 'tenant_id', '')::uuid,
    NULLIF(auth.jwt() ->> 'tenant_id', '')::uuid,
    (SELECT p.tenant_id FROM public.profiles p WHERE p.id = auth.uid())
  );
$$;

-- 9. get_secure_tenant_id()
CREATE OR REPLACE FUNCTION public.get_secure_tenant_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, private, extensions, pg_temp
AS $$
  SELECT public.get_current_tenant_id();
$$;

-- 10. get_my_tenant()
CREATE OR REPLACE FUNCTION public.get_my_tenant()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, private, extensions, pg_temp
AS $$
  SELECT public.get_current_tenant_id();
$$;

-- 11. get_secure_branch_id()
CREATE OR REPLACE FUNCTION public.get_secure_branch_id()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, private, extensions, pg_temp
AS $$
DECLARE
    b_id uuid;
    raw_branch_id text;
BEGIN
    raw_branch_id := current_setting('request.jwt.claims', true)::jsonb ->> 'branch_id';
    
    IF raw_branch_id IS NOT NULL AND raw_branch_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
        b_id := raw_branch_id::uuid;
    END IF;

    IF b_id IS NULL AND auth.uid() IS NOT NULL THEN
        SELECT branch_id INTO b_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
    END IF;
    
    RETURN b_id;
END;
$$;

-- 12. has_permission(p_permission text, p_branch_id uuid)
CREATE OR REPLACE FUNCTION public.has_permission(p_permission text, p_branch_id uuid DEFAULT NULL::uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, private, extensions, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.role_permissions rp ON ur.role_id = rp.role_id
    WHERE ur.user_id = auth.uid()
      AND (ur.tenant_id = public.get_current_tenant_id() OR public.is_super_admin())
      AND (ur.branch_id = p_branch_id OR ur.branch_id IS NULL OR p_branch_id IS NULL)
      AND rp.permission = p_permission
  );
$$;

-- 13. can_edit_profile(target_role text)
CREATE OR REPLACE FUNCTION public.can_edit_profile(target_role text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, private, extensions, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
      AND (
        p.role IN ('super_admin', 'tenant_owner', 'admin')
        OR (p.role IN ('staff', 'technician') AND target_role = 'user')
      )
  );
$$;

-- 14. get_my_permissions()
CREATE OR REPLACE FUNCTION public.get_my_permissions()
RETURNS TABLE(permission text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, private, extensions, pg_temp
AS $$
  SELECT rp.permission
  FROM public.user_roles ur
  JOIN public.role_permissions rp ON ur.role_id = rp.role_id
  WHERE ur.user_id = auth.uid();
$$;

-- 15. get_request_guest_session()
CREATE OR REPLACE FUNCTION public.get_request_guest_session()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, private, extensions, pg_temp
AS $$
  SELECT NULLIF(TRIM(current_setting('request.headers', true)::json->>'x-guest-session'), '');
$$;

-- ==============================================================================
-- Grants & Permisos Críticos para PostgREST y RLS
-- ==============================================================================
-- Otorgar EXECUTE en helpers requeridos por políticas RLS evaluadas en caliente
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_admin_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin_of_tenant(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_auth_user_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_auth_user_tenant() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_auth_user_branch() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_tenant_id() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.get_secure_tenant_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_tenant() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_secure_branch_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_permission(text, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_edit_profile(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_permissions() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_request_guest_session() TO authenticated, anon;

-- Justificaciones formales de arquitectura para auditoría y linter
COMMENT ON FUNCTION public.is_admin() IS '@security-definer-justification: Bypass RLS on profiles to prevent CWE-674 infinite recursion in policies';
COMMENT ON FUNCTION public.is_super_admin() IS '@security-definer-justification: Bypass RLS on profiles to prevent CWE-674 infinite recursion in policies';
COMMENT ON FUNCTION public.get_auth_user_tenant() IS '@security-definer-justification: Core RLS tenant resolver required to bypass profiles policy evaluation';
COMMENT ON FUNCTION public.get_auth_user_role() IS '@security-definer-justification: Core RLS role resolver required to bypass profiles policy evaluation';
COMMENT ON FUNCTION public.get_current_tenant_id() IS '@security-definer-justification: Multi-tenant resolver for guest and authenticated sessions';
COMMENT ON FUNCTION public.has_permission(text, uuid) IS '@security-definer-justification: RBAC permission check evaluating roles and permissions tables';
COMMENT ON FUNCTION public.get_my_permissions() IS '@security-definer-justification: Frontend RPC for user permission matrix';

COMMIT;

NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';
