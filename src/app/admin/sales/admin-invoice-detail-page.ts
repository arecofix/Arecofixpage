import {
  Component,
  inject,
  OnInit,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslationService } from '@app/core/services/translation.service';
import {
  CompanyService,
  CompanySettings,
} from '@app/core/services/company.service';
import { InvoiceService } from '@app/features/sales/application/invoice.service';
import {
  Invoice,
  InvoiceItem,
} from '@app/features/sales/domain/entities/invoice.entity';
import { InvoicePdfExportService } from '@app/features/sales/application/services/invoice-pdf-export.service';
import { QrGeneratorService } from '@app/features/sales/application/services/qr-generator.service';
import { NotificationService } from '@app/core/services/notification.service';
import {
  ARCA_ITEM_TYPES,
  ArcaEmitterData,
  ArcaItemType,
  ArcaVatCondition,
} from '@app/features/sales/domain/entities/arca.entity';
import { CalculateArcaTotalsUseCase } from '@app/features/sales/domain/usecases/calculate-arca-totals.usecase';
import { ValidateArcaInvoiceUseCase } from '@app/features/sales/domain/usecases/validate-arca-invoice.usecase';
import { InvoiceDraftBannerComponent } from './components/invoice-draft-banner/invoice-draft-banner.component';

@Component({
  selector: 'app-admin-invoice-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink, InvoiceDraftBannerComponent],
  templateUrl: './admin-invoice-detail-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      /* Configuración global de impresión A4 conforme a Ley 27.743 y RG 4892 */
      @page {
        size: A4;
        margin: 10mm 12mm;
      }

      @media print {
        body {
          visibility: hidden !important;
          background: #ffffff !important;
          color: #000000 !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        .no-print,
        header,
        aside,
        nav,
        button,
        .toolbar,
        .drawer-side,
        .navbar,
        .tab-bar-container {
          display: none !important;
          visibility: hidden !important;
        }

        /* Contenedor oficial de la factura para evitar hoja en blanco y solapamientos */
        .factura-container {
          visibility: visible !important;
          position: relative !important;
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          background: #ffffff !important;
          color: #000000 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          box-shadow: none !important;
          border: none !important;
        }

        .factura-container * {
          visibility: visible !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        /* En impresión A4 forzar siempre 2 columnas para el encabezado y datos de emisor */
        .grid.grid-cols-1.md\:grid-cols-2 {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          gap: 6mm !important;
        }

        .qr-container {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        .section-divider {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        .no-break {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        /* Modo Ticket Térmico 80mm */
        body.print-pos-mode .factura-container,
        body.print-pos-mode .print-container {
          display: none !important;
          visibility: hidden !important;
        }

        body.print-pos-mode #pos-ticket-print {
          visibility: visible !important;
          display: block !important;
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 80mm !important;
          margin: 0 auto !important;
          font-family: 'Courier New', Courier, monospace !important;
        }

        body.print-pos-mode #pos-ticket-print * {
          visibility: visible !important;
        }
      }

      /* Reglas estrictas de layout de comprobante ARCA */
      .section-divider {
        border-bottom: 1px solid #ccc;
        padding: 4mm;
      }
      .section-title {
        font-weight: 700;
        font-size: 11pt;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .data-text {
        font-size: 9.5pt;
        line-height: 1.4;
      }
      .data-row {
        margin-bottom: 2mm;
      }
      .last-data-row {
        margin-bottom: 4mm;
      }
      .totals-text {
        font-size: 13pt;
        font-weight: 700;
      }
      .letter-box {
        width: 1cm;
        height: 1cm;
        min-width: 1cm;
        min-height: 1cm;
        border: 1px solid #000;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-weight: 700;
        font-size: 16pt;
        line-height: 1;
        background-color: #ffffff;
        color: #000000;
      }
      .code-badge {
        padding: 2mm;
        display: inline-block;
        font-size: 9pt;
        font-weight: 600;
      }
    `,
  ],
})
export class AdminInvoiceDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private companyService = inject(CompanyService);
  private invoiceService = inject(InvoiceService);
  private pdfExportService = inject(InvoicePdfExportService);
  private qrGenerator = inject(QrGeneratorService);
  private notificationService = inject(NotificationService);
  public t = inject(TranslationService).t;

  invoice = signal<Invoice | null>(null);
  items = signal<InvoiceItem[]>([]);
  company = signal<CompanySettings | null>(null);
  loading = signal(true);
  sharing = signal(false);
  error = signal('');
  qrCodeDataUrl = signal<string>('');

  /** Controls print rendering mode: 'a4' for full invoice, 'pos' for 80mm ticket */
  printMode = signal<'a4' | 'pos'>('a4');

  /** Desglose de IVA en tiempo real conforme a Ley 27.743 y RG 5614/2024 */
  taxBreakdown = computed(() => {
    const currentItems = this.items();
    const inv = this.invoice();
    return CalculateArcaTotalsUseCase.execute(
      currentItems,
      inv?.discount || 0,
      inv?.type || 'B',
      inv?.surcharge || 0,
      inv?.advance_payment || 0
    );
  });

  emitterVatCondition = computed(() => {
    return this.getEmitterData().vatCondition;
  });

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    try {
      // Fetch company settings
      const companyData = await this.companyService.getSettings();
      if (companyData) {
        this.company.set(companyData);
      }

      if (id) {
        const result = await this.invoiceService.getInvoiceWithDetails(id);
        if (result.invoice) {
          this.invoice.set(result.invoice);
          this.items.set(result.items);
          // Generate official ARCA QR code (RG 4892/2020)
          try {
            const qrUrl = await this.qrGenerator.generateInvoiceQrDataUrl(
              result.invoice,
              this.getEmitterData()
            );
            this.qrCodeDataUrl.set(qrUrl);
          } catch (qrErr) {
            console.warn('[AdminInvoiceDetailPage] Failed to generate QR', qrErr);
          }
        } else {
          this.error.set('Factura no encontrada');
        }
      }
    } catch (e: unknown) {
      console.error('Error loading invoice:', e);
      const errorMessage =
        e instanceof Error ? e.message : 'Error al cargar la factura';
      this.error.set(errorMessage);
    } finally {
      this.loading.set(false);
    }
  }

  /** Print in A4 mode (browser native print dialog with corrected CSS) */
  print() {
    this.printMode.set('a4');
    document.body.classList.remove('print-pos-mode');
    setTimeout(() => window.print(), 100);
  }

  /** Print in 80mm POS ticket format */
  printTicketPOS() {
    this.printMode.set('pos');
    document.body.classList.add('print-pos-mode');
    setTimeout(() => {
      window.print();
      // Reset after print dialog closes
      setTimeout(() => {
        document.body.classList.remove('print-pos-mode');
        this.printMode.set('a4');
      }, 1000);
    }, 150);
  }

  /** Export to official ARCA A4 PDF */
  async downloadPdf() {
    const inv = this.invoice();
    if (!inv) return;

    try {
      this.notificationService.showInfo('Generando PDF oficial...');
      const emitter = this.getEmitterData();
      await this.pdfExportService.downloadPdf(inv, emitter, this.items());
      this.notificationService.showSuccess('Factura A4 descargada correctamente.');
    } catch (e) {
      console.error('Error exporting PDF', e);
      this.notificationService.showError('No se pudo generar el archivo PDF.');
    }
  }

  /** Share via Web Share API or download fallback */
  async share() {
    const inv = this.invoice();
    if (!inv) return;

    this.sharing.set(true);
    try {
      const emitter = this.getEmitterData();
      const res = await this.pdfExportService.shareOrDownload(inv, emitter, this.items());
      if (res.shared) {
        this.notificationService.showSuccess('Comprobante compartido con éxito.');
      } else if (res.downloaded) {
        this.notificationService.showSuccess('Comprobante descargado en tu dispositivo.');
      }
    } catch (e) {
      console.error('Error sharing invoice', e);
      this.notificationService.showError('Ocurrió un error al compartir la factura.');
    } finally {
      this.sharing.set(false);
    }
  }

  getItemTypeLabel(type?: string): string {
    if (!type) return 'Producto';
    const mapped = ARCA_ITEM_TYPES[type as ArcaItemType]?.label;
    if (mapped) return mapped;
    if (type.toLowerCase().includes('labor') || type.toLowerCase().includes('obra')) return 'Mano de obra';
    if (type.toLowerCase().includes('part') || type.toLowerCase().includes('repuesto')) return 'Repuesto';
    if (type.toLowerCase().includes('serv')) return 'Servicio';
    return 'Producto';
  }

  formatPaymentMethod(method?: string): string {
    switch (method) {
      case 'cash': return 'Efectivo';
      case 'transfer': return 'Transferencia Bancaria';
      case 'debit_card': return 'Tarjeta de Débito';
      case 'credit_card': return 'Tarjeta de Crédito';
      case 'qr_mercadopago': return 'Mercado Pago / QR';
      default: return 'Contado';
    }
  }

  confirming = signal(false);

  /**
   * Confirma el borrador de factura aplicando reglas fiscales ARCA y validación de umbrales
   */
  async handleConfirmDraft(): Promise<void> {
    const inv = this.invoice();
    if (!inv) return;

    const emitter = this.getEmitterData();
    const isMonotributo =
      emitter.vatCondition.toLowerCase().includes('monotributo') ||
      emitter.vatCondition.toLowerCase() === 'monotributista';

    // Regla: Si el emisor es Monotributista, mostrar advertencia
    if (isMonotributo) {
      this.notificationService.showInfo(
        'Como Monotributista, solo podés emitir Factura C. El IVA no se discrimina.'
      );
    }

    // Regla: Aplicar validaciones de umbrales ARCA ($208.644 / $417.288) al confirmar
    const validation = ValidateArcaInvoiceUseCase.execute({
      type: inv.type,
      customer: {
        docType: (inv.customer_doc_type as any) || 'DNI',
        docNumber: inv.customer_tax_id || '',
        name: inv.customer_name || '',
        address: inv.customer_address || '',
        vatCondition: (inv.customer_vat_condition as any) || 'Consumidor Final',
      },
      items: this.items().map((it) => ({
        description: it.description,
        quantity: it.quantity,
        unit_price: it.unit_price,
        tax_rate: it.tax_rate,
      })),
      paymentMethod: (inv.payment_method as any) || 'cash',
      grandTotal: inv.total_amount,
      emitterVatCondition: emitter.vatCondition,
    });

    if (!validation.isValid) {
      this.notificationService.showError(
        validation.errors[0] || 'Comprobante no cumple con la normativa ARCA'
      );
      return;
    }

    this.confirming.set(true);
    try {
      await this.invoiceService.confirmDraft(inv.id);
      this.notificationService.showSuccess('Borrador de factura confirmado exitosamente.');

      // Recargar detalles actualizados
      const updated = await this.invoiceService.getInvoiceWithDetails(inv.id);
      if (updated.invoice) {
        this.invoice.set(updated.invoice);
        this.items.set(updated.items);
      }
    } catch (e: unknown) {
      console.error('Error confirming invoice draft:', e);
      const msg = e instanceof Error ? e.message : 'Error al confirmar la factura';
      this.notificationService.showError(msg);
    } finally {
      this.confirming.set(false);
    }
  }

  formatPtoVta(val?: string | number): string {
    const num = parseInt(String(val || 1), 10);
    return isNaN(num) ? '00001' : String(num).padStart(5, '0');
  }

  formatCompNro(val?: string | number): string {
    const num = parseInt(String(val || 1), 10);
    return isNaN(num) ? '00000001' : String(num).padStart(8, '0');
  }

  getTypeCode(type?: string): string {
    switch (type) {
      case 'A': return '001';
      case 'B': return '006';
      case 'C': return '011';
      case 'X': return '099';
      default: return '006';
    }
  }

  getEmitterData(): ArcaEmitterData {
    const c = this.company();
    return {
      businessName: c?.name || 'Arecofix',
      cuit: c?.tax_id || '20438529161',
      commercialAddress: c?.address || c?.location || 'Jorge Newbery 69, Buenos Aires',
      vatCondition: (c?.vat_condition as ArcaVatCondition) || 'IVA Responsable Inscripto',
      iibb: c?.iibb || c?.tax_id || '20438529161',
      activityStartDate: c?.activity_start_date || '01/03/2021',
      pointOfSale: c?.point_of_sale ? String(c.point_of_sale) : '00004',
      phone: c?.phone || '1125960900',
      email: c?.email || 'ezequielneryo15@gmail.com',
      logoUrl: c?.logo_url || '',
    };
  }
}
