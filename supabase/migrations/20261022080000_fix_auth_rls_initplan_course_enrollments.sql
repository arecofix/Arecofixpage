-- UP: 20261022080000_fix_auth_rls_initplan_course_enrollments.sql
BEGIN;

-- Backup de la política actual para el DOWN
CREATE TABLE IF NOT EXISTS _migration_backup_20261022080000 (
  id serial PRIMARY KEY,
  captured_at timestamptz DEFAULT now(),
  policyname text,
  qual text,
  with_check text
);

INSERT INTO _migration_backup_20261022080000 (policyname, qual, with_check)
SELECT policyname, qual, with_check FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'course_enrollments'
  AND policyname = 'course_enrollments_select_unified';

-- Drop y recreate con InitPlan escalar estricto
DROP POLICY IF EXISTS "course_enrollments_select_unified" ON public.course_enrollments;

CREATE POLICY "course_enrollments_select_unified" ON public.course_enrollments
  FOR SELECT TO authenticated
  USING (
    (SELECT public.is_super_admin())
    OR tenant_id = ((SELECT auth.jwt()) ->> 'tenant_id')::uuid
    OR user_id = (SELECT auth.uid())
  );

-- Verificación inline
DO $$
DECLARE
  bad_count int;
BEGIN
  SELECT count(*) INTO bad_count
  FROM pg_policies
  WHERE schemaname = 'public' AND tablename = 'course_enrollments'
    AND policyname = 'course_enrollments_select_unified'
    AND (
      (qual ~* 'auth\.(uid|jwt|role)\(\)' AND qual !~* '\(\s*SELECT\s+auth\.')
      OR
      (qual ~* 'current_setting\(' AND qual !~* '\(\s*SELECT\s+current_setting\(')
    );
  IF bad_count > 0 THEN
    RAISE EXCEPTION 'La política course_enrollments_select_unified sigue con InitPlan no escalar';
  END IF;
END $$;

COMMIT;

NOTIFY pgrst, 'reload schema';
