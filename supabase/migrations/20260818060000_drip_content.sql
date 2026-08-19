-- Migration: Drip Content — Liberación Progresiva de Módulos
-- Fecha: 2026-08-18
-- Descripción: Agrega `unlock_date` a course_modules y actualiza las políticas RLS.

-- ─────────────────────────────────────────────────────────────
-- 1. AGREGAR COLUMNA unlock_date A course_modules
-- ─────────────────────────────────────────────────────────────
-- NULL        = bloqueado indefinidamente (sin fecha programada aún)
-- fecha futura = programado para ese momento
-- fecha pasada = ya desbloqueado
ALTER TABLE public.course_modules
  ADD COLUMN IF NOT EXISTS unlock_date TIMESTAMPTZ NULL;

-- Índice para optimizar consultas de "módulos actualmente desbloqueados"
CREATE INDEX IF NOT EXISTS idx_course_modules_unlock_date
  ON public.course_modules(unlock_date)
  WHERE unlock_date IS NOT NULL;

-- ─────────────────────────────────────────────────────────────
-- 2. ACTUALIZAR RLS DE course_modules (TEMARIO)
-- ─────────────────────────────────────────────────────────────
-- Una sola política de SELECT:
-- Todo el mundo ve el temario de cursos activos; admins ven todos los de su tenant.
DROP POLICY IF EXISTS "Public can view syllabus" ON public.course_modules;
DROP POLICY IF EXISTS "Students can view modules" ON public.course_modules;

CREATE POLICY "course_modules_select_policy"
ON public.course_modules
FOR SELECT
TO authenticated, anon
USING (
  EXISTS (
    SELECT 1 FROM public.courses c
    WHERE c.id = course_modules.course_id
      AND c.is_active = true
  )
  OR public.is_admin_of_tenant(tenant_id)
);

-- ─────────────────────────────────────────────────────────────
-- 3. ACTUALIZAR RLS DE course_module_contents (CONTENIDO REAL)
-- ─────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Students can view contents" ON public.course_module_contents;
DROP POLICY IF EXISTS "Admins can manage course contents" ON public.course_module_contents;

-- 3.1 LECTURA: Solo alumnos inscriptos con fecha cumplida, o administradores
CREATE POLICY "module_contents_select_policy"
ON public.course_module_contents
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.course_modules cm
    JOIN public.course_enrollments ce ON ce.course_id = cm.course_id
    WHERE cm.id = course_module_contents.lesson_id
      AND ce.status = 'confirmed'
      AND lower(ce.email) = lower(auth.jwt() ->> 'email')
      AND cm.unlock_date IS NOT NULL
      AND cm.unlock_date <= now()
  )
  OR public.is_admin_of_tenant(tenant_id)
);

-- 3.2 GESTIÓN: Solo los admins pueden insertar, actualizar o borrar contenido
CREATE POLICY "module_contents_all_admin_policy"
ON public.course_module_contents
FOR ALL
TO authenticated
USING (public.is_admin_of_tenant(tenant_id))
WITH CHECK (public.is_admin_of_tenant(tenant_id));

-- ─────────────────────────────────────────────────────────────
-- 4. RECARGAR SCHEMA DE POSTGREST
-- ─────────────────────────────────────────────────────────────
NOTIFY pgrst, 'reload schema';
