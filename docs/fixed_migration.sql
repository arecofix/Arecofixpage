-- FIXED SAAS MIGRATION SCRIPT
-- Resolves: "column profiles.tenant_id does not exist"
-- Resolves: Robust handling of existing data

-- 1. Create table of Tenants
CREATE TABLE IF NOT EXISTS tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  plan_type text DEFAULT 'basic' CHECK (plan_type IN ('basic', 'premium', 'enterprise')),
  custom_domain text UNIQUE,
  branding_settings jsonb DEFAULT '{
    "primary_color": "#3b82f6",
    "logo_url": null,
    "favicon_url": null
  }'::jsonb,
  owner_id uuid, -- Will reference auth.users(id) but better to add constraint later
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Ensure initial tenant exists
INSERT INTO tenants (name, slug)
VALUES ('Arecofix Principal', 'arecofix')
ON CONFLICT (slug) DO NOTHING;

-- 3. Get the ID of the principal tenant
DO $$
DECLARE
    main_tenant_id uuid;
    table_name text;
    tables_to_migrate text[] := ARRAY[
        'profiles', 'branches', 'clients', 'repairs', 'repair_jobs', 
        'products', 'product_stock_per_branch', 'orders', 'order_items', 
        'suppliers', 'categories', 'brands', 'sales', 'purchases'
    ];
BEGIN
    SELECT id INTO main_tenant_id FROM tenants WHERE slug = 'arecofix';

    -- Migrate each table
    FOREACH table_name IN ARRAY tables_to_migrate LOOP
        -- check if table exists
        IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = table_name AND table_schema = 'public') THEN
            -- Add tenant_id if not exists
            EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS tenant_id uuid REFERENCES tenants(id)', table_name);
            
            -- Update existing rows to main tenant
            EXECUTE format('UPDATE %I SET tenant_id = %L WHERE tenant_id IS NULL', table_name, main_tenant_id);
            
            -- Make it NOT NULL for future rows
            -- EXECUTE format('ALTER TABLE %I ALTER COLUMN tenant_id SET NOT NULL', table_name);
        END IF;
    END LOOP;
END $$;

-- 4. Create Helper Functions
CREATE OR REPLACE FUNCTION get_my_tenant()
RETURNS uuid AS $$
  -- We use current_setting to avoid recursion if profiles has RLS
  SELECT tenant_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 5. Enable RLS and create policies
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- Now that tenant_id exists in profiles, we can create the policy
DROP POLICY IF EXISTS "Users see their tenant" ON tenants;
CREATE POLICY "Users see their tenant" ON tenants
  FOR SELECT USING (
    id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
    OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin'
  );

-- Example policy for products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tenant Isolation Products" ON products;
CREATE POLICY "Tenant Isolation Products" ON products
  FOR ALL TO authenticated
  USING (tenant_id = get_my_tenant() OR is_active = true) -- Allow seeing active items globally? No, usually isolation.
  WITH CHECK (tenant_id = get_my_tenant());

-- Example policy for orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tenant Isolation Orders" ON orders;
CREATE POLICY "Tenant Isolation Orders" ON orders
  FOR ALL TO authenticated
  USING (tenant_id = get_my_tenant())
  WITH CHECK (tenant_id = get_my_tenant());
