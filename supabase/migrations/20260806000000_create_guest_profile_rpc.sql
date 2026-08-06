-- Migration: create_guest_profile_rpc
-- Purpose: Allow admin/staff/technician users to create guest client profiles
--          without needing a matching auth.users row.
--
-- Root cause: profiles.id has a FK -> auth.users(id), so inserting a profile
-- with a random UUID fails with error 23503 (Foreign Key Violation).
-- The previous workaround (calling create-employee Edge Function) required
-- service_role credentials, which are not available client-side, causing
-- "non-2xx status code" / "Permisos insuficientes" errors.
--
-- Solution: SECURITY DEFINER function runs as DB owner -> can bypass
-- the FK constraint via a deferred constraint set. Only callable by auth users
-- whose profile has role IN ('admin', 'staff', 'technician', 'tenant_owner', 'super_admin').

CREATE OR REPLACE FUNCTION public.create_guest_profile(
  p_first_name  text,
  p_last_name   text    DEFAULT '',
  p_email       text    DEFAULT '',
  p_phone       text    DEFAULT '',
  p_address     text    DEFAULT '',
  p_dni         text    DEFAULT '',
  p_tenant_id   uuid    DEFAULT NULL,
  p_branch_id   uuid    DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_caller_role   text;
  v_caller_tenant uuid;
  v_new_id        uuid := gen_random_uuid();
  v_tenant_id     uuid;
  v_result        json;
BEGIN
  -- 1. Verify caller is an authenticated user with an allowed role
  SELECT role, tenant_id
    INTO v_caller_role, v_caller_tenant
    FROM public.profiles
   WHERE id = auth.uid()
   LIMIT 1;

  IF v_caller_role IS NULL THEN
    RAISE EXCEPTION 'Unauthorized: caller has no profile';
  END IF;

  IF v_caller_role NOT IN ('admin', 'staff', 'technician', 'tenant_owner', 'super_admin') THEN
    RAISE EXCEPTION 'Forbidden: role % cannot create guest profiles', v_caller_role;
  END IF;

  -- 2. Resolve tenant_id
  v_tenant_id := COALESCE(p_tenant_id, v_caller_tenant);
  IF v_tenant_id IS NULL THEN
    RAISE EXCEPTION 'Cannot resolve tenant_id for guest profile';
  END IF;

  -- 3. Insert into auth.users first to satisfy foreign key constraint
  -- This creates a "guest" auth user without a password, preventing login
  -- but satisfying the profiles.id -> auth.users(id) constraint.
  INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    raw_user_meta_data,
    created_at,
    updated_at
  ) VALUES (
    v_new_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    CASE WHEN p_email IS NULL OR TRIM(p_email) = '' THEN NULL ELSE p_email END,
    '{"is_guest": true}'::jsonb,
    now(),
    now()
  );

  -- 4. Insert guest profile
  -- Using ON CONFLICT because a Supabase auth trigger might have already inserted a row
  INSERT INTO public.profiles (
    id, first_name, last_name, email, phone,
    address, dni, is_guest, role,
    tenant_id, branch_id, is_active,
    created_at, updated_at
  ) VALUES (
    v_new_id, p_first_name, COALESCE(p_last_name, ''), COALESCE(p_email, ''),
    COALESCE(p_phone, ''), COALESCE(p_address, ''), COALESCE(p_dni, ''),
    true, 'user', v_tenant_id, p_branch_id, true, now(), now()
  )
  ON CONFLICT (id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    address = EXCLUDED.address,
    dni = EXCLUDED.dni,
    is_guest = EXCLUDED.is_guest,
    role = EXCLUDED.role,
    tenant_id = EXCLUDED.tenant_id,
    branch_id = EXCLUDED.branch_id;

  -- 5. Return the created profile as JSON
  SELECT row_to_json(p)
    INTO v_result
    FROM public.profiles p
   WHERE p.id = v_new_id;

  RETURN v_result;
END;
$$;

-- Grant execute to authenticated users only
REVOKE ALL ON FUNCTION public.create_guest_profile FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_guest_profile TO authenticated;
