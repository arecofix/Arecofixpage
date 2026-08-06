-- Este script repara la función que se ejecuta automáticamente cuando se crea un usuario en Supabase (Trigger).
-- El error ocurría porque la función antigua intentaba insertar datos en la columna "full_name" 
-- de la tabla "profiles", pero esa columna ya no existe (fue dividida en first_name y last_name).

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Insertamos en la tabla profiles manejando correctamente first_name y last_name
  INSERT INTO public.profiles (
    id, 
    first_name, 
    last_name, 
    email, 
    role, 
    is_active, 
    created_at, 
    updated_at
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'first_name', ''),
    COALESCE(new.raw_user_meta_data->>'last_name', ''),
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'user'),
    true,
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    email = EXCLUDED.email;

  RETURN NEW;
END;
$$;
