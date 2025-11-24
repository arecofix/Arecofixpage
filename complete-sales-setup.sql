-- ==========================================
-- 1. FIX SALES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id UUID REFERENCES profiles(id),
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  status VARCHAR(50) DEFAULT 'completed',
  payment_method VARCHAR(50) DEFAULT 'cash',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add columns if they are missing
ALTER TABLE sales ADD COLUMN IF NOT EXISTS staff_id UUID REFERENCES profiles(id);
ALTER TABLE sales ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE sales ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'completed';
ALTER TABLE sales ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'cash';

-- ==========================================
-- 2. FIX SALE ITEMS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS sale_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- 3. CREATE DECREMENT_STOCK FUNCTION
-- ==========================================
CREATE OR REPLACE FUNCTION decrement_stock(row_id UUID, amount INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE products
  SET stock = stock - amount
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- 4. FIX INVOICES TABLE
-- ==========================================
-- The code tries to insert: sale_id, total_amount, type, issued_at
-- We need to make sure these columns exist and constraints are compatible

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE invoices ADD COLUMN IF NOT EXISTS sale_id UUID REFERENCES sales(id);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10,2) DEFAULT 0;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'B';
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS issued_at TIMESTAMP DEFAULT NOW();

-- Relax constraints that might be blocking insert if they exist from previous setup
ALTER TABLE invoices ALTER COLUMN invoice_number DROP NOT NULL;
ALTER TABLE invoices ALTER COLUMN customer_name DROP NOT NULL;

-- ==========================================
-- 5. PERMISSIONS (RLS)
-- ==========================================
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Re-create policies to ensure access
DROP POLICY IF EXISTS "Authenticated insert sales" ON sales;
CREATE POLICY "Authenticated insert sales" ON sales FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated select sales" ON sales;
CREATE POLICY "Authenticated select sales" ON sales FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated insert sale_items" ON sale_items;
CREATE POLICY "Authenticated insert sale_items" ON sale_items FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated select sale_items" ON sale_items;
CREATE POLICY "Authenticated select sale_items" ON sale_items FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated insert invoices" ON invoices;
CREATE POLICY "Authenticated insert invoices" ON invoices FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated select invoices" ON invoices;
CREATE POLICY "Authenticated select invoices" ON invoices FOR SELECT TO authenticated USING (true);

-- Notify schema cache reload (works in some Supabase environments)
NOTIFY pgrst, 'reload schema';
