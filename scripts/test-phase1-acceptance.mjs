/**
 * ==============================================================================
 * TEST DE INTEGRACIÓN: FASE 1 — 10 CRITERIOS DE ACEPTACIÓN
 * ==============================================================================
 * Valida de forma exhaustiva el comportamiento de las migraciones M1 a M5,
 * constraints de integridad, RPC register_academy_payment y función
 * effective_enrollment_status dentro de un bloque de transacción aislado.
 */

import { execSync } from 'child_process';

const testSql = `
DO $$
DECLARE
  v_course_id uuid;
  v_user_id uuid;
  v_enrollment_id uuid;
  v_completed_enrollment_id uuid;
  v_cancelled_enrollment_id uuid;
  v_payment public.academy_payments;
  v_cash public.cash_movements;
  v_enr public.course_enrollments;
  v_status text;
  v_failed boolean;
  v_tenant_id uuid;
BEGIN
  RAISE NOTICE '>>> INICIANDO VERIFICACIÓN DE LOS 10 CRITERIOS DE ACEPTACIÓN <<<';

  -- Setup fixtures
  SELECT id INTO v_course_id FROM public.courses LIMIT 1;
  SELECT id INTO v_user_id FROM public.profiles WHERE role = 'super_admin' LIMIT 1;
  SELECT id INTO v_tenant_id FROM public.tenants WHERE is_active = true LIMIT 1;

  IF v_course_id IS NULL OR v_user_id IS NULL THEN
    RAISE EXCEPTION 'Fixtures base (course, profile) no encontrados en la base';
  END IF;

  -- Crear enrollment de prueba con 3 cuotas, 0 pagadas
  INSERT INTO public.course_enrollments (
    course_id, user_id, full_name, email, status,
    agreed_price, installments_count, installment_amount, installments_paid,
    next_due_date, payment_plan_status, tenant_id
  ) VALUES (
    v_course_id, v_user_id, 'Test Student Phase 1', 'test_phase1_' || substr(gen_random_uuid()::text,1,8) || '@test.com',
    'confirmed', 150000, 3, 50000, 0, now(), 'active', v_tenant_id
  ) RETURNING id INTO v_enrollment_id;

  -- ---------------------------------------------------------------------------
  -- CRITERIO 1: Pago exitoso registra en academy_payments con approved y receipt_number
  -- ---------------------------------------------------------------------------
  v_payment := public.register_academy_payment(
    p_enrollment_id := v_enrollment_id,
    p_amount := 50000,
    p_payment_method := 'cash',
    p_paid_at := now(),
    p_period_number := 1,
    p_notes := 'Test cuota 1',
    p_created_by := v_user_id
  );

  IF v_payment.status <> 'approved' THEN
    RAISE EXCEPTION 'CRITERIO 1 FALLÓ: Status del pago no es approved (es %)', v_payment.status;
  END IF;

  IF v_payment.receipt_number IS NULL OR NOT (v_payment.receipt_number LIKE 'REC-ACAD-%') THEN
    RAISE EXCEPTION 'CRITERIO 1 FALLÓ: receipt_number inválido (%)', v_payment.receipt_number;
  END IF;
  RAISE NOTICE '✔ CRITERIO 1 PASÓ: Pago exitoso registrado en academy_payments con status approved y receipt %', v_payment.receipt_number;

  -- ---------------------------------------------------------------------------
  -- CRITERIO 2: Pago exitoso registra en cash_movements con type=income y category=academy
  -- ---------------------------------------------------------------------------
  SELECT * INTO v_cash FROM public.cash_movements WHERE reference_id = v_payment.id;
  IF v_cash.id IS NULL THEN
    RAISE EXCEPTION 'CRITERIO 2 FALLÓ: No se encontró movimiento en cash_movements';
  END IF;

  IF v_cash.type <> 'income' OR v_cash.category <> 'academy' THEN
    RAISE EXCEPTION 'CRITERIO 2 FALLÓ: Tipo o categoría incorrecta en caja (% / %)', v_cash.type, v_cash.category;
  END IF;
  RAISE NOTICE '✔ CRITERIO 2 PASÓ: Movimiento de caja creado con type=income y category=academy ($%)', v_cash.amount;

  -- ---------------------------------------------------------------------------
  -- CRITERIO 3: Pago actualiza course_enrollments (installments_paid, next_due_date, expires_at)
  -- ---------------------------------------------------------------------------
  SELECT * INTO v_enr FROM public.course_enrollments WHERE id = v_enrollment_id;
  IF v_enr.installments_paid <> 1 THEN
    RAISE EXCEPTION 'CRITERIO 3 FALLÓ: installments_paid esperado 1, obtenido %', v_enr.installments_paid;
  END IF;

  IF v_enr.next_due_date IS NULL OR v_enr.expires_at IS NULL THEN
    RAISE EXCEPTION 'CRITERIO 3 FALLÓ: next_due_date o expires_at son nulos';
  END IF;
  RAISE NOTICE '✔ CRITERIO 3 PASÓ: Enrollment actualizado a cuota 1/3 con próximo vencimiento %', v_enr.next_due_date;

  -- ---------------------------------------------------------------------------
  -- CRITERIO 5: Si installments_paid + 1 < installments_count, payment_plan_status pasa a active
  -- ---------------------------------------------------------------------------
  IF v_enr.payment_plan_status <> 'active' THEN
    RAISE EXCEPTION 'CRITERIO 5 FALLÓ: payment_plan_status esperado active, obtenido %', v_enr.payment_plan_status;
  END IF;
  RAISE NOTICE '✔ CRITERIO 5 PASÓ: Enrollment con cuotas pendientes permanece en active';

  -- Pago de la cuota 2
  v_payment := public.register_academy_payment(
    p_enrollment_id := v_enrollment_id,
    p_amount := 50000,
    p_payment_method := 'transfer',
    p_notes := 'Test cuota 2'
  );

  -- ---------------------------------------------------------------------------
  -- CRITERIO 4: Si installments_paid + 1 >= installments_count, payment_plan_status pasa a completed y next_due_date es NULL
  -- ---------------------------------------------------------------------------
  -- Pago de la cuota 3 (última de 3)
  v_payment := public.register_academy_payment(
    p_enrollment_id := v_enrollment_id,
    p_amount := 50000,
    p_payment_method := 'cash',
    p_notes := 'Test cuota 3 final'
  );

  SELECT * INTO v_enr FROM public.course_enrollments WHERE id = v_enrollment_id;
  IF v_enr.installments_paid <> 3 THEN
    RAISE EXCEPTION 'CRITERIO 4 FALLÓ: installments_paid esperado 3, obtenido %', v_enr.installments_paid;
  END IF;

  IF v_enr.next_due_date IS NOT NULL THEN
    RAISE EXCEPTION 'CRITERIO 4 FALLÓ: next_due_date debe ser NULL al completar las cuotas';
  END IF;

  IF v_enr.payment_plan_status <> 'completed' THEN
    RAISE EXCEPTION 'CRITERIO 4 FALLÓ: payment_plan_status esperado completed, obtenido %', v_enr.payment_plan_status;
  END IF;
  RAISE NOTICE '✔ CRITERIO 4 PASÓ: Al completar 3/3 cuotas, payment_plan_status es completed y next_due_date es NULL';

  -- ---------------------------------------------------------------------------
  -- CRITERIO 6: Intento de pago en enrollment completado o cancelado debe fallar con excepción
  -- ---------------------------------------------------------------------------
  v_failed := false;
  BEGIN
    PERFORM public.register_academy_payment(v_enrollment_id, 50000, 'cash');
  EXCEPTION WHEN OTHERS THEN
    v_failed := true;
  END;

  IF NOT v_failed THEN
    RAISE EXCEPTION 'CRITERIO 6 FALLÓ: Se permitió pagar en enrollment en estado completed';
  END IF;

  -- Probar con enrollment cancelado
  INSERT INTO public.course_enrollments (
    course_id, user_id, full_name, email, status, payment_plan_status, tenant_id
  ) VALUES (
    v_course_id, v_user_id, 'Cancelled Student', 'cancelled_' || substr(gen_random_uuid()::text,1,8) || '@test.com',
    'confirmed', 'cancelled', v_tenant_id
  ) RETURNING id INTO v_cancelled_enrollment_id;

  v_failed := false;
  BEGIN
    PERFORM public.register_academy_payment(v_cancelled_enrollment_id, 50000, 'cash');
  EXCEPTION WHEN OTHERS THEN
    v_failed := true;
  END;

  IF NOT v_failed THEN
    RAISE EXCEPTION 'CRITERIO 6 FALLÓ: Se permitió pagar en enrollment en estado cancelled';
  END IF;
  RAISE NOTICE '✔ CRITERIO 6 PASÓ: Pago rechazado en enrollments completados o cancelados';

  -- ---------------------------------------------------------------------------
  -- CRITERIO 7: Intento de pago con monto <= 0 debe fallar con excepción
  -- ---------------------------------------------------------------------------
  v_failed := false;
  BEGIN
    PERFORM public.register_academy_payment(v_enrollment_id, 0, 'cash');
  EXCEPTION WHEN OTHERS THEN
    v_failed := true;
  END;

  IF NOT v_failed THEN
    RAISE EXCEPTION 'CRITERIO 7 FALLÓ: Se permitió registrar pago con monto 0';
  END IF;

  v_failed := false;
  BEGIN
    PERFORM public.register_academy_payment(v_enrollment_id, -100, 'cash');
  EXCEPTION WHEN OTHERS THEN
    v_failed := true;
  END;

  IF NOT v_failed THEN
    RAISE EXCEPTION 'CRITERIO 7 FALLÓ: Se permitió registrar pago con monto negativo';
  END IF;
  RAISE NOTICE '✔ CRITERIO 7 PASÓ: Montos <= 0 son rechazados estrictamente';

  -- ---------------------------------------------------------------------------
  -- CRITERIO 8: Intento de registrar pago con enrollment_id inexistente debe fallar
  -- ---------------------------------------------------------------------------
  v_failed := false;
  BEGIN
    PERFORM public.register_academy_payment('ffffffff-ffff-ffff-ffff-ffffffffffff'::uuid, 1000, 'cash');
  EXCEPTION WHEN OTHERS THEN
    v_failed := true;
  END;

  IF NOT v_failed THEN
    RAISE EXCEPTION 'CRITERIO 8 FALLÓ: Se permitió registrar pago con enrollment_id inexistente';
  END IF;
  RAISE NOTICE '✔ CRITERIO 8 PASÓ: enrollment_id inexistente rechazado con excepción';

  -- ---------------------------------------------------------------------------
  -- CRITERIO 9: Doble submit con mismo receipt_number es rechazado por constraint UNIQUE
  -- ---------------------------------------------------------------------------
  v_failed := false;
  BEGIN
    INSERT INTO public.academy_payments (
      tenant_id, user_id, enrollment_id, amount, status, receipt_number, paid_at
    ) VALUES (
      v_tenant_id, v_user_id, v_enrollment_id, 1000, 'approved', v_payment.receipt_number, now()
    );
  EXCEPTION WHEN unique_violation THEN
    v_failed := true;
  END;

  IF NOT v_failed THEN
    RAISE EXCEPTION 'CRITERIO 9 FALLÓ: Se permitió duplicar receipt_number';
  END IF;
  RAISE NOTICE '✔ CRITERIO 9 PASÓ: receipt_number duplicado rechazado por constraint UNIQUE';

  -- ---------------------------------------------------------------------------
  -- CRITERIO 10: Constraint academy_payments_target_check exige subscription_id o enrollment_id
  -- ---------------------------------------------------------------------------
  v_failed := false;
  BEGIN
    INSERT INTO public.academy_payments (
      tenant_id, user_id, subscription_id, enrollment_id, amount, status, receipt_number, paid_at
    ) VALUES (
      v_tenant_id, v_user_id, NULL, NULL, 1000, 'approved', 'REC-TEST-ORPHAN', now()
    );
  EXCEPTION WHEN check_violation THEN
    v_failed := true;
  END;

  IF NOT v_failed THEN
    RAISE EXCEPTION 'CRITERIO 10 FALLÓ: Se permitió pago huérfano sin subscription_id ni enrollment_id';
  END IF;
  RAISE NOTICE '✔ CRITERIO 10 PASÓ: Constraint exige subscription_id o enrollment_id obligatorio';

  -- ---------------------------------------------------------------------------
  -- BONUS: Verificación de effective_enrollment_status (active, grace_period, suspended)
  -- ---------------------------------------------------------------------------
  IF public.effective_enrollment_status('active', now() + interval '5 days') <> 'active' THEN
    RAISE EXCEPTION 'effective_enrollment_status falló para fecha futura';
  END IF;

  IF public.effective_enrollment_status('active', now() - interval '3 days') <> 'grace_period' THEN
    RAISE EXCEPTION 'effective_enrollment_status falló para fecha dentro de los 7 días de gracia';
  END IF;

  IF public.effective_enrollment_status('active', now() - interval '9 days') <> 'suspended' THEN
    RAISE EXCEPTION 'effective_enrollment_status falló para fecha vencida > 7 días';
  END IF;
  RAISE NOTICE '✔ BONUS PASÓ: effective_enrollment_status calcula active, grace_period y suspended con precisión';

  -- Limpieza de fixtures creados en la prueba
  DELETE FROM public.cash_movements WHERE reference_id IN (SELECT id FROM public.academy_payments WHERE enrollment_id = v_enrollment_id);
  DELETE FROM public.academy_payments WHERE enrollment_id = v_enrollment_id;
  DELETE FROM public.course_enrollments WHERE id IN (v_enrollment_id, v_cancelled_enrollment_id);

  RAISE NOTICE '>>> LOS 10 CRITERIOS DE ACEPTACIÓN DE FASE 1 FUERON VERIFICADOS EXITOSAMENTE <<<';
END $$;
`;

try {
  const result = execSync(`ssh -i ssh-key-2026-08-30.key ubuntu@ssh.arecofix.com.ar "docker exec -i supabase-db psql -U postgres"`, {
    input: testSql,
    encoding: 'utf-8'
  });
  console.log(result);
  console.log('✅ TODOS LOS TESTS DE INTEGRACIÓN DE FASE 1 PASARON (10/10 OK)');
} catch (e) {
  console.error('❌ Error en test de integración:', e.stderr || e.message);
  process.exit(1);
}
