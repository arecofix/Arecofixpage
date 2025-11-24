-- Fix purchases status check constraint
-- The database likely has a constraint that doesn't include 'received' or 'ordered'

-- Drop the existing constraint
ALTER TABLE purchases DROP CONSTRAINT IF EXISTS purchases_status_check;

-- Add a new constraint with the correct values
-- We allow: 'received', 'ordered', 'pending', 'cancelled'
ALTER TABLE purchases 
ADD CONSTRAINT purchases_status_check 
CHECK (status IN ('received', 'ordered', 'pending', 'cancelled', 'completed'));
