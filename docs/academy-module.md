# 🎓 Módulo Academy — Documentación Técnica y Contratos de Uso

## 1. Modelo de Negocio y Alcance (Decisión D1)
Arecofix Academy implementa un modelo de **venta de cursos individuales** con esquema de cuotas fijas (N cuotas mensuales acordadas). La suscripción global recurrente (`academy_subscriptions`) queda reservada para fases futuras.

## 2. Contrato de Uso de `academy_payments`
Para evitar redundancia de tablas, la entidad `academy_payments` soporta tanto el pago de cuotas de cursos individuales como futuras suscripciones recurrentes bajo el siguiente contrato estricto:

| Campo | Pago de Cuota (Curso Individual) | Pago de Suscripción Global (Futuro) |
|---|---|---|
| `enrollment_id` | **NOT NULL** (FK `course_enrollments.id`) | `NULL` |
| `subscription_id` | `NULL` | **NOT NULL** (FK `academy_subscriptions.id`) |
| `plan_id` | `NULL` | **NOT NULL** (FK `academy_plans.id`) |
| `amount` | **NOT NULL** (Monto de la cuota abonada) | **NOT NULL** (Monto del plan) |
| `currency_id` | `'ARS'` (o divisa de cobro) | `'ARS'` |
| `payment_method_id` | `'cash'`, `'transfer'`, `'mercadopago'`, `'other'` | Provisto por pasarela de cobro |
| `receipt_number` | **NOT NULL UNIQUE** (`REC-ACAD-YYYYMMDD-XXXXXX`) | Generado o `NULL` si pasarela emite ID propio |
| `period_number` | Número de cuota abonada (1..N) | Número de período mensual facturado |
| `status` | `'approved'`, `'pending'`, `'rejected'`, `'refunded'` | `'approved'`, `'pending'`, etc. |
| `created_by` | **NOT NULL** (FK `profiles.id` del operador que registró) | `NULL` (Webhook / Pasarela) |
| `paid_at` | Timestamp efectivo del cobro | Timestamp de acreditación |

### Restricción de Integridad (Check Constraint)
```sql
CONSTRAINT academy_payments_target_check 
CHECK (subscription_id IS NOT NULL OR enrollment_id IS NOT NULL)
```

## 3. Máquina de Estados de Cursada y Cobro (`payment_plan_status` y `effective_enrollment_status`)
1. **`pending_payment`**: Solicitud de vacante recibida o alumno inscripto esperando regularizar la primera cuota. Contenido bloqueado en campus hasta cobro.
2. **`active`**: Alumno al día, cursada habilitada. Próximo vencimiento en el futuro (`now() <= next_due_date`).
3. **`grace_period`**: Alumno con vencimiento superado pero dentro de los 7 días de tolerancia (`now() <= next_due_date + INTERVAL '7 days'`). Acceso permitido con advertencia visible y persistente.
4. **`suspended`**: Vencimiento + 7 días superados sin pago. Acceso al aula, videos, PDFs y exámenes bloqueado lazy.
5. **`completed`**: Total de cuotas acordadas abonadas (`installments_paid >= installments_count`). Acceso extendido vitalicio o anual.
6. **`cancelled`**: Inscripción dada de baja administrativa o unificada (e.g., duplicados históricos). Fila atenuada en reportes.
7. **`scholarship`**: Alumno bonificado/becado 100% (e.g., cuentas internas de testing o becas). No genera deuda ni vencimientos.

## 4. Transacción Atómica de Pago (`register_academy_payment`)
Toda mutación de cobro ejecuta en una transacción PostgreSQL `SECURITY DEFINER`:
1. Bloqueo con `FOR UPDATE` en `course_enrollments`.
2. Verificación de monto > 0 y estado admisible.
3. Inserción en `academy_payments` con recibo único correlativo.
4. Inserción inmediata en `cash_movements` con `type = 'income'`, `category = 'academy'` y `reference_type = 'academy_payment'`.
5. Recálculo automático de `installments_paid`, `next_due_date`, `expires_at` y transición a `'completed'` o `'active'`.

## 5. Anulación Atómica de Pago (`void_academy_payment`)
Permite revertir cobros erróneos o devoluciones de seña/cuota garantizando trazabilidad contable total:
1. Valida existencia del recibo y que su estado actual sea `'approved'`.
2. Actualiza el estado del pago a `'refunded'`.
3. Inserta un contra-asiento en `cash_movements`:
   - `type = 'expense'`
   - `category = 'academy'`
   - `amount = v_payment.amount`
   - `notes = 'Anulación recibo REC-...: [Motivo]'`
   - `reference_type = 'academy_payment'`
4. Decrementa `installments_paid` en `course_enrollments` en 1.
5. Recalcula `next_due_date` retrotrayéndolo 1 mes y actualiza `payment_plan_status` a `'pending_payment'` si no quedan cuotas o `'active'`.
6. Inserta registro de auditoría en `audit_logs`.

## 6. Comprobantes de Pago del Alumno (`academy_payment_proofs` y Bucket `comprobantes`)
1. El estudiante desde `/academy/mis-cursos` visualiza los datos bancarios oficiales de Arecofix:
   - CBU: `0140026703518851410948`
   - Alias: `ARECOFIX`
   - Banco: Banco de la Provincia de Buenos Aires
   - Titular: Ezequiel Enrico Areco
2. Al transferir, adjunta su comprobante (PDF o imagen).
3. El frontend sube el archivo a Supabase Storage:
   - Bucket: `comprobantes`
   - Ruta: `{user_id}/{timestamp}_{nombre_archivo}`
4. Se registra en `academy_payment_proofs` con `status = 'pending'`.
5. Administración valida el comprobante desde `/admin/courses/subscriptions` y registra el cobro oficial impactando el pago.

## 7. Emisión Oficial de Recibos en PDF (`ReceiptPdfService`)
- Formato oficial en A5 apaisado generado con `jsPDF`.
- Encabezado institucional azul de Arecofix Academy con CUIT y datos de contacto.
- Detalle del alumno, DNI, curso, número de cuota (`Cuota X de Y`), medio de pago y fecha.
- Monto destacado en ARS y caja de observaciones.
- Firma digital y sello de **Ezequiel Enrico Areco - Director General Arecofix Academy**.
- Descarga inmediata y persistencia en Supabase Storage bucket `receipts/`.

## 8. Bloqueo Lazy en Frontend (`StudentCampusPage`)
- En `/academy/:slug/aula`, si el alumno no es administrador ni autor docente:
  - Se consulta su matrícula en `course_enrollments`.
  - Se calcula su `effective_status`.
  - Si el estado es `suspended` o `pending_payment`:
    - **No se descargan** los contenidos de los módulos ni enlaces de video o examen (bloqueo lazy a nivel red/aplicación).
    - Se despliega un modal bloqueante informativo invitando a regularizar la cuota con link directo a `/academy/mis-cursos`.
  - Si el estado es `grace_period`:
    - Se permite el acceso a los contenidos pero se despliega un banner amarillo persistente con la fecha límite de regularización.
