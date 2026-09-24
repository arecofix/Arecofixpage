CREATE OR REPLACE VIEW public.academy_students_view AS
SELECT 
    p.id AS user_id,
    p.first_name,
    p.last_name,
    p.email,
    p.dni,
    p.phone,
    p.tenant_id,
    p.role,
    (SELECT count(*) FROM public.course_enrollments ce WHERE ce.user_id = p.id AND ce.status = 'confirmed') AS enrolled_courses_count,
    (SELECT count(*) FROM public.course_certificates cc WHERE cc.user_id = p.id) AS certificates_count
FROM 
    public.profiles p
WHERE p.role = 'user';
