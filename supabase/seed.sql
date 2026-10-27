-- Supabase Seed Data

-- 1. Create a Super Admin User in auth.users
-- Password is 'Password123!' (we just mock the hash for local testing)
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    '11111111-1111-1111-1111-111111111111', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'admin@arecofix.com', 
    '$2a$10$wE9K2s.V8vLq4y1yvY0QOuC/fO9k6qgZ.P0jM7c9O4l7.K.T9n.22', 
    now(), 
    now(), 
    now()
) ON CONFLICT DO NOTHING;

-- 2. Create the main Tenant
INSERT INTO public.tenants (id, name, slug, plan_type, custom_domain, is_active, currency, tax_percentage)
VALUES (
    'bba26ccd-59ce-471c-aac0-4c1f5513de3b',
    'Arecofix Central',
    'arecofix',
    'premium',
    'localhost', -- Important for local SSR to find it via hostname 'localhost'
    true,
    'ARS',
    21
) ON CONFLICT DO NOTHING;

-- 3. Create the Admin Profile
INSERT INTO public.profiles (id, email, first_name, last_name, role, is_active, tenant_id)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'admin@arecofix.com',
    'Super',
    'Admin',
    'super_admin',
    true,
    'bba26ccd-59ce-471c-aac0-4c1f5513de3b'
) ON CONFLICT DO NOTHING;

-- 4. Create Secondary Tenant for multi-tenant isolation testing
INSERT INTO public.tenants (id, name, slug, plan_type, custom_domain, is_active, currency, tax_percentage)
VALUES (
    '00e4e8be-6e62-4713-96ab-be14d71710ac',
    'Test Tenant B',
    'test-tenant-b',
    'basic',
    'tenant-b.localhost',
    true,
    'ARS',
    21
) ON CONFLICT DO NOTHING;

-- 5. Test products for Cart & Checkout testing
INSERT INTO public.products (id, tenant_id, name, slug, price, currency, stock, is_active)
VALUES 
    ('44444444-4444-4444-4444-444444444444', 'bba26ccd-59ce-471c-aac0-4c1f5513de3b', 'Test Product Tenant A', 'test-product-tenant-a', 50000, 'ARS', 10, true),
    ('55555555-5555-5555-5555-555555555555', '00e4e8be-6e62-4713-96ab-be14d71710ac', 'Test Product Tenant B', 'test-product-tenant-b', 75000, 'ARS', 5, true)
ON CONFLICT DO NOTHING;

-- 6. Dedicated Test Admin for Automated Cypress Security Audit Suites
DO $$
DECLARE
  v_test_admin_uid uuid := '22222222-2222-2222-2222-222222222222';
  v_tenant_uid uuid := 'bba26ccd-59ce-471c-aac0-4c1f5513de3b';
  v_test_admin_email text := 'testadmin@arecofix.com';
BEGIN
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    confirmation_token, recovery_token, email_change, email_change_token_new, email_change_token_current,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    v_test_admin_uid,
    '00000000-0000-0000-0000-000000000000',
    '',
    'authenticated',
    v_test_admin_email,
    crypt('SecretTestUser2026!#', gen_salt('bf', 10)),
    NOW(),
    '', '', '', '', '',
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Cypress Test Admin","tenant_id":"bba26ccd-59ce-471c-aac0-4c1f5513de3b","role":"super_admin"}'::jsonb,
    NOW(), NOW()
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

  INSERT INTO auth.identities (
    id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    v_test_admin_uid::text,
    v_test_admin_uid,
    json_build_object('sub', v_test_admin_uid::text, 'email', v_test_admin_email, 'email_verified', true, 'phone_verified', false),
    'email',
    NOW(), NOW(), NOW()
  )
  ON CONFLICT (provider, provider_id) DO UPDATE SET
    identity_data = EXCLUDED.identity_data,
    updated_at = NOW();

  INSERT INTO public.profiles (
    id, email, first_name, last_name, role, tenant_id, is_active, is_guest, created_at, updated_at
  ) VALUES (
    v_test_admin_uid,
    v_test_admin_email,
    'Cypress',
    'TestAdmin',
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
END $$;


