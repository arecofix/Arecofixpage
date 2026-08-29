-- Migration: E-Learning Architecture Cleanup & Optimization
-- Fecha: 2026-08-18

BEGIN;

-- ─────────────────────────────────────────────────────────────
-- PASO 1: RESCATAR DATOS DE LA RAMA DUPLICADA Y UNIFICAR
-- Si creaste contenido en la tabla vieja "lessons", esto lo pasa 
-- automáticamente a módulos para no perder ni un solo archivo.
-- ─────────────────────────────────────────────────────────────
DO $$ 
DECLARE
  v_lesson RECORD;
  v_new_module_id UUID;
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'lessons') THEN
      FOR v_lesson IN SELECT * FROM public.lessons LOOP
        -- Crea un módulo equivalente para esta lección paralela
        v_new_module_id := gen_random_uuid();
        INSERT INTO public.course_modules (id, course_id, title, description, tenant_id, order_index)
        VALUES (v_new_module_id, v_lesson.course_id, v_lesson.title, 'Módulo recuperado de lecciones antiguas', v_lesson.tenant_id, v_lesson.order_index);
        
        -- Mueve los contenidos a la tabla principal
        INSERT INTO public.course_module_contents (id, lesson_id, tenant_id, type, title, url, metadata, order_index, created_at)
        SELECT id, v_new_module_id, tenant_id, type, title, url, metadata, order_index, created_at
        FROM public.lesson_contents
        WHERE lesson_id = v_lesson.id;
      END LOOP;
  END IF;
END $$;

-- Eliminar de forma segura la rama duplicada y obsoleta
DROP TABLE IF EXISTS public.lesson_contents CASCADE;
DROP TABLE IF EXISTS public.lessons CASCADE;

-- ─────────────────────────────────────────────────────────────
-- PASO 2: RENOMBRAR TABLA Y COLUMNAS A ESTÁNDAR LMS
-- Estructura final: courses -> course_modules -> course_lessons
-- ─────────────────────────────────────────────────────────────
-- Arreglamos la columna confusa (ahora los contenidos apuntan al module_id)
ALTER TABLE public.course_module_contents RENAME COLUMN lesson_id TO module_id;

-- Renombramos la tabla para que el código frontend sea más limpio
ALTER TABLE public.course_module_contents RENAME TO course_lessons;

-- ─────────────────────────────────────────────────────────────
-- PASO 3: BORRADO EN CASCADA (ON DELETE CASCADE)
-- Permitirá borrar un curso desde el Admin y que se limpien solos sus módulos y videos.
-- ─────────────────────────────────────────────────────────────
-- Cascada: Módulos -> Cursos
ALTER TABLE public.course_modules DROP CONSTRAINT IF EXISTS course_modules_course_id_fkey;
ALTER TABLE public.course_modules 
  ADD CONSTRAINT course_modules_course_id_fkey 
  FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;

-- Cascada: Lecciones -> Módulos
ALTER TABLE public.course_lessons DROP CONSTRAINT IF EXISTS course_module_contents_lesson_id_fkey;
ALTER TABLE public.course_lessons 
  ADD CONSTRAINT course_lessons_module_id_fkey 
  FOREIGN KEY (module_id) REFERENCES public.course_modules(id) ON DELETE CASCADE;

-- Cascada: Progreso del alumno -> Lecciones
ALTER TABLE public.course_progress DROP CONSTRAINT IF EXISTS course_progress_content_id_fkey;
ALTER TABLE public.course_progress 
  ADD CONSTRAINT course_progress_content_id_fkey 
  FOREIGN KEY (content_id) REFERENCES public.course_lessons(id) ON DELETE CASCADE;

-- ─────────────────────────────────────────────────────────────
-- PASO 4: VINCULACIÓN FUERTE POR UUID (NO POR EMAIL)
-- Evita perder el progreso de los alumnos si cambian de correo
-- ─────────────────────────────────────────────────────────────
-- Agregar columnas UUID
ALTER TABLE public.course_enrollments ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.course_progress ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.course_certificates ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Migrar / Relacionar los datos existentes usando el correo que ya tienen
UPDATE public.course_enrollments ce
SET user_id = p.id
FROM public.profiles p
WHERE lower(ce.email) = lower(p.email) AND ce.user_id IS NULL;

UPDATE public.course_progress cp
SET user_id = p.id
FROM public.profiles p
WHERE lower(cp.email) = lower(p.email) AND cp.user_id IS NULL;

UPDATE public.course_certificates cc
SET user_id = p.id
FROM public.profiles p
WHERE lower(cc.email) = lower(p.email) AND cc.user_id IS NULL;

COMMIT;

-- Recargar esquema API
NOTIFY pgrst, 'reload schema';