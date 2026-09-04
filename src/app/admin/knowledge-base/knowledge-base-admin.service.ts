import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from '@app/core/services/supabase.service';
import { TenantService } from '@app/core/services/tenant.service';
import { environment } from '@env/environment';

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface KnowledgeDoc {
  id: string;
  tenant_id: string;
  title: string;
  source_type: string;
  source_id: string | null;
  source_url: string | null;
  chunk_index: number;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface IngestTextPayload {
  title: string;
  content: string;
  source_type: 'product' | 'service' | 'manual' | 'course' | 'faq' | 'blog' | 'custom';
  metadata?: Record<string, unknown>;
}

// ─── Servicio ─────────────────────────────────────────────────────────────────

/**
 * KnowledgeBaseAdminService
 *
 * Orquesta las tres operaciones del panel de administración RAG:
 *
 *  1. ingestText()  → Envía texto directo al Worker de embeddings (Fase 2)
 *  2. ingestFile()  → Sube un archivo (PDF/txt) a R2 vía Flask presigned URL,
 *                     extrae el texto y lo indexa en la knowledge_base
 *  3. listDocs()    → Lista los documentos únicos indexados (agrupados por source_id)
 *  4. deleteDoc()   → Elimina todos los chunks de un documento por source_id
 */
@Injectable({ providedIn: 'root' })
export class KnowledgeBaseAdminService {
  private readonly supabase = inject(SupabaseService);
  private readonly tenantService = inject(TenantService);

  private readonly embeddingWorkerUrl = environment.embeddingWorkerUrl || environment.chatbotWorkerUrl.replace('rag-chatbot', 'embedding-ingestion');
  private readonly workerSecret = '0GLFFVCUthNF8nfwAV5Q2xQQpYYIyzWA1g0Pt3xPyIs=';
  private readonly flaskUrl = environment.apiUrl;

  /** Señales de estado */
  readonly loading = signal(false);
  readonly uploading = signal(false);
  readonly error = signal<string | null>(null);

  private get tenantId(): string {
    return this.tenantService.currentTenant()?.id ?? '';
  }

  // ── 1. Ingesta de texto directo ────────────────────────────────────────────

  async ingestText(payload: IngestTextPayload): Promise<{ chunks_processed: number }> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const res = await fetch(`${this.embeddingWorkerUrl}/ingest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.workerSecret}`,
        },
        body: JSON.stringify({ ...payload, tenant_id: this.tenantId }),
      });
      if (!res.ok) {
        const err = await res.json() as { error?: string };
        throw new Error(err['error'] ?? `HTTP ${res.status}`);
      }
      const data = await res.json() as { chunks_processed: number };
      await this.supabase.clearCache();
      return data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al indexar texto.';
      this.error.set(msg);
      throw err;
    } finally {
      this.loading.set(false);
    }
  }

  // ── 2. Ingesta de archivo (PDF / TXT) vía R2 ──────────────────────────────

  /**
   * Flujo completo de un archivo:
   *  a) Solicita presigned URL a Flask (PUT a R2)
   *  b) Sube el archivo directamente a R2 desde el browser
   *  c) Extrae el texto del archivo en el cliente (para PDFs usa pdfjs-dist si está disponible)
   *  d) Envía el texto al Worker de embeddings para indexar
   */
  async ingestFile(
    file: File,
    title: string,
    sourceType: IngestTextPayload['source_type'],
    metadata?: Record<string, unknown>,
  ): Promise<{ chunks_processed: number; r2_url: string }> {
    this.uploading.set(true);
    this.error.set(null);

    try {
      // ── a) Obtener presigned URL desde Flask ─────────────────────────────
      const folder = `rag/${this.tenantId}/${sourceType}`;
      const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const presignedRes = await fetch(
        `${this.flaskUrl}/api/storage/presigned-upload?folder=${encodeURIComponent(folder)}&filename=${encodeURIComponent(filename)}&content_type=${encodeURIComponent(file.type || 'application/octet-stream')}`,
        { credentials: 'include' },
      );

      if (!presignedRes.ok) throw new Error('No se pudo obtener la URL de subida.');
      const { upload_url, public_url } = await presignedRes.json() as { upload_url: string; public_url: string };

      // ── b) Subir archivo a R2 directamente ───────────────────────────────
      const uploadRes = await fetch(upload_url, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type || 'application/octet-stream' },
      });
      if (!uploadRes.ok) throw new Error(`Error al subir a R2: ${uploadRes.status}`);

      // ── c) Extraer texto del archivo ─────────────────────────────────────
      const textContent = await this.extractText(file);
      if (!textContent || textContent.trim().length < 20) {
        throw new Error('No se pudo extraer texto del archivo. Asegurate de que el PDF tenga texto seleccionable.');
      }

      // ── d) Indexar en knowledge_base via Worker ───────────────────────────
      const ingestRes = await fetch(`${this.embeddingWorkerUrl}/ingest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.workerSecret}`,
        },
        body: JSON.stringify({
          tenant_id: this.tenantId,
          title,
          content: textContent,
          source_type: sourceType,
          source_url: public_url,
          metadata: { ...metadata, filename: file.name, size_bytes: file.size },
        }),
      });

      if (!ingestRes.ok) {
        const err = await ingestRes.json() as { error?: string };
        throw new Error(err['error'] ?? 'Error al indexar archivo.');
      }

      const result = await ingestRes.json() as { chunks_processed: number };
      await this.supabase.clearCache();
      return { ...result, r2_url: public_url };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error inesperado.';
      this.error.set(msg);
      throw err;
    } finally {
      this.uploading.set(false);
    }
  }

  /** Extrae texto plano de un File (PDF vía FileReader + PDF.js si disponible, TXT directo) */
  private async extractText(file: File): Promise<string> {
    if (file.type === 'text/plain') {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('No se pudo leer el archivo .txt'));
        reader.readAsText(file, 'UTF-8');
      });
    }

    if (file.type === 'application/pdf') {
      return this.extractPdfText(file);
    }

    // Fallback para otros tipos (docx, etc.) — leer como texto
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Tipo de archivo no soportado para extracción de texto.'));
      reader.readAsText(file, 'UTF-8');
    });
  }

  /** Extrae texto de PDF usando el endpoint de Flask (que usa pdfplumber en Python) */
  private async extractPdfText(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${this.flaskUrl}/api/rag/extract-pdf`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!res.ok) {
      // Fallback: intentar leer el PDF en el browser con la API nativa de texto
      console.warn('[KnowledgeBaseAdmin] Flask PDF extraction failed, trying client-side fallback');
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).replace(/[^\x20-\x7E\n\r\t\u00C0-\u024F]/g, ' ').trim());
        reader.onerror = () => reject(new Error('No se pudo extraer texto del PDF.'));
        reader.readAsText(file);
      });
    }

    const data = await res.json() as { text: string };
    return data.text;
  }

  // ── 3. Listar documentos indexados ────────────────────────────────────────

  async listDocs(): Promise<KnowledgeDoc[]> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const client = this.supabase.getClient();
      // Traer solo chunk_index = 0 (primer chunk de cada doc) para evitar duplicados
      const { data, error } = await client
        .from('knowledge_base')
        .select('id, tenant_id, title, source_type, source_id, source_url, chunk_index, metadata, created_at')
        .eq('tenant_id', this.tenantId)
        .eq('chunk_index', 0)
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) throw error;
      return (data as KnowledgeDoc[]) ?? [];
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al cargar documentos.';
      this.error.set(msg);
      return [];
    } finally {
      this.loading.set(false);
    }
  }

  // ── 4. Eliminar documento ─────────────────────────────────────────────────

  async deleteDoc(sourceId: string): Promise<void> {
    const res = await fetch(
      `${this.embeddingWorkerUrl}/document/${sourceId}?tenant_id=${this.tenantId}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${this.workerSecret}` },
      },
    );
    if (!res.ok) throw new Error(`Error al eliminar documento: ${res.status}`);
    await this.supabase.clearCache();
  }

  // ── 5. Contar chunks por doc ──────────────────────────────────────────────

  async countChunks(title: string): Promise<number> {
    const client = this.supabase.getClient();
    const { count } = await client
      .from('knowledge_base')
      .select('id', { count: 'exact', head: true })
      .eq('tenant_id', this.tenantId)
      .eq('title', title);
    return count ?? 0;
  }
}
