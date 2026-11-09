-- ==============================================================================
-- MIGRATION M1: Extend course_enrollments with payment plan columns
-- ==============================================================================

ALTER TABLE public.course_enrollments
  ADD COLUMN IF NOT EXISTS agreed_price numeric(12,2),
  ADD COLUMN IF NOT EXISTS installments_count int DEFAULT 1,
  ADD COLUMN IF NOT EXISTS installment_amount numeric(12,2),
  ADD COLUMN IF NOT EXISTS installments_paid int DEFAULT 0,
  ADD COLUMN IF NOT EXISTS next_due_date timestamptz,
  ADD COLUMN IF NOT EXISTS expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS payment_plan_status text DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS notes text,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'course_enrollments_payment_plan_status_check'
  ) THEN
    ALTER TABLE public.course_enrollments
      ADD CONSTRAINT course_enrollments_payment_plan_status_check
      CHECK (payment_plan_status IN ('pending_payment', 'active', 'grace_period', 'suspended', 'completed', 'cancelled', 'scholarship'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_course_enrollments_payment_plan_status
  ON public.course_enrollments (payment_plan_status);

CREATE INDEX IF NOT EXISTS idx_course_enrollments_next_due_date
  ON public.course_enrollments (next_due_date);
