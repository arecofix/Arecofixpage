-- ==============================================================================
-- Rollback Migration: 20261021070000_rls_policies_missing_tables_down.sql
-- Description: Revert policies created by 20261021070000_rls_policies_missing_tables.sql
-- ==============================================================================

BEGIN;

DROP POLICY IF EXISTS "educacion_y_skills_public_select" ON public.educacion_y_skills;
DROP POLICY IF EXISTS "educacion_y_skills_admin_all" ON public.educacion_y_skills;
DROP POLICY IF EXISTS "experiencia_laboral_public_select" ON public.experiencia_laboral;
DROP POLICY IF EXISTS "experiencia_laboral_admin_all" ON public.experiencia_laboral;
DROP POLICY IF EXISTS "schema_migrations_admin_only" ON public.schema_migrations;

COMMIT;
