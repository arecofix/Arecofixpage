-- ==============================================================================
-- Migration: 20261008015000_core_auth_helpers.sql
-- Description: Core auth and tenant helper functions required before RLS isolation policies
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

GRANT EXECUTE ON FUNCTION public.get_auth_user_tenant() TO authenticated;

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

GRANT EXECUTE ON FUNCTION public.get_auth_user_branch() TO authenticated;

-- 8. get_auth_user_role() and get_user_role()
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

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, private, extensions, pg_temp
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_role() TO authenticated;

-- 9. get_my_tenant()
CREATE OR REPLACE FUNCTION public.get_my_tenant()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, private, extensions, pg_temp
AS $$
  SELECT COALESCE(
    public.get_current_tenant_id(),
    (SELECT p.tenant_id FROM public.profiles p WHERE p.id = auth.uid()),
    '00000000-0000-0000-0000-000000000000'::uuid
  );
$$;

-- 10. get_my_branch()
CREATE OR REPLACE FUNCTION public.get_my_branch()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, private, extensions, pg_temp
AS $$
  SELECT branch_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_my_branch() TO authenticated, anon;

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

GRANT EXECUTE ON FUNCTION public.get_secure_tenant_id() TO authenticated, anon;

-- 12. get_secure_branch_id()
CREATE OR REPLACE FUNCTION public.get_secure_branch_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, private, extensions, pg_temp
AS $$
  SELECT COALESCE(
    NULLIF(current_setting('request.jwt.claims', true)::jsonb ->> 'branch_id', '')::uuid,
    (SELECT branch_id FROM public.profiles WHERE id = auth.uid() LIMIT 1)
  );
$$;

GRANT EXECUTE ON FUNCTION public.get_secure_branch_id() TO authenticated, anon;

COMMIT;
