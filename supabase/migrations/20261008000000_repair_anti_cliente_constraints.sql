-- ==============================================================================
-- TSK-02b: Defensa en profundidad Backend (Anti-Cliente)
-- Constraints para evitar strings vacíos o fallbacks harcodeados en DB.
-- ==============================================================================

BEGIN;

-- 0. Dropear trigger obsoleto y roto que impide actualizar perfiles
DROP FUNCTION IF EXISTS public.sync_profile_to_repairs() CASCADE;

-- 1. Sanear datos corruptos existentes en profiles
UPDATE public.profiles
SET first_name = 'Sin Nombre', last_name = '(Corregir)'
WHERE trim(first_name) = 'Cliente' OR trim(first_name) = '';

-- 2. Aplicar Constraint a profiles
ALTER TABLE public.profiles 
ADD CONSTRAINT chk_profiles_first_name 
CHECK (first_name IS NULL OR (trim(first_name) <> 'Cliente' AND trim(first_name) <> ''));

-- 3. Sanear datos corruptos existentes en models
UPDATE public.models
SET name = 'Sin Modelo (Corregir)'
WHERE trim(name) = 'Equipo Genérico' OR trim(name) = '';

-- 4. Aplicar Constraint a models
ALTER TABLE public.models 
ADD CONSTRAINT chk_models_name 
CHECK (name IS NULL OR (trim(name) <> 'Equipo Genérico' AND trim(name) <> ''));

COMMIT;
