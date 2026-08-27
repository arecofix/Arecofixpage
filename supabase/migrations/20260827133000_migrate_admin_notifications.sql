-- 1. Insert all existing records from admin_notifications into the notifications table
INSERT INTO public.notifications (
    tenant_id, 
    title, 
    message, 
    type, 
    is_read, 
    created_at, 
    scope, 
    payload, 
    branch_id
)
SELECT 
    tenant_id,
    COALESCE(title, 'Nueva Reparación') as title,
    COALESCE(message, 'Se ha creado una nueva reparación en el sistema.') as message,
    'info' as type,
    is_read,
    created_at,
    'admin' as scope,
    payload,
    branch_id
FROM public.admin_notifications;

-- 2. NOTE: You must manually update any DB Triggers or Functions (e.g. `save_repair_order` or `notify_admin` triggers) 
-- that currently insert into `admin_notifications` so that they instead insert into `notifications`.
-- Example update for a hypothetical trigger function:
-- INSERT INTO public.notifications (tenant_id, title, message, type, scope, payload, branch_id) 
-- VALUES (NEW.tenant_id, 'Nueva Reparación', 'Se ha ingresado un equipo.', 'info', 'admin', jsonb_build_object('source', 'repair_created'), NEW.branch_id);

-- 3. Drop the redundant table
DROP TABLE IF EXISTS public.admin_notifications;
