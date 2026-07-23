-- Añadir columnas a la tabla profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0;

-- Crear un índice en referral_code para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON public.profiles(referral_code);

-- Crear función RPC para aplicar el código de referido
-- Esta función será llamada por el cliente (registrado o anónimo, idealmente después del registro)
-- Toma el ID del nuevo usuario y el código de referido ingresado.
CREATE OR REPLACE FUNCTION public.apply_referral(new_user_id UUID, ref_code TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- Se ejecuta con permisos de creador para saltar RLS y actualizar el referente
AS $$
DECLARE
    referrer_id UUID;
    points_to_add INTEGER := 100; -- Puntos que gana el referente (puedes cambiar esto)
BEGIN
    -- Validar que el código no esté vacío
    IF ref_code IS NULL OR trim(ref_code) = '' THEN
        RETURN;
    END IF;

    -- Buscar al usuario dueño del código
    SELECT id INTO referrer_id
    FROM public.profiles
    WHERE referral_code = trim(ref_code)
    LIMIT 1;

    -- Si el referente existe y no es el mismo usuario nuevo (evitar auto-referidos)
    IF referrer_id IS NOT NULL AND referrer_id != new_user_id THEN
        -- Sumar puntos al referente
        UPDATE public.profiles
        SET points = COALESCE(points, 0) + points_to_add
        WHERE id = referrer_id;
        
        -- Opcional: Aquí podrías registrar en una tabla "referrals" que new_user_id fue referido por referrer_id
        -- INSERT INTO referrals (referrer_id, referred_id) VALUES (referrer_id, new_user_id);
    END IF;
END;
$$;
