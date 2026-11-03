/**
 * Construye enlaces sanitizados a la API de WhatsApp (wa.me)
 */
export function buildWhatsAppUrl(phoneNumber: string, message?: string): string {
  const cleanPhone = (phoneNumber || '').replace(/[^0-9]/g, '');
  if (!cleanPhone) {
    return 'https://wa.me/';
  }
  if (!message || !message.trim()) {
    return `https://wa.me/${cleanPhone}`;
  }
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message.trim())}`;
}
