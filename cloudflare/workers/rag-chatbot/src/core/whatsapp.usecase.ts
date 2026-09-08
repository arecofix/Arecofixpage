import { Env, WhatsAppWebhookBody } from '../types';
import { ChatUseCase } from './chat.usecase';
import { WhatsappService } from '../services/whatsapp.service';

export class WhatsappUseCase {
  constructor(
    private chatUseCase: ChatUseCase,
    private whatsappService: WhatsappService,
    private env: Env
  ) {}

  async processWebhookBody(body: WhatsAppWebhookBody): Promise<void> {
    if (body.object !== 'whatsapp_business_account') {
      console.log('[WhatsappUseCase] Evento ignorado (object no es whatsapp_business_account):', body.object);
      return;
    }

    for (const entry of body.entry ?? []) {
      for (const change of entry.changes ?? []) {
        if (change.field !== 'messages') continue;

        const messages = change.value.messages ?? [];
        for (const msg of messages) {
          if (msg.type !== 'text' || !msg.text?.body) {
            console.log(`[WhatsappUseCase] Mensaje tipo '${msg.type}' de ${msg.from} ignorado.`);
            continue;
          }

          const userPhone = msg.from;
          const userText = msg.text.body;
          const tenantId = this.env.WHATSAPP_TENANT_ID ?? '';

          console.log(`[WhatsappUseCase] Procesando mensaje de ${userPhone}: "${userText}"`);

          try {
            const ragResponse = await this.chatUseCase.executeComplete({
              question: userText,
              tenant_id: tenantId,
              history: []
            });

            if (ragResponse.answer) {
              await this.whatsappService.sendReply(userPhone, ragResponse.answer);
            } else {
              console.error('[WhatsappUseCase] RAG sin respuesta para', userPhone);
              await this.whatsappService.sendReply(
                userPhone,
                'Disculpá, hubo un problema procesando tu consulta. Intentá de nuevo o escribinos directamente.'
              );
            }
          } catch (ragErr) {
            console.error('[WhatsappUseCase] Error critico en pipeline RAG:', ragErr);
            await this.whatsappService.sendReply(
              userPhone,
              'Hubo un error temporal. Por favor intentá de nuevo en unos segundos.'
            ).catch(() => {/* silenciar error secundario */});
          }
        }
      }
    }
  }
}
