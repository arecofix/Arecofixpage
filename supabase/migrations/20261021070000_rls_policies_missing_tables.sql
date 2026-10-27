-- ==============================================================================
-- Migration: 20261021070000_rls_policies_missing_tables.sql
-- Description: Add RLS policies for tables with RLS enabled but no policies
-- Severity: MEDIUM / ARCHITECTURE (P1)
-- Category: rls_enabled_no_policy
-- Target Tables:
--   - public.educacion_y_skills
--   - public.experiencia_laboral
--   - public.schema_migrations
-- ==============================================================================

BEGIN;

-- Apply policies conditionally if tables exist
DO $$
BEGIN
    -- 1. public.educacion_y_skills
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'educacion_y_skills') THEN
        DROP POLICY IF EXISTS "educacion_y_skills_public_select" ON public.educacion_y_skills;
        DROP POLICY IF EXISTS "educacion_y_skills_admin_all" ON public.educacion_y_skills;

        CREATE POLICY "educacion_y_skills_public_select" ON public.educacion_y_skills
            FOR SELECT TO anon, authenticated
            USING (id IS NOT NULL);

        CREATE POLICY "educacion_y_skills_admin_all" ON public.educacion_y_skills
            FOR ALL TO authenticated
            USING (public.is_super_admin())
            WITH CHECK (public.is_super_admin());
    END IF;

    -- 2. public.experiencia_laboral
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'experiencia_laboral') THEN
        DROP POLICY IF EXISTS "experiencia_laboral_public_select" ON public.experiencia_laboral;
        DROP POLICY IF EXISTS "experiencia_laboral_admin_all" ON public.experiencia_laboral;

        CREATE POLICY "experiencia_laboral_public_select" ON public.experiencia_laboral
            FOR SELECT TO anon, authenticated
            USING (id IS NOT NULL);

        CREATE POLICY "experiencia_laboral_admin_all" ON public.experiencia_laboral
            FOR ALL TO authenticated
            USING (public.is_super_admin())
            WITH CHECK (public.is_super_admin());
    END IF;

    -- 3. public.schema_migrations
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'schema_migrations') THEN
        DROP POLICY IF EXISTS "schema_migrations_admin_only" ON public.schema_migrations;

        CREATE POLICY "schema_migrations_admin_only" ON public.schema_migrations
            FOR ALL TO authenticated
            USING (public.is_super_admin())
            WITH CHECK (public.is_super_admin());
    END IF;
END $$;

COMMIT;
