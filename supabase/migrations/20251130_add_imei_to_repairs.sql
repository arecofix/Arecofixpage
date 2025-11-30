-- Add IMEI column to repairs table
ALTER TABLE public.repairs
ADD COLUMN IF NOT EXISTS imei text;
