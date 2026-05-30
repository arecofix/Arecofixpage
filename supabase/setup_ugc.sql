-- Run this in your Supabase SQL Editor to enable UGC (User-Generated Content)

-- 1. Add author_id and status to courses
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- Populate existing courses as published to not break current UI
UPDATE public.courses SET status = 'published' WHERE status = 'pending';

-- 2. Add author_id to blog_posts (it already has status)
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES auth.users(id);

-- Optional: Enable RLS policies for inserts by authenticated users
-- Create policy to allow authenticated users to insert courses (pending)
-- CREATE POLICY "Allow authenticated users to create courses" 
-- ON public.courses FOR INSERT TO authenticated WITH CHECK (true);

-- Create policy to allow authenticated users to insert posts (draft/pending)
-- CREATE POLICY "Allow authenticated users to create posts" 
-- ON public.blog_posts FOR INSERT TO authenticated WITH CHECK (true);
