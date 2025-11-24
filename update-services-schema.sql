-- ==========================================
-- FIX SERVICES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  duration_minutes INTEGER DEFAULT 60,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add columns if they are missing
ALTER TABLE services ADD COLUMN IF NOT EXISTS name VARCHAR(255);
ALTER TABLE services ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS price DECIMAL(10,2) DEFAULT 0;
ALTER TABLE services ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 60;
ALTER TABLE services ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- ==========================================
-- PERMISSIONS (RLS)
-- ==========================================
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Policies for services
DROP POLICY IF EXISTS "Public read services" ON services;
CREATE POLICY "Public read services" ON services FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated insert services" ON services;
CREATE POLICY "Authenticated insert services" ON services FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated update services" ON services;
CREATE POLICY "Authenticated update services" ON services FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated delete services" ON services;
CREATE POLICY "Authenticated delete services" ON services FOR DELETE TO authenticated USING (true);

-- Notify schema cache reload
NOTIFY pgrst, 'reload schema';
