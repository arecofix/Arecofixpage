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
