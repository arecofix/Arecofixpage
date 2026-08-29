-- =============================================================================
-- FASE 1: Base de Datos para IA (RAG con pgvector)
-- Descripción: Activa pgvector, crea la tabla knowledge_base multi-tenant
--              y la función match_documents para búsqueda semántica por coseno.
-- =============================================================================


-- ─────────────────────────────────────────────────────────────────────────────
-- 1. ACTIVAR LA EXTENSIÓN pgvector
--    Requiere Supabase Pro o que el proyecto tenga acceso a extensiones.
--    Ejecutar en el SQL Editor de Supabase (no como usuario anónimo).
-- ─────────────────────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;


-- ─────────────────────────────────────────────────────────────────────────────
-- 2. TABLA: knowledge_base
--
--    Diseño deliberado: tabla independiente (NO columnas en products/services)
--    Razones:
--      a) Un mismo chunk de conocimiento puede referenciar múltiples entidades.
--      b) Los PDFs / manuales técnicos no tienen contraparte en products.
--      c) Evita degradar el rendimiento de las queries de productos con
--         vectors de 768 dimensiones en cada fila.
--      d) Facilita re-indexar sin tocar tablas de negocio críticas.
--
--    Dimensiones del vector: 768
--      Modelo objetivo → @cf/baai/bge-base-en-v1.5 (Workers AI)
--      Soporta español con buena fidelidad semántica.
--      Para escalar a multilingüe: @cf/baai/bge-m3 produce 1024 dims →
--      cambiar vector(768) a vector(1024) en ese caso.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.knowledge_base (
    -- Identidad
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,

    -- Origen del conocimiento (metadata para trazabilidad)
    source_type     TEXT        NOT NULL CHECK (source_type IN (
                                    'product',       -- Descripción / ficha de producto
                                    'service',       -- Descripción de un servicio de reparación
                                    'manual',        -- Manual técnico (PDF)
                                    'course',        -- Material de academia / curso
                                    'faq',           -- Pregunta frecuente
                                    'blog',          -- Entrada de blog
                                    'custom'         -- Cualquier otro contenido libre
                                )),
    source_id       UUID,       -- FK opcional al ID de la entidad origen (product_id, course_id…)
    source_url      TEXT,       -- URL del archivo en R2 (para PDFs/manuales)

    -- Contenido
    title           TEXT        NOT NULL,                   -- Título del chunk (ej. nombre del producto)
    content         TEXT        NOT NULL,                   -- Texto original del chunk (sin embeddings)
    chunk_index     INTEGER     NOT NULL DEFAULT 0,         -- Para textos largos divididos en múltiples chunks
    metadata        JSONB       NOT NULL DEFAULT '{}',      -- Datos extra: tags, sku, precio, idioma, etc.

    -- Vector semántico
    -- IMPORTANTE: Cambiar 768 → 1024 si se usa bge-m3 en Workers AI
    embedding       extensions.vector(768),

    -- Auditoría
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Comentarios descriptivos
COMMENT ON TABLE  public.knowledge_base                IS 'Almacena chunks de conocimiento con embeddings para el sistema RAG de Arecofix.';
COMMENT ON COLUMN public.knowledge_base.content        IS 'Texto plano del chunk, usado como contexto en el prompt del LLM.';
COMMENT ON COLUMN public.knowledge_base.embedding      IS 'Vector de 768 dims generado por bge-base-en-v1.5 vía Cloudflare Workers AI.';
COMMENT ON COLUMN public.knowledge_base.chunk_index    IS 'Índice de fragmento cuando un documento largo se divide. Empieza en 0.';
COMMENT ON COLUMN public.knowledge_base.metadata       IS 'JSONB libre: tags, sku, precio, idioma, branch_id, etc.';


-- ─────────────────────────────────────────────────────────────────────────────
-- 3. TRIGGER: auto-actualizar updated_at
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- El trigger solo se crea si no existe (idempotente)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger
        WHERE tgname = 'trg_knowledge_base_updated_at'
    ) THEN
        CREATE TRIGGER trg_knowledge_base_updated_at
        BEFORE UPDATE ON public.knowledge_base
        FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
    END IF;
END;
$$;


-- ─────────────────────────────────────────────────────────────────────────────
-- 4. ÍNDICES DE RENDIMIENTO
--
--    a) HNSW (Hierarchical Navigable Small World) para búsqueda ANN rápida.
--       operator: vector_cosine_ops → alineado con la función match_documents.
--       m=16, ef_construction=64 son valores seguros para producción inicial.
--       Ajustar ef_construction hacia arriba (128-256) cuando la tabla
--       supere 100k filas a costa de más tiempo de build.
--
--    b) Índices de apoyo para filtros multi-tenant y source_type.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_kb_embedding_hnsw
    ON public.knowledge_base
    USING hnsw (embedding extensions.vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

CREATE INDEX IF NOT EXISTS idx_kb_tenant_source
    ON public.knowledge_base (tenant_id, source_type);

CREATE INDEX IF NOT EXISTS idx_kb_source_id
    ON public.knowledge_base (source_id)
    WHERE source_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_kb_metadata
    ON public.knowledge_base
    USING GIN (metadata);


-- ─────────────────────────────────────────────────────────────────────────────
-- 5. ROW LEVEL SECURITY (RLS)
--    Patrón idéntico al resto del esquema de Arecofix:
--    - Los usuarios autenticados solo ven chunks de su propio tenant.
--    - El rol de servicio (service_role) tiene acceso total (para el Worker).
--    - Lectura pública opcional: desactivada por defecto (activar si el
--      chatbot es público y no requiere login).
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;

-- Política para usuarios autenticados (operadores / admins del tenant)
DROP POLICY IF EXISTS "Tenant users can manage their knowledge_base" ON public.knowledge_base;
CREATE POLICY "Tenant users can manage their knowledge_base"
    ON public.knowledge_base
    FOR ALL
    TO authenticated
    USING (tenant_id = public.get_my_tenant())
    WITH CHECK (tenant_id = public.get_my_tenant());

-- Política de lectura para el rol anónimo (chatbot público sin login)
-- DESACTIVADA: descomentar si el chatbot es accesible sin autenticación.
-- DROP POLICY IF EXISTS "Public read for chatbot" ON public.knowledge_base;
-- CREATE POLICY "Public read for chatbot"
--     ON public.knowledge_base
--     FOR SELECT
--     TO anon
--     USING (true);

-- NOTA: service_role omite RLS por defecto en Supabase.
-- El Cloudflare Worker debe usar la SUPABASE_SERVICE_ROLE_KEY para escribir.


-- ─────────────────────────────────────────────────────────────────────────────
-- 6. FUNCIÓN: match_documents
--
--    Propósito: Recibe el embedding de la pregunta del usuario y devuelve
--               los chunks más similares del knowledge_base usando distancia
--               del coseno (<=> operator de pgvector).
--
--    Parámetros:
--      query_embedding  → vector de la pregunta (mismas 768 dims)
--      match_threshold  → similitud mínima aceptada (0.0 a 1.0).
--                         Recomendado: 0.70 para español. Bajar a 0.60 si
--                         hay pocos resultados; subir a 0.80 para más precisión.
--      match_count      → máximo de chunks a retornar (recomendado: 5-10)
--      filter_tenant_id → UUID del tenant para aislar resultados (multi-tenant)
--      filter_source_type → (opcional) filtrar por tipo: 'product','manual'…
--
--    Retorna tabla con: id, title, content, metadata, source_type,
--                       source_id, source_url, similarity (score 0-1)
--
--    SECURITY DEFINER: Necesario para que el rol anónimo (chatbot público)
--    pueda ejecutar la función y que pgvector resuelva el índice HNSW
--    correctamente sin restricciones de RLS bloqueando la búsqueda vectorial.
--    La seguridad multi-tenant está garantizada por el parámetro filter_tenant_id.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.match_documents(
    query_embedding     extensions.vector(768),
    match_threshold     FLOAT           DEFAULT 0.70,
    match_count         INT             DEFAULT 5,
    filter_tenant_id    UUID            DEFAULT NULL,
    filter_source_type  TEXT            DEFAULT NULL
)
RETURNS TABLE (
    id              UUID,
    title           TEXT,
    content         TEXT,
    metadata        JSONB,
    source_type     TEXT,
    source_id       UUID,
    source_url      TEXT,
    similarity      FLOAT
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
    RETURN QUERY
    SELECT
        kb.id,
        kb.title,
        kb.content,
        kb.metadata,
        kb.source_type,
        kb.source_id,
        kb.source_url,
        -- Convierte distancia coseno (0=idéntico, 2=opuesto) a similitud (1=idéntico, 0=opuesto)
        (1 - (kb.embedding <=> query_embedding))::FLOAT AS similarity
    FROM
        public.knowledge_base kb
    WHERE
        -- Filtro de tenant (SIEMPRE aplicado para garantizar aislamiento)
        (filter_tenant_id IS NULL OR kb.tenant_id = filter_tenant_id)
        -- Filtro opcional por tipo de fuente
        AND (filter_source_type IS NULL OR kb.source_type = filter_source_type)
        -- Solo chunks con similitud suficiente
        AND (1 - (kb.embedding <=> query_embedding)) >= match_threshold
    ORDER BY
        kb.embedding <=> query_embedding  -- ASC: menor distancia = más similar
    LIMIT
        match_count;
END;
$$;

COMMENT ON FUNCTION public.match_documents IS
'Búsqueda semántica por coseno sobre knowledge_base. Usada por el chatbot RAG de Arecofix vía Cloudflare Workers AI + Supabase pgvector.';


-- ─────────────────────────────────────────────────────────────────────────────
-- 7. GRANT: Permitir que roles puedan ejecutar match_documents
-- ─────────────────────────────────────────────────────────────────────────────
GRANT EXECUTE ON FUNCTION public.match_documents TO authenticated;
GRANT EXECUTE ON FUNCTION public.match_documents TO anon;
GRANT EXECUTE ON FUNCTION public.match_documents TO service_role;
