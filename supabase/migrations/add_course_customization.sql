-- Add new customizable fields to the 'courses' table

ALTER TABLE courses
ADD COLUMN IF NOT EXISTS classes_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS hours_content integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS hours_practice integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS hours_per_week text,
ADD COLUMN IF NOT EXISTS instructor_role text,
ADD COLUMN IF NOT EXISTS instructor_bio text,
ADD COLUMN IF NOT EXISTS instructor_avatar text,
ADD COLUMN IF NOT EXISTS audience_list jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS reviews_count integer DEFAULT 0;

-- Optional: Since we are adding new columns that Supabase JS client will query,
-- ensure RLS policies don't need changes (they usually apply to the row, not columns).
-- However, we must ensure PostgREST cache is refreshed if needed (done automatically by Supabase usually).
