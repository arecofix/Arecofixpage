-- Añadir columnas para configuración de WhatsApp Cloud API (Meta) en la tabla tenants
ALTER TABLE public.tenants 
ADD COLUMN IF NOT EXISTS whatsapp_access_token text,
ADD COLUMN IF NOT EXISTS whatsapp_phone_id text,
ADD COLUMN IF NOT EXISTS whatsapp_business_account_id text,
ADD COLUMN IF NOT EXISTS whatsapp_enabled boolean DEFAULT false;

-- Comentario para documentación
COMMENT ON COLUMN public.tenants.whatsapp_access_token IS 'Token de acceso permanente de la API de Meta (WhatsApp)';
COMMENT ON COLUMN public.tenants.whatsapp_phone_id IS 'ID del número de teléfono remitente en WhatsApp API';
COMMENT ON COLUMN public.tenants.whatsapp_business_account_id IS 'ID de la cuenta comercial de WhatsApp (WABA)';
COMMENT ON COLUMN public.tenants.whatsapp_enabled IS 'Indica si el tenant tiene habilitada la integración de WhatsApp';
