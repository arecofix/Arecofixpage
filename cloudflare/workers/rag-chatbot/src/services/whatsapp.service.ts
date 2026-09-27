import { Env } from '../types';

export class WhatsappService {
  constructor(private env: Env) {}

  async sendReply(to: string, text: string): Promise<void> {
    const phoneId = this.env.WHATSAPP_PHONE_ID;
    const token = this.env.WHATSAPP_TOKEN;

    if (!phoneId || !token) {
      console.error('[WhatsappService] WHATSAPP_PHONE_ID o WHATSAPP_TOKEN no configurados.');
      return;
    }

    try {
      const res = await fetch(
        `https://graph.facebook.com/v20.0/${phoneId}/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to,
            type: 'text',
            text: { body: text },
          }),
        }
      );

      if (!res.ok) {
        const err = await res.text();
        console.error(`[WhatsappService] Error al enviar mensaje a ${to}:`, err);
      } else {
        console.log(`[WhatsappService] Mensaje enviado a ${to}.`);
      }
    } catch (error) {
      console.error(`[WhatsappService] Exception al enviar mensaje a ${to}:`, error);
      throw error;
    }
  }

  verifyWebhook(url: URL): Response {
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    const expectedToken = this.env.WHATSAPP_VERIFY_TOKEN ?? 'ARECOFIX_WHATSAPP_2026';

    if (mode === 'subscribe' && token === expectedToken && challenge) {
      console.log('[WhatsappService] Verificación de Meta exitosa.');
      return new Response(challenge, { status: 200, headers: { 'Content-Type': 'text/plain' } });
    }

    console.warn('[WhatsappService] Verificación fallida. Token recibido:', token);
    return new Response('Forbidden', { status: 403 });
  }
}
