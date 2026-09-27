-- (Data migration skipped for local dev because admin_notifications does not exist)

-- 2. NOTE: You must manually update any DB Triggers or Functions (e.g. `save_repair_order` or `notify_admin` triggers) 
-- that currently insert into `admin_notifications` so that they instead insert into `notifications`.
-- Example update for a hypothetical trigger function:
-- INSERT INTO public.notifications (tenant_id, title, message, type, scope, payload, branch_id) 
-- VALUES (NEW.tenant_id, 'Nueva Reparación', 'Se ha ingresado un equipo.', 'info', 'admin', jsonb_build_object('source', 'repair_created'), NEW.branch_id);

-- 3. Drop the redundant table
DROP TABLE IF EXISTS public.admin_notifications;
