-- Fix for custom_access_token_hook to prevent UUID cast errors when provider_id is sent
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    claims jsonb;
    user_record record;
    parsed_uuid uuid;
BEGIN
    -- Validamos que el user_id sea un UUID válido antes de hacer el cast
    IF event->>'user_id' IS NULL OR event->>'user_id' !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
        -- Si no es un UUID válido (por ej. ID de Google), devolvemos el event tal cual
        RETURN event;
    END IF;

    parsed_uuid := (event->>'user_id')::uuid;

    -- Buscamos los datos del usuario en Profiles
    SELECT role, tenant_id, branch_id INTO user_record 
    FROM public.profiles 
    WHERE id = parsed_uuid;

    claims := event->'claims';

    -- Si el usuario tiene perfil, inyectamos los datos en el JWT
    IF user_record.tenant_id IS NOT NULL THEN
        claims := jsonb_set(claims, '{tenant_id}', to_jsonb(user_record.tenant_id));
        claims := jsonb_set(claims, '{user_role}', to_jsonb(COALESCE(user_record.role, 'user')));
        
        IF user_record.branch_id IS NOT NULL THEN
            claims := jsonb_set(claims, '{branch_id}', to_jsonb(user_record.branch_id));
        END IF;
    END IF;

    -- Devolvemos el token con la metadata inyectada
    RETURN jsonb_set(event, '{claims}', claims);
END;
$$;
