-- ============================================
-- FIX ROW LEVEL SECURITY POLICIES FOR PRODUCTS
-- ============================================

-- First, enable RLS on products table (if not already enabled)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow authenticated users to view products" ON products;
DROP POLICY IF EXISTS "Allow authenticated users to insert products" ON products;
DROP POLICY IF EXISTS "Allow authenticated users to update products" ON products;
DROP POLICY IF EXISTS "Allow authenticated users to delete products" ON products;
DROP POLICY IF EXISTS "Allow public read access to products" ON products;

-- Create new policies

-- 1. Allow everyone (including anonymous users) to READ products
CREATE POLICY "Allow public read access to products"
  ON products FOR SELECT
  TO public
  USING (true);

-- 2. Allow authenticated users to INSERT products
CREATE POLICY "Allow authenticated users to insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 3. Allow authenticated users to UPDATE products
CREATE POLICY "Allow authenticated users to update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. Allow authenticated users to DELETE products
CREATE POLICY "Allow authenticated users to delete products"
  ON products FOR DELETE
  TO authenticated
  USING (true);
