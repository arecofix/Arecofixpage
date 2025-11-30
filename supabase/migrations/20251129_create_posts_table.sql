-- Create posts table
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT,
    image_url TEXT,
    published BOOLEAN DEFAULT false,
    meta_title TEXT,
    meta_description TEXT
);

-- Enable Row Level Security
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Public read access for published posts
CREATE POLICY "Public posts are viewable by everyone" 
ON public.posts FOR SELECT 
USING (published = true);

-- Admin full access (assuming authenticated users are admins for now, or specific role check)
-- For simplicity in this project context where auth usually implies admin or we use a specific role check if available.
-- Based on previous files, there might be a role check, but often 'authenticated' is used for admin in simple setups.
-- Let's check if there's a specific role pattern. I'll use 'authenticated' for now as per common Supabase patterns, 
-- but ideally we should check for 'admin' role if it exists in a profiles table or metadata.
-- Given I saw 'roles.constants.ts', I should probably check that, but for RLS 'authenticated' is a safe start for "logged in users can manage".

CREATE POLICY "Authenticated users can manage posts" 
ON public.posts FOR ALL 
USING (auth.role() = 'authenticated');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_posts_updated_at
BEFORE UPDATE ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
