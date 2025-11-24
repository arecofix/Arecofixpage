-- ==========================================
-- FIX PURCHASES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID REFERENCES suppliers(id),
  purchase_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(50) DEFAULT 'received',
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add columns if they are missing
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS supplier_id UUID REFERENCES suppliers(id);
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS purchase_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'received';
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10,2) NOT NULL DEFAULT 0;

-- ==========================================
-- FIX PURCHASE ITEMS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS purchase_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  purchase_id UUID REFERENCES purchases(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add columns if they are missing
ALTER TABLE purchase_items ADD COLUMN IF NOT EXISTS purchase_id UUID REFERENCES purchases(id) ON DELETE CASCADE;
ALTER TABLE purchase_items ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES products(id);
ALTER TABLE purchase_items ADD COLUMN IF NOT EXISTS quantity INTEGER NOT NULL DEFAULT 1;
ALTER TABLE purchase_items ADD COLUMN IF NOT EXISTS unit_cost DECIMAL(10,2) NOT NULL DEFAULT 0;

-- ==========================================
-- PERMISSIONS (RLS)
-- ==========================================
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_items ENABLE ROW LEVEL SECURITY;

-- Policies for purchases
DROP POLICY IF EXISTS "Authenticated insert purchases" ON purchases;
CREATE POLICY "Authenticated insert purchases" ON purchases FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated select purchases" ON purchases;
CREATE POLICY "Authenticated select purchases" ON purchases FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated update purchases" ON purchases;
CREATE POLICY "Authenticated update purchases" ON purchases FOR UPDATE TO authenticated USING (true);

-- Policies for purchase_items
DROP POLICY IF EXISTS "Authenticated insert purchase_items" ON purchase_items;
CREATE POLICY "Authenticated insert purchase_items" ON purchase_items FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated select purchase_items" ON purchase_items;
CREATE POLICY "Authenticated select purchase_items" ON purchase_items FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated update purchase_items" ON purchase_items;
CREATE POLICY "Authenticated update purchase_items" ON purchase_items FOR UPDATE TO authenticated USING (true);

-- Notify schema cache reload
NOTIFY pgrst, 'reload schema';
