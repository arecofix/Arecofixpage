import { Env, ChatPayload, MatchedDocument } from '../types';

export class SupabaseService {
  constructor(private env: Env) {}

  async retrieveContext(
    embedding: number[],
    payload: ChatPayload
  ): Promise<MatchedDocument[]> {
    const rpcUrl = `${this.env.SUPABASE_URL}/rest/v1/rpc/match_documents`;
    const body = {
      query_embedding: embedding,
      match_threshold: payload.match_threshold ?? 0.65,
      match_count: payload.match_count ?? 5,
      filter_tenant_id: payload.tenant_id,
      filter_source_type: payload.source_type ?? null,
    };

    try {
      const response = await fetch(rpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: this.env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${this.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`Supabase match_documents error ${response.status}: ${err}`);
      }

      const docs = (await response.json()) as MatchedDocument[];
      return docs;
    } catch (error) {
      console.error('[SupabaseService] retrieveContext failed:', error);
      // Resilience: Return empty array so LLM can fallback to general knowledge
      return [];
    }
  }
}
