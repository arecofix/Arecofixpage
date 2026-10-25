-- DOWN: 20261022080000_fix_auth_rls_initplan_course_enrollments_down.sql
BEGIN;

DROP POLICY IF EXISTS "course_enrollments_select_unified" ON public.course_enrollments;

DO $$
DECLARE
  v_qual text;
  v_with_check text;
BEGIN
  SELECT qual, with_check INTO v_qual, v_with_check
  FROM _migration_backup_20261022080000
  WHERE policyname = 'course_enrollments_select_unified'
  LIMIT 1;

  IF v_qual IS NOT NULL THEN
    EXECUTE format(
      'CREATE POLICY "course_enrollments_select_unified" ON public.course_enrollments FOR SELECT TO authenticated USING (%s)',
      v_qual
    );
  END IF;
END $$;

DROP TABLE IF EXISTS _migration_backup_20261022080000;

COMMIT;

NOTIFY pgrst, 'reload schema';
