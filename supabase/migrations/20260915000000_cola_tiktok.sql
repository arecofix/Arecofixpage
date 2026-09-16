-- Migración para crear la tabla cola_tiktok

CREATE TABLE IF NOT EXISTS public.cola_tiktok (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    url_video_r2 TEXT NOT NULL,
    texto_post TEXT NOT NULL,
    estado TEXT NOT NULL DEFAULT 'pendiente',
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Habilitar RLS (Row Level Security) por seguridad
ALTER TABLE public.cola_tiktok ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS
-- Permitir select y update a usuarios autenticados o al rol de servicio
CREATE POLICY "Permitir lectura de cola_tiktok a roles de servicio"
    ON public.cola_tiktok
    FOR SELECT
    USING (true);

CREATE POLICY "Permitir actualización de cola_tiktok a roles de servicio"
    ON public.cola_tiktok
    FOR UPDATE
    USING (true);

CREATE POLICY "Permitir inserción en cola_tiktok"
    ON public.cola_tiktok
    FOR INSERT
    WITH CHECK (true);

-- Índices para optimizar la búsqueda del 'Distribuidor' de n8n
CREATE INDEX IF NOT EXISTS idx_cola_tiktok_estado_fecha ON public.cola_tiktok(estado, fecha_creacion);
