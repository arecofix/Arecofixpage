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
import { NotificationService } from '@app/core/services/notification.service';
import {
  ARCA_ITEM_TYPES,
  ArcaEmitterData,
  ArcaItemType,
} from '@app/features/sales/domain/entities/arca.entity';
import { CalculateArcaTotalsUseCase } from '@app/features/sales/domain/usecases/calculate-arca-totals.usecase';

@Component({
  selector: 'app-admin-invoice-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-invoice-detail-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      /* Configuración global de impresión A4 conforme a Ley 27.743 y ARCA */
      @page {
        size: A4;
        margin: 10mm;
      }

      @media print {
        /* Ocultar elementos de UI no imprimibles */
        .no-print,
        header,
        aside,
        nav,
        .drawer-side,
        .navbar,
        .tab-bar-container {
          display: none !important;
          visibility: hidden !important;
        }

        body {
          visibility: hidden !important;
          background: #ffffff !important;
          color: #000000 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        /* Contenedor oficial de la factura para evitar hoja en blanco */
        .factura-container,
        .print-container {
          visibility: visible !important;
          display: block !important;
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          background: #ffffff !important;
          color: #000000 !important;
          box-shadow: none !important;
          border: none !important;
        }

        .factura-container *,
        .print-container * {
          visibility: visible !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
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
    `,
  ],
})
export class AdminInvoiceDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private companyService = inject(CompanyService);
  private invoiceService = inject(InvoiceService);
  private pdfExportService = inject(InvoicePdfExportService);
  private notificationService = inject(NotificationService);
  public t = inject(TranslationService).t;

  invoice = signal<Invoice | null>(null);
  items = signal<InvoiceItem[]>([]);
  company = signal<CompanySettings | null>(null);
  loading = signal(true);
  sharing = signal(false);
  error = signal('');

  /** Controls print rendering mode: 'a4' for full invoice, 'pos' for 80mm ticket */
  printMode = signal<'a4' | 'pos'>('a4');

  /** Desglose de IVA en tiempo real conforme a Ley 27.743 y RG 5614/2024 */
  taxBreakdown = computed(() => {
    const currentItems = this.items();
    const inv = this.invoice();
    return CalculateArcaTotalsUseCase.execute(currentItems, inv?.discount || 0);
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
    if (!type) return 'General';
    return ARCA_ITEM_TYPES[type as ArcaItemType]?.label || type;
  }

  private getEmitterData(): ArcaEmitterData {
    const c = this.company();
    return {
      businessName: c?.name || 'ARECOFIX SERVICIOS INTEGRALES',
      cuit: c?.tax_id || '30-71649281-9',
      commercialAddress: c?.address || c?.location || 'Buenos Aires, Argentina',
      vatCondition: (c as any)?.vat_condition || 'IVA Responsable Inscripto',
      iibb: (c as any)?.iibb || c?.tax_id || '30-71649281-9',
      activityStartDate: (c as any)?.activity_start_date || '01/03/2021',
      pointOfSale: (c as any)?.point_of_sale || '00004',
      phone: c?.phone || '',
      email: c?.email || '',
      logoUrl: c?.logo_url || '',
    };
  }
}
