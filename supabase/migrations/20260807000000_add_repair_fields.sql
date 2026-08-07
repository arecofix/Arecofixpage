-- Migration: 20260807000000_add_repair_fields
-- Purpose: Adds cost_at_time to repair_parts_used, and supplier_id/warranty to repairs

-- 1. Add cost_at_time to repair_parts_used if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'repair_parts_used' AND column_name = 'cost_at_time') THEN
        ALTER TABLE public.repair_parts_used ADD COLUMN cost_at_time numeric DEFAULT 0 CHECK (cost_at_time >= 0);
    END IF;
END $$;

-- 2. Add warranty to repairs if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'repairs' AND column_name = 'warranty') THEN
        ALTER TABLE public.repairs ADD COLUMN warranty text;
    END IF;
END $$;

-- 3. Add supplier_id to repairs if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'repairs' AND column_name = 'supplier_id') THEN
        ALTER TABLE public.repairs ADD COLUMN supplier_id uuid REFERENCES public.suppliers(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 4. Grant necessary permissions just in case
GRANT ALL ON public.repair_parts_used TO authenticated;
GRANT ALL ON public.repairs TO authenticated;
