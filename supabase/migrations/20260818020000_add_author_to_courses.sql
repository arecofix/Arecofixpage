-- Add author_id to courses for instructor assignment
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
