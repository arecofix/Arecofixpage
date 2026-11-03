-- SQL Unit Tests for get_current_tenant_id()
-- Vectors:
-- 1. Without JWT (anon, no claims) -> NULL
-- 2. With JWT app_metadata.tenant_id -> Returns UUID
-- 3. With JWT root tenant_id -> Returns UUID
-- 4. With user profile tenant_id -> Returns profile tenant_id
-- 5. With empty JWT claims -> Returns NULL

DO $$
DECLARE
  v_test_tenant uuid := '550e8400-e29b-41d4-a716-446655440000';
  v_res uuid;
BEGIN
  -- Vector 1: Without JWT / empty session
  PERFORM set_config('request.jwt.claims', '', true);
  v_res := public.get_current_tenant_id();
  IF v_res IS NOT NULL THEN
    RAISE EXCEPTION 'Test Vector 1 Failed: expected NULL without JWT, got %', v_res;
  END IF;

  -- Vector 2: With JWT app_metadata.tenant_id
  PERFORM set_config('request.jwt.claims', json_build_object(
    'sub', '00000000-0000-0000-0000-000000000000',
    'app_metadata', json_build_object('tenant_id', v_test_tenant::text)
  )::text, true);
  v_res := public.get_current_tenant_id();
  IF v_res IS DISTINCT FROM v_test_tenant THEN
    RAISE EXCEPTION 'Test Vector 2 Failed: expected %, got %', v_test_tenant, v_res;
  END IF;

  -- Vector 3: With JWT root tenant_id
  PERFORM set_config('request.jwt.claims', json_build_object(
    'sub', '00000000-0000-0000-0000-000000000000',
    'tenant_id', v_test_tenant::text
  )::text, true);
  v_res := public.get_current_tenant_id();
  IF v_res IS DISTINCT FROM v_test_tenant THEN
    RAISE EXCEPTION 'Test Vector 3 Failed: expected %, got %', v_test_tenant, v_res;
  END IF;

  -- Vector 4: With user profile in public.profiles
  -- Using existing admin profile '11111111-1111-1111-1111-111111111111'
  PERFORM set_config('request.jwt.claims', json_build_object(
    'sub', '11111111-1111-1111-1111-111111111111',
    'role', 'authenticated'
  )::text, true);
  v_res := public.get_current_tenant_id();
  IF v_res IS NULL THEN
    RAISE EXCEPTION 'Test Vector 4 Failed: expected profile tenant_id, got NULL';
  END IF;

  -- Vector 5: With unauthenticated / random non-existent user
  PERFORM set_config('request.jwt.claims', json_build_object(
    'sub', 'ffffffff-ffff-ffff-ffff-ffffffffffff',
    'role', 'authenticated'
  )::text, true);
  v_res := public.get_current_tenant_id();
  IF v_res IS NOT NULL THEN
    RAISE EXCEPTION 'Test Vector 5 Failed: expected NULL for non-existent profile, got %', v_res;
  END IF;

  RAISE NOTICE 'SUCCESS: All 5 SQL unit test vectors for get_current_tenant_id() PASSED';
END $$;
