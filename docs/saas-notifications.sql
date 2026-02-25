-- 1. Create Notifications Table
DROP TABLE IF EXISTS public.notifications CASCADE;

CREATE TABLE public.notifications (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id uuid NOT NULL,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title character varying NOT NULL,
    message text NOT NULL,
    type character varying DEFAULT 'info'::character varying, -- 'info', 'success', 'warning', 'error'
    link character varying, -- optional URL path to redirect when clicked
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Users can only see their own notifications within their tenant
CREATE POLICY "notifications_select_policy" ON public.notifications
    FOR SELECT TO authenticated
    USING (
        tenant_id = public.get_my_tenant()
        AND user_id = (select auth.uid())
    );

-- Users can update (mark as read) their own notifications
CREATE POLICY "notifications_update_policy" ON public.notifications
    FOR UPDATE TO authenticated
    USING (
        tenant_id = public.get_my_tenant()
        AND user_id = (select auth.uid())
    );

-- Admins or system can insert notifications
CREATE POLICY "notifications_insert_policy" ON public.notifications
    FOR INSERT TO authenticated
    WITH CHECK (
        tenant_id = public.get_my_tenant()
    );

-- 4. Automatic Notifications Trigger (Example: New Repair triggers an admin notification)
CREATE OR REPLACE FUNCTION public.notify_admins_on_new_repair()
RETURNS trigger AS $$
DECLARE
    v_admin_id uuid;
BEGIN
    -- For each admin in the same tenant, create a notification
    FOR v_admin_id IN 
        SELECT id FROM public.profiles 
        WHERE tenant_id = new.tenant_id AND role = 'admin' AND id != (select auth.uid())
    LOOP
        INSERT INTO public.notifications (tenant_id, user_id, title, message, type, link)
        VALUES (
            new.tenant_id, 
            v_admin_id, 
            'Nueva Reparación', 
            'El cliente ' || new.customer_name || ' ha dejado un ' || new.device_model,
            'info',
            '/admin/repairs/edit/' || new.id
        );
    END LOOP;
    
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_notify_admins_on_new_repair ON public.repairs;
CREATE TRIGGER trg_notify_admins_on_new_repair
    AFTER INSERT ON public.repairs
    FOR EACH ROW EXECUTE FUNCTION public.notify_admins_on_new_repair();
