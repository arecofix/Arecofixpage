-- =================================================================
-- FIX PARA CREACIÓN DE EMPLEADOS - SIN gen_salt()
-- Reemplaza la función create_employee que usa gen_salt() por una versión
-- que usa crypt() que está disponible en Supabase/PostgreSQL
-- =================================================================

-- Eliminar función anterior si existe
DROP FUNCTION IF EXISTS create_employee;

-- Crear función corregida SIN gen_salt()
CREATE OR REPLACE FUNCTION create_employee(
    p_first_name TEXT,
    p_last_name TEXT,
    p_email TEXT,
    p_phone TEXT,
    p_role TEXT,
    p_password TEXT,
    p_avatar_url TEXT,
    p_tenant_id UUID
)
RETURNS TABLE (
    id UUID,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    role TEXT,
    avatar_url TEXT,
    tenant_id UUID,
    created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_profile_id UUID;
    v_hashed_password TEXT;
BEGIN
    -- Validar que el email no exista ya
    IF EXISTS (SELECT 1 FROM auth.users WHERE auth.users.email = p_email) THEN
        RAISE EXCEPTION 'El email ya está registrado en el sistema';
    END IF;
    
    -- Hashear la contraseña usando crypt() en lugar de gen_salt()
    -- crypt() está disponible en PostgreSQL y es más compatible
    v_hashed_password := crypt(p_password, '$2b$12$' || encode(gen_random_bytes(16), 'base64'));
    
    -- Crear usuario en auth.users
    INSERT INTO auth.users (
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        role
    ) VALUES (
        p_email,
        v_hashed_password,
        NOW(),
        NOW(),
        NOW(),
        'authenticated'
    ) RETURNING id INTO v_user_id;
    
    -- Crear perfil en public.profiles
    INSERT INTO public.profiles (
        id,
        email,
        first_name,
        last_name,
        phone,
        role,
        avatar_url,
        tenant_id,
        is_active,
        created_at,
        updated_at
    ) VALUES (
        v_user_id,
        p_email,
        p_first_name,
        p_last_name,
        p_phone,
        p_role,
        p_avatar_url,
        p_tenant_id,
        true,
        NOW(),
        NOW()
    ) RETURNING id INTO v_profile_id;
    
    -- Retornar los datos del empleado creado usando alias explícitos
    RETURN QUERY
    SELECT 
        p.id,
        p.email,
        p.first_name,
        p.last_name,
        p.phone,
        p.role,
        p.avatar_url,
        p.tenant_id,
        p.created_at
    FROM public.profiles p
    WHERE p.id = v_profile_id;
    
END;
$$;

-- Crear política para que la función pueda ser ejecutada
-- (si es necesario, dependiendo de tu configuración RLS)
GRANT EXECUTE ON FUNCTION create_employee TO authenticated;

-- Crear función alternativa para asignar usuario existente como empleado
CREATE OR REPLACE FUNCTION assign_user_as_employee(
    p_user_id UUID,
    p_role TEXT,
    p_tenant_id UUID
)
RETURNS TABLE (
    id UUID,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    role TEXT,
    avatar_url TEXT,
    tenant_id UUID,
    created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Actualizar el perfil del usuario existente para que sea empleado
    UPDATE public.profiles 
    SET 
        role = p_role,
        tenant_id = p_tenant_id,
        updated_at = NOW()
    WHERE id = p_user_id;
    
    -- Retornar los datos actualizados usando alias explícitos
    RETURN QUERY
    SELECT 
        p.id,
        p.email,
        p.first_name,
        p.last_name,
        p.phone,
        p.role,
        p.avatar_url,
        p.tenant_id,
        p.created_at
    FROM public.profiles p
    WHERE p.id = p_user_id;
    
END;
$$;

GRANT EXECUTE ON FUNCTION assign_user_as_employee TO authenticated;

-- Crear vista para obtener usuarios disponibles para asignar como empleados
CREATE OR REPLACE VIEW available_users_for_employee AS
SELECT 
    u.id,
    u.email,
    p.first_name,
    p.last_name,
    p.phone,
    p.avatar_url,
    p.created_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email NOT IN (
    SELECT profiles.email FROM public.profiles 
    WHERE profiles.role IN ('admin', 'staff', 'technician')
)
AND u.email_confirmed_at IS NOT NULL
ORDER BY u.created_at DESC;

-- Comentarios para documentación
COMMENT ON FUNCTION create_employee IS 'Crea un nuevo empleado con usuario y perfil, usando crypt() en lugar de gen_salt()';
COMMENT ON FUNCTION assign_user_as_employee IS 'Asigna un usuario existente como empleado';
COMMENT ON VIEW available_users_for_employee IS 'Usuarios registrados disponibles para asignar como empleados';

-- Confirmar cambios
SELECT 'Employee creation functions fixed successfully' as status;
