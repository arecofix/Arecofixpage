-- 1. Limpieza de tablas basura creadas por la migración destructiva (si existen y están vacías)
DROP TABLE IF EXISTS public.payment_audit_log CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.enrollments CASCADE;
DROP TABLE IF EXISTS public.course_audience CASCADE;
DROP TABLE IF EXISTS public.instructors CASCADE;

DROP TYPE IF EXISTS public.course_status CASCADE;
DROP TYPE IF EXISTS public.payment_status CASCADE;
DROP TYPE IF EXISTS public.course_level CASCADE;
DROP TYPE IF EXISTS public.user_role CASCADE;

-- 2. Creación del Trigger Nativo para Enrollments Automáticos
-- Esto reemplaza la dependencia de la Edge Function en la nube antigua.
CREATE OR REPLACE FUNCTION public.process_course_enrollments()
RETURNS trigger AS $$
BEGIN
  -- Solo actuar si el pedido se marca como 'paid' o 'completed'
  IF NEW.status IN ('paid', 'completed') AND OLD.status NOT IN ('paid', 'completed') THEN
    
    -- Insertar enrolamientos para todos los items que sean cursos
    INSERT INTO public.course_enrollments (
      course_id, 
      full_name, 
      email, 
      phone,
      status, 
      tenant_id, 
      user_id,
      created_at
    )
    SELECT 
      oi.course_id, 
      COALESCE(NEW.customer_name, 'Alumno'), 
      COALESCE(NEW.customer_email, 'sin-email@arecofix.com'), 
      NEW.customer_phone,
      'confirmed', 
      NEW.tenant_id, 
      NEW.user_id,
      now()
    FROM public.order_items oi
    WHERE oi.order_id = NEW.id 
      AND oi.course_id IS NOT NULL
    -- Prevenir duplicados si el webhook/trigger se dispara dos veces
    ON CONFLICT DO NOTHING;

  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Adjuntar el trigger a la tabla orders
DROP TRIGGER IF EXISTS trg_process_course_enrollments ON public.orders;

CREATE TRIGGER trg_process_course_enrollments
  AFTER UPDATE OF status ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.process_course_enrollments();

-- 4. Opcional: Arreglar el trigger existente on_order_completed si apuntaba a Supabase Cloud viejo.
-- Si n8n webhook o la edge function sigue siendo necesaria para NOTIFICAR por email/whatsapp:
-- Podemos mantenerlo, pero la asignación de base de datos ya está cubierta por el trigger nativo superior.
