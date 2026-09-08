export interface Env {
  AI: Ai;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  CHATBOT_SECRET: string;
  WHATSAPP_NUMBER?: string;
  WHATSAPP_VERIFY_TOKEN?: string;
  WHATSAPP_TOKEN?: string;
  WHATSAPP_PHONE_ID?: string;
  WHATSAPP_TENANT_ID?: string;
  ALLOWED_ORIGIN?: string; // Para CORS
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatPayload {
  question: string;
  tenant_id: string;
  source_type?: 'product' | 'service' | 'manual' | 'course' | 'faq' | 'blog' | 'custom';
  history?: ChatMessage[];
  match_threshold?: number;
  match_count?: number;
}

export interface MatchedDocument {
  id: string;
  title: string;
  content: string;
  metadata: Record<string, unknown>;
  source_type: string;
  source_id: string | null;
  source_url: string | null;
  similarity: number;
}

export interface ChatResponse {
  answer: string;
  sources: Array<{
    title: string;
    source_type: string;
    source_url: string | null;
    similarity: number;
  }>;
  context_chunks_used: number;
}

export interface WhatsAppMessage {
  from: string;
  id: string;
  type: 'text' | 'image' | 'audio' | 'document' | 'sticker' | 'video' | string;
  text?: { body: string };
  timestamp: string;
}

export interface WhatsAppWebhookBody {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        metadata: { display_phone_number: string; phone_number_id: string };
        messages?: WhatsAppMessage[];
        statuses?: unknown[];
      };
      field: string;
    }>;
  }>;
}
