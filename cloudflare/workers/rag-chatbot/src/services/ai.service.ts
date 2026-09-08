import { Env } from '../types';
import { EMBEDDING_MODEL, LLM_MODEL } from '../config/constants';

export class AiService {
  constructor(private env: Env) {}

  async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.env.AI.run(EMBEDDING_MODEL, { text: [text] });
    const data = (response as { data?: number[][] }).data;
    if (!data?.[0]) throw new Error('Workers AI no devolvió embedding para la pregunta.');
    return data[0];
  }

  async generateCompletion(messages: RoleScopedChatInput[], stream: boolean = false): Promise<any> {
    return this.env.AI.run(LLM_MODEL, {
      messages,
      max_tokens: 512,
      stream,
    });
  }
}
