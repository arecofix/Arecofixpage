-- Restore admin_notifications as a View to catch inserts from legacy RPCs (like save_repair_order)
-- and redirect them to the new notifications table.

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

CREATE OR REPLACE FUNCTION public.trg_insert_admin_notifications()
RETURNS TRIGGER AS $$
DECLARE
    final_payload JSONB;
BEGIN
    final_payload := COALESCE(NEW.payload, '{}'::jsonb);
    
    -- Preserve source if it was sent by legacy function
    IF NEW.source IS NOT NULL THEN
        final_payload := jsonb_set(final_payload, '{source}', to_jsonb(NEW.source));
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
        NEW.tenant_id,
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
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_admin_notifications_insert ON public.admin_notifications;

CREATE TRIGGER trg_admin_notifications_insert
INSTEAD OF INSERT ON public.admin_notifications
FOR EACH ROW
EXECUTE FUNCTION public.trg_insert_admin_notifications();
