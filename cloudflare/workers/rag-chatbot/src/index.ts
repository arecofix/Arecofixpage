import { Env, ChatPayload, WhatsAppWebhookBody } from './types';
import { AiService } from './services/ai.service';
import { SupabaseService } from './services/supabase.service';
import { WhatsappService } from './services/whatsapp.service';
import { ChatUseCase } from './core/chat.usecase';
import { WhatsappUseCase } from './core/whatsapp.usecase';
import { jsonResponse, handleCors, isAuthorized } from './utils/response.util';
import { EMBEDDING_MODEL, LLM_MODEL } from './config/constants';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    // CORS Preflight
    if (request.method === 'OPTIONS') {
      return handleCors(env);
    }

    // Inyección de dependencias
    const aiService = new AiService(env);
    const supabaseService = new SupabaseService(env);
    const whatsappService = new WhatsappService(env);

    const chatUseCase = new ChatUseCase(aiService, supabaseService, env);
    const whatsappUseCase = new WhatsappUseCase(chatUseCase, whatsappService, env);

    // ── WhatsApp Webhook (Sin Auth) ──
    if (pathname === '/webhook') {
      if (request.method === 'GET') {
        return whatsappService.verifyWebhook(url);
      }

      if (request.method === 'POST') {
        let body: WhatsAppWebhookBody | null = null;
        try {
          body = await request.json() as WhatsAppWebhookBody;
        } catch {
          console.log('[webhook] Error parseando JSON de Meta — devolviendo 200 igual.');
        }

        if (body) {
          ctx.waitUntil(whatsappUseCase.processWebhookBody(body));
        }

        // Meta requiere un 200 OK inmediatamente
        return new Response('EVENT_RECEIVED', { status: 200 });
      }

      return new Response('Method Not Allowed', { status: 405 });
    }

    // ── Healthcheck ──
    if (pathname === '/health' && request.method === 'GET') {
      return jsonResponse({
        status: 'ok',
        worker: 'rag-chatbot-modular',
        embedding_model: EMBEDDING_MODEL,
        llm_model: LLM_MODEL,
      }, env);
    }

    // ── Rutas protegidas con Auth Bearer ──
    if (!isAuthorized(request, env)) {
      return jsonResponse({ error: 'Unauthorized' }, env, 401);
    }

    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Método no permitido.' }, env, 405);
    }

    let payload: ChatPayload;
    try {
      payload = await request.json() as ChatPayload;
    } catch {
      return jsonResponse({ error: 'JSON inválido en el body.' }, env, 400);
    }

    // Validaciones
    if (!payload.question?.trim()) {
      return jsonResponse({ error: 'El campo "question" es obligatorio.' }, env, 400);
    }
    if (!payload.tenant_id) {
      return jsonResponse({ error: 'El campo "tenant_id" es obligatorio.' }, env, 400);
    }
    if (payload.question.trim().length > 1_000) {
      return jsonResponse({ error: 'La pregunta supera el límite de 1000 caracteres.' }, env, 400);
    }

    try {
      if (pathname === '/chat' || pathname === '/chat/offline') {
        const result = await chatUseCase.executeComplete(payload);
        return jsonResponse(result, env);
      }

      if (pathname === '/chat/stream') {
        return await chatUseCase.executeStream(payload);
      }

      return jsonResponse({ error: 'Ruta no encontrada.' }, env, 404);
    } catch (err: unknown) {
      console.error('[rag-chatbot] Error en endpoint chat:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      
      // Quota / Rate limits
      if (errorMessage.toLowerCase().includes('quota') || 
          errorMessage.includes('429') || 
          errorMessage.toLowerCase().includes('rate limit')) {
        return jsonResponse(
          {
            error: 'En este momento estoy procesando muchas consultas, intentá de nuevo en unos segundos.',
            detail: errorMessage,
          },
          env,
          429
        );
      }

      return jsonResponse(
        {
          error: 'Error interno del servidor.',
          detail: errorMessage,
        },
        env,
        500
      );
    }
  },
} satisfies ExportedHandler<Env>;
