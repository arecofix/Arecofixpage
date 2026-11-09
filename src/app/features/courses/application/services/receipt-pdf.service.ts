import { Injectable, inject } from '@angular/core';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';

export interface ReceiptData {
  receiptNumber: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  courseTitle: string;
  periodNumber: number;
  installmentsCount: number;
  amount: number;
  paymentMethod: string;
  paidAt: Date | string;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReceiptPdfService {
  private supabase = inject(SUPABASE_CLIENT);

  private async loadJsPdf() {
    const { jsPDF } = (await import('jspdf')) as any;
    return { jsPDF };
  }

  async generateReceiptPdf(data: ReceiptData): Promise<{ doc: any; blob: Blob; filename: string }> {
    const { jsPDF } = await this.loadJsPdf();

    // A5 Horizontal o A4 Media Página (210mm x 148mm)
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a5'
    });

    const pageWidth = 210;

    let paidDate: Date;
    if (typeof data.paidAt === 'string') {
      if (data.paidAt.includes('T')) {
        paidDate = new Date(data.paidAt);
      } else {
        paidDate = new Date(`${data.paidAt}T12:00:00-03:00`);
      }
    } else {
      paidDate = data.paidAt;
    }

    const dateFormatted = new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'America/Argentina/Buenos_Aires'
    }).format(paidDate);

    // Marco exterior con esquinas redondeadas
    doc.setDrawColor(203, 213, 225); // slate-300
    doc.setLineWidth(0.6);
    doc.roundedRect(8, 8, pageWidth - 16, 132, 4, 4);

    // Franja superior de marca
    doc.setFillColor(30, 58, 138); // blue-900
    doc.rect(8, 8, pageWidth - 16, 18, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('ARECOFIX ACADEMY', 14, 19);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('COMPROBANTE OFICIAL DE COBRO', pageWidth - 14, 19, { align: 'right' });

    // Recuadro de Recibo N° y Fecha
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setFillColor(248, 250, 252); // slate-50
    doc.roundedRect(14, 30, pageWidth - 28, 14, 2, 2, 'FD');

    doc.setTextColor(51, 65, 85); // slate-700
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('N° DE RECIBO:', 18, 38);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 64, 175); // blue-800
    doc.text(data.receiptNumber, 46, 38);

    doc.setTextColor(51, 65, 85);
    doc.setFont('helvetica', 'bold');
    doc.text('FECHA:', pageWidth - 70, 38);
    doc.setFont('helvetica', 'normal');
    doc.text(dateFormatted, pageWidth - 50, 38);

    // Datos del Alumno y Curso
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105); // slate-600
    doc.text('ALUMNO:', 14, 52);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.setFont('helvetica', 'bold');
    doc.text(data.studentName.toUpperCase(), 35, 52);

    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    doc.text('EMAIL:', 14, 59);
    doc.setTextColor(15, 23, 42);
    doc.text(data.studentEmail, 35, 59);

    if (data.studentPhone) {
      doc.setTextColor(71, 85, 105);
      doc.text('TEL:', pageWidth - 70, 59);
      doc.setTextColor(15, 23, 42);
      doc.text(data.studentPhone, pageWidth - 55, 59);
    }

    doc.setTextColor(71, 85, 105);
    doc.text('PROGRAMA:', 14, 66);
    doc.setTextColor(30, 64, 175);
    doc.setFont('helvetica', 'bold');
    doc.text(data.courseTitle, 35, 66);

    // Tabla de detalle del cobro
    doc.setFillColor(241, 245, 249); // slate-100
    doc.rect(14, 72, pageWidth - 28, 8, 'F');
    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('CONCEPTO', 18, 77);
    doc.text('MEDIO DE PAGO', 110, 77);
    doc.text('IMPORTE', pageWidth - 20, 77, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    const concepto = `Pago de Cuota ${data.periodNumber} de ${data.installmentsCount}`;
    doc.text(concepto, 18, 87);

    const medioLabel = this.formatPaymentMethod(data.paymentMethod);
    doc.text(medioLabel, 110, 87);

    doc.setFont('helvetica', 'bold');
    const importeStr = `$ ${data.amount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
    doc.text(importeStr, pageWidth - 20, 87, { align: 'right' });

    doc.setDrawColor(226, 232, 240);
    doc.line(14, 93, pageWidth - 14, 93);

    // Total
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    doc.text('TOTAL COBRADO:', 120, 101);
    doc.setTextColor(22, 101, 52); // emerald-800
    doc.setFontSize(12);
    doc.text(importeStr, pageWidth - 18, 101, { align: 'right' });

    // Observaciones si existen
    if (data.notes) {
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'italic');
      doc.text(`Observaciones: ${data.notes}`, 14, 108);
    }

    // Pie con firma
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('Arecofix Academy — Jorge Newbery 69, Marcos Paz, Bs. As. | Tel: +5491125960900', 14, 128);
    doc.text('academy.arecofix.com.ar', 14, 132);

    doc.setDrawColor(148, 163, 184);
    doc.line(pageWidth - 70, 122, pageWidth - 18, 122);
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text('Ezequiel Enrico Areco', pageWidth - 44, 126, { align: 'center' });
    doc.text('Dirección Académica', pageWidth - 44, 129, { align: 'center' });

    const filename = `${data.receiptNumber}.pdf`;
    const blob = doc.output('blob');

    return { doc, blob, filename };
  }

  async downloadReceipt(data: ReceiptData): Promise<void> {
    const { doc, filename } = await this.generateReceiptPdf(data);
    doc.save(filename);
  }

  async uploadReceiptToStorage(receiptNumber: string, blob: Blob): Promise<string | null> {
    try {
      const path = `${receiptNumber}.pdf`;
      const { error } = await this.supabase.storage
        .from('receipts')
        .upload(path, blob, {
          contentType: 'application/pdf',
          upsert: true
        });

      if (error) {
        console.warn('[ReceiptPdfService] Error uploading receipt to storage:', error.message);
        return null;
      }

      const { data } = this.supabase.storage.from('receipts').getPublicUrl(path);
      return data?.publicUrl || null;
    } catch (e) {
      console.warn('[ReceiptPdfService] Unexpected error uploading receipt:', e);
      return null;
    }
  }

  private formatPaymentMethod(method: string): string {
    switch ((method || '').toLowerCase()) {
      case 'cash':
      case 'efectivo':
        return 'Efectivo';
      case 'transfer':
      case 'transferencia':
        return 'Transferencia Bancaria';
      case 'mercadopago':
      case 'mercado_pago':
      case 'mp':
        return 'Mercado Pago';
      case 'card':
      case 'tarjeta':
        return 'Tarjeta';
      default:
        return method || 'Otro';
    }
  }
}

