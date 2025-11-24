-- Create sales table if it doesn't exist, or add missing columns
CREATE TABLE IF NOT EXISTS sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id UUID REFERENCES profiles(id),
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  status VARCHAR(50) DEFAULT 'completed',
  payment_method VARCHAR(50) DEFAULT 'cash',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add columns if table exists but columns are missing
ALTER TABLE sales 
ADD COLUMN IF NOT EXISTS staff_id UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'completed',
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'cash';

-- Create sale_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS sale_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add columns to sale_items if needed
ALTER TABLE sale_items
ADD COLUMN IF NOT EXISTS sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES products(id),
ADD COLUMN IF NOT EXISTS quantity INTEGER NOT NULL DEFAULT 1,
ADD COLUMN IF NOT EXISTS unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10,2) NOT NULL DEFAULT 0;

-- Enable RLS
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;

-- Policies for sales
DROP POLICY IF EXISTS "Allow authenticated users to insert sales" ON sales;
CREATE POLICY "Allow authenticated users to insert sales"
  ON sales FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users to view sales" ON sales;
CREATE POLICY "Allow authenticated users to view sales"
  ON sales FOR SELECT
  TO authenticated
  USING (true);

-- Policies for sale_items
DROP POLICY IF EXISTS "Allow authenticated users to insert sale_items" ON sale_items;
CREATE POLICY "Allow authenticated users to insert sale_items"
  ON sale_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users to view sale_items" ON sale_items;
CREATE POLICY "Allow authenticated users to view sale_items"
  ON sale_items FOR SELECT
  TO authenticated
  USING (true);
