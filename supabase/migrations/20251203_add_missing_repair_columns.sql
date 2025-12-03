-- Add missing columns to repairs table
ALTER TABLE repairs 
ADD COLUMN IF NOT EXISTS imei TEXT,
ADD COLUMN IF NOT EXISTS security_pin TEXT,
ADD COLUMN IF NOT EXISTS security_pattern TEXT,
ADD COLUMN IF NOT EXISTS deposit_amount NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS checklist JSONB DEFAULT '{"charger": false, "battery": false, "chip": false, "sd": false, "case": false}'::jsonb,
ADD COLUMN IF NOT EXISTS repair_number SERIAL,
ADD COLUMN IF NOT EXISTS technician_notes TEXT;
