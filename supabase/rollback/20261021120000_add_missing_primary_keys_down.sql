-- ==============================================================================
-- Rollback Migration: 20261021120000_add_missing_primary_keys_down.sql
-- Description: Revert primary keys and return backups to public schema
-- ==============================================================================

BEGIN;

ALTER TABLE public.course_certificates DROP CONSTRAINT IF EXISTS course_certificates_pkey;
ALTER TABLE public.course_enrollments DROP CONSTRAINT IF EXISTS course_enrollments_pkey;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'backups' AND table_name = 'services_backup_20261018'
    ) THEN
        ALTER TABLE backups.services_backup_20261018 SET SCHEMA public;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'backups' AND table_name = 'blog_posts_backup_20261018'
    ) THEN
        ALTER TABLE backups.blog_posts_backup_20261018 SET SCHEMA public;
    END IF;
END $$;

COMMIT;
