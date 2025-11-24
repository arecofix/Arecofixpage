-- Fix services table title column issue
-- The database has a 'title' column but the app uses 'name'
-- We'll make title nullable or drop it if name exists

-- Option 1: Make title nullable (safer)
ALTER TABLE services ALTER COLUMN title DROP NOT NULL;

-- Option 2: If you want to use 'name' instead of 'title', rename the column
-- ALTER TABLE services RENAME COLUMN title TO name;

-- If the table already has both columns and you want to keep 'name', drop title
-- ALTER TABLE services DROP COLUMN IF EXISTS title;
