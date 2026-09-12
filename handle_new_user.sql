                                                                                                                                                +
 DECLARE                                                                                                                                        +
   v_first_name text;                                                                                                                           +
   v_last_name text;                                                                                                                            +
   v_full_name text;                                                                                                                            +
   v_avatar_url text;                                                                                                                           +
   v_phone text;                                                                                                                                +
   v_role text;                                                                                                                                 +
   v_tenant_id uuid;                                                                                                                            +
   v_branch_id uuid;                                                                                                                            +
   v_raw_meta jsonb;                                                                                                                            +
   v_email text;                                                                                                                                +
 BEGIN                                                                                                                                          +
   v_raw_meta := COALESCE(NEW.raw_user_meta_data, '{}'::jsonb);                                                                                 +
   v_email := COALESCE(NEW.email, v_raw_meta->>'email', '');                                                                                    +
                                                                                                                                                +
   -- 1.1 Extracción de Nombre Completo y Nombres/Apellidos para separarlos                                                                     +
   v_full_name := NULLIF(TRIM(COALESCE(                                                                                                         +
     v_raw_meta->>'full_name',                                                                                                                  +
     v_raw_meta->>'name',                                                                                                                       +
     ''                                                                                                                                         +
   )), '');                                                                                                                                     +
                                                                                                                                                +
   v_first_name := NULLIF(TRIM(COALESCE(                                                                                                        +
     v_raw_meta->>'first_name',                                                                                                                 +
     v_raw_meta->>'given_name',                                                                                                                 +
     CASE                                                                                                                                       +
       WHEN v_full_name IS NOT NULL AND position(' ' IN v_full_name) > 0                                                                        +
       THEN split_part(v_full_name, ' ', 1)                                                                                                     +
       ELSE v_full_name                                                                                                                         +
     END,                                                                                                                                       +
     split_part(v_email, '@', 1)                                                                                                                +
   )), '');                                                                                                                                     +
                                                                                                                                                +
   v_last_name := NULLIF(TRIM(COALESCE(                                                                                                         +
     v_raw_meta->>'last_name',                                                                                                                  +
     v_raw_meta->>'family_name',                                                                                                                +
     CASE                                                                                                                                       +
       WHEN v_full_name IS NOT NULL AND position(' ' IN v_full_name) > 0                                                                        +
       THEN substr(v_full_name, length(split_part(v_full_name, ' ', 1)) + 2)                                                                    +
       ELSE ''                                                                                                                                  +
     END                                                                                                                                        +
   )), '');                                                                                                                                     +
                                                                                                                                                +
   -- 1.2 Avatar y Teléfono                                                                                                                     +
   v_avatar_url := NULLIF(TRIM(COALESCE(                                                                                                        +
     v_raw_meta->>'avatar_url',                                                                                                                 +
     v_raw_meta->>'picture',                                                                                                                    +
     ''                                                                                                                                         +
   )), '');                                                                                                                                     +
                                                                                                                                                +
   v_phone := NULLIF(TRIM(COALESCE(                                                                                                             +
     NEW.phone,                                                                                                                                 +
     v_raw_meta->>'phone',                                                                                                                      +
     ''                                                                                                                                         +
   )), '');                                                                                                                                     +
                                                                                                                                                +
   -- 1.3 Asignación de Rol                                                                                                                     +
   IF v_email IN ('ezequielenrico15@gmail.com', 'ezequielenrico1015@hotmail.com') THEN                                                          +
     v_role := 'super_admin';                                                                                                                   +
   ELSIF v_raw_meta->>'role' IN ('admin', 'super_admin', 'tenant_owner', 'staff', 'technician', 'instructor') THEN                              +
     v_role := v_raw_meta->>'role';                                                                                                             +
   ELSE                                                                                                                                         +
     v_role := 'user';                                                                                                                          +
   END IF;                                                                                                                                      +
                                                                                                                                                +
   -- 1.4 Resolución de Tenant ID                                                                                                               +
   IF v_raw_meta->>'tenant_id' IS NOT NULL AND v_raw_meta->>'tenant_id' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN+
     SELECT id INTO v_tenant_id FROM public.tenants WHERE id = (v_raw_meta->>'tenant_id')::uuid;                                                +
   END IF;                                                                                                                                      +
                                                                                                                                                +
   IF v_tenant_id IS NULL THEN                                                                                                                  +
     SELECT id INTO v_tenant_id                                                                                                                 +
     FROM public.tenants                                                                                                                        +
     WHERE slug = 'arecofix' OR id = 'bba26ccd-59ce-471c-aac0-4c1f5513de3b'::uuid                                                               +
     LIMIT 1;                                                                                                                                   +
                                                                                                                                                +
     IF v_tenant_id IS NULL THEN                                                                                                                +
       SELECT t.id INTO v_tenant_id FROM public.tenants t WHERE t.is_active = true ORDER BY t.created_at ASC LIMIT 1;                           +
     END IF;                                                                                                                                    +
   END IF;                                                                                                                                      +
                                                                                                                                                +
   -- 1.5 Resolución de Branch ID                                                                                                               +
   IF v_raw_meta->>'branch_id' IS NOT NULL AND v_raw_meta->>'branch_id' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN+
     SELECT id INTO v_branch_id FROM public.branches WHERE id = (v_raw_meta->>'branch_id')::uuid;                                               +
   END IF;                                                                                                                                      +
                                                                                                                                                +
   IF v_branch_id IS NULL THEN                                                                                                                  +
     SELECT id INTO v_branch_id                                                                                                                 +
     FROM public.branches                                                                                                                       +
     WHERE id = 'de967f68-7b15-44c0-bc98-952ccf06e1e5'::uuid OR tenant_id = v_tenant_id                                                         +
     LIMIT 1;                                                                                                                                   +
   END IF;                                                                                                                                      +
                                                                                                                                                +
   -- 1.6 Inserción o Actualización Atómica (UPSERT)                                                                                            +
   INSERT INTO public.profiles (                                                                                                                +
     id,                                                                                                                                        +
     email,                                                                                                                                     +
     first_name,                                                                                                                                +
     last_name,                                                                                                                                 +
     avatar_url,                                                                                                                                +
     phone,                                                                                                                                     +
     role,                                                                                                                                      +
     tenant_id,                                                                                                                                 +
     branch_id,                                                                                                                                 +
     is_active,                                                                                                                                 +
     is_guest,                                                                                                                                  +
     created_at,                                                                                                                                +
     updated_at                                                                                                                                 +
   ) VALUES (                                                                                                                                   +
     NEW.id,                                                                                                                                    +
     v_email,                                                                                                                                   +
     v_first_name,                                                                                                                              +
     v_last_name,                                                                                                                               +
     v_avatar_url,                                                                                                                              +
     v_phone,                                                                                                                                   +
     v_role,                                                                                                                                    +
     v_tenant_id,                                                                                                                               +
     v_branch_id,                                                                                                                               +
     true,                                                                                                                                      +
     false,                                                                                                                                     +
     COALESCE(NEW.created_at, NOW()),                                                                                                           +
     NOW()                                                                                                                                      +
   )                                                                                                                                            +
   ON CONFLICT (id) DO UPDATE SET                                                                                                               +
     email = COALESCE(EXCLUDED.email, public.profiles.email),                                                                                   +
     first_name = COALESCE(EXCLUDED.first_name, public.profiles.first_name),                                                                    +
     last_name = COALESCE(EXCLUDED.last_name, public.profiles.last_name),                                                                       +
     avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),                                                                    +
     phone = COALESCE(EXCLUDED.phone, public.profiles.phone),                                                                                   +
     tenant_id = COALESCE(public.profiles.tenant_id, EXCLUDED.tenant_id),                                                                       +
     branch_id = COALESCE(public.profiles.branch_id, EXCLUDED.branch_id),                                                                       +
     updated_at = NOW();                                                                                                                        +
                                                                                                                                                +
   RETURN NEW;                                                                                                                                  +
 EXCEPTION                                                                                                                                      +
   WHEN OTHERS THEN                                                                                                                             +
     RAISE WARNING 'Error en handle_new_user() para usuario %: %', NEW.id, SQLERRM;                                                             +
     RETURN NEW;                                                                                                                                +
 END;                                                                                                                                           +
 

