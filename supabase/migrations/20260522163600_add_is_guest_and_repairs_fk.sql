-- Migration: Add is_guest to profiles and repairs_client_id_fkey constraint

-- ─── 1. Add is_guest column to public.profiles ───────────────────────────
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_guest boolean DEFAULT false;

-- ─── 2. Clean up orphaned client_ids in public.repairs before adding FK ──
-- This prevents constraint creation from failing if client_id references non-existent profile IDs.
UPDATE public.repairs r
SET client_id = NULL
WHERE client_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = r.client_id
  );

-- ─── 3. Add foreign key constraint to public.repairs ─────────────────────
ALTER TABLE public.repairs DROP CONSTRAINT IF EXISTS repairs_client_id_fkey;

ALTER TABLE public.repairs
  ADD CONSTRAINT repairs_client_id_fkey
  FOREIGN KEY (client_id)
  REFERENCES public.profiles(id)
  ON DELETE SET NULL;
