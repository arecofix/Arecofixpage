-- ==============================================================================
-- Migration: 20261024020000_restore_public_tenant_and_auth_helpers.sql
-- Description: Restore and guarantee existence of public.get_current_tenant_id()
--              and associated core RLS helper functions in the 'public' schema.
--              Resolves 404 / 42883 undefined function error on PostgREST /rest/v1/orders
--              triggered by force_tenant_isolation() and multi-tenant RLS policies.
--              Includes grants for anon and authenticated roles.
-- ==============================================================================

BEGIN;

-- 1. get_current_tenant_id()
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

GRANT EXECUTE ON FUNCTION public.get_current_tenant_id() TO authenticated, anon;
COMMENT ON FUNCTION public.get_current_tenant_id() IS '@security-definer-justification: Multi-tenant resolver for guest and authenticated sessions';

-- 2. get_request_guest_session()
CREATE OR REPLACE FUNCTION public.get_request_guest_session()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, private, extensions, pg_temp
AS $$
  SELECT NULLIF(TRIM(current_setting('request.headers', true)::json->>'x-guest-session'), '');
$$;

GRANT EXECUTE ON FUNCTION public.get_request_guest_session() TO authenticated, anon;
COMMENT ON FUNCTION public.get_request_guest_session() IS '@security-definer-justification: Guest session header extractor for anonymous cart RLS';

-- 3. is_super_admin()
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

GRANT EXECUTE ON FUNCTION public.is_super_admin() TO authenticated, anon;
COMMENT ON FUNCTION public.is_super_admin() IS '@security-definer-justification: Super admin claim / profile evaluator';

-- 4. is_admin()
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

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;
COMMENT ON FUNCTION public.is_admin() IS '@security-definer-justification: Admin role evaluator across profiles';

-- 5. is_admin_user()
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

GRANT EXECUTE ON FUNCTION public.is_admin_user() TO authenticated;

-- 6. is_admin_of_tenant(p_tenant_id uuid)
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
  ) OR EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.tenant_id = p_tenant_id
      AND ur.role_id IN ('admin', 'tenant_owner')
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin_of_tenant(uuid) TO authenticated;

-- 7. get_auth_user_tenant()
CREATE OR REPLACE FUNCTION public.get_auth_user_tenant()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, private, extensions, pg_temp
AS $$
  SELECT tenant_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_auth_user_tenant() TO authenticated;

-- 8. get_auth_user_branch()
CREATE OR REPLACE FUNCTION public.get_auth_user_branch()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, private, extensions, pg_temp
AS $$
  SELECT branch_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_auth_user_branch() TO authenticated;

-- 9. get_auth_user_role()
CREATE OR REPLACE FUNCTION public.get_auth_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, private, extensions, pg_temp
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_auth_user_role() TO authenticated;

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

GRANT EXECUTE ON FUNCTION public.get_my_tenant() TO authenticated;

-- 11. get_secure_tenant_id()
CREATE OR REPLACE FUNCTION public.get_secure_tenant_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, private, extensions, pg_temp
AS $$
  SELECT public.get_current_tenant_id();
$$;

GRANT EXECUTE ON FUNCTION public.get_secure_tenant_id() TO authenticated;

-- 12. get_secure_branch_id()
CREATE OR REPLACE FUNCTION public.get_secure_branch_id()
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

GRANT EXECUTE ON FUNCTION public.get_secure_branch_id() TO authenticated;

-- 13. has_permission(p_permission text, p_branch_id uuid)
CREATE OR REPLACE FUNCTION public.has_permission(p_permission text, p_branch_id uuid DEFAULT NULL::uuid)
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
    JOIN public.permissions p ON p.id = rp.permission_id
    WHERE ur.user_id = v_user_id
      AND p.name = p_permission
      AND (
        p_branch_id IS NULL
        OR ur.branch_id IS NULL
        OR ur.branch_id = p_branch_id
      )
      AND (ur.tenant_id = public.get_current_tenant_id() OR public.is_super_admin())
  ) INTO v_has_perm;

  RETURN COALESCE(v_has_perm, false);
END;
$$;

GRANT EXECUTE ON FUNCTION public.has_permission(text, uuid) TO authenticated;

-- 14. can_edit_profile(target_role text)
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

GRANT EXECUTE ON FUNCTION public.can_edit_profile(text) TO authenticated;

-- 15. Fix backup schema linter warnings if tables exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'backups' AND table_name = '_migration_backup_20261022080000') THEN
    ALTER TABLE backups._migration_backup_20261022080000 DISABLE ROW LEVEL SECURITY;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'backups' AND table_name = '_migration_backup_20261022090000') THEN
    ALTER TABLE backups._migration_backup_20261022090000 DISABLE ROW LEVEL SECURITY;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'backups' AND table_name = 'services_backup_20261018') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_schema = 'backups' AND table_name = 'services_backup_20261018' AND constraint_type = 'PRIMARY KEY') THEN
      ALTER TABLE backups.services_backup_20261018 ADD PRIMARY KEY (id);
    END IF;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'backups' AND table_name = 'blog_posts_backup_20261018') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_schema = 'backups' AND table_name = 'blog_posts_backup_20261018' AND constraint_type = 'PRIMARY KEY') THEN
      ALTER TABLE backups.blog_posts_backup_20261018 ADD PRIMARY KEY (id);
    END IF;
  END IF;
END $$;

COMMIT;

NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';
