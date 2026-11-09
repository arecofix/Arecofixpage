-- ==============================================================================
-- MIGRATION M4: Atomic register_academy_payment RPC function
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.register_academy_payment(
  p_enrollment_id uuid,
  p_amount numeric,
  p_payment_method text,
  p_paid_at timestamptz DEFAULT now(),
  p_period_number int DEFAULT NULL,
  p_notes text DEFAULT NULL,
  p_created_by uuid DEFAULT NULL
) RETURNS public.academy_payments
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_enrollment public.course_enrollments;
  v_payment public.academy_payments;
  v_receipt text;
  v_new_due timestamptz;
  v_new_expires timestamptz;
  v_new_status text;
  v_new_paid_count int;
  v_creator_id uuid;
  v_tenant_id uuid;
  v_period int;
BEGIN
  -- 1. Validar monto
  IF p_amount IS NULL OR p_amount <= 0 THEN
    RAISE EXCEPTION 'El monto del pago debe ser mayor a cero';
  END IF;

  -- 2. Validar enrollment y lock para update
  SELECT * INTO v_enrollment
  FROM public.course_enrollments
  WHERE id = p_enrollment_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Enrollment no encontrado';
  END IF;

  IF v_enrollment.payment_plan_status IN ('cancelled', 'completed') THEN
    RAISE EXCEPTION 'Enrollment no admite pagos en estado %', v_enrollment.payment_plan_status;
  END IF;

  v_tenant_id := COALESCE(v_enrollment.tenant_id, get_my_tenant());
  v_creator_id := COALESCE(p_created_by, auth.uid());
  v_new_paid_count := COALESCE(v_enrollment.installments_paid, 0) + 1;
  v_period := COALESCE(p_period_number, v_new_paid_count);

  -- 3. Generar receipt_number único
  v_receipt := 'REC-ACAD-' || to_char(COALESCE(p_paid_at, now()), 'YYYYMMDD') || '-' || upper(substr(gen_random_uuid()::text, 1, 6));

  -- 4. Insertar pago
  INSERT INTO public.academy_payments (
    tenant_id,
    user_id,
    enrollment_id,
    amount,
    currency_id,
    status,
    payment_method_id,
    paid_at,
    receipt_number,
    period_number,
    notes,
    created_by
  ) VALUES (
    v_tenant_id,
    v_enrollment.user_id,
    p_enrollment_id,
    p_amount,
    'ARS',
    'approved',
    COALESCE(p_payment_method, 'cash'),
    COALESCE(p_paid_at, now()),
    v_receipt,
    v_period,
    p_notes,
    v_creator_id
  ) RETURNING * INTO v_payment;

  -- 5. Insertar movimiento de caja
  INSERT INTO public.cash_movements (
    tenant_id,
    type,
    category,
    amount,
    payment_method,
    notes,
    reference_id,
    reference_type,
    created_by,
    created_at
  ) VALUES (
    v_tenant_id,
    'income',
    'academy',
    p_amount,
    COALESCE(p_payment_method, 'cash'),
    'Cobro academia — ' || v_receipt,
    v_payment.id,
    'academy_payment',
    v_creator_id,
    COALESCE(p_paid_at, now())
  );

  -- 6. Calcular nuevos vencimientos y estado del enrollment
  IF v_new_paid_count >= COALESCE(v_enrollment.installments_count, 1) THEN
    v_new_due := NULL;
    v_new_expires := COALESCE(v_enrollment.expires_at, COALESCE(p_paid_at, now())) + INTERVAL '1 year';
    v_new_status := 'completed';
  ELSE
    IF v_enrollment.next_due_date IS NOT NULL AND v_enrollment.next_due_date > COALESCE(p_paid_at, now()) THEN
      v_new_due := v_enrollment.next_due_date + INTERVAL '1 month';
    ELSE
      v_new_due := COALESCE(p_paid_at, now()) + INTERVAL '1 month';
    END IF;
    v_new_expires := v_new_due + INTERVAL '7 days';
    v_new_status := 'active';
  END IF;

  UPDATE public.course_enrollments
  SET installments_paid = v_new_paid_count,
      next_due_date = v_new_due,
      expires_at = v_new_expires,
      payment_plan_status = v_new_status,
      status = 'confirmed',
      updated_at = now()
  WHERE id = p_enrollment_id;

  RETURN v_payment;
END;
$$;

GRANT EXECUTE ON FUNCTION public.register_academy_payment(uuid, numeric, text, timestamptz, int, text, uuid) TO authenticated, service_role;

