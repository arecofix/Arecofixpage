-- ==============================================================================
-- MIGRATION M3: Extend cash_movements with reference_type and 'academy' category
-- ==============================================================================

ALTER TABLE public.cash_movements
  ADD COLUMN IF NOT EXISTS reference_type text;

-- Backfill reference_type on historical rows
UPDATE public.cash_movements
SET reference_type = 'order'
WHERE category = 'sale' AND reference_id IS NOT NULL AND reference_type IS NULL;

UPDATE public.cash_movements
SET reference_type = 'repair'
WHERE category = 'repair' AND reference_id IS NOT NULL AND reference_type IS NULL;

-- Update category check constraint to include 'academy'
ALTER TABLE public.cash_movements
  DROP CONSTRAINT IF EXISTS cash_movements_category_check;

ALTER TABLE public.cash_movements
  ADD CONSTRAINT cash_movements_category_check
  CHECK (category = ANY (ARRAY[
    'sale'::text, 'purchase'::text, 'repair'::text, 'adjustment'::text, 
    'draw'::text, 'scholarship'::text, 'external_salary'::text, 
    'fixed_expense'::text, 'petty_expense'::text, 'investment'::text, 
    'other'::text, 'academy'::text
  ]));

CREATE INDEX IF NOT EXISTS idx_cash_movements_category_academy
  ON public.cash_movements (category) WHERE category = 'academy';

