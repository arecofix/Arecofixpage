-- ==============================================================================
-- TSK-02b: Fix Corrupción de Datos (Defensa Backend)
-- ==============================================================================

BEGIN;

-- 1. Eliminar datos corruptos previos de la tabla profiles (o actualizarlos a un valor válido como 'Sin Nombre')
UPDATE public.profiles 
SET first_name = 'Sin Nombre' 
WHERE first_name = '' OR first_name = 'Cliente' OR first_name IS NULL;

-- 2. Agregar constraints de CHECK en profiles
ALTER TABLE public.profiles 
ADD CONSTRAINT check_valid_first_name 
CHECK (
    first_name IS NOT NULL AND 
    first_name <> '' AND 
    first_name <> 'Cliente'
);

COMMIT;
