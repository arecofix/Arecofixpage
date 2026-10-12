import {
  Component,
  inject,
  OnInit,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { TranslationService } from '@app/core/services/translation.service';
import { InvoiceService } from '@app/features/sales/application/invoice.service';
import { NotificationService } from '@app/core/services/notification.service';
import { LoggerService } from '@app/core/services/logger.service';
import {
  Invoice,
  CreateInvoiceDto,
} from '@app/features/sales/domain/entities/invoice.entity';
import { InvoicePdfExportService } from '@app/features/sales/application/services/invoice-pdf-export.service';
import { CompanyService } from '@app/core/services/company.service';
import { InvoiceFormModalComponent } from './components/invoice-form-modal/invoice-form-modal.component';
import { ArcaEmitterData } from '@app/features/sales/domain/entities/arca.entity';

@Component({
  selector: 'app-admin-invoices-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, InvoiceFormModalComponent],
  templateUrl: './admin-invoices-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminInvoicesPage implements OnInit {
  public t = inject(TranslationService).t;
  private invoiceService = inject(InvoiceService);
  private pdfExportService = inject(InvoicePdfExportService);
  private companyService = inject(CompanyService);
  private notificationService = inject(NotificationService);
  private logger = inject(LoggerService);

  // ── Page State ──────────────────────────────────────────────────────────────
  invoices = signal<Invoice[]>([]);
  loading = signal(true);
  saving = signal(false);

  // ── Pagination & Search State ───────────────────────────────────────────────
  searchTerm = signal('');
  pageOffset = signal(0);
  pageSize = signal(20);
  hasMore = signal(true);
  loadingMore = signal(false);
  private search$ = new Subject<string>();

  // ── Modal State ─────────────────────────────────────────────────────────────
  isModalOpen = signal(false);

  // ── Lifecycle ───────────────────────────────────────────────────────────────
  async ngOnInit() {
    this.search$
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((term) => {
        this.searchTerm.set(term);
        this.loadInvoices();
      });

    await this.loadInvoices();
  }

  async loadInvoices(append = false) {
    if (append) {
      this.loadingMore.set(true);
    } else {
      this.loading.set(true);
      this.pageOffset.set(0);
      this.hasMore.set(true);
    }

    try {
      const data = await this.invoiceService.getAll(
        this.pageSize(),
        this.pageOffset(),
        this.searchTerm()
      );

      if (append) {
        this.invoices.set([...this.invoices(), ...data]);
      } else {
        this.invoices.set(data);
      }

      this.hasMore.set(data.length === this.pageSize());
    } catch (e) {
      this.notificationService.showError('Error al cargar comprobantes');
      this.logger.error('Failed to load invoices', e);
    } finally {
      this.loading.set(false);
      this.loadingMore.set(false);
    }
  }

  loadMore() {
    if (this.loading() || this.loadingMore() || !this.hasMore()) return;
    this.pageOffset.update((v) => v + this.pageSize());
    this.loadInvoices(true);
  }

  onSearch(term: string) {
    this.search$.next(term);
  }

  // ── Modal Controls ──────────────────────────────────────────────────────────
  openModal() {
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  async onInvoiceCreated(dto: CreateInvoiceDto) {
    this.saving.set(true);
    try {
      const res = await this.invoiceService.generateInvoice(dto);
      if (res.error) {
        this.notificationService.showError(
          'Error al emitir factura: ' + (res.error.message || 'Desconocido')
        );
        return;
      }
      this.notificationService.showSuccess('✅ Factura emitida con éxito conforme ARCA.');
      this.closeModal();
      await this.loadInvoices();
    } catch (e) {
      this.logger.error('Error in onInvoiceCreated', e);
      this.notificationService.showError('No se pudo generar la factura.');
    } finally {
      this.saving.set(false);
    }
  }

  // ── PDF & Sharing Actions ───────────────────────────────────────────────────
  async downloadInvoicePdf(invoice: Invoice, event?: Event) {
    if (event) event.stopPropagation();
    try {
      this.notificationService.showInfo('Generando PDF oficial A4...');
      const { items } = await this.invoiceService.getInvoiceWithDetails(invoice.id);
      const emitter = await this.getEmitterData();
      await this.pdfExportService.downloadPdf(invoice, emitter, items);
      this.notificationService.showSuccess('Factura descargada en formato A4.');
    } catch (e) {
      this.logger.error('Failed to download invoice PDF', e);
      this.notificationService.showError('Error al generar PDF de la factura.');
    }
  }

  async shareInvoice(invoice: Invoice, event?: Event) {
    if (event) event.stopPropagation();
    try {
      const { items } = await this.invoiceService.getInvoiceWithDetails(invoice.id);
      const emitter = await this.getEmitterData();
      const res = await this.pdfExportService.shareOrDownload(invoice, emitter, items);

      if (res.shared) {
        this.notificationService.showSuccess('Comprobante compartido correctamente.');
      } else if (res.downloaded) {
        this.notificationService.showSuccess('Comprobante descargado.');
      }
    } catch (e) {
      this.logger.error('Failed to share invoice', e);
      this.notificationService.showError('No se pudo compartir el comprobante.');
    }
  }

  private async getEmitterData(): Promise<ArcaEmitterData> {
    const company = await this.companyService.getSettings();
    return {
      businessName: company?.name || 'ARECOFIX SERVICIOS INTEGRALES',
      cuit: company?.tax_id || '30-71649281-9',
      commercialAddress: company?.address || company?.location || 'Buenos Aires, Argentina',
      vatCondition: (company as any)?.vat_condition || 'IVA Responsable Inscripto',
      iibb: (company as any)?.iibb || company?.tax_id || '30-71649281-9',
      activityStartDate: (company as any)?.activity_start_date || '01/03/2021',
      pointOfSale: (company as any)?.point_of_sale || '00004',
      phone: company?.phone || '',
      email: company?.email || '',
      logoUrl: company?.logo_url || '',
    };
  }
}
