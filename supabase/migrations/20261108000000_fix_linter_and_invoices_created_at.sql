-- ==============================================================================
-- MIGRATION: 20261108000000_fix_linter_and_invoices_created_at.sql
-- DESCRIPTION: Remediación Integral de Seguridad y Rendimiento
-- 1. Agrega created_at a public.invoices y sincroniza con issued_at.
-- 2. get_request_guest_session() -> SECURITY INVOKER (resuelve WARN anon/authenticated).
-- 3. register_academy_payment, register_enrollment_payment, void_academy_payment:
--    Revoca EXECUTE de anon/authenticated; limita a service_role.
-- 4. Funciones helper RLS: Migra lógica a esquema private (SECURITY DEFINER)
--    y crea wrappers SECURITY INVOKER en public (resuelve WARN 0029).
-- 5. academy_payment_proofs: Optimiza políticas RLS para auth_rls_initplan usando (SELECT ...).
-- ==============================================================================

BEGIN;

-- ------------------------------------------------------------------------------
-- 1. FIX INVOICES CREATED_AT COLUMN
-- ------------------------------------------------------------------------------
ALTER TABLE public.invoices 
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT timezone('utc'::text, now());

UPDATE public.invoices 
SET created_at = COALESCE(issued_at, now()) 
WHERE created_at IS NULL;


-- ------------------------------------------------------------------------------
-- 2. FIX GET_REQUEST_GUEST_SESSION (Fix anon_security_definer & authenticated_security_definer)
-- Solo lee cabecera HTTP sin acceder a tablas ni requerir privilegios elevados.
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_request_guest_session()
RETURNS text
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
  SELECT NULLIF(TRIM(current_setting('request.headers', true)::json->>'x-guest-session'), '');
$$;

GRANT EXECUTE ON FUNCTION public.get_request_guest_session() TO authenticated, anon, service_role;
COMMENT ON FUNCTION public.get_request_guest_session() IS 'Header extractor for guest sessions (SECURITY INVOKER)';


-- ------------------------------------------------------------------------------
-- 3. REVOKE EXTERNAL RPC EXECUTION ON ACADEMY PAYMENTS (Fix anon & authenticated)
-- Solo ejecutables por backend / service_role
-- ------------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'public' AND p.proname = 'register_academy_payment') THEN
    REVOKE EXECUTE ON FUNCTION public.register_academy_payment(uuid, numeric, text, timestamptz, int, text, uuid) FROM PUBLIC, anon, authenticated;
    GRANT EXECUTE ON FUNCTION public.register_academy_payment(uuid, numeric, text, timestamptz, int, text, uuid) TO service_role;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'public' AND p.proname = 'register_enrollment_payment') THEN
    REVOKE EXECUTE ON FUNCTION public.register_enrollment_payment(uuid, numeric, text, timestamptz, int, text, uuid) FROM PUBLIC, anon, authenticated;
    GRANT EXECUTE ON FUNCTION public.register_enrollment_payment(uuid, numeric, text, timestamptz, int, text, uuid) TO service_role;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'public' AND p.proname = 'void_academy_payment') THEN
    REVOKE EXECUTE ON FUNCTION public.void_academy_payment(uuid, uuid, text) FROM PUBLIC, anon, authenticated;
    GRANT EXECUTE ON FUNCTION public.void_academy_payment(uuid, uuid, text) TO service_role;
  END IF;
END $$;


-- ------------------------------------------------------------------------------
-- 4. RLS HELPER FUNCTIONS: PRIVATE SCHEMA DEFINERS + PUBLIC INVOKER WRAPPERS
-- Erradica authenticated_security_definer_function_executable sin riesgo de recursión
-- ------------------------------------------------------------------------------
CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO anon, authenticated, service_role, postgres, supabase_admin;

-- 4.1 is_super_admin
CREATE OR REPLACE FUNCTION private.is_super_admin()
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
GRANT EXECUTE ON FUNCTION private.is_super_admin() TO authenticated, anon, service_role;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public, private, extensions, pg_temp
AS $$
  SELECT private.is_super_admin();
$$;
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO authenticated, anon, service_role;

-- 4.2 is_admin
CREATE OR REPLACE FUNCTION private.is_admin()
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
GRANT EXECUTE ON FUNCTION private.is_admin() TO authenticated, anon, service_role;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public, private, extensions, pg_temp
AS $$
  SELECT private.is_admin();
$$;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon, service_role;

-- 4.3 is_admin_user
CREATE OR REPLACE FUNCTION private.is_admin_user()
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
GRANT EXECUTE ON FUNCTION private.is_admin_user() TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public, private, extensions, pg_temp
AS $$
  SELECT private.is_admin_user();
$$;
GRANT EXECUTE ON FUNCTION public.is_admin_user() TO authenticated, service_role;

-- 4.4 is_admin_of_tenant
CREATE OR REPLACE FUNCTION private.is_admin_of_tenant(target_tenant_id uuid)
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
        OR (role IN ('admin', 'tenant_owner') AND tenant_id = target_tenant_id AND target_tenant_id IS NOT NULL)
      )
  );
$$;
GRANT EXECUTE ON FUNCTION private.is_admin_of_tenant(uuid) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.is_admin_of_tenant(target_tenant_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public, private, extensions, pg_temp
AS $$
  SELECT private.is_admin_of_tenant(target_tenant_id);
$$;
GRANT EXECUTE ON FUNCTION public.is_admin_of_tenant(uuid) TO authenticated, service_role;

-- 4.5 get_current_tenant_id
CREATE OR REPLACE FUNCTION private.get_current_tenant_id()
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
GRANT EXECUTE ON FUNCTION private.get_current_tenant_id() TO authenticated, anon, service_role;

CREATE OR REPLACE FUNCTION public.get_current_tenant_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public, private, extensions, pg_temp
AS $$
  SELECT private.get_current_tenant_id();
$$;
GRANT EXECUTE ON FUNCTION public.get_current_tenant_id() TO authenticated, anon, service_role;

-- 4.6 get_my_tenant
CREATE OR REPLACE FUNCTION private.get_my_tenant()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, private, extensions, pg_temp
AS $$
  SELECT private.get_current_tenant_id();
$$;
GRANT EXECUTE ON FUNCTION private.get_my_tenant() TO authenticated, anon, service_role;

CREATE OR REPLACE FUNCTION public.get_my_tenant()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public, private, extensions, pg_temp
AS $$
  SELECT private.get_my_tenant();
$$;
GRANT EXECUTE ON FUNCTION public.get_my_tenant() TO authenticated, anon, service_role;

-- 4.7 get_secure_tenant_id
CREATE OR REPLACE FUNCTION private.get_secure_tenant_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, private, extensions, pg_temp
AS $$
  SELECT private.get_current_tenant_id();
$$;
GRANT EXECUTE ON FUNCTION private.get_secure_tenant_id() TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.get_secure_tenant_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public, private, extensions, pg_temp
AS $$
  SELECT private.get_secure_tenant_id();
$$;
GRANT EXECUTE ON FUNCTION public.get_secure_tenant_id() TO authenticated, service_role;

-- 4.8 get_auth_user_tenant
CREATE OR REPLACE FUNCTION private.get_auth_user_tenant()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, private, extensions, pg_temp
AS $$
  SELECT tenant_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;
GRANT EXECUTE ON FUNCTION private.get_auth_user_tenant() TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.get_auth_user_tenant()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public, private, extensions, pg_temp
AS $$
  SELECT private.get_auth_user_tenant();
$$;
GRANT EXECUTE ON FUNCTION public.get_auth_user_tenant() TO authenticated, service_role;

-- 4.9 get_auth_user_branch
CREATE OR REPLACE FUNCTION private.get_auth_user_branch()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, private, extensions, pg_temp
AS $$
  SELECT branch_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;
GRANT EXECUTE ON FUNCTION private.get_auth_user_branch() TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.get_auth_user_branch()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public, private, extensions, pg_temp
AS $$
  SELECT private.get_auth_user_branch();
$$;
GRANT EXECUTE ON FUNCTION public.get_auth_user_branch() TO authenticated, service_role;

-- 4.10 get_auth_user_role
CREATE OR REPLACE FUNCTION private.get_auth_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, private, extensions, pg_temp
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;
GRANT EXECUTE ON FUNCTION private.get_auth_user_role() TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.get_auth_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public, private, extensions, pg_temp
AS $$
  SELECT private.get_auth_user_role();
$$;
GRANT EXECUTE ON FUNCTION public.get_auth_user_role() TO authenticated, service_role;

-- 4.11 get_secure_branch_id
CREATE OR REPLACE FUNCTION private.get_secure_branch_id()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, private, extensions, pg_temp
AS $$
DECLARE
  v_branch_id uuid;
BEGIN
  v_branch_id := NULLIF(current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'branch_id', '')::uuid;
  IF v_branch_id IS NOT NULL THEN
    RETURN v_branch_id;
  END IF;

  SELECT p.branch_id INTO v_branch_id
  FROM public.profiles p
  WHERE p.id = auth.uid();

  RETURN v_branch_id;
END;
$$;
GRANT EXECUTE ON FUNCTION private.get_secure_branch_id() TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.get_secure_branch_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public, private, extensions, pg_temp
AS $$
  SELECT private.get_secure_branch_id();
$$;
GRANT EXECUTE ON FUNCTION public.get_secure_branch_id() TO authenticated, service_role;

-- 4.12 has_permission
CREATE OR REPLACE FUNCTION private.has_permission(p_permission text, p_branch_id uuid DEFAULT NULL::uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, private, extensions, pg_temp
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_is_super boolean;
  v_has_perm boolean;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN false;
  END IF;

  SELECT (role = 'super_admin') INTO v_is_super
  FROM public.profiles
  WHERE id = v_user_id;

  IF v_is_super IS TRUE THEN
    RETURN true;
  END IF;

  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON rp.role_id = ur.role_id
    WHERE ur.user_id = v_user_id
      AND rp.permission = p_permission
      AND (
        p_branch_id IS NULL
        OR ur.branch_id IS NULL
        OR ur.branch_id = p_branch_id
      )
      AND (ur.tenant_id = private.get_current_tenant_id() OR private.is_super_admin())
  ) INTO v_has_perm;

  RETURN COALESCE(v_has_perm, false);
END;
$$;
GRANT EXECUTE ON FUNCTION private.has_permission(text, uuid) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.has_permission(p_permission text, p_branch_id uuid DEFAULT NULL::uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public, private, extensions, pg_temp
AS $$
  SELECT private.has_permission(p_permission, p_branch_id);
$$;
GRANT EXECUTE ON FUNCTION public.has_permission(text, uuid) TO authenticated, service_role;

-- 4.13 can_edit_profile
CREATE OR REPLACE FUNCTION private.can_edit_profile(target_role text)
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
GRANT EXECUTE ON FUNCTION private.can_edit_profile(text) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.can_edit_profile(target_role text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public, private, extensions, pg_temp
AS $$
  SELECT private.can_edit_profile(target_role);
$$;
GRANT EXECUTE ON FUNCTION public.can_edit_profile(text) TO authenticated, service_role;

-- 4.14 get_my_permissions
CREATE OR REPLACE FUNCTION private.get_my_permissions()
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
GRANT EXECUTE ON FUNCTION private.get_my_permissions() TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.get_my_permissions()
RETURNS TABLE(permission text)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public, private, extensions, pg_temp
AS $$
  SELECT * FROM private.get_my_permissions();
$$;
GRANT EXECUTE ON FUNCTION public.get_my_permissions() TO authenticated, service_role;


-- ------------------------------------------------------------------------------
-- 5. RENDIMIENTO RLS ACADEMY_PAYMENT_PROOFS (Fix WARN: auth_rls_initplan)
-- Optimizar políticas envolviendo llamadas auth.<function>() en (SELECT ...)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS academy_payment_proofs_read ON public.academy_payment_proofs;
DROP POLICY IF EXISTS academy_payment_proofs_insert ON public.academy_payment_proofs;
DROP POLICY IF EXISTS academy_payment_proofs_update ON public.academy_payment_proofs;

CREATE POLICY academy_payment_proofs_read ON public.academy_payment_proofs
    FOR SELECT TO authenticated
    USING (
        (tenant_id = (SELECT get_current_tenant_id()))
        OR (user_id = (SELECT auth.uid()))
        OR (SELECT is_super_admin())
    );

CREATE POLICY academy_payment_proofs_insert ON public.academy_payment_proofs
    FOR INSERT TO authenticated
    WITH CHECK (
        (tenant_id = (SELECT get_current_tenant_id()))
        OR (user_id = (SELECT auth.uid()))
        OR (SELECT is_super_admin())
    );

CREATE POLICY academy_payment_proofs_update ON public.academy_payment_proofs
    FOR UPDATE TO authenticated
    USING (
        (tenant_id = (SELECT get_current_tenant_id()))
        OR (SELECT is_super_admin())
    );

COMMIT;

NOTIFY pgrst, 'reload schema';

