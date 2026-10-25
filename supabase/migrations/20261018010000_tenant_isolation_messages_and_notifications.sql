-- ==============================================================================
-- Migration: 20261018010000_tenant_isolation_messages_and_notifications.sql
-- Description: Absolute Tenant Isolation for Messages, Notifications and Inbox
--              Eliminates cross-tenant data leakage between branches.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Helper Functions for Tenant Resolution and SuperAdmin Check
-- ------------------------------------------------------------------------------

-- Strict current tenant extractor (JWT claims -> profiles -> NULL, NO hardcoded fallback)
CREATE OR REPLACE FUNCTION public.get_current_tenant_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    NULLIF(auth.jwt() -> 'app_metadata' ->> 'tenant_id', '')::uuid,
    NULLIF(auth.jwt() ->> 'tenant_id', '')::uuid,
    (SELECT p.tenant_id FROM public.profiles p WHERE p.id = auth.uid())
  );
$$;

-- Strict super admin check
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin',
    (SELECT p.role = 'super_admin' FROM public.profiles p WHERE p.id = auth.uid()),
    false
  );
$$;

-- Secure tenant getter (updates legacy get_secure_tenant_id to eliminate hardcoded fallback)
CREATE OR REPLACE FUNCTION public.get_secure_tenant_id()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    t_id uuid;
    raw_tenant_id text;
BEGIN
    raw_tenant_id := current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'tenant_id';
    IF raw_tenant_id IS NULL THEN
        raw_tenant_id := current_setting('request.jwt.claims', true)::jsonb ->> 'tenant_id';
    END IF;

    IF raw_tenant_id IS NOT NULL AND raw_tenant_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
        t_id := raw_tenant_id::uuid;
    END IF;

    IF (t_id IS NULL OR t_id = '00000000-0000-0000-0000-000000000000'::uuid) AND auth.uid() IS NOT NULL THEN
        SELECT tenant_id INTO t_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
    END IF;

    IF t_id = '00000000-0000-0000-0000-000000000000'::uuid THEN
        t_id := NULL;
    END IF;

    RETURN t_id;
END;
$$;

-- Update get_my_tenant() to eliminate hardcoded main branch fallback
CREATE OR REPLACE FUNCTION public.get_my_tenant()
RETURNS uuid
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
    tenant_val text;
    sec_tenant uuid;
BEGIN
    tenant_val := current_setting('app.current_tenant', true);
    IF tenant_val IS NOT NULL AND tenant_val != '' AND tenant_val != '00000000-0000-0000-0000-000000000000' THEN
      RETURN tenant_val::uuid;
    END IF;

    sec_tenant := public.get_secure_tenant_id();
    IF sec_tenant IS NOT NULL AND sec_tenant != '00000000-0000-0000-0000-000000000000'::uuid THEN
      RETURN sec_tenant;
    END IF;

    RETURN NULL;
EXCEPTION
    WHEN OTHERS THEN
      RETURN NULL;
END;
$$;

-- ------------------------------------------------------------------------------
-- 2. Ensure Schema Integrity & Foreign Keys
-- ------------------------------------------------------------------------------

-- Ensure notifications table has tenant_id NOT NULL and references tenants(id)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'notifications' AND column_name = 'tenant_id'
    ) THEN
        ALTER TABLE public.notifications ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
    END IF;
    
    -- Ensure NOT NULL constraint
    ALTER TABLE public.notifications ALTER COLUMN tenant_id SET NOT NULL;
END $$;

-- Ensure contact_messages table has tenant_id NOT NULL and references tenants(id)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'contact_messages' AND column_name = 'tenant_id'
    ) THEN
        ALTER TABLE public.contact_messages ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
    END IF;

    -- Ensure NOT NULL constraint
    ALTER TABLE public.contact_messages ALTER COLUMN tenant_id SET NOT NULL;
END $$;

-- Ensure academy_email_notifications has tenant_id referencing tenants(id)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'academy_email_notifications' AND column_name = 'tenant_id'
    ) THEN
        ALTER TABLE public.academy_email_notifications ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Enable & Force Row Level Security on all message and notification tables
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications FORCE ROW LEVEL SECURITY;

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages FORCE ROW LEVEL SECURITY;

ALTER TABLE public.academy_email_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy_email_notifications FORCE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 3. Drop Leaky & Outdated Policies
-- ------------------------------------------------------------------------------

-- Notifications
DROP POLICY IF EXISTS "Allow public insert on notifications" ON public.notifications;
DROP POLICY IF EXISTS "Public can insert admin notifications" ON public.notifications;
DROP POLICY IF EXISTS "notifications_master_isolation" ON public.notifications;
DROP POLICY IF EXISTS "super_admin_all_access" ON public.notifications;
DROP POLICY IF EXISTS "tenant_notifications_select" ON public.notifications;
DROP POLICY IF EXISTS "tenant_notifications_insert" ON public.notifications;
DROP POLICY IF EXISTS "tenant_notifications_update" ON public.notifications;
DROP POLICY IF EXISTS "tenant_notifications_delete" ON public.notifications;
DROP POLICY IF EXISTS "super_admin_notifications_all" ON public.notifications;

-- Contact Messages
DROP POLICY IF EXISTS "Allow public insert on contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Permitir a invitados enviar mensajes" ON public.contact_messages;
DROP POLICY IF EXISTS "contact_messages_master" ON public.contact_messages;
DROP POLICY IF EXISTS "super_admin_all_access" ON public.contact_messages;
DROP POLICY IF EXISTS "tenant_contact_messages_select" ON public.contact_messages;
DROP POLICY IF EXISTS "tenant_contact_messages_insert_auth" ON public.contact_messages;
DROP POLICY IF EXISTS "public_contact_messages_insert_anon" ON public.contact_messages;
DROP POLICY IF EXISTS "tenant_contact_messages_update" ON public.contact_messages;
DROP POLICY IF EXISTS "tenant_contact_messages_delete" ON public.contact_messages;
DROP POLICY IF EXISTS "super_admin_contact_messages_all" ON public.contact_messages;

-- Academy Email Notifications
DROP POLICY IF EXISTS "Admins can view email notifications" ON public.academy_email_notifications;
DROP POLICY IF EXISTS "tenant_academy_email_notifications_select" ON public.academy_email_notifications;
DROP POLICY IF EXISTS "tenant_academy_email_notifications_all" ON public.academy_email_notifications;

-- ------------------------------------------------------------------------------
-- 4. Create Strict Tenant-Isolated RLS Policies for Notifications
-- ------------------------------------------------------------------------------

-- SuperAdmin full bypass
CREATE POLICY "super_admin_notifications_all"
ON public.notifications
FOR ALL
TO authenticated
USING (public.is_super_admin())
WITH CHECK (public.is_super_admin());

-- SELECT: Only notifications belonging to the user's tenant
-- Regular users see their own user-scoped notifications.
-- Staff/admins see admin-scoped notifications of their own tenant.
CREATE POLICY "tenant_notifications_select"
ON public.notifications
FOR SELECT
TO authenticated
USING (
  tenant_id = public.get_current_tenant_id()
  AND (
    (scope = 'user' AND (user_id IS NULL OR user_id = auth.uid()))
    OR (scope = 'admin' AND EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
        AND p.role = ANY (ARRAY['admin', 'staff', 'technician', 'tenant_owner'])
    ))
  )
);

-- INSERT: Authenticated users can ONLY insert notifications with their own tenant_id
CREATE POLICY "tenant_notifications_insert"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (
  tenant_id = public.get_current_tenant_id()
);

-- UPDATE: Users can ONLY update (e.g. mark as read) notifications of their own tenant
CREATE POLICY "tenant_notifications_update"
ON public.notifications
FOR UPDATE
TO authenticated
USING (
  tenant_id = public.get_current_tenant_id()
)
WITH CHECK (
  tenant_id = public.get_current_tenant_id()
);

-- DELETE: Admins/Owners can ONLY delete notifications of their own tenant
CREATE POLICY "tenant_notifications_delete"
ON public.notifications
FOR DELETE
TO authenticated
USING (
  tenant_id = public.get_current_tenant_id()
  AND EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() 
      AND p.role = ANY (ARRAY['admin', 'tenant_owner'])
  )
);

-- ------------------------------------------------------------------------------
-- 5. Create Strict Tenant-Isolated RLS Policies for Contact Messages
-- ------------------------------------------------------------------------------

-- SuperAdmin full bypass
CREATE POLICY "super_admin_contact_messages_all"
ON public.contact_messages
FOR ALL
TO authenticated
USING (public.is_super_admin())
WITH CHECK (public.is_super_admin());

-- SELECT: Only staff/admins/owners of the matching tenant can read messages
CREATE POLICY "tenant_contact_messages_select"
ON public.contact_messages
FOR SELECT
TO authenticated
USING (
  tenant_id = public.get_current_tenant_id()
  AND EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role = ANY (ARRAY['admin', 'staff', 'technician', 'tenant_owner'])
  )
);

-- INSERT for Authenticated Users: Strictly restricted to their own tenant_id
CREATE POLICY "tenant_contact_messages_insert_auth"
ON public.contact_messages
FOR INSERT
TO authenticated
WITH CHECK (
  tenant_id = public.get_current_tenant_id()
);

-- INSERT for Anonymous Public Visitors: Allowed ONLY if tenant_id points to an active tenant
CREATE POLICY "public_contact_messages_insert_anon"
ON public.contact_messages
FOR INSERT
TO anon
WITH CHECK (
  tenant_id IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM public.tenants t 
    WHERE t.id = contact_messages.tenant_id 
      AND t.is_active = true
  )
);

-- UPDATE: Only staff/admins of the matching tenant can update (e.g. mark as read)
CREATE POLICY "tenant_contact_messages_update"
ON public.contact_messages
FOR UPDATE
TO authenticated
USING (
  tenant_id = public.get_current_tenant_id()
  AND EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role = ANY (ARRAY['admin', 'staff', 'technician', 'tenant_owner'])
  )
)
WITH CHECK (
  tenant_id = public.get_current_tenant_id()
);

-- DELETE: Only admins/owners of the matching tenant can delete
CREATE POLICY "tenant_contact_messages_delete"
ON public.contact_messages
FOR DELETE
TO authenticated
USING (
  tenant_id = public.get_current_tenant_id()
  AND EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role = ANY (ARRAY['admin', 'tenant_owner'])
  )
);

-- ------------------------------------------------------------------------------
-- 6. Strict Policies for Academy Email Notifications
-- ------------------------------------------------------------------------------

CREATE POLICY "tenant_academy_email_notifications_select"
ON public.academy_email_notifications
FOR SELECT
TO authenticated
USING (
  public.is_super_admin()
  OR (
    tenant_id = public.get_current_tenant_id()
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role = ANY (ARRAY['admin', 'staff', 'tenant_owner'])
    )
  )
);

-- ------------------------------------------------------------------------------
-- 7. Trigger on contact_messages to Auto-Notify Admin within the SAME Tenant
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.trg_contact_message_notify_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert admin notification ensuring exact tenant_id propagation
  INSERT INTO public.notifications (
    tenant_id,
    title,
    message,
    type,
    scope,
    is_read,
    created_at,
    branch_id
  ) VALUES (
    NEW.tenant_id,
    CASE 
      WHEN NEW.subject = 'Solicitud de Turno: Reparación' THEN '🔧 Nuevo Turno Solicitado'
      ELSE '✉️ Nuevo Mensaje de Contacto'
    END,
    CASE 
      WHEN NEW.subject = 'Solicitud de Turno: Reparación' THEN COALESCE(NEW.name, 'Cliente') || ' solicitó un turno de reparación.'
      ELSE COALESCE(NEW.name, 'Contacto') || ' envió un mensaje: ' || SUBSTRING(COALESCE(NEW.message, ''), 1, 80)
    END,
    'info',
    'admin',
    false,
    NOW(),
    NEW.branch_id
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_admin_on_contact_message ON public.contact_messages;
CREATE TRIGGER trg_notify_admin_on_contact_message
AFTER INSERT ON public.contact_messages
FOR EACH ROW
EXECUTE FUNCTION public.trg_contact_message_notify_admin();

-- ------------------------------------------------------------------------------
-- ------------------------------------------------------------------------------
-- 8. Update View admin_notifications & Insert Trigger
-- ------------------------------------------------------------------------------

CREATE OR REPLACE VIEW public.admin_notifications AS 
SELECT 
    id, 
    tenant_id, 
    title, 
    message, 
    is_read, 
    created_at, 
    payload, 
    branch_id,
    CAST(NULL AS TEXT) AS source,
    CAST(NULL AS TEXT) AS type
FROM public.notifications
WHERE scope = 'admin';

ALTER VIEW public.admin_notifications SET (security_invoker = true);

CREATE OR REPLACE FUNCTION public.trg_insert_admin_notifications()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    final_payload JSONB;
    target_tenant UUID;
BEGIN
    final_payload := COALESCE(NEW.payload, '{}'::jsonb);
    
    IF NEW.source IS NOT NULL THEN
        final_payload := jsonb_set(final_payload, '{source}', to_jsonb(NEW.source));
    END IF;

    target_tenant := COALESCE(NEW.tenant_id, public.get_current_tenant_id());
    
    IF target_tenant IS NULL THEN
        RAISE EXCEPTION 'Cannot insert admin notification without a valid tenant_id';
    END IF;

    INSERT INTO public.notifications (
        tenant_id,
        title,
        message,
        type,
        scope,
        is_read,
        created_at,
        payload,
        branch_id
    ) VALUES (
        target_tenant,
        COALESCE(NEW.title, 'Nueva Notificación'),
        COALESCE(NEW.message, 'Evento de sistema.'),
        COALESCE(NEW.type, 'info'),
        'admin',
        COALESCE(NEW.is_read, false),
        COALESCE(NEW.created_at, NOW()),
        final_payload,
        NEW.branch_id
    );
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_admin_notifications_insert ON public.admin_notifications;
CREATE TRIGGER trg_admin_notifications_insert
INSTEAD OF INSERT ON public.admin_notifications
FOR EACH ROW
EXECUTE FUNCTION public.trg_insert_admin_notifications();

