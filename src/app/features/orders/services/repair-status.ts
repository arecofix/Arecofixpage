import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RepairStatusService {
  
  private readonly statusTranslations: Record<string, string> = {
    pending: 'Pendiente',
    processing: 'En Reparación',
    completed: 'Listo para retirar',
    cancelled: 'Cancelado'
  };

  getStatusLabel(status: string): string {
    return this.statusTranslations[status] || status;
  }

  /**
   * Generates a WhatsApp link to notify the customer about the status change.
   */
  generateWhatsAppLink(phone: string, customerName: string, status: string, orderNumber: string, deviceName: string = 'tu equipo'): string | null {
    if (!phone) return null;

    // Clean phone number: remove spaces, +, etc.
    let cleanPhone = phone.replace(/\D/g, '');

    // Default to Argentina (549) if it looks like a local mobile number without country code
    // Assuming 10 digits (area code + number) -> add 549
    if (cleanPhone.length === 10) {
      cleanPhone = '549' + cleanPhone;
    } 
    // If it starts with 0 (e.g. 011...), remove it
    if (cleanPhone.startsWith('0')) {
        cleanPhone = cleanPhone.substring(1);
        if (cleanPhone.length === 10) cleanPhone = '549' + cleanPhone;
    }

    const statusText = this.getStatusLabel(status);
    const message = `Hola ${customerName}, te contactamos de Arecofix. \n\nEl estado de tu reparación (Orden #${orderNumber}) para ${deviceName} ha cambiado a: *${statusText}*. \n\nCualquier consulta estamos a tu disposición.`;

    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  }
}
