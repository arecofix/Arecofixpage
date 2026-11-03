-- UP: 20261022090000_harden_storage_receipts_initplan.sql
BEGIN;

CREATE TABLE IF NOT EXISTS _migration_backup_20261022090000 (
  id serial PRIMARY KEY,
  captured_at timestamptz DEFAULT now(),
  policyname text,
  qual text,
  with_check text
);

INSERT INTO _migration_backup_20261022090000 (policyname, qual, with_check)
SELECT policyname, qual, with_check FROM pg_policies
WHERE schemaname = 'storage' AND tablename = 'objects'
  AND policyname IN ('Student_Read_Own_Receipt', 'Student_Insert_Receipt', 'Admins_Read_All_Receipts', 'Authenticated can upload avatars', 'Authenticated can upload evidence');

-- Recreación de políticas en receipts con InitPlan escalar
DROP POLICY IF EXISTS "Student_Read_Own_Receipt" ON storage.objects;
DROP POLICY IF EXISTS "Admins_Read_All_Receipts" ON storage.objects;

CREATE POLICY "receipts_select_scoped" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'receipts'
    AND (
      owner = (SELECT auth.uid())
      OR (SELECT public.is_admin())
      OR (SELECT public.is_super_admin())
    )
  );

DROP POLICY IF EXISTS "Student_Insert_Receipt" ON storage.objects;

CREATE POLICY "receipts_insert_scoped" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'receipts'
    AND owner = (SELECT auth.uid())
  );

-- Sanitización de llamadas role() en uploads de avatars y evidence
DROP POLICY IF EXISTS "Authenticated can upload avatars" ON storage.objects;
CREATE POLICY "avatars_upload_authenticated" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Authenticated can upload evidence" ON storage.objects;
CREATE POLICY "evidence_upload_authenticated" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'evidence');

COMMIT;

NOTIFY pgrst, 'reload schema';
