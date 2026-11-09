-- ==============================================================================
-- MIGRATION M2: Extend academy_payments to support single-course installments
-- ==============================================================================

ALTER TABLE public.academy_payments
  ALTER COLUMN subscription_id DROP NOT NULL,
  ALTER COLUMN mp_payment_id DROP NOT NULL;

ALTER TABLE public.academy_payments
  ADD COLUMN IF NOT EXISTS enrollment_id uuid REFERENCES public.course_enrollments(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS receipt_number text UNIQUE,
  ADD COLUMN IF NOT EXISTS period_number int,
  ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES public.profiles(id),
  ADD COLUMN IF NOT EXISTS notes text,
  ADD COLUMN IF NOT EXISTS receipt_pdf_url text;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'academy_payments_target_check'
  ) THEN
    ALTER TABLE public.academy_payments
      ADD CONSTRAINT academy_payments_target_check
      CHECK (subscription_id IS NOT NULL OR enrollment_id IS NOT NULL);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_academy_payments_enrollment_id
  ON public.academy_payments (enrollment_id);

CREATE INDEX IF NOT EXISTS idx_academy_payments_receipt_number
  ON public.academy_payments (receipt_number);

