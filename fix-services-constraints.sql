-- Comprehensive fix for services table constraints
-- Make all problematic NOT NULL columns nullable or add defaults

-- Make title nullable (if it exists)
ALTER TABLE services ALTER COLUMN title DROP NOT NULL;

-- Make slug nullable or add a default
ALTER TABLE services ALTER COLUMN slug DROP NOT NULL;

-- Alternatively, you can set a default value for slug based on name
-- This requires a function to generate slugs, but for now we'll just make it nullable

-- If you want to auto-generate slugs from name in the future, you can add a trigger
-- For now, the application should handle slug generation or we make it optional
