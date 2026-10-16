import { Injectable, inject } from '@angular/core';
import {
  ARCA_CONSTANTS,
  ARCA_ITEM_TYPES,
  ARCA_LEGENDS,
  ArcaEmitterData,
  ArcaInvoiceType,
} from '../../domain/entities/arca.entity';
import { Invoice, InvoiceItem } from '../../domain/entities/invoice.entity';
import { CalculateArcaTotalsUseCase } from '../../domain/usecases/calculate-arca-totals.usecase';
import { LoggerService } from '@app/core/services/logger.service';
import { QrGeneratorService } from './qr-generator.service';

@Injectable({
  providedIn: 'root',
})
export class InvoicePdfExportService {
  private logger = inject(LoggerService);
  private qrGenerator = inject(QrGeneratorService);

  /**
   * Lazily loads jsPDF and jspdf-autotable
   */
  private async loadJsPdf() {
    const { jsPDF } = (await import('jspdf')) as any;
    const { default: autoTable } = (await import('jspdf-autotable')) as any;
    return { jsPDF, autoTable };
  }

  /**
   * Generates the official ARCA A4 PDF Document
   */
  async generateArcaA4Doc(
    invoice: Invoice,
    emitter: ArcaEmitterData,
    items: InvoiceItem[]
  ): Promise<any> {
    const { jsPDF, autoTable } = await this.loadJsPdf();

    // Standard A4: 210mm x 297mm
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = 210;
    const marginLeft = 12; // 12-15mm izquierdo
    const marginRight = 12;
    const marginTop = 10; // 10mm superior
    const contentWidth = pageWidth - marginLeft - marginRight;

    const invoiceType = (invoice.type || 'B') as ArcaInvoiceType;
    const invoiceCode = ARCA_CONSTANTS.INVOICE_CODES[invoiceType] || '006';

    const totals = CalculateArcaTotalsUseCase.execute(
      items,
      {
        type: invoiceType,
        discount: invoice.discount || 0,
        advancePayment: invoice.advance_payment || 0,
      }
    );

    // Generar código QR oficial ARCA RG 4892/2020
    const { dataUrl: qrDataUrl } = await this.qrGenerator.generateFromInvoice(
      invoice,
      emitter
    );

    // ──────────────────────────────────────────────────────────────────────────
    // 1. MARCO EXTERIOR Y HEADER DE ARCA (Letra A / B / C / X central)
    // ──────────────────────────────────────────────────────────────────────────
    doc.setDrawColor(70, 70, 70);
    doc.setLineWidth(0.4);

    // Header box (Top: 10mm, Height: 45mm)
    const headerHeight = 46;
    doc.rect(marginLeft, marginTop, contentWidth, headerHeight);

    // Central letter box (ARCA standard: 14mm width, 14mm height centered at top)
    const boxWidth = 14;
    const boxHeight = 14;
    const boxX = marginLeft + contentWidth / 2 - boxWidth / 2;
    const boxY = marginTop;

    doc.setFillColor(255, 255, 255);
    doc.rect(boxX, boxY, boxWidth, boxHeight, 'FD');

    // Letter inside box
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(20, 20, 20);
    doc.text(invoiceType, boxX + boxWidth / 2, boxY + 9.5, { align: 'center' });

    // Official Code under letter
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.text(`COD. ${invoiceCode}`, boxX + boxWidth / 2, boxY + 13, {
      align: 'center',
    });

    // Divider line below the box
    doc.line(boxX + boxWidth / 2, boxY + boxHeight, boxX + boxWidth / 2, boxY + headerHeight);

    // ──────────────────────────────────────────────────────────────────────────
    // 2. DATOS DEL EMISOR (Lado Izquierdo)
    // ──────────────────────────────────────────────────────────────────────────
    const leftX = marginLeft + 3;
    let currY = marginTop + 7;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(17, 24, 39);
    doc.text(emitter.businessName || 'ARECOFIX', leftX, currY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(75, 85, 99);

    currY += 5;
    doc.text(`Razón Social: ${emitter.businessName || 'Arecofix'}`, leftX, currY);
    currY += 4;
    doc.text(`Domicilio Comercial: ${emitter.commercialAddress || 'Buenos Aires, Argentina'}`, leftX, currY);
    currY += 4;
    doc.text(`Condición frente al IVA: ${emitter.vatCondition || 'IVA Responsable Inscripto'}`, leftX, currY);

    if (emitter.phone || emitter.email) {
      currY += 4;
      doc.text(`Contacto: ${emitter.phone || ''} ${emitter.email ? ' | ' + emitter.email : ''}`, leftX, currY);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 3. DATOS DEL COMPROBANTE Y NÚMEROS FISCALES (Lado Derecho)
    // ──────────────────────────────────────────────────────────────────────────
    const rightX = marginLeft + contentWidth / 2 + 5;
    currY = marginTop + 7;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(17, 24, 39);
    const invoiceTitle = invoiceType === 'X' ? 'COMPROBANTE INTERNO' : `FACTURA "${invoiceType}"`;
    doc.text(invoiceTitle, rightX, currY);

    doc.setFontSize(8);
    currY += 5;
    const formattedNum = this.formatInvoiceNumber(invoice.invoice_number, emitter.pointOfSale);
    doc.text(`Punto de Venta: ${emitter.pointOfSale || '00004'}   Comp. Nro: ${formattedNum}`, rightX, currY);

    currY += 4;
    const issueDate = invoice.issued_at
      ? new Date(invoice.issued_at).toLocaleDateString('es-AR')
      : new Date().toLocaleDateString('es-AR');
    doc.text(`Fecha de Emisión: ${issueDate}`, rightX, currY);

    currY += 4;
    doc.text(`CUIT: ${emitter.cuit || '30-71649281-9'}`, rightX, currY);

    currY += 4;
    doc.text(`Ingresos Brutos: ${emitter.iibb || emitter.cuit || '30-71649281-9'}`, rightX, currY);

    currY += 4;
    doc.text(`Fecha de Inicio de Actividades: ${emitter.activityStartDate || '01/03/2021'}`, rightX, currY);

    // ──────────────────────────────────────────────────────────────────────────
    // 4. DATOS DEL CLIENTE / RECEPTOR (Caja secundaria)
    // ──────────────────────────────────────────────────────────────────────────
    const custBoxY = marginTop + headerHeight + 3;
    const custBoxHeight = 25;
    doc.rect(marginLeft, custBoxY, contentWidth, custBoxHeight);

    doc.setFontSize(8);
    const col1X = marginLeft + 3;
    const col2X = marginLeft + contentWidth / 2 + 3;

    // Fila 1
    let custY = custBoxY + 5;
    doc.setFont('helvetica', 'bold');
    doc.text('Apellido y Nombre / Razón Social:', col1X, custY);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.customer_name || 'Consumidor Final', col1X + 48, custY);

    doc.setFont('helvetica', 'bold');
    doc.text('DNI / CUIT / CUIL:', col2X, custY);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.customer_tax_id || '---', col2X + 30, custY);

    // Fila 2
    custY += 5;
    doc.setFont('helvetica', 'bold');
    doc.text('Condición frente al IVA:', col1X, custY);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.customer_vat_condition || (invoiceType === 'A' ? 'IVA Responsable Inscripto' : 'Consumidor Final'), col1X + 37, custY);

    doc.setFont('helvetica', 'bold');
    doc.text('Domicilio:', col2X, custY);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.customer_address || '---', col2X + 18, custY);

    // Fila 3
    custY += 5;
    doc.setFont('helvetica', 'bold');
    doc.text('Condición de Venta:', col1X, custY);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.sale_condition || 'Contado', col1X + 32, custY);

    doc.setFont('helvetica', 'bold');
    doc.text('Medio de Pago:', col2X, custY);
    doc.setFont('helvetica', 'normal');
    doc.text(this.formatPaymentMethod(invoice.payment_method), col2X + 24, custY);

    // ──────────────────────────────────────────────────────────────────────────
    // 5. TABLA DE ÍTEMS (Clasificados: Mano de obra, Repuestos, Productos, Servicios)
    // ──────────────────────────────────────────────────────────────────────────
    const tableStartY = custBoxY + custBoxHeight + 3;

    const tableBody = items.map((item, idx) => {
      const typeLabel = item.item_type ? ARCA_ITEM_TYPES[item.item_type]?.label || 'General' : 'General';
      const unitPrice = Number(item.unit_price) || 0;
      const qty = Number(item.quantity) || 0;
      const ratePct = ((Number(item.tax_rate) || 0) * 100).toFixed(1) + '%';
      const subtotal = qty * unitPrice;

      return [
        typeLabel,
        item.description || 'Ítem sin descripción',
        qty.toString(),
        `$ ${unitPrice.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`,
        ratePct,
        `$ ${subtotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`,
      ];
    });

    autoTable(doc, {
      startY: tableStartY,
      margin: { left: marginLeft, right: marginRight },
      head: [['Tipo', 'Descripción del Producto o Servicio', 'Cant.', 'Precio Unit.', 'Alíc. IVA', 'Subtotal']],
      body: tableBody,
      theme: 'grid',
      headStyles: {
        fillColor: [243, 244, 246],
        textColor: [31, 41, 55],
        fontSize: 7.5,
        fontStyle: 'bold',
        halign: 'left',
      },
      columnStyles: {
        0: { cellWidth: 26, fontSize: 7, textColor: [75, 85, 99] },
        1: { cellWidth: 'auto', fontSize: 7.5 },
        2: { cellWidth: 14, halign: 'center', fontSize: 7.5 },
        3: { cellWidth: 24, halign: 'right', fontSize: 7.5 },
        4: { cellWidth: 18, halign: 'center', fontSize: 7.5 },
        5: { cellWidth: 26, halign: 'right', fontSize: 7.5, fontStyle: 'bold' },
      },
      styles: {
        cellPadding: 2,
        lineColor: [200, 200, 200],
        lineWidth: 0.2,
      },
    });

    const finalTableY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY : tableStartY + 40;

    // ──────────────────────────────────────────────────────────────────────────
    // 6. APARTADO DE DESGLOSE DE IVA / RÉGIMEN DE TRANSPARENCIA FISCAL
    // ──────────────────────────────────────────────────────────────────────────
    const taxBoxY = finalTableY + 4;
    const taxBoxHeight = 36;
    const taxBoxWidth = contentWidth * 0.58;

    doc.rect(marginLeft, taxBoxY, taxBoxWidth, taxBoxHeight);

    if (invoiceType === 'C' || invoiceType === 'X') {
      // Factura C / X: Monotributo sin IVA
      doc.setFillColor(248, 250, 252);
      doc.rect(marginLeft, taxBoxY, taxBoxWidth, 6, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(30, 41, 59);
      doc.text('RÉGIMEN SIMPLIFICADO PARA PEQUEÑOS CONTRIBUYENTES (MONOTRIBUTO)', marginLeft + 2, taxBoxY + 4.2);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(70, 70, 70);
      doc.text('Operación sin discriminación de IVA conforme a la Ley de Monotributo.', marginLeft + 3, taxBoxY + 13);
      doc.text('Documento no computable para cómputo de crédito fiscal de IVA.', marginLeft + 3, taxBoxY + 19);
    } else if (invoiceType === 'B') {
      // Factura B: Leyenda obligatoria RG 5614/2024 + Transparencia informativa
      doc.setFillColor(248, 250, 252);
      doc.rect(marginLeft, taxBoxY, taxBoxWidth, 6, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(30, 41, 59);
      doc.text('RÉGIMEN DE TRANSPARENCIA FISCAL AL CONSUMIDOR (LEY 27.743 / RG 5614)', marginLeft + 2, taxBoxY + 4.2);

      // Leyenda obligatoria destacada
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text(ARCA_LEGENDS.VAT_INCLUDED_B, marginLeft + 3, taxBoxY + 11);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(70, 70, 70);
      let tRowY = taxBoxY + 17;
      doc.text(`Importe Neto: $ ${totals.totalNet.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`, marginLeft + 3, tRowY);
      doc.text(`IVA Incluido: $ ${totals.totalVat.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`, marginLeft + 55, tRowY);
      tRowY += 5;
      doc.text(`Importe Total: $ ${totals.grandTotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`, marginLeft + 3, tRowY);
    } else {
      // Factura A: IVA discriminado formal
      doc.setFillColor(248, 250, 252);
      doc.rect(marginLeft, taxBoxY, taxBoxWidth, 6, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(30, 41, 59);
      doc.text('DISCRIMINACIÓN DE ALÍCUOTAS DE IVA (FACTURA A)', marginLeft + 2, taxBoxY + 4.2);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(70, 70, 70);

      let tRowY = taxBoxY + 10;
      doc.text(`Neto Gravado 21%: $ ${totals.netAmount21.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`, marginLeft + 3, tRowY);
      doc.text(`IVA 21%: $ ${totals.vatAmount21.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`, marginLeft + 55, tRowY);

      tRowY += 4.5;
      doc.text(`Neto Gravado 10.5%: $ ${totals.netAmount105.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`, marginLeft + 3, tRowY);
      doc.text(`IVA 10.5%: $ ${totals.vatAmount105.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`, marginLeft + 55, tRowY);

      tRowY += 4.5;
      doc.text(`Neto Gravado 27%: $ ${totals.netAmount27.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`, marginLeft + 3, tRowY);
      doc.text(`IVA 27%: $ ${totals.vatAmount27.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`, marginLeft + 55, tRowY);

      tRowY += 4.5;
      doc.text(`Op. Exentas / No Gravadas: $ ${totals.exemptAmount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`, marginLeft + 3, tRowY);

      tRowY += 5;
      doc.setFont('helvetica', 'bold');
      doc.text(`TOTAL IVA DISCRIMINADO: $ ${totals.totalVat.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`, marginLeft + 3, tRowY);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 7. CUADRO DE TOTALES (Lado Derecho)
    // ──────────────────────────────────────────────────────────────────────────
    const totalsBoxX = marginLeft + taxBoxWidth + 3;
    const totalsBoxWidth = contentWidth - taxBoxWidth - 3;
    doc.rect(totalsBoxX, taxBoxY, totalsBoxWidth, taxBoxHeight);

    let totRowY = taxBoxY + 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Subtotal:', totalsBoxX + 3, totRowY);
    doc.text(`$ ${totals.totalNet.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`, totalsBoxX + totalsBoxWidth - 3, totRowY, { align: 'right' });

    if (invoiceType === 'A') {
      totRowY += 5.5;
      doc.text('IVA Total:', totalsBoxX + 3, totRowY);
      doc.text(`$ ${totals.totalVat.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`, totalsBoxX + totalsBoxWidth - 3, totRowY, { align: 'right' });
    }

    if (totals.discount > 0) {
      totRowY += 5.5;
      doc.setTextColor(220, 38, 38);
      doc.text('Descuento:', totalsBoxX + 3, totRowY);
      doc.text(`-$ ${totals.discount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`, totalsBoxX + totalsBoxWidth - 3, totRowY, { align: 'right' });
      doc.setTextColor(70, 70, 70);
    }

    // Barra de Total
    const grandBarY = taxBoxY + taxBoxHeight - 11;
    doc.setFillColor(30, 41, 59);
    doc.rect(totalsBoxX, grandBarY, totalsBoxWidth, 11, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('TOTAL:', totalsBoxX + 3, grandBarY + 7);
    doc.text(`$ ${totals.grandTotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`, totalsBoxX + totalsBoxWidth - 3, grandBarY + 7, { align: 'right' });

    // ──────────────────────────────────────────────────────────────────────────
    // 8. PIE FISCAL ARCA: CÓDIGO QR OBLIGATORIO (RG 4892) Y CAE REAL O PENDIENTE
    // ──────────────────────────────────────────────────────────────────────────
    const footerY = taxBoxY + taxBoxHeight + 4;
    doc.setDrawColor(180, 180, 180);
    doc.line(marginLeft, footerY, marginLeft + contentWidth, footerY);

    // Incrustar QR obligatorio de 30mm x 30mm (RG 4892/2020) en esquina inferior izquierda
    if (qrDataUrl) {
      doc.addImage(qrDataUrl, 'PNG', marginLeft, footerY + 3, 30, 30);
    }

    // Leyendas oficiales ARCA al lado del QR
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text('ARCA', marginLeft + 33, footerY + 8);

    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(ARCA_LEGENDS.AUTHORIZED_VOUCHER, marginLeft + 33, footerY + 12);
    doc.text(ARCA_LEGENDS.VALID_DOCUMENT, marginLeft + 33, footerY + 16);

    // CAE y Vencimiento a la derecha (o advertencia de borrador interno)
    if (invoice.cae) {
      const caeVto = invoice.cae_expires_at
        ? new Date(invoice.cae_expires_at).toLocaleDateString('es-AR')
        : new Date(Date.now() + 10 * 24 * 3600 * 1000).toLocaleDateString('es-AR');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);
      doc.text(`CAE N°: ${invoice.cae}`, marginLeft + contentWidth - 3, footerY + 8, { align: 'right' });
      doc.text(`Fecha de Vto. de CAE: ${caeVto}`, marginLeft + contentWidth - 3, footerY + 13, { align: 'right' });
    } else {
      // Sin CAE real (integración pendiente): NUNCA imprimir CAE ficticio
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(220, 38, 38);
      doc.text(`CAE: ${ARCA_LEGENDS.CAE_PENDING}`, marginLeft + contentWidth - 3, footerY + 8, { align: 'right' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(100, 100, 100);
      doc.text(ARCA_LEGENDS.DRAFT_NO_CAE, marginLeft + 33, footerY + 22);
      doc.text('Documento de control interno no válido como factura fiscal.', marginLeft + contentWidth - 3, footerY + 13, { align: 'right' });
    }

    return doc;
  }

  /**
   * Generates and downloads the PDF directly to user's device
   */
  async downloadPdf(
    invoice: Invoice,
    emitter: ArcaEmitterData,
    items: InvoiceItem[]
  ): Promise<void> {
    try {
      const doc = await this.generateArcaA4Doc(invoice, emitter, items);
      const filename = this.generateFilename(invoice);
      doc.save(filename);
      this.logger.info(`[InvoicePdfExportService] PDF downloaded: ${filename}`);
    } catch (error) {
      this.logger.error('[InvoicePdfExportService] Failed to download PDF', error);
      throw error;
    }
  }

  /**
   * Shares the PDF via Web Share API (mobile), falling back to download if not supported
   */
  async shareOrDownload(
    invoice: Invoice,
    emitter: ArcaEmitterData,
    items: InvoiceItem[]
  ): Promise<{ shared: boolean; downloaded: boolean; error?: string }> {
    try {
      const doc = await this.generateArcaA4Doc(invoice, emitter, items);
      const filename = this.generateFilename(invoice);

      // Check if Web Share API with files is available (Modern Mobile browsers)
      if (typeof navigator !== 'undefined' && 'share' in navigator && 'canShare' in navigator) {
        const pdfBlob = doc.output('blob');
        const file = new File([pdfBlob], filename, { type: 'application/pdf' });

        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `Factura ${invoice.type} #${invoice.invoice_number || 'S/N'}`,
            text: `Comprobante de compra de ${emitter.businessName || 'Arecofix'}`,
            files: [file],
          });
          return { shared: true, downloaded: false };
        }
      }

      // Fallback: download directly
      doc.save(filename);
      return { shared: false, downloaded: true };
    } catch (error: any) {
      // If user cancelled the share modal, don't treat it as an error
      if (error?.name === 'AbortError') {
        return { shared: false, downloaded: false };
      }

      this.logger.warn('[InvoicePdfExportService] Web share failed, attempting download fallback', error);
      try {
        const doc = await this.generateArcaA4Doc(invoice, emitter, items);
        doc.save(this.generateFilename(invoice));
        return { shared: false, downloaded: true };
      } catch (fallbackError) {
        return { shared: false, downloaded: false, error: String(error) };
      }
    }
  }

  private generateFilename(invoice: Invoice): string {
    const type = invoice.type || 'B';
    const num = invoice.invoice_number || 'BORRADOR';
    const client = (invoice.customer_name || 'Consumidor_Final')
      .replace(/[^a-zA-Z0-9]/g, '_')
      .substring(0, 20);
    return `Factura_${type}_${num}_${client}.pdf`;
  }

  private formatInvoiceNumber(num: number | string | undefined, pos: string = '00004'): string {
    if (!num) return '00000001';
    const n = typeof num === 'number' ? num : parseInt(num.toString(), 10) || 1;
    return n.toString().padStart(8, '0');
  }

  private formatPaymentMethod(method?: string): string {
    switch (method) {
      case 'cash':
        return 'Efectivo';
      case 'transfer':
        return 'Transferencia Bancaria';
      case 'debit_card':
        return 'Tarjeta de Débito';
      case 'credit_card':
        return 'Tarjeta de Crédito';
      case 'qr_mercadopago':
        return 'Mercado Pago / QR';
      default:
        return 'Contado';
    }
  }
}
