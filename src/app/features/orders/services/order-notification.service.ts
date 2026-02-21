import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OrderNotificationService {
  
  private readonly statusTranslations: Record<string, string> = {
    pending: 'Pendiente',
    processing: 'Procesando envío/retiro',
    completed: 'Completado',
    cancelled: 'Cancelado'
  };

  getStatusLabel(status: string): string {
    return this.statusTranslations[status] || status;
  }

  /**
   * Generates a WhatsApp link to notify the customer about an Ecommerce Order.
   */
  generateWhatsAppLink(phone: string, customerName: string, status: string, orderNumber: string, productDetails: string): string | null {
    if (!phone) return null;

    let cleanPhone = phone.replace(/\D/g, '');

    if (cleanPhone.length === 10) {
      cleanPhone = '549' + cleanPhone;
    } 
    if (cleanPhone.startsWith('0')) {
        cleanPhone = cleanPhone.substring(1);
        if (cleanPhone.length === 10) cleanPhone = '549' + cleanPhone;
    }

    let message = '';

    if (status === 'completed') {
        message = `Hola ${customerName}, te contactamos de Arecofix. Tu pedido #${orderNumber} por [${productDetails}] ya ha llegado y está listo. ¡Muchas gracias por tu compra!`;
    } else {
        const statusText = this.getStatusLabel(status);
        message = `Hola ${customerName}, te contactamos de Arecofix. \n\nEl estado de tu compra (Pedido #${orderNumber}) se ha actualizado a: *${statusText}*. \n\nCualquier consulta estamos a tu disposición.`;
    }

    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  }
}
