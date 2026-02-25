-- Trigger SQL para Google y Facebook Login (SaaS)
-- Objetivo: Cuando un usuario se autentica con Redes Sociales por primera vez, Supabase lo inserta en auth.users, pero no tiene tenant_id explícito.
-- Solución: Este trigger captura la creación de la cuenta y fuerza la inyección del perfil a la tabla public.profiles con el tenant_id principal si viene nulo.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_tenant_id uuid;
BEGIN
  -- Intenta sacar el tenant del metadata si vino en el request HTTP
  v_tenant_id := CAST(new.raw_user_meta_data->>'tenant_id' AS uuid);

  -- Si es nulo (ej. Registro OAuth por Google), asignarlo al tenant principal por defecto
  IF v_tenant_id IS NULL THEN
    SELECT id INTO v_tenant_id FROM public.tenants WHERE slug = 'arecofix' LIMIT 1;
  END IF;

  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    avatar_url,
    tenant_id,
    role
  )
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''), 
    new.raw_user_meta_data->>'avatar_url',
    v_tenant_id,
    'user'
  );
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recrear el Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
