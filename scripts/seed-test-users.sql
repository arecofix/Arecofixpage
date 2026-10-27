-- ==============================================================================
-- scripts/seed-test-users.sql
-- Seeds deterministic test users for E2E / Security suites
-- Fixes GoTrue self-hosted aud alignment and identities mapping
-- ==============================================================================

DO $$
DECLARE
  v_admin_uid uuid := '22222222-2222-2222-2222-222222222222';
  v_tenant_uid uuid := 'bba26ccd-59ce-471c-aac0-4c1f5513de3b';
  v_admin_email text := 'testadmin@arecofix.com';
BEGIN
  -- 1. Ensure test admin in auth.users with proper aud and non-null tokens for GoTrue self-hosted
  INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_token,
    recovery_token,
    email_change,
    email_change_token_new,
    email_change_token_current,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  ) VALUES (
    v_admin_uid,
    '00000000-0000-0000-0000-000000000000',
    '', -- Essential fix: empty aud prevents GoTrue 400 invalid credentials on self-hosted
    'authenticated',
    v_admin_email,
    crypt('SecretTestUser2026!#', gen_salt('bf', 10)),
    NOW(),
    '',
    '',
    '',
    '',
    '',
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Test Admin","tenant_id":"bba26ccd-59ce-471c-aac0-4c1f5513de3b","role":"super_admin"}'::jsonb,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    aud = '',
    email = EXCLUDED.email,
    email_confirmed_at = COALESCE(auth.users.email_confirmed_at, NOW()),
    confirmation_token = COALESCE(auth.users.confirmation_token, ''),
    recovery_token = COALESCE(auth.users.recovery_token, ''),
    email_change = COALESCE(auth.users.email_change, ''),
    email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
    email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
    raw_user_meta_data = COALESCE(auth.users.raw_user_meta_data, EXCLUDED.raw_user_meta_data),
    updated_at = NOW();

  -- 2. Ensure auth.identities has valid email provider entry
  INSERT INTO auth.identities (
    id,
    provider_id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    v_admin_uid::text,
    v_admin_uid,
    json_build_object('sub', v_admin_uid::text, 'email', v_admin_email, 'email_verified', true, 'phone_verified', false),
    'email',
    NOW(),
    NOW(),
    NOW()
  )
  ON CONFLICT (provider, provider_id) DO UPDATE SET
    identity_data = EXCLUDED.identity_data,
    updated_at = NOW();

  -- 3. Ensure public.profiles matches
  INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name,
    role,
    tenant_id,
    is_active,
    is_guest,
    created_at,
    updated_at
  ) VALUES (
    v_admin_uid,
    v_admin_email,
    'Test',
    'Admin',
    'super_admin',
    v_tenant_uid,
    true,
    false,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    role = 'super_admin',
    tenant_id = v_tenant_uid,
    is_active = true,
    updated_at = NOW();

  RAISE NOTICE 'Test user seeded successfully with aud alignment.';
END $$;
