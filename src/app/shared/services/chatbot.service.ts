import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TenantService } from '@app/core/services/tenant.service';
import { environment } from '@env/environment';

// ─── Tipos públicos ───────────────────────────────────────────────────────────

/** Un turno de conversación */
export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

/** Fuente recuperada del RAG (para mostrar transparencia al usuario) */
export interface ChatSource {
  title: string;
  source_type: string;
  source_url: string | null;
  similarity: number;
}

/** Respuesta completa del endpoint /chat */
export interface ChatResponse {
  answer: string;
  sources: ChatSource[];
  context_chunks_used: number;
}

/** Estado del servicio observable vía signals */
export interface ChatbotState {
  loading: boolean;
  streaming: boolean;
  error: string | null;
}

// ─── Servicio ─────────────────────────────────────────────────────────────────

/**
 * ChatbotService
 *
 * Interfaz entre la UI de Angular y el Cloudflare Worker RAG (Fase 3).
 * Soporta dos modos:
 *   - ask()       → respuesta completa JSON (para mobile/Tauri)
 *   - askStream() → SSE streaming token a token (para web — efecto typing)
 *
 * Maneja automáticamente:
 *   - Authorization header con CHATBOT_SECRET
 *   - tenant_id desde TenantService (multi-tenant)
 *   - Historial de conversación (últimos 6 turnos)
 *   - Estados de carga y error vía Signals
 */
@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  private readonly tenantService = inject(TenantService);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly workerUrl = environment.chatbotWorkerUrl;
  private readonly chatbotSecret = environment.chatbotSecret;

  /** Historial local de la conversación (últimos MAX_HISTORY turnos) */
  private readonly MAX_HISTORY = 12; // 6 pares user/assistant
  readonly history = signal<ChatTurn[]>([]);

  /** Estados reactivos */
  readonly loading = signal(false);
  readonly streaming = signal(false);
  readonly error = signal<string | null>(null);

  // ── Helpers privados ───────────────────────────────────────────────────────

  private get tenantId(): string {
    return this.tenantService.currentTenant()?.id ?? '';
  }

  private buildHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.chatbotSecret}`,
    };
  }

  private addToHistory(role: 'user' | 'assistant', content: string): void {
    this.history.update((h) => {
      const updated = [...h, { role, content }];
      // Mantener solo los últimos MAX_HISTORY turnos
      return updated.slice(-this.MAX_HISTORY);
    });
  }

  private handleError(err: unknown): string {
    if (err instanceof TypeError && err.message.includes('fetch')) {
      return 'No se pudo conectar con el asistente. Verificá tu conexión.';
    }
    if (err instanceof Error) return err.message;
    return 'Error inesperado. Intentá de nuevo.';
  }

  // ── API pública ────────────────────────────────────────────────────────────

  /**
   * Limpia el historial de la conversación.
   * Llamar al cerrar/reabrir el chat.
   */
  clearHistory(): void {
    this.history.set([]);
    this.error.set(null);
  }

  /**
   * ask() — Respuesta completa (no streaming).
   * Ideal para Tauri, mobile (Capacitor) o contextos sin SSE.
   *
   * @param question Pregunta del usuario en texto plano
   * @param sourceType Filtro opcional por tipo de fuente RAG
   * @returns Promise con la respuesta completa y fuentes
   */
  async ask(
    question: string,
    sourceType?: string,
  ): Promise<ChatResponse> {
    if (!isPlatformBrowser(this.platformId)) {
      return { answer: '', sources: [], context_chunks_used: 0 };
    }

    this.loading.set(true);
    this.error.set(null);
    this.addToHistory('user', question);

    try {
      let isOnline = navigator.onLine;
      let targetUrl = isOnline ? `${this.workerUrl}/chat` : `http://localhost:5000/api/chat/offline`;
      const reqInit = {
        method: 'POST',
        headers: this.buildHeaders(),
        body: JSON.stringify({
          question,
          tenant_id: this.tenantId,
          history: this.history().slice(0, -1), // sin el turno actual
          source_type: sourceType ?? null,
        }),
      };

      let response: Response;
      try {
        response = await fetch(targetUrl, reqInit);
      } catch (err) {
        // Fallback si el Worker de Cloudflare está caído o apagado localmente
        if (targetUrl !== `http://localhost:5000/api/chat/offline`) {
          console.warn('Worker unreachable, falling back to local backend...');
          targetUrl = `http://localhost:5000/api/chat/offline`;
          response = await fetch(targetUrl, reqInit);
        } else {
          throw err;
        }
      }

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({})) as { error?: string };
        throw new Error(errBody['error'] ?? `HTTP ${response.status}`);
      }

      const data = (await response.json()) as ChatResponse;
      this.addToHistory('assistant', data.answer);
      return data;
    } catch (err) {
      const msg = this.handleError(err);
      this.error.set(msg);
      throw err;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * askStream() — Respuesta token por token via SSE.
   * Ideal para la UI web (efecto "typing" en tiempo real).
   *
   * El caller recibe callbacks:
   *   - onToken(chunk)   → llamado con cada fragmento de texto del LLM
   *   - onSources(list)  → llamado UNA VEZ cuando llegan las fuentes RAG
   *   - onDone()         → llamado cuando el stream termina
   *   - onError(msg)     → llamado si hay error
   *
   * @param question Pregunta del usuario
   * @param callbacks Funciones de callback para cada evento
   * @param sourceType Filtro opcional por tipo de fuente RAG
   */
  async askStream(
    question: string,
    callbacks: {
      onToken: (chunk: string) => void;
      onSources?: (sources: ChatSource[]) => void;
      onDone?: () => void;
      onError?: (msg: string) => void;
    },
    sourceType?: string,
  ): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    this.streaming.set(true);
    this.error.set(null);
    this.addToHistory('user', question);

    let fullAnswer = '';

    try {
      let isOnline = navigator.onLine;
      let targetUrl = isOnline ? `${this.workerUrl}/chat/stream` : `http://localhost:5000/api/chat/offline`;
      const reqInit = {
        method: 'POST',
        headers: this.buildHeaders(),
        body: JSON.stringify({
          question,
          tenant_id: this.tenantId,
          history: this.history().slice(0, -1),
          source_type: sourceType ?? null,
        }),
      };

      let response: Response;
      try {
        response = await fetch(targetUrl, reqInit);
      } catch (err) {
        // Fallback si el Worker de Cloudflare está caído o apagado localmente
        if (targetUrl !== `http://localhost:5000/api/chat/offline`) {
          console.warn('Worker stream unreachable, falling back to local backend...');
          targetUrl = `http://localhost:5000/api/chat/offline`;
          response = await fetch(targetUrl, reqInit);
        } else {
          throw err;
        }
      }

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({})) as { error?: string };
        throw new Error(errBody['error'] ?? `HTTP ${response.status}`);
      }

      if (!response.body) throw new Error('El stream no tiene body.');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Procesar líneas SSE del buffer
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? ''; // última línea puede estar incompleta

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (!raw || raw === '[DONE]') continue;

          try {
            const parsed = JSON.parse(raw) as {
              type?: string;
              sources?: ChatSource[];
              response?: string;
              error?: string;
              p?: string;
            };

            // Si el backend envía un error en el stream
            if (parsed['error']) {
              callbacks.onError?.(parsed['error']);
              continue;
            }

            // Evento de fuentes (primer evento SSE del Worker)
            if (parsed['type'] === 'sources' && parsed['sources']) {
              callbacks.onSources?.(parsed['sources']);
              continue;
            }

            // Token del LLM (Workers AI SSE format: { response: "token" })
            const token = parsed['response'] ?? '';
            if (token) {
              fullAnswer += token;
              callbacks.onToken(token);
            }
          } catch {
            // Línea parcial o formato inesperado — ignorar
          }
        }
      }

      // Guardar respuesta completa en el historial
      if (fullAnswer) this.addToHistory('assistant', fullAnswer);
      callbacks.onDone?.();
    } catch (err) {
      const msg = this.handleError(err);
      this.error.set(msg);
      callbacks.onError?.(msg);
    } finally {
      this.streaming.set(false);
    }
  }
}
