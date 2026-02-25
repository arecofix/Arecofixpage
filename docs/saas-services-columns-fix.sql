-- Fix the `services` table schema to match the Angular Frontend Application
-- Renames columns and adds missing properties

-- 1. Rename 'title' to 'name' if it exists
DO $$ 
BEGIN
  IF EXISTS(SELECT *
    FROM information_schema.columns
    WHERE table_name='services' and column_name='title')
  THEN
      ALTER TABLE public.services RENAME COLUMN title TO name;
  END IF;
END $$;

-- 2. Rename 'content' to 'description' if it exists
DO $$ 
BEGIN
  IF EXISTS(SELECT *
    FROM information_schema.columns
    WHERE table_name='services' and column_name='content')
  THEN
      ALTER TABLE public.services RENAME COLUMN content TO description;
  END IF;
END $$;

-- 3. Add 'is_active' column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS(SELECT *
    FROM information_schema.columns
    WHERE table_name='services' and column_name='is_active')
  THEN
      ALTER TABLE public.services ADD COLUMN is_active boolean DEFAULT true;
  END IF;
END $$;

-- 4. Reload PostgREST schema cache to immediately fix the API Error 400
NOTIFY pgrst, 'reload schema';
