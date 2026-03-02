CREATE OR REPLACE FUNCTION public.create_client(
  p_first_name text,
  p_last_name text,
  p_email text,
  p_phone text,
  p_address text,
  p_dni text,
  p_tenant_id uuid
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_fake_email text;
  v_pass text;
  v_user_meta jsonb;
BEGIN
  -- Generate user_id and email if missing
  v_user_id := gen_random_uuid();
  v_fake_email := COALESCE(NULLIF(p_email, ''), 'cliente_' || extract(epoch from now())::text || '@arecofix.local');
  v_pass := crypt('tempPass123!_' || gen_random_uuid()::text, gen_salt('bf'));
  
  v_user_meta := jsonb_build_object(
      'first_name', p_first_name,
      'last_name', p_last_name,
      'full_name', trim(p_first_name || ' ' || p_last_name)
  );

  -- Insert into auth layer bypassing standard validation
  INSERT INTO auth.users (
    id,
    instance_id,
    tenant_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    '00000000-0000-0000-0000-000000000000',
    'admin',
    'authenticated',
    'authenticated',
    v_fake_email,
    v_pass,
    now(),
    v_user_meta,
    now(),
    now()
  );

  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    v_user_id,
    jsonb_build_object('sub', v_user_id, 'email', v_fake_email),
    'email',
    v_user_id,
    now(),
    now(),
    now()
  );

  -- 3. Profile will usually be created via a trigger on auth.users, BUT
  -- we can just update the profile after the trigger creates it.
  -- Let's give the trigger time to run (it runs synchronously)
  -- Then update the details:
  UPDATE public.profiles
  SET 
    first_name = p_first_name,
    last_name = p_last_name,
    full_name = trim(p_first_name || ' ' || p_last_name),
    phone = p_phone,
    address = p_address,
    dni = p_dni,
    role = 'user',
    tenant_id = p_tenant_id
  WHERE id = v_user_id;

  RETURN v_user_id;
END;
$$;
