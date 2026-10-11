# Arquitectura de Datos y Esquema Objetivo (Supabase / PostgreSQL) - v3

---

## 1. Decisiones de Diseño y Arquitectura de Datos

### 1.1 Modelado con Enums Fuertemente Tipados
Se reemplazan todos los campos de texto libre con Enums de PostgreSQL para garantizar integridad referencial y semántica a nivel motor de base de datos:
- `user_role_enum`: `'super_admin'`, `'admin'`, `'tenant_owner'`, `'branch_admin'`, `'instructor'`, `'student'`.
- `course_level_enum`: `'basic'`, `'intermediate'`, `'advanced'`, `'all'`.
- `course_status_enum`: `'draft'`, `'pending_review'`, `'published'`, `'archived'`.
- `enrollment_status_enum`: `'pending'`, `'confirmed'`, `'cancelled'`, `'expired'`.
- `payment_status_enum`: `'pending'`, `'approved'`, `'rejected'`, `'refunded'`.
- `content_type_enum`: `'video'`, `'document'`, `'link'`, `'text'`, `'exam'`.

### 1.2 Reglas de Integridad y Restricciones CHECK
- **Precios:** `CHECK (price >= 0)`, `CHECK (sale_price IS NULL OR (sale_price >= 0 AND sale_price < price))`.
- **Puntajes y Exámenes:** `CHECK (score >= 0 AND score <= 100)`, `CHECK (passing_score >= 0 AND passing_score <= 100)`.
- **Calificaciones:** `CHECK (rating >= 1.0 AND rating <= 5.0)`.
- **Orden e Índices:** `CHECK (order_index >= 0)`.
- **Emails:** `CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')`.

### 1.3 Estrategia de Eliminación Lógica (Soft Deletes)
Las entidades de auditoría sensible (`profiles`, `instructors`, `courses`, `course_enrollments`) incorporan `deleted_at timestamptz NULL`.
- **Justificación:** Previene la cascada destructiva sobre registros de transacciones contables, diplomas emitidos y trazabilidad fiscal.
- **Acceso:** Las vistas públicas y consultas estándar aplican `WHERE deleted_at IS NULL`. Las relaciones foráneas usan `ON DELETE RESTRICT` en tablas financieras y de certificaciones.

### 1.4 Idempotencia en Pagos y Webhooks
El trigger de transición de estados de pagos `trg_payments_status_change` encapsula la condición:
```sql
IF OLD.status IS DISTINCT FROM NEW.status THEN
   -- Lógica de activación de matrícula e inserción en auditoría
END IF;
```
Previene duplicación de registros de auditoría y activaciones múltiples frente a reintentos de webhooks de pasarelas de pago (MercadoPago / Stripe).

### 1.5 Políticas RLS Granulares (Zero "ALL" Permissive)
Cada tabla define políticas disyuntas e independientes para `SELECT`, `INSERT`, `UPDATE` y `DELETE`, evitando políticas genéricas `FOR ALL`:
- **SELECT:** Filtrado por aislamiento de tenant mediante `tenant_id = get_my_tenant()` o visibilidad pública condicional (`is_active = true AND deleted_at IS NULL`).
- **INSERT / UPDATE:** Validación estricta con cláusula `WITH CHECK` que asegura pertenencia al tenant del usuario autenticado.
- **DELETE:** Restringido a roles administrativos o impedido mediante revocación de privilegios en favor de soft delete.

---

## 2. Definición del Esquema DDL Objetivo

```sql
-- ============================================================================
-- 1. ENUMS Y EXTENSIONES
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE user_role_enum AS ENUM (
  'super_admin', 'admin', 'tenant_owner', 'branch_admin', 'instructor', 'student'
);

CREATE TYPE course_level_enum AS ENUM (
  'basic', 'intermediate', 'advanced', 'all'
);

CREATE TYPE course_status_enum AS ENUM (
  'draft', 'pending_review', 'published', 'archived'
);

CREATE TYPE enrollment_status_enum AS ENUM (
  'pending', 'confirmed', 'cancelled', 'expired'
);

CREATE TYPE payment_status_enum AS ENUM (
  'pending', 'approved', 'rejected', 'refunded'
);

CREATE TYPE content_type_enum AS ENUM (
  'video', 'document', 'link', 'text', 'exam'
);

-- ============================================================================
-- 2. TABLA: PROFILES (Extensión de auth.users)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  email text NOT NULL,
  first_name text NOT NULL DEFAULT '',
  last_name text NOT NULL DEFAULT '',
  phone text,
  dni text,
  role user_role_enum NOT NULL DEFAULT 'student',
  avatar_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  deleted_at timestamptz,
  CONSTRAINT chk_profile_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- ============================================================================
-- 3. TABLA: INSTRUCTORS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.instructors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE RESTRICT,
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  title text NOT NULL,
  bio text,
  specialties text[] DEFAULT '{}',
  commission_percentage numeric(5,2) NOT NULL DEFAULT 0.00 CHECK (commission_percentage >= 0 AND commission_percentage <= 100),
  payout_info jsonb DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  deleted_at timestamptz
);

-- ============================================================================
-- 4. TABLA: COURSES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  author_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  instructor_id uuid REFERENCES public.instructors(id) ON DELETE SET NULL,
  title text NOT NULL,
  slug text NOT NULL,
  description text,
  short_description text,
  level course_level_enum NOT NULL DEFAULT 'basic',
  status course_status_enum NOT NULL DEFAULT 'draft',
  price numeric(12,2) NOT NULL DEFAULT 0.00 CHECK (price >= 0),
  sale_price numeric(12,2) CHECK (sale_price IS NULL OR (sale_price >= 0 AND sale_price < price)),
  duration text,
  schedule text,
  hours_content integer NOT NULL DEFAULT 0 CHECK (hours_content >= 0),
  hours_practice integer NOT NULL DEFAULT 0 CHECK (hours_practice >= 0),
  classes_count integer NOT NULL DEFAULT 0 CHECK (classes_count >= 0),
  image_url text,
  preview_video_url text,
  rating numeric(3,2) NOT NULL DEFAULT 5.00 CHECK (rating >= 1.0 AND rating <= 5.0),
  reviews_count integer NOT NULL DEFAULT 0 CHECK (reviews_count >= 0),
  is_featured boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  deleted_at timestamptz,
  CONSTRAINT uq_courses_tenant_slug UNIQUE (tenant_id, slug)
);

-- ============================================================================
-- 5. TABLA: COURSE_MODULES (Temario / Drip Content)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.course_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  order_index integer NOT NULL DEFAULT 0 CHECK (order_index >= 0),
  unlock_date timestamptz,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- 6. TABLA: COURSE_CONTENTS (Lecciones / Recursos)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.course_contents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  module_id uuid NOT NULL REFERENCES public.course_modules(id) ON DELETE CASCADE,
  title text NOT NULL,
  type content_type_enum NOT NULL,
  url text,
  duration text,
  order_index integer NOT NULL DEFAULT 0 CHECK (order_index >= 0),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- 7. TABLA: COURSE_ENROLLMENTS (Inscripciones / Acceso al Campus)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.course_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE RESTRICT,
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  email text NOT NULL,
  full_name text NOT NULL,
  phone text,
  status enrollment_status_enum NOT NULL DEFAULT 'pending',
  enrolled_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  expires_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  deleted_at timestamptz,
  CONSTRAINT uq_enrollment_course_email UNIQUE (tenant_id, course_id, email)
);

-- ============================================================================
-- 8. TABLA: PAYMENTS (Transacciones de Cobro)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  enrollment_id uuid REFERENCES public.course_enrollments(id) ON DELETE RESTRICT,
  user_id uuid REFERENCES public.profiles(id) ON DELETE RESTRICT,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE RESTRICT,
  amount numeric(12,2) NOT NULL CHECK (amount > 0),
  currency text NOT NULL DEFAULT 'ARS',
  gateway text NOT NULL DEFAULT 'mercadopago',
  gateway_payment_id text,
  status payment_status_enum NOT NULL DEFAULT 'pending',
  gateway_payload jsonb DEFAULT '{}'::jsonb,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT uq_gateway_payment UNIQUE (gateway, gateway_payment_id)
);

-- ============================================================================
-- 9. TABLA: PAYMENT_AUDIT_LOG (Historial Inmutable)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.payment_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id uuid NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL,
  previous_status payment_status_enum,
  new_status payment_status_enum NOT NULL,
  changed_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- 10. TABLA: COURSE_PROGRESS (Seguimiento de Avance)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.course_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  content_id uuid NOT NULL REFERENCES public.course_contents(id) ON DELETE CASCADE,
  email text NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT uq_progress_user_content UNIQUE (course_id, content_id, email)
);

-- ============================================================================
-- 11. TABLA: COURSE_CERTIFICATES (Diplomas Acreditados)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.course_certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE RESTRICT,
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  email text NOT NULL,
  student_name text NOT NULL,
  student_dni text,
  pdf_url text,
  issued_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  revoked_at timestamptz,
  CONSTRAINT uq_certificate_course_student UNIQUE (course_id, email)
);

-- ============================================================================
-- 12. TABLA: COURSE_EXAM_QUESTIONS (Preguntas de Examen)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.course_exam_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  content_id uuid NOT NULL REFERENCES public.course_contents(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  options jsonb NOT NULL,
  correct_option_index integer NOT NULL CHECK (correct_option_index >= 0),
  order_index integer NOT NULL DEFAULT 0 CHECK (order_index >= 0),
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- 13. TABLA: COURSE_EXAM_SUBMISSIONS (Intentos de Examen)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.course_exam_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  content_id uuid NOT NULL REFERENCES public.course_contents(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  email text NOT NULL,
  answers jsonb NOT NULL,
  score numeric(5,2) NOT NULL CHECK (score >= 0 AND score <= 100),
  passed boolean NOT NULL,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);
```

---

## 3. Políticas RLS Granulares

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_certificates ENABLE ROW LEVEL SECURITY;

-- COURSES: SELECT
CREATE POLICY "courses_select_public" ON public.courses
  FOR SELECT USING (
    tenant_id = get_my_tenant()
    AND (
      (is_active = true AND status = 'published' AND deleted_at IS NULL)
      OR (get_user_role() = ANY(ARRAY['admin', 'super_admin', 'tenant_owner']))
      OR (author_id = auth.uid())
    )
  );

-- COURSES: INSERT
CREATE POLICY "courses_insert_author" ON public.courses
  FOR INSERT WITH CHECK (
    tenant_id = get_my_tenant()
    AND (
      get_user_role() = ANY(ARRAY['admin', 'super_admin', 'tenant_owner'])
      OR (get_user_role() = 'instructor' AND author_id = auth.uid())
    )
  );

-- COURSES: UPDATE
CREATE POLICY "courses_update_author" ON public.courses
  FOR UPDATE USING (
    tenant_id = get_my_tenant()
    AND (
      get_user_role() = ANY(ARRAY['admin', 'super_admin', 'tenant_owner'])
      OR (author_id = auth.uid())
    )
  ) WITH CHECK (
    tenant_id = get_my_tenant()
  );

-- COURSES: DELETE
CREATE POLICY "courses_delete_admin" ON public.courses
  FOR DELETE USING (
    tenant_id = get_my_tenant()
    AND get_user_role() = ANY(ARRAY['admin', 'super_admin', 'tenant_owner'])
  );

-- ENROLLMENTS: SELECT
CREATE POLICY "enrollments_select_student_or_admin" ON public.course_enrollments
  FOR SELECT USING (
    tenant_id = get_my_tenant()
    AND (
      email = (auth.jwt() ->> 'email')
      OR user_id = auth.uid()
      OR get_user_role() = ANY(ARRAY['admin', 'super_admin', 'tenant_owner'])
      OR EXISTS (
        SELECT 1 FROM public.courses c
        WHERE c.id = course_id AND c.author_id = auth.uid()
      )
    )
  );

-- ENROLLMENTS: INSERT
CREATE POLICY "enrollments_insert_public_or_admin" ON public.course_enrollments
  FOR INSERT WITH CHECK (
    tenant_id = get_my_tenant()
  );

-- ENROLLMENTS: UPDATE
CREATE POLICY "enrollments_update_admin" ON public.course_enrollments
  FOR UPDATE USING (
    tenant_id = get_my_tenant()
    AND get_user_role() = ANY(ARRAY['admin', 'super_admin', 'tenant_owner'])
  ) WITH CHECK (
    tenant_id = get_my_tenant()
  );
```

---

## 4. Índices de Rendimiento
```sql
CREATE INDEX IF NOT EXISTS idx_courses_tenant_active ON public.courses (tenant_id, is_active, status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_courses_author ON public.courses (author_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_course_modules_course_order ON public.course_modules (course_id, order_index);
CREATE INDEX IF NOT EXISTS idx_course_contents_module_order ON public.course_contents (module_id, order_index);
CREATE INDEX IF NOT EXISTS idx_enrollments_student_lookup ON public.course_enrollments (tenant_id, course_id, email, status);
CREATE INDEX IF NOT EXISTS idx_payments_gateway_lookup ON public.payments (gateway, gateway_payment_id);
CREATE INDEX IF NOT EXISTS idx_progress_course_user ON public.course_progress (course_id, email);
CREATE INDEX IF NOT EXISTS idx_certificates_verification ON public.course_certificates (id, course_id, email);
```

---

## 5. Triggers Idempotentes

### Activación Automática de Matrícula por Pago Aprobado
```sql
CREATE OR REPLACE FUNCTION public.handle_payment_status_transition()
RETURNS trigger AS $$
BEGIN
  -- Verificar idempotencia de cambio de estado
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    -- Registrar en log inmutable de auditoría
    INSERT INTO public.payment_audit_log (
      payment_id, tenant_id, previous_status, new_status, changed_by, metadata
    ) VALUES (
      NEW.id, NEW.tenant_id, OLD.status, NEW.status, auth.uid(),
      jsonb_build_object('gateway', NEW.gateway, 'gateway_payment_id', NEW.gateway_payment_id)
    );

    -- Si el pago pasa a 'approved', confirmar o crear inscripción
    IF NEW.status = 'approved' THEN
      IF NEW.enrollment_id IS NOT NULL THEN
        UPDATE public.course_enrollments
        SET status = 'confirmed', updated_at = now()
        WHERE id = NEW.enrollment_id;
      ELSE
        INSERT INTO public.course_enrollments (
          tenant_id, course_id, user_id, email, full_name, status, enrolled_at
        )
        SELECT 
          NEW.tenant_id, NEW.course_id, NEW.user_id, p.email,
          COALESCE(p.first_name || ' ' || p.last_name, p.email), 'confirmed', now()
        FROM public.profiles p
        WHERE p.id = NEW.user_id
        ON CONFLICT (tenant_id, course_id, email)
        DO UPDATE SET status = 'confirmed', updated_at = now();
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER trg_payments_status_change
  AFTER UPDATE OF status ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_payment_status_transition();
```
