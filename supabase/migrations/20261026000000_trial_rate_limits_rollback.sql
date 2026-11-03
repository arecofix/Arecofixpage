-- ==============================================================================
-- Rollback Script: Reversión de Control de Tasa para Pruebas Gratuitas
-- Archivo: supabase/migrations/20261026000000_trial_rate_limits_rollback.sql
-- ==============================================================================

DROP FUNCTION IF EXISTS public.check_trial_rate_limit(TEXT, INT, INT);
DROP TABLE IF EXISTS public.trial_rate_limits;
