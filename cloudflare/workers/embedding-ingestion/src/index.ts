/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FASE 2: Cloudflare Worker — Generador de Embeddings (Ingestion Pipeline)
 *
 * Responsabilidad:
 *   1. Recibe texto plano + metadata (título, tenant_id, source_type, etc.)
 *   2. Lo divide en chunks si supera MAX_CHUNK_CHARS (chunking strategy)
 *   3. Genera embeddings con Workers AI → @cf/baai/bge-base-en-v1.5 (768 dims)
 *   4. Guarda cada chunk + su vector en Supabase (knowledge_base)
 *      usando la Service Role Key (omite RLS, acceso de escritura total)
 *
 * Modelo elegido: @cf/baai/bge-base-en-v1.5
 *   - 768 dimensiones (coincide con vector(768) de la Fase 1)
 *   - Excelente rendimiento en español e inglés técnico
 *   - Gratuito en el plan Workers Free (10k req/día)
 *   - Latencia ~100-200ms por chunk
 *
 * Endpoints expuestos:
 *   POST /ingest       → ingesta un documento (texto, metadata)
 *   POST /ingest/batch → ingesta múltiples documentos a la vez
 *   DELETE /document/:source_id → elimina chunks por source_id
 *   GET  /health       → healthcheck
 *
 * Seguridad:
 *   Todas las rutas requieren el header Authorization: Bearer <WORKER_SECRET>
 *   (variable de entorno WORKER_SECRET en Cloudflare Secrets)
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ─── Tipos ────────────────────────────────────────────────────────────────────

/** Payload esperado en POST /ingest */
interface IngestPayload {
  /** UUID del tenant (obligatorio para aislamiento multi-tenant) */
  tenant_id: string;
  /** Texto completo del documento a vectorizar */
  content: string;
  /** Título del documento / producto / manual */
  title: string;
  /** Tipo de fuente — debe coincidir con el CHECK de la tabla */
  source_type: 'product' | 'service' | 'manual' | 'course' | 'faq' | 'blog' | 'custom';
  /** ID de la entidad origen en la BD (opcional) */
  source_id?: string;
  /** URL del archivo en R2 (opcional, para PDFs/manuales) */
  source_url?: string;
  /** Metadata extra en formato libre (SKU, precio, tags, etc.) */
  metadata?: Record<string, unknown>;
}

/** Payload para POST /ingest/batch */
interface BatchIngestPayload {
  documents: IngestPayload[];
}

/** Fila que se inserta en Supabase knowledge_base */
interface KnowledgeBaseRow {
  tenant_id: string;
  title: string;
  content: string;
  chunk_index: number;
  source_type: string;
  source_id?: string;
  source_url?: string;
  metadata: Record<string, unknown>;
  embedding: number[];
}

/** Variables de entorno del Worker (definidas en wrangler.toml / Cloudflare Secrets) */
interface Env {
  /** @cf/baai/bge-base-en-v1.5 binding via Workers AI */
  AI: Ai;
  /** https://jftiyfnnaogmgvksgkbn.supabase.co (var de entorno) */
  SUPABASE_URL: string;
  /** Service Role Key — tiene acceso de escritura irrestricto */
  SUPABASE_SERVICE_ROLE_KEY: string;
  /** Secret compartido que deben enviar los clientes en Authorization: Bearer */
  WORKER_SECRET: string;
}

// ─── Constantes ───────────────────────────────────────────────────────────────

/** Máximo de caracteres por chunk antes de dividir el texto */
const MAX_CHUNK_CHARS = 1_500;

/** Solapamiento entre chunks (contexto compartido entre fragmentos adyacentes) */
const CHUNK_OVERLAP_CHARS = 150;

/** Modelo de embeddings — 768 dims, multilingüe con buen soporte español */
const EMBEDDING_MODEL = '@cf/baai/bge-base-en-v1.5' as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Divide un texto largo en chunks con solapamiento.
 * Estrategia: split por párrafo (\n\n), luego por oración si sigue siendo largo.
 * El solapamiento evita perder contexto en los bordes de los fragmentos.
 */
function chunkText(text: string): string[] {
  const normalized = text.trim().replace(/\r\n/g, '\n');

  if (normalized.length <= MAX_CHUNK_CHARS) {
    return [normalized];
  }

  const chunks: string[] = [];
  let start = 0;

  while (start < normalized.length) {
    let end = start + MAX_CHUNK_CHARS;

    if (end < normalized.length) {
      // Busca el último salto de párrafo/oración para no cortar a mitad de frase
      const lastParagraph = normalized.lastIndexOf('\n\n', end);
      const lastNewline = normalized.lastIndexOf('\n', end);
      const lastPeriod = normalized.lastIndexOf('. ', end);

      if (lastParagraph > start + MAX_CHUNK_CHARS / 2) {
        end = lastParagraph;
      } else if (lastNewline > start + MAX_CHUNK_CHARS / 2) {
        end = lastNewline;
      } else if (lastPeriod > start + MAX_CHUNK_CHARS / 2) {
        end = lastPeriod + 1;
      }
    }

    chunks.push(normalized.slice(start, end).trim());
    start = Math.max(start + 1, end - CHUNK_OVERLAP_CHARS);
  }

  return chunks.filter((c) => c.length > 0);
}

/**
 * Valida el header Authorization: Bearer <secret>
 */
function isAuthorized(request: Request, env: Env): boolean {
  const authHeader = request.headers.get('Authorization') ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  return token === env.WORKER_SECRET;
}

/**
 * Construye una respuesta JSON estandarizada.
 */
function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      // CORS: el Worker usa validación por WORKER_SECRET, así que permitimos * para dev/prod
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, DELETE, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// ─── Core: Generación de embedding vía Workers AI ─────────────────────────────

/**
 * Genera el vector de embedding para un texto usando Workers AI.
 * Retorna un array de 768 floats.
 */
async function generateEmbedding(text: string, env: Env): Promise<number[]> {
  // La API de Workers AI para embeddings devuelve { data: number[][] }
  const response = await env.AI.run(EMBEDDING_MODEL, { text: [text] });

  // Normalización defensiva del output (la forma puede variar levemente entre modelos)
  const data = (response as { data?: number[][] }).data;
  if (!data || data.length === 0 || !Array.isArray(data[0])) {
    throw new Error(`Workers AI devolvió un formato inesperado: ${JSON.stringify(response)}`);
  }

  return data[0];
}

// ─── Core: Guardar en Supabase ────────────────────────────────────────────────

/**
 * Inserta una o más filas en public.knowledge_base via Supabase REST API.
 * Usa upsert para re-indexar sin duplicar (basado en source_id + chunk_index + tenant_id).
 */
async function upsertToSupabase(rows: KnowledgeBaseRow[], env: Env): Promise<void> {
  const url = `${env.SUPABASE_URL}/rest/v1/knowledge_base`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      // Upsert: si ya existe un registro con (source_id, chunk_index, tenant_id),
      // actualiza el embedding y el contenido en lugar de insertar duplicado.
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify(rows),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase error ${response.status}: ${errorText}`);
  }
}

// ─── Core: Eliminar chunks por source_id ──────────────────────────────────────

async function deleteBySourceId(
  sourceId: string,
  tenantId: string,
  env: Env,
): Promise<void> {
  const url =
    `${env.SUPABASE_URL}/rest/v1/knowledge_base` +
    `?source_id=eq.${sourceId}&tenant_id=eq.${tenantId}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      Prefer: 'return=minimal',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase delete error ${response.status}: ${errorText}`);
  }
}

// ─── Core: Pipeline de ingesta para un documento ──────────────────────────────

/**
 * Orquesta el pipeline completo para un documento:
 * texto → chunks → embeddings → upsert en Supabase
 */
async function ingestDocument(
  payload: IngestPayload,
  env: Env,
): Promise<{ chunks_processed: number; title: string }> {
  // 1. Dividir en chunks
  const chunks = chunkText(payload.content);

  // 2. Generar embeddings en paralelo (hasta 10 a la vez para no saturar Workers AI)
  const BATCH_SIZE = 10;
  const rows: KnowledgeBaseRow[] = [];

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batchChunks = chunks.slice(i, i + BATCH_SIZE);

    const embeddings = await Promise.all(
      batchChunks.map((chunk) => generateEmbedding(chunk, env)),
    );

    batchChunks.forEach((chunk, idx) => {
      rows.push({
        tenant_id: payload.tenant_id,
        title: payload.title,
        content: chunk,
        chunk_index: i + idx,
        source_type: payload.source_type,
        source_id: payload.source_id,
        source_url: payload.source_url,
        metadata: payload.metadata ?? {},
        embedding: embeddings[idx],
      });
    });
  }

  // 3. Upsert en Supabase
  await upsertToSupabase(rows, env);

  return { chunks_processed: rows.length, title: payload.title };
}

// ─── Router principal ─────────────────────────────────────────────────────────

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    // Preflight CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, DELETE, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // ── Healthcheck (sin autenticación) ──────────────────────────────────────
    if (pathname === '/health' && request.method === 'GET') {
      return jsonResponse({ status: 'ok', worker: 'embedding-ingestion', model: EMBEDDING_MODEL });
    }

    // ── Autenticación (todas las demás rutas) ─────────────────────────────────
    if (!isAuthorized(request, env)) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    try {
      // ── POST /ingest ─────────────────────────────────────────────────────────
      if (pathname === '/ingest' && request.method === 'POST') {
        const body = (await request.json()) as IngestPayload;

        // Validaciones básicas
        if (!body.tenant_id || !body.content || !body.title || !body.source_type) {
          return jsonResponse(
            { error: 'Campos obligatorios: tenant_id, content, title, source_type' },
            400,
          );
        }

        if (body.content.trim().length < 10) {
          return jsonResponse({ error: 'El contenido es demasiado corto para vectorizar.' }, 400);
        }

        const result = await ingestDocument(body, env);

        return jsonResponse({
          success: true,
          message: `Documento "${result.title}" indexado correctamente.`,
          chunks_processed: result.chunks_processed,
        });
      }

      // ── POST /ingest/batch ───────────────────────────────────────────────────
      if (pathname === '/ingest/batch' && request.method === 'POST') {
        const body = (await request.json()) as BatchIngestPayload;

        if (!Array.isArray(body.documents) || body.documents.length === 0) {
          return jsonResponse({ error: 'El campo "documents" debe ser un array no vacío.' }, 400);
        }

        if (body.documents.length > 50) {
          return jsonResponse({ error: 'Máximo 50 documentos por batch.' }, 400);
        }

        // Procesar en serie para no agotar el límite de CPU del Worker
        const results: Array<{ title: string; chunks_processed: number }> = [];
        const errors: Array<{ title: string; error: string }> = [];

        for (const doc of body.documents) {
          try {
            const result = await ingestDocument(doc, env);
            results.push(result);
          } catch (err) {
            errors.push({
              title: doc.title ?? 'sin título',
              error: err instanceof Error ? err.message : String(err),
            });
          }
        }

        return jsonResponse({
          success: errors.length === 0,
          documents_indexed: results.length,
          documents_failed: errors.length,
          results,
          errors,
        });
      }

      // ── DELETE /document/:source_id ──────────────────────────────────────────
      const deleteMatch = pathname.match(/^\/document\/([^/]+)$/);
      if (deleteMatch && request.method === 'DELETE') {
        const sourceId = deleteMatch[1];
        const tenantId = url.searchParams.get('tenant_id');

        if (!tenantId) {
          return jsonResponse({ error: 'Query param "tenant_id" es obligatorio.' }, 400);
        }

        await deleteBySourceId(sourceId, tenantId, env);

        return jsonResponse({
          success: true,
          message: `Chunks del source_id "${sourceId}" eliminados para el tenant "${tenantId}".`,
        });
      }

      return jsonResponse({ error: 'Ruta no encontrada.' }, 404);
    } catch (err) {
      console.error('[embedding-ingestion] Error:', err);
      return jsonResponse(
        { error: 'Error interno del servidor.', detail: err instanceof Error ? err.message : String(err) },
        500,
      );
    }
  },
} satisfies ExportedHandler<Env>;
