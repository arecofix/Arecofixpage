-- ==============================================================================
-- MIGRATION: 20261018030000_eradicate_all_remaining_tenant_leaks.sql
-- PURPOSE: Eradicate all remaining get_my_tenant() / get_secure_tenant_id() calls,
--          hardcoded fallbacks in handle_new_user, force_tenant_isolation, and
--          leaky USING (true) policies on knowledge_base and repair_number_sequences.
-- ==============================================================================

-- 1. Redefine get_my_tenant and get_secure_tenant_id as strict wrappers of get_current_tenant_id
CREATE OR REPLACE FUNCTION public.get_my_tenant()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.get_current_tenant_id();
$$;

CREATE OR REPLACE FUNCTION public.get_secure_tenant_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.get_current_tenant_id();
$$;

-- 2. Update force_tenant_isolation trigger function
CREATE OR REPLACE FUNCTION public.force_tenant_isolation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    context_tenant_id uuid;
    v_user_role text;
BEGIN
    context_tenant_id := public.get_current_tenant_id();
    
    v_user_role := current_setting('request.jwt.claims', true)::jsonb ->> 'user_role';
    IF v_user_role IS NULL AND auth.uid() IS NOT NULL THEN
        SELECT role INTO v_user_role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
    END IF;

    IF v_user_role = 'super_admin' OR public.is_super_admin() THEN
        IF TG_OP = 'INSERT' AND NEW.tenant_id IS NULL THEN
            NEW.tenant_id := context_tenant_id;
        END IF;
        RETURN NEW;
    END IF;

    IF context_tenant_id IS NOT NULL THEN
        IF TG_OP = 'INSERT' THEN
            NEW.tenant_id := context_tenant_id;
        ELSIF TG_OP = 'UPDATE' THEN
            IF OLD.tenant_id != NEW.tenant_id THEN
                RAISE EXCEPTION 'Aislamiento crítico: Prohibido mover registros entre Tenants.';
            END IF;
            NEW.tenant_id := OLD.tenant_id;
        END IF;
    ELSE
        IF TG_OP = 'INSERT' THEN
            IF NEW.tenant_id IS NULL THEN
                RAISE EXCEPTION 'Aislamiento crítico: Usuario sin tenant asignado y no se proporcionó tenant_id explícito.';
            END IF;
        ELSIF TG_OP = 'UPDATE' THEN
            IF OLD.tenant_id IS NOT NULL AND NEW.tenant_id IS NOT NULL AND OLD.tenant_id != NEW.tenant_id THEN
                RAISE EXCEPTION 'Aislamiento crítico: Prohibido mover registros entre Tenants.';
            END IF;
            NEW.tenant_id := OLD.tenant_id;
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

-- 3. Update handle_new_user to eliminate hardcoded tenant 'bba26ccd-...' and branch 'de967f68-...'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

  -- 1.1 Extracción de Nombre Completo
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

  -- 1.4 Resolución de Tenant ID Dinámica (Sin fallbacks hardcodeados)
  IF v_raw_meta->>'tenant_id' IS NOT NULL AND v_raw_meta->>'tenant_id' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
    SELECT id INTO v_tenant_id FROM public.tenants WHERE id = (v_raw_meta->>'tenant_id')::uuid;
  END IF;

  IF v_tenant_id IS NULL OR v_tenant_id = '00000000-0000-0000-0000-000000000000'::uuid THEN
    v_tenant_id := public.get_current_tenant_id();
  END IF;

  -- 1.5 Resolución de Branch ID Dinámica (Perteneciente al tenant resuelto)
  IF v_raw_meta->>'branch_id' IS NOT NULL AND v_raw_meta->>'branch_id' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
    SELECT id INTO v_branch_id FROM public.branches WHERE id = (v_raw_meta->>'branch_id')::uuid;
  END IF;

  IF v_branch_id IS NULL AND v_tenant_id IS NOT NULL THEN
    SELECT id INTO v_branch_id 
    FROM public.branches 
    WHERE tenant_id = v_tenant_id
    ORDER BY is_active DESC, updated_at ASC
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

-- 4. Fix knowledge_base policies (Remove USING (true) delete/read leaks)
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated read access to knowledge_base" ON public.knowledge_base;
DROP POLICY IF EXISTS "Allow authenticated delete access to knowledge_base" ON public.knowledge_base;
DROP POLICY IF EXISTS "Silencing linter for knowledge_base" ON public.knowledge_base;
DROP POLICY IF EXISTS "knowledge_base_tenant_isolation" ON public.knowledge_base;

CREATE POLICY "knowledge_base_tenant_isolation"
ON public.knowledge_base
FOR ALL
TO authenticated
USING (tenant_id = public.get_current_tenant_id() OR public.is_super_admin())
WITH CHECK (tenant_id = public.get_current_tenant_id() OR public.is_super_admin());

-- 5. Fix repair_number_sequences policies (Remove USING (true) read leak)
ALTER TABLE public.repair_number_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repair_number_sequences FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_read" ON public.repair_number_sequences;
DROP POLICY IF EXISTS "repair_number_sequences_tenant_isolation" ON public.repair_number_sequences;

CREATE POLICY "repair_number_sequences_tenant_isolation"
ON public.repair_number_sequences
FOR ALL
TO authenticated
USING (tenant_id = public.get_current_tenant_id() OR public.is_super_admin())
WITH CHECK (tenant_id = public.get_current_tenant_id() OR public.is_super_admin());

-- 6. Replace remaining get_my_tenant() policies with public.get_current_tenant_id()

-- 6.1 Audit Logs & Auth Logs
DROP POLICY IF EXISTS "tenant_isolation_policy" ON public.audit_logs;
DROP POLICY IF EXISTS "audit_logs_tenant_isolation" ON public.audit_logs;
CREATE POLICY "audit_logs_tenant_isolation"
ON public.audit_logs
FOR ALL
TO authenticated
USING (tenant_id = public.get_current_tenant_id() OR public.is_super_admin())
WITH CHECK (tenant_id = public.get_current_tenant_id() OR public.is_super_admin());

DROP POLICY IF EXISTS "tenant_isolation_policy" ON public.auth_logs;
DROP POLICY IF EXISTS "auth_logs_tenant_isolation" ON public.auth_logs;
CREATE POLICY "auth_logs_tenant_isolation"
ON public.auth_logs
FOR ALL
TO authenticated
USING (tenant_id = public.get_current_tenant_id() OR public.is_super_admin())
WITH CHECK (tenant_id = public.get_current_tenant_id() OR public.is_super_admin());

-- 6.2 Bank Reconciliations
DROP POLICY IF EXISTS "Tenants can manage bank recons" ON public.bank_reconciliations;
DROP POLICY IF EXISTS "bank_reconciliations_tenant_isolation" ON public.bank_reconciliations;
CREATE POLICY "bank_reconciliations_tenant_isolation"
ON public.bank_reconciliations
FOR ALL
TO authenticated
USING (tenant_id = public.get_current_tenant_id() OR public.is_super_admin())
WITH CHECK (tenant_id = public.get_current_tenant_id() OR public.is_super_admin());

-- 6.3 Blog Categories, Post Tags, Tags
DROP POLICY IF EXISTS "tenant_isolation_policy" ON public.blog_categories;
DROP POLICY IF EXISTS "blog_categories_tenant_isolation" ON public.blog_categories;
CREATE POLICY "blog_categories_tenant_isolation"
ON public.blog_categories
FOR ALL
TO authenticated
USING (tenant_id = public.get_current_tenant_id() OR public.is_super_admin())
WITH CHECK (tenant_id = public.get_current_tenant_id() OR public.is_super_admin());

DROP POLICY IF EXISTS "tenant_isolation_policy" ON public.blog_post_tags;
DROP POLICY IF EXISTS "blog_post_tags_tenant_isolation" ON public.blog_post_tags;
CREATE POLICY "blog_post_tags_tenant_isolation"
ON public.blog_post_tags
FOR ALL
TO authenticated
USING (tenant_id = public.get_current_tenant_id() OR public.is_super_admin())
WITH CHECK (tenant_id = public.get_current_tenant_id() OR public.is_super_admin());

DROP POLICY IF EXISTS "tenant_isolation_policy" ON public.blog_tags;
DROP POLICY IF EXISTS "blog_tags_tenant_isolation" ON public.blog_tags;
CREATE POLICY "blog_tags_tenant_isolation"
ON public.blog_tags
FOR ALL
TO authenticated
USING (tenant_id = public.get_current_tenant_id() OR public.is_super_admin())
WITH CHECK (tenant_id = public.get_current_tenant_id() OR public.is_super_admin());

-- 6.4 Blog Posts
DROP POLICY IF EXISTS "bp_select" ON public.blog_posts;
DROP POLICY IF EXISTS "bp_insert" ON public.blog_posts;
DROP POLICY IF EXISTS "bp_update" ON public.blog_posts;
DROP POLICY IF EXISTS "bp_delete" ON public.blog_posts;

CREATE POLICY "bp_select"
ON public.blog_posts
FOR SELECT
TO public
USING (
    (status = 'published' AND EXISTS (SELECT 1 FROM public.tenants t WHERE t.id = blog_posts.tenant_id AND t.is_active = true))
    OR tenant_id = public.get_current_tenant_id()
    OR public.is_super_admin()
);

CREATE POLICY "bp_insert"
ON public.blog_posts
FOR INSERT
TO authenticated
WITH CHECK (tenant_id = public.get_current_tenant_id() OR public.is_super_admin());

CREATE POLICY "bp_update"
ON public.blog_posts
FOR UPDATE
TO authenticated
USING (tenant_id = public.get_current_tenant_id() OR public.is_super_admin())
WITH CHECK (tenant_id = public.get_current_tenant_id() OR public.is_super_admin());

CREATE POLICY "bp_delete"
ON public.blog_posts
FOR DELETE
TO authenticated
USING (tenant_id = public.get_current_tenant_id() OR public.is_super_admin());

-- 6.5 Branches
DROP POLICY IF EXISTS "branches_master_policy" ON public.branches;
DROP POLICY IF EXISTS "branches_tenant_isolation" ON public.branches;
CREATE POLICY "branches_tenant_isolation"
ON public.branches
FOR ALL
TO authenticated
USING (tenant_id = public.get_current_tenant_id() OR public.is_super_admin())
WITH CHECK (tenant_id = public.get_current_tenant_id() OR public.is_super_admin());

-- 6.6 Courses
DROP POLICY IF EXISTS "crs_select" ON public.courses;
DROP POLICY IF EXISTS "crs_insert" ON public.courses;
DROP POLICY IF EXISTS "crs_update" ON public.courses;
DROP POLICY IF EXISTS "crs_delete" ON public.courses;

CREATE POLICY "crs_select"
ON public.courses
FOR SELECT
TO public
USING (
    (is_active = true AND EXISTS (SELECT 1 FROM public.tenants t WHERE t.id = courses.tenant_id AND t.is_active = true))
    OR tenant_id = public.get_current_tenant_id()
    OR public.is_super_admin()
);

CREATE POLICY "crs_insert"
ON public.courses
FOR INSERT
TO authenticated
WITH CHECK (tenant_id = public.get_current_tenant_id() OR public.is_super_admin());

CREATE POLICY "crs_update"
ON public.courses
FOR UPDATE
TO authenticated
USING (tenant_id = public.get_current_tenant_id() OR public.is_super_admin())
WITH CHECK (tenant_id = public.get_current_tenant_id() OR public.is_super_admin());

CREATE POLICY "crs_delete"
ON public.courses
FOR DELETE
TO authenticated
USING (tenant_id = public.get_current_tenant_id() OR public.is_super_admin());

-- 6.7 Customer Devices
DROP POLICY IF EXISTS "devices_master_isolation" ON public.customer_devices;
DROP POLICY IF EXISTS "customer_devices_tenant_isolation" ON public.customer_devices;
CREATE POLICY "customer_devices_tenant_isolation"
ON public.customer_devices
FOR ALL
TO authenticated
USING (tenant_id = public.get_current_tenant_id() OR public.is_super_admin())
WITH CHECK (tenant_id = public.get_current_tenant_id() OR public.is_super_admin());

-- 6.8 Models
DROP POLICY IF EXISTS "mod_select" ON public.models;
DROP POLICY IF EXISTS "mod_insert" ON public.models;
DROP POLICY IF EXISTS "mod_update" ON public.models;
DROP POLICY IF EXISTS "mod_delete" ON public.models;

CREATE POLICY "mod_select"
ON public.models
FOR SELECT
TO public
USING (
    (deleted_at IS NULL AND EXISTS (SELECT 1 FROM public.tenants t WHERE t.id = models.tenant_id AND t.is_active = true))
    OR tenant_id = public.get_current_tenant_id()
    OR public.is_super_admin()
);

CREATE POLICY "mod_insert"
ON public.models
FOR INSERT
TO authenticated
WITH CHECK (tenant_id = public.get_current_tenant_id() OR public.is_super_admin());

CREATE POLICY "mod_update"
ON public.models
FOR UPDATE
TO authenticated
USING (tenant_id = public.get_current_tenant_id() OR public.is_super_admin())
WITH CHECK (tenant_id = public.get_current_tenant_id() OR public.is_super_admin());

CREATE POLICY "mod_delete"
ON public.models
FOR DELETE
TO authenticated
USING (tenant_id = public.get_current_tenant_id() OR public.is_super_admin());

-- 6.9 Page Templates & Pages
DROP POLICY IF EXISTS "tenant_isolation_policy" ON public.page_templates;
DROP POLICY IF EXISTS "page_templates_tenant_isolation" ON public.page_templates;
CREATE POLICY "page_templates_tenant_isolation"
ON public.page_templates
FOR ALL
TO authenticated
USING (tenant_id = public.get_current_tenant_id() OR public.is_super_admin())
WITH CHECK (tenant_id = public.get_current_tenant_id() OR public.is_super_admin());

DROP POLICY IF EXISTS "tenant_isolation_policy" ON public.pages;
DROP POLICY IF EXISTS "pages_tenant_isolation" ON public.pages;
CREATE POLICY "pages_tenant_isolation"
ON public.pages
FOR ALL
TO authenticated
USING (tenant_id = public.get_current_tenant_id() OR public.is_super_admin())
WITH CHECK (tenant_id = public.get_current_tenant_id() OR public.is_super_admin());

-- 6.10 Product Images & Product Reviews
DROP POLICY IF EXISTS "pi_select" ON public.product_images;
DROP POLICY IF EXISTS "pi_insert" ON public.product_images;
DROP POLICY IF EXISTS "pi_update" ON public.product_images;
DROP POLICY IF EXISTS "pi_delete" ON public.product_images;

CREATE POLICY "pi_select"
ON public.product_images
FOR SELECT
TO public
USING (
    EXISTS (SELECT 1 FROM public.tenants t WHERE t.id = product_images.tenant_id AND t.is_active = true)
    OR tenant_id = public.get_current_tenant_id()
    OR public.is_super_admin()
);

CREATE POLICY "pi_insert"
ON public.product_images
FOR INSERT
TO authenticated
WITH CHECK (tenant_id = public.get_current_tenant_id() OR public.is_super_admin());

CREATE POLICY "pi_update"
ON public.product_images
FOR UPDATE
TO authenticated
USING (tenant_id = public.get_current_tenant_id() OR public.is_super_admin())
WITH CHECK (tenant_id = public.get_current_tenant_id() OR public.is_super_admin());

CREATE POLICY "pi_delete"
ON public.product_images
FOR DELETE
TO authenticated
USING (tenant_id = public.get_current_tenant_id() OR public.is_super_admin());

DROP POLICY IF EXISTS "pr_select" ON public.product_reviews;
DROP POLICY IF EXISTS "pr_insert" ON public.product_reviews;
DROP POLICY IF EXISTS "pr_update" ON public.product_reviews;
DROP POLICY IF EXISTS "pr_delete" ON public.product_reviews;

CREATE POLICY "pr_select"
ON public.product_reviews
FOR SELECT
TO public
USING (
    EXISTS (SELECT 1 FROM public.tenants t WHERE t.id = product_reviews.tenant_id AND t.is_active = true)
    OR tenant_id = public.get_current_tenant_id()
    OR public.is_super_admin()
);

CREATE POLICY "pr_insert"
ON public.product_reviews
FOR INSERT
TO authenticated
WITH CHECK (tenant_id = public.get_current_tenant_id() OR public.is_super_admin());

CREATE POLICY "pr_update"
ON public.product_reviews
FOR UPDATE
TO authenticated
USING (tenant_id = public.get_current_tenant_id() OR public.is_super_admin())
WITH CHECK (tenant_id = public.get_current_tenant_id() OR public.is_super_admin());

CREATE POLICY "pr_delete"
ON public.product_reviews
FOR DELETE
TO authenticated
USING (tenant_id = public.get_current_tenant_id() OR public.is_super_admin());

-- 6.11 Purchase Items & Suppliers
DROP POLICY IF EXISTS "tenant_isolation_policy" ON public.purchase_items;
DROP POLICY IF EXISTS "purchase_items_tenant_isolation" ON public.purchase_items;
CREATE POLICY "purchase_items_tenant_isolation"
ON public.purchase_items
FOR ALL
TO authenticated
USING (tenant_id = public.get_current_tenant_id() OR public.is_super_admin())
WITH CHECK (tenant_id = public.get_current_tenant_id() OR public.is_super_admin());

DROP POLICY IF EXISTS "tenant_isolation_policy" ON public.suppliers;
DROP POLICY IF EXISTS "suppliers_tenant_isolation" ON public.suppliers;
CREATE POLICY "suppliers_tenant_isolation"
ON public.suppliers
FOR ALL
TO authenticated
USING (tenant_id = public.get_current_tenant_id() OR public.is_super_admin())
WITH CHECK (tenant_id = public.get_current_tenant_id() OR public.is_super_admin());

-- 6.12 Repair Details (Images, Parts Used, Status History)
DROP POLICY IF EXISTS "Permitir todo a usuarios del mismo tenant en repair_images" ON public.repair_images;
DROP POLICY IF EXISTS "ri_tenant_isolation" ON public.repair_images;
DROP POLICY IF EXISTS "repair_images_tenant_isolation" ON public.repair_images;
CREATE POLICY "repair_images_tenant_isolation"
ON public.repair_images
FOR ALL
TO authenticated
USING (tenant_id = public.get_current_tenant_id() OR public.is_super_admin())
WITH CHECK (tenant_id = public.get_current_tenant_id() OR public.is_super_admin());

DROP POLICY IF EXISTS "rpu_tenant_isolation" ON public.repair_parts_used;
DROP POLICY IF EXISTS "repair_parts_used_tenant_isolation" ON public.repair_parts_used;
CREATE POLICY "repair_parts_used_tenant_isolation"
ON public.repair_parts_used
FOR ALL
TO authenticated
USING (tenant_id = public.get_current_tenant_id() OR public.is_super_admin())
WITH CHECK (tenant_id = public.get_current_tenant_id() OR public.is_super_admin());

DROP POLICY IF EXISTS "rsh_tenant_isolation" ON public.repair_status_history;
DROP POLICY IF EXISTS "repair_status_history_tenant_isolation" ON public.repair_status_history;
CREATE POLICY "repair_status_history_tenant_isolation"
ON public.repair_status_history
FOR ALL
TO authenticated
USING (tenant_id = public.get_current_tenant_id() OR public.is_super_admin())
WITH CHECK (tenant_id = public.get_current_tenant_id() OR public.is_super_admin());

-- 6.13 Technical Solutions
DROP POLICY IF EXISTS "tenant_staff_manage_solutions" ON public.technical_solutions;
DROP POLICY IF EXISTS "technical_solutions_tenant_isolation" ON public.technical_solutions;
CREATE POLICY "technical_solutions_tenant_isolation"
ON public.technical_solutions
FOR ALL
TO authenticated
USING (tenant_id = public.get_current_tenant_id() OR public.is_super_admin())
WITH CHECK (tenant_id = public.get_current_tenant_id() OR public.is_super_admin());

-- 6.14 Tenants
DROP POLICY IF EXISTS "ten_unified_select" ON public.tenants;
DROP POLICY IF EXISTS "tenants_select_policy" ON public.tenants;
CREATE POLICY "tenants_select_policy"
ON public.tenants
FOR SELECT
TO public
USING (
    is_active = true 
    OR id = public.get_current_tenant_id() 
    OR public.is_super_admin()
);
