-- 1. FUNCIÓN DE SINCRONIZACIÓN AUTOMÁTICA (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_first_name text;
  v_last_name text;
  v_full_name text;
  v_avatar_url text;
  v_phone text;
  v_role text;
  v_tenant_id uuid;
  v_branch_id uuid;
  v_raw_meta jsonb;
  v_email text;
BEGIN
  v_raw_meta := COALESCE(NEW.raw_user_meta_data, '{}'::jsonb);
  v_email := COALESCE(NEW.email, v_raw_meta->>'email', '');

  -- 1.1 Extracción de Nombre Completo y Nombres/Apellidos para separarlos
  v_full_name := NULLIF(TRIM(COALESCE(
    v_raw_meta->>'full_name',
    v_raw_meta->>'name',
    ''
  )), '');

  v_first_name := NULLIF(TRIM(COALESCE(
    v_raw_meta->>'first_name',
    v_raw_meta->>'given_name',
    CASE 
      WHEN v_full_name IS NOT NULL AND position(' ' IN v_full_name) > 0 
      THEN split_part(v_full_name, ' ', 1)
      ELSE v_full_name
    END,
    split_part(v_email, '@', 1)
  )), '');

  v_last_name := NULLIF(TRIM(COALESCE(
    v_raw_meta->>'last_name',
    v_raw_meta->>'family_name',
    CASE 
      WHEN v_full_name IS NOT NULL AND position(' ' IN v_full_name) > 0 
      THEN substr(v_full_name, length(split_part(v_full_name, ' ', 1)) + 2)
      ELSE ''
    END
  )), '');

  -- 1.2 Avatar y Teléfono
  v_avatar_url := NULLIF(TRIM(COALESCE(
    v_raw_meta->>'avatar_url',
    v_raw_meta->>'picture',
    ''
  )), '');

  v_phone := NULLIF(TRIM(COALESCE(
    NEW.phone,
    v_raw_meta->>'phone',
    ''
  )), '');

  -- 1.3 Asignación de Rol
  IF v_email IN ('ezequielenrico15@gmail.com', 'ezequielenrico1015@hotmail.com') THEN
    v_role := 'super_admin';
  ELSIF v_raw_meta->>'role' IN ('admin', 'super_admin', 'tenant_owner', 'staff', 'technician', 'instructor') THEN
    v_role := v_raw_meta->>'role';
  ELSE
    v_role := 'user';
  END IF;

  -- 1.4 Resolución de Tenant ID
  IF v_raw_meta->>'tenant_id' IS NOT NULL AND v_raw_meta->>'tenant_id' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
    SELECT id INTO v_tenant_id FROM public.tenants WHERE id = (v_raw_meta->>'tenant_id')::uuid;
  END IF;

  IF v_tenant_id IS NULL THEN
    SELECT id INTO v_tenant_id 
    FROM public.tenants 
    WHERE slug = 'arecofix' OR id = 'bba26ccd-59ce-471c-aac0-4c1f5513de3b'::uuid
    LIMIT 1;
    
    IF v_tenant_id IS NULL THEN
      SELECT t.id INTO v_tenant_id FROM public.tenants t WHERE t.is_active = true ORDER BY t.created_at ASC LIMIT 1;
    END IF;
  END IF;

  -- 1.5 Resolución de Branch ID
  IF v_raw_meta->>'branch_id' IS NOT NULL AND v_raw_meta->>'branch_id' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
    SELECT id INTO v_branch_id FROM public.branches WHERE id = (v_raw_meta->>'branch_id')::uuid;
  END IF;

  IF v_branch_id IS NULL THEN
    SELECT id INTO v_branch_id 
    FROM public.branches 
    WHERE id = 'de967f68-7b15-44c0-bc98-952ccf06e1e5'::uuid OR tenant_id = v_tenant_id
    LIMIT 1;
  END IF;

  -- 1.6 Inserción o Actualización Atómica (UPSERT)
  INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name,
    avatar_url,
    phone,
    role,
    tenant_id,
    branch_id,
    is_active,
    is_guest,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    v_email,
    v_first_name,
    v_last_name,
    v_avatar_url,
    v_phone,
    v_role,
    v_tenant_id,
    v_branch_id,
    true,
    false,
    COALESCE(NEW.created_at, NOW()),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = COALESCE(EXCLUDED.email, public.profiles.email),
    first_name = COALESCE(EXCLUDED.first_name, public.profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, public.profiles.last_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
    phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
    tenant_id = COALESCE(public.profiles.tenant_id, EXCLUDED.tenant_id),
    branch_id = COALESCE(public.profiles.branch_id, EXCLUDED.branch_id),
    updated_at = NOW();

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error en handle_new_user() para usuario %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- 2. TRIGGER EN auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 3. MIGRACIÓN RETROACTIVA (BACKFILL HISTÓRICO)
INSERT INTO public.profiles (
  id,
  email,
  first_name,
  last_name,
  avatar_url,
  phone,
  role,
  tenant_id,
  branch_id,
  is_active,
  is_guest,
  created_at,
  updated_at
)
SELECT
  u.id,
  u.email,
  COALESCE(
    u.raw_user_meta_data->>'first_name',
    u.raw_user_meta_data->>'given_name',
    split_part(COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', split_part(u.email, '@', 1)), ' ', 1)
  ) AS first_name,
  COALESCE(
    u.raw_user_meta_data->>'last_name',
    u.raw_user_meta_data->>'family_name',
    NULLIF(substr(COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', ''), length(split_part(COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', ''), ' ', 1)) + 2), '')
  ) AS last_name,
  COALESCE(u.raw_user_meta_data->>'avatar_url', u.raw_user_meta_data->>'picture', NULL) AS avatar_url,
  COALESCE(u.phone, u.raw_user_meta_data->>'phone', NULL) AS phone,
  CASE
    WHEN u.email IN ('ezequielenrico15@gmail.com', 'ezequielenrico1015@hotmail.com') THEN 'super_admin'
    WHEN u.raw_user_meta_data->>'role' IN ('admin', 'super_admin', 'tenant_owner', 'staff', 'technician', 'instructor') THEN u.raw_user_meta_data->>'role'
    ELSE 'user'
  END AS role,
  COALESCE(
    NULLIF(u.raw_user_meta_data->>'tenant_id', '')::uuid,
    (SELECT t.id FROM public.tenants t WHERE t.slug = 'arecofix' OR t.id = 'bba26ccd-59ce-471c-aac0-4c1f5513de3b'::uuid LIMIT 1),
    (SELECT t.id FROM public.tenants t WHERE t.is_active = true ORDER BY t.created_at ASC LIMIT 1)
  ) AS tenant_id,
  COALESCE(
    NULLIF(u.raw_user_meta_data->>'branch_id', '')::uuid,
    (SELECT b.id FROM public.branches b WHERE b.id = 'de967f68-7b15-44c0-bc98-952ccf06e1e5'::uuid LIMIT 1),
    (SELECT b.id FROM public.branches b WHERE b.is_active = true ORDER BY b.updated_at ASC LIMIT 1)
  ) AS branch_id,
  true AS is_active,
  false AS is_guest,
  COALESCE(u.created_at, NOW()),
  NOW()
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- 3.2 Repara registros existentes con tenant_id nulos o nombres faltantes
UPDATE public.profiles p
SET
  tenant_id = COALESCE(
    p.tenant_id,
    (SELECT t.id FROM public.tenants t WHERE t.slug = 'arecofix' OR t.id = 'bba26ccd-59ce-471c-aac0-4c1f5513de3b'::uuid LIMIT 1),
    (SELECT t.id FROM public.tenants t WHERE t.is_active = true ORDER BY t.created_at ASC LIMIT 1)
  ),
  branch_id = COALESCE(
    p.branch_id,
    (SELECT b.id FROM public.branches b WHERE b.id = 'de967f68-7b15-44c0-bc98-952ccf06e1e5'::uuid LIMIT 1),
    (SELECT b.id FROM public.branches b WHERE b.is_active = true ORDER BY b.updated_at ASC LIMIT 1)
  ),
  email = COALESCE(p.email, u.email),
  first_name = COALESCE(
    p.first_name,
    u.raw_user_meta_data->>'first_name',
    u.raw_user_meta_data->>'given_name',
    split_part(COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', split_part(u.email, '@', 1)), ' ', 1)
  ),
  last_name = COALESCE(
    p.last_name,
    u.raw_user_meta_data->>'last_name',
    u.raw_user_meta_data->>'family_name',
    NULLIF(substr(COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', ''), length(split_part(COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', ''), ' ', 1)) + 2), '')
  ),
  avatar_url = COALESCE(p.avatar_url, u.raw_user_meta_data->>'avatar_url', u.raw_user_meta_data->>'picture'),
  role = CASE
    WHEN u.email IN ('ezequielenrico15@gmail.com', 'ezequielenrico1015@hotmail.com') THEN 'super_admin'
    ELSE COALESCE(p.role, 'user')
  END,
  updated_at = NOW()
FROM auth.users u
WHERE p.id = u.id
  AND (
    p.tenant_id IS NULL 
    OR p.first_name IS NULL 
    OR (u.email IN ('ezequielenrico15@gmail.com', 'ezequielenrico1015@hotmail.com') AND p.role != 'super_admin')
  );

-- 4. FUNCIÓN HELPER NO RECURSIVA PARA VERIFICAR ADMINS (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('super_admin', 'tenant_owner', 'admin')
  );
$$;

-- 5. POLÍTICAS RLS EN public.profiles (SIN RECURSIÓN)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users and Admins can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage profiles in tenant" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;

-- 5.1 Lectura: Permitida para todos los usuarios autenticados y anónimos (evita recursión infinita en cascada)
CREATE POLICY "profiles_select_policy"
ON public.profiles
FOR SELECT
TO authenticated, anon
USING (true);

-- 5.2 Inserción: El propio usuario o administradores
CREATE POLICY "profiles_insert_policy"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id OR public.is_admin_user());

-- 5.3 Actualización: El propio usuario o administradores
CREATE POLICY "profiles_update_policy"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id OR public.is_admin_user())
WITH CHECK (auth.uid() = id OR public.is_admin_user());

-- 6. RECARGA DE CACHÉ DE POSTGREST
NOTIFY pgrst, 'reload schema';
