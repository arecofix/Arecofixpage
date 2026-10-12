import { Injectable } from '@angular/core';
import QRCode from 'qrcode';
import {
  ARCA_DOC_TYPE_CODES,
  ARCA_INVOICE_NUMERIC_CODES,
  ArcaDocType,
  ArcaEmitterData,
  ArcaInvoiceType,
  ArcaQrData,
} from '../../domain/entities/arca.entity';
import { Invoice } from '../../domain/entities/invoice.entity';

@Injectable({
  providedIn: 'root',
})
export class QrGeneratorService {
  /** Base URL oficial del validador de comprobantes ARCA (RG 4892/2020) */
  private readonly ARCA_QR_BASE_URL = 'https://www.arca.gob.ar/fe/qr/?p=';

  /**
   * Genera el payload de datos JSON exigido por RG 4892/2020 a partir de una factura y emisor
   */
  buildQrPayload(invoice: Invoice, emitter: ArcaEmitterData): ArcaQrData {
    const rawDate = invoice.issued_at
      ? new Date(invoice.issued_at).toISOString().substring(0, 10)
      : new Date().toISOString().substring(0, 10);

    const cleanEmitterCuit = Number(
      (emitter.cuit || '30716492819').replace(/\D/g, '')
    ) || 30716492819;

    const ptoVta = Number(
      (emitter.pointOfSale || '00004').toString().replace(/\D/g, '')
    ) || 4;

    const invoiceType = (invoice.type || 'B') as ArcaInvoiceType;
    const tipoCmp = ARCA_INVOICE_NUMERIC_CODES[invoiceType] || 6;

    const rawNum = invoice.invoice_number?.toString().replace(/\D/g, '') || '1';
    const nroCmp = parseInt(rawNum, 10) || 1;

    const importe = Math.round((Number(invoice.total_amount) || 0) * 100) / 100;

    // Tipo de documento del receptor
    const docType = (invoice.customer_doc_type || 'DNI') as ArcaDocType;
    const tipoDocRec = ARCA_DOC_TYPE_CODES[docType] || 96;

    const cleanDoc = invoice.customer_tax_id
      ? Number(invoice.customer_tax_id.replace(/\D/g, ''))
      : undefined;

    const cleanCae = invoice.cae
      ? Number(invoice.cae.toString().replace(/\D/g, ''))
      : null;

    return {
      ver: 1,
      fecha: rawDate,
      cuit: cleanEmitterCuit,
      ptoVta,
      tipoCmp,
      nroCmp,
      importe,
      moneda: 'PES',
      ctz: 1,
      tipoDocRec,
      nroDocRec: cleanDoc && !isNaN(cleanDoc) ? cleanDoc : undefined,
      tipoCodAut: 'E',
      codAut: cleanCae && !isNaN(cleanCae) ? cleanCae : null,
    };
  }

  /**
   * Codifica el objeto JSON en base64 y arma la URL oficial ARCA
   */
  buildQrUrl(qrData: ArcaQrData): string {
    const jsonString = JSON.stringify(qrData);
    const base64 = this.safeBase64Encode(jsonString);
    return `${this.ARCA_QR_BASE_URL}${base64}`;
  }

  /**
   * Genera un Data URL PNG (base64) del código QR para incrustar en HTML o jsPDF
   */
  async generateQrDataUrl(qrData: ArcaQrData): Promise<string> {
    const targetUrl = this.buildQrUrl(qrData);
    return await QRCode.toDataURL(targetUrl, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 200,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });
  }

  /**
   * Helper directo para generar el Data URL a partir de Invoice y Emitter
   */
  async generateFromInvoice(
    invoice: Invoice,
    emitter: ArcaEmitterData
  ): Promise<{ qrUrl: string; dataUrl: string; qrData: ArcaQrData }> {
    const qrData = this.buildQrPayload(invoice, emitter);
    const qrUrl = this.buildQrUrl(qrData);
    const dataUrl = await this.generateQrDataUrl(qrData);
    return { qrUrl, dataUrl, qrData };
  }

  /**
   * Helper directo para obtener el string DataURL del QR
   */
  async generateInvoiceQrDataUrl(
    invoice: Invoice,
    emitter: ArcaEmitterData
  ): Promise<string> {
    const res = await this.generateFromInvoice(invoice, emitter);
    return res.dataUrl;
  }

  /**
   * Codificador base64 seguro compatible con browser y SSR (Node.js)
   */
  private safeBase64Encode(str: string): string {
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(str, 'utf-8').toString('base64');
    }
    if (typeof btoa !== 'undefined') {
      return btoa(unescape(encodeURIComponent(str)));
    }
    return '';
  }
}
