import { Env, ChatPayload, MatchedDocument, ChatMessage } from '../types';
import { AiService } from '../services/ai.service';
import { SupabaseService } from '../services/supabase.service';
import { buildSystemPrompt, MAX_CONTEXT_CHARS, MAX_HISTORY_TURNS } from '../config/constants';

export class ChatUseCase {
  constructor(
    private aiService: AiService,
    private supabaseService: SupabaseService,
    private env: Env
  ) {}

  async executeComplete(payload: ChatPayload): Promise<any> {
    const embedding = await this.aiService.generateEmbedding(payload.question);
    const docs = await this.supabaseService.retrieveContext(embedding, payload);
    const contextBlock = this.buildContextBlock(docs);
    const messages = this.buildMessages(payload.question, contextBlock, payload.history ?? []);

    const llmResponse = await this.aiService.generateCompletion(messages, false);
    const answer = (llmResponse as { response?: string }).response?.trim() ?? 'No pude generar una respuesta.';

    return {
      answer,
      sources: docs.map(d => ({
        title: d.title,
        source_type: d.source_type,
        source_url: d.source_url,
        similarity: parseFloat(d.similarity.toFixed(3)),
      })),
      context_chunks_used: docs.length,
    };
  }

  async executeStream(payload: ChatPayload): Promise<Response> {
    const embedding = await this.aiService.generateEmbedding(payload.question);
    const docs = await this.supabaseService.retrieveContext(embedding, payload);
    const contextBlock = this.buildContextBlock(docs);
    const messages = this.buildMessages(payload.question, contextBlock, payload.history ?? []);

    const llmStream = await this.aiService.generateCompletion(messages, true);

    const sourcesEvent =
      `data: ${JSON.stringify({
        type: 'sources',
        sources: docs.map(d => ({
          title: d.title,
          source_type: d.source_type,
          source_url: d.source_url,
          similarity: parseFloat(d.similarity.toFixed(3)),
        })),
      })}\n\n`;

    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    (async () => {
      try {
        await writer.write(encoder.encode(sourcesEvent));
        const reader = (llmStream as unknown as ReadableStream).getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const raw = line.slice(6).trim();
            if (!raw || raw === '[DONE]') {
              await writer.write(encoder.encode(line + '\n'));
              continue;
            }
            
            try {
              const parsed = JSON.parse(raw);
              if (parsed.response) {
                await writer.write(encoder.encode(`data: ${JSON.stringify(parsed)}\n\n`));
              } else {
                await writer.write(encoder.encode(line + '\n'));
              }
            } catch {
              await writer.write(encoder.encode(line + '\n'));
            }
          }
        }
        
        if (buffer) {
          await writer.write(encoder.encode(buffer + '\n'));
        }
        
        await writer.write(encoder.encode('data: [DONE]\n\n'));
      } catch (err: unknown) {
        console.error('[ChatUseCase] Stream error:', err);
        const msg = err instanceof Error ? err.message : 'Error de Stream';
        const streamErr = JSON.stringify({ error: msg });
        await writer.write(encoder.encode(`data: ${streamErr}\n\n`));
      } finally {
        await writer.close();
      }
    })();

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': this.env.ALLOWED_ORIGIN ?? '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, ngsw-bypass',
      },
    });
  }

  private buildContextBlock(docs: MatchedDocument[]): string {
    if (docs.length === 0) return '';

    let contextText = '';
    let charCount = 0;

    for (const doc of docs) {
      const section =
        `--- [${doc.source_type.toUpperCase()}] ${doc.title} (similitud: ${(doc.similarity * 100).toFixed(0)}%) ---\n` +
        `${doc.content}\n\n`;

      if (charCount + section.length > MAX_CONTEXT_CHARS) break;
      contextText += section;
      charCount += section.length;
    }

    return contextText.trim();
  }

  private buildMessages(question: string, contextBlock: string, history: ChatMessage[]): RoleScopedChatInput[] {
    let combinedSystemPrompt = buildSystemPrompt() + "\n\n";

    if (contextBlock) {
      combinedSystemPrompt += `A continuación encontrarás información relevante de la base de conocimiento de Arecofix para responder la pregunta del usuario:\n\n${contextBlock}\n\nUsa SOLO esta información para responder. Si no es suficiente, indícalo.`;
    } else {
      combinedSystemPrompt += `No se encontró información específica en la base de conocimiento para esta consulta. Responde de forma general dentro del dominio de Arecofix o indicá que no tenés esa información.`;
    }

    const messages: RoleScopedChatInput[] = [{ role: 'system', content: combinedSystemPrompt }];

    const recentHistory = history.slice(-MAX_HISTORY_TURNS);
    for (const msg of recentHistory) {
      messages.push({ role: msg.role, content: msg.content });
    }

    messages.push({ role: 'user', content: question });

    return messages;
  }
}
