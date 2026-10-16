import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { TranslationService } from '@app/core/services/translation.service';
import { InvoiceService } from '@app/features/sales/application/invoice.service';
import { NotificationService } from '@app/core/services/notification.service';
import { LoggerService } from '@app/core/services/logger.service';
import {
  Invoice,
  CreateInvoiceDto,
  InvoiceStatus,
} from '@app/features/sales/domain/entities/invoice.entity';
import { InvoicePdfExportService } from '@app/features/sales/application/services/invoice-pdf-export.service';
import { CompanyService } from '@app/core/services/company.service';
import { InvoiceFormModalComponent } from './components/invoice-form-modal/invoice-form-modal.component';
import { ArcaEmitterData } from '@app/features/sales/domain/entities/arca.entity';
import { AdminLayout } from '@app/admin/layout/admin-layout';

@Component({
  selector: 'app-admin-invoices-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, InvoiceFormModalComponent],
  templateUrl: './admin-invoices-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminInvoicesPage implements OnInit, OnDestroy {
  public t = inject(TranslationService).t;
  private invoiceService = inject(InvoiceService);
  private pdfExportService = inject(InvoicePdfExportService);
  private companyService = inject(CompanyService);
  private notificationService = inject(NotificationService);
  private logger = inject(LoggerService);
  private route = inject(ActivatedRoute);
  private adminLayout = inject(AdminLayout, { optional: true });
  private wasMenuOpenBeforeModal = false;

  // ── Page State ──────────────────────────────────────────────────────────────
  invoices = signal<Invoice[]>([]);
  loading = signal(true);
  saving = signal(false);

  // ── Draft Counter & Filter State ────────────────────────────────────────────
  pendingDraftCount = signal<number>(0);
  selectedStatusFilter = signal<'all' | 'draft' | 'issued'>('all');

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
    const queryStatus = this.route.snapshot.queryParams['status'];
    if (queryStatus === 'draft') {
      this.selectedStatusFilter.set('draft');
    }

    this.search$
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((term) => {
        this.searchTerm.set(term);
        this.loadInvoices();
      });

    await Promise.all([this.loadInvoices(), this.loadDraftCount()]);
  }

  async loadDraftCount() {
    try {
      const count = await this.invoiceService.getDraftCount();
      this.pendingDraftCount.set(count);
    } catch (e) {
      this.logger.error('Failed to load draft count', e);
    }
  }

  setStatusFilter(filter: 'all' | 'draft' | 'issued') {
    this.selectedStatusFilter.set(filter);
    this.loadInvoices();
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
      const filter = this.selectedStatusFilter();
      const statusParam: InvoiceStatus | undefined =
        filter === 'draft' ? 'draft' : filter === 'issued' ? 'issued' : undefined;

      const data = await this.invoiceService.getAll(
        this.pageSize(),
        this.pageOffset(),
        this.searchTerm(),
        statusParam
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
    if (this.adminLayout) {
      this.wasMenuOpenBeforeModal = this.adminLayout.isMainMenuOpen();
      this.adminLayout.isMainMenuOpen.set(false);
    }
    if (typeof document !== 'undefined') {
      const drawerCheckbox = document.getElementById('admin-drawer') as HTMLInputElement | null;
      if (drawerCheckbox?.checked) {
        drawerCheckbox.checked = false;
      }
    }
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    if (this.adminLayout && this.wasMenuOpenBeforeModal) {
      this.adminLayout.isMainMenuOpen.set(true);
    }
  }

  ngOnDestroy() {
    this.search$.complete();
    if (this.adminLayout && this.wasMenuOpenBeforeModal && this.isModalOpen()) {
      this.adminLayout.isMainMenuOpen.set(true);
    }
  }

  async onInvoiceCreated(dto: CreateInvoiceDto) {
    await this.handleSaveInvoice(dto);
  }

  async handleSaveInvoice(dto: CreateInvoiceDto) {
    this.saving.set(true);
    try {
      const result = await this.invoiceService.generateInvoice(dto);
      if (result.duplicate) {
        this.notificationService.showInfo('Comprobante duplicado omitido');
      } else if (result.error) {
        this.notificationService.showError('Error al guardar comprobante');
      } else {
        this.notificationService.showSuccess('Comprobante generado con éxito');
        this.closeModal();
        await Promise.all([this.loadInvoices(), this.loadDraftCount()]);
      }
    } catch (e) {
      this.notificationService.showError('Error al crear la factura');
      this.logger.error('Error saving invoice', e);
    } finally {
      this.saving.set(false);
    }
  }

  async downloadInvoicePdf(invoice: Invoice, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    await this.handleDownloadPdf(invoice);
  }

  async shareInvoice(invoice: Invoice, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    try {
      this.notificationService.showInfo('Generando comprobante para compartir...');
      const emitter = await this.getEmitterData();
      const details = await this.invoiceService.getInvoiceWithDetails(invoice.id);
      const res = await this.pdfExportService.shareOrDownload(invoice, emitter, details.items);
      if (res.shared) {
        this.notificationService.showSuccess('Comprobante compartido con éxito.');
      } else if (res.downloaded) {
        this.notificationService.showSuccess('Comprobante descargado en tu dispositivo.');
      }
    } catch (e) {
      this.logger.error('Error sharing invoice', e);
      this.notificationService.showError('No se pudo compartir la factura.');
    }
  }

  async handleDownloadPdf(invoice: Invoice) {
    try {
      this.notificationService.showInfo('Generando PDF oficial...');
      const emitter = await this.getEmitterData();
      const details = await this.invoiceService.getInvoiceWithDetails(invoice.id);
      await this.pdfExportService.downloadPdf(invoice, emitter, details.items);
      this.notificationService.showSuccess('PDF descargado con éxito.');
    } catch (e) {
      this.logger.error('PDF download failed', e);
      this.notificationService.showError('No se pudo generar el PDF.');
    }
  }

  private async getEmitterData(): Promise<ArcaEmitterData> {
    const c = await this.companyService.getSettings();
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
