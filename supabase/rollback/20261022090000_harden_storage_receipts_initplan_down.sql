-- DOWN: 20261022090000_harden_storage_receipts_initplan_down.sql
BEGIN;

DROP POLICY IF EXISTS "receipts_select_scoped" ON storage.objects;
DROP POLICY IF EXISTS "receipts_insert_scoped" ON storage.objects;
DROP POLICY IF EXISTS "avatars_upload_authenticated" ON storage.objects;
DROP POLICY IF EXISTS "evidence_upload_authenticated" ON storage.objects;

DROP TABLE IF EXISTS _migration_backup_20261022090000;

COMMIT;

NOTIFY pgrst, 'reload schema';
