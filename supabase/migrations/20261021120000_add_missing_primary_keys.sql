-- ==============================================================================
-- Migration: 20261021120000_add_missing_primary_keys.sql
-- Description: Deduplicate course_certificates, add PKs, and isolate backups
-- Severity: INTEGRITY / HYGIENE (P2)
-- Category: no_primary_key
-- ==============================================================================

BEGIN;

-- ------------------------------------------------------------------------------
-- 1. Deduplicate public.course_certificates and add PRIMARY KEY
-- ------------------------------------------------------------------------------
DELETE FROM public.course_certificates a
USING public.course_certificates b
WHERE a.ctid < b.ctid AND a.id = b.id;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conrelid = 'public.course_certificates'::regclass AND contype = 'p'
    ) THEN
        ALTER TABLE public.course_certificates ADD CONSTRAINT course_certificates_pkey PRIMARY KEY (id);
    END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 2. Add PRIMARY KEY to public.course_enrollments
-- ------------------------------------------------------------------------------
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conrelid = 'public.course_enrollments'::regclass AND contype = 'p'
    ) THEN
        ALTER TABLE public.course_enrollments ADD CONSTRAINT course_enrollments_pkey PRIMARY KEY (id);
    END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 3. Move temporary backup tables out of public schema into backups schema
-- ------------------------------------------------------------------------------
CREATE SCHEMA IF NOT EXISTS backups;
REVOKE ALL ON SCHEMA backups FROM anon, authenticated, public;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'services_backup_20261018'
    ) THEN
        ALTER TABLE public.services_backup_20261018 SET SCHEMA backups;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'blog_posts_backup_20261018'
    ) THEN
        ALTER TABLE public.blog_posts_backup_20261018 SET SCHEMA backups;
    END IF;
END $$;

COMMIT;
