-- SEED.SQL para testing E2E de Academy
-- Justificación: Escenario control para tests, proveyendo un dataset completo para admin, instructor y alumno.

-- Insertamos los usuarios en auth.users (mock if needed for local, but usually handled by CLI auth create)
-- Asumimos que los IDs de abajo existen o saltaremos las constraints si auth.users no es editable localmente.
-- En supabase local, auth.users permite inserts.
INSERT INTO auth.users (id, email) VALUES 
('00000000-0000-0000-0000-000000000001', 'admin@arecofix.com.ar'),
('00000000-0000-0000-0000-000000000010', 'instructor1@arecofix.com.ar'),
('00000000-0000-0000-0000-000000000011', 'instructor2@arecofix.com.ar'),
('00000000-0000-0000-0000-000000000100', 'student1@gmail.com'),
('00000000-0000-0000-0000-000000000101', 'student2@gmail.com'),
('00000000-0000-0000-0000-000000000102', 'student3@gmail.com'),
('00000000-0000-0000-0000-000000000103', 'student4@gmail.com'),
('00000000-0000-0000-0000-000000000104', 'student5@gmail.com')
ON CONFLICT DO NOTHING;

-- 1 Admin, 2 Instructores, 5 Alumnos
INSERT INTO public.profiles (id, role, first_name, last_name) VALUES
('00000000-0000-0000-0000-000000000001', 'admin', 'Ezequiel', 'Areco'),
('00000000-0000-0000-0000-000000000010', 'instructor', 'Juan', 'Pérez'),
('00000000-0000-0000-0000-000000000011', 'instructor', 'María', 'Gómez'),
('00000000-0000-0000-0000-000000000100', 'student', 'Carlos', 'López'),
('00000000-0000-0000-0000-000000000101', 'student', 'Ana', 'Martínez'),
('00000000-0000-0000-0000-000000000102', 'student', 'Pedro', 'Sánchez'),
('00000000-0000-0000-0000-000000000103', 'student', 'Lucía', 'Díaz'),
('00000000-0000-0000-0000-000000000104', 'student', 'Miguel', 'Torres')
ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role;

-- Metadata instructores
INSERT INTO public.instructors (id, bio, rating) VALUES
('00000000-0000-0000-0000-000000000010', 'Experto en microelectrónica Apple', 4.9),
('00000000-0000-0000-0000-000000000011', 'Técnica especializada en displays', 4.8)
ON CONFLICT DO NOTHING;

-- 3 Cursos
INSERT INTO public.courses (id, title, slug, status, price, created_by) VALUES
('11111111-1111-1111-1111-111111111111', 'Reparación de iPhone Avanzado', 'reparacion-iphone', 'published', 50000, '00000000-0000-0000-0000-000000000010'),
('22222222-2222-2222-2222-222222222222', 'Cambio de Módulos Samsung', 'cambio-modulos-samsung', 'published', 25000, '00000000-0000-0000-0000-000000000011'),
('33333333-3333-3333-3333-333333333333', 'Soldadura SMD', 'soldadura-smd', 'draft', 35000, '00000000-0000-0000-0000-000000000010')
ON CONFLICT DO NOTHING;

-- 4 Pagos (Pending, Approved, Rejected, Refunded)
INSERT INTO public.payments (id, student_id, course_id, status, amount, receipt_url) VALUES
('44444444-4444-4444-4444-444444444441', '00000000-0000-0000-0000-000000000100', '11111111-1111-1111-1111-111111111111', 'approved', 50000, 'receipts/mock1.pdf'),
('44444444-4444-4444-4444-444444444442', '00000000-0000-0000-0000-000000000101', '11111111-1111-1111-1111-111111111111', 'pending', 50000, 'receipts/mock2.jpg'),
('44444444-4444-4444-4444-444444444443', '00000000-0000-0000-0000-000000000102', '22222222-2222-2222-2222-222222222222', 'rejected', 25000, 'receipts/mock3.pdf'),
('44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000103', '22222222-2222-2222-2222-222222222222', 'refunded', 25000, 'receipts/mock4.png')
ON CONFLICT DO NOTHING;

-- Enrollments para el Approved (esto normalmente lo hace el trigger, pero como insertamos crudo, aseguramos estado)
-- Agregamos un enrollment expirado para testing de revocación.
INSERT INTO public.enrollments (student_id, course_id, has_access, access_type, granted_at) VALUES
('00000000-0000-0000-0000-000000000100', '11111111-1111-1111-1111-111111111111', true, 'one_time', now()),
('00000000-0000-0000-0000-000000000104', '11111111-1111-1111-1111-111111111111', false, 'one_time', now() - interval '30 days')
ON CONFLICT DO NOTHING;

UPDATE public.enrollments SET expires_at = now() - interval '1 day', revoked_at = now(), reason = 'Test Expirado' 
WHERE student_id = '00000000-0000-0000-0000-000000000104';
