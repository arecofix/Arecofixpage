import {
  Component,
  inject,
  OnInit,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { InvoiceService } from '@app/features/sales/application/invoice.service';
import { NotificationService } from '@app/core/services/notification.service';
import { LoggerService } from '@app/core/services/logger.service';
import {
  Invoice,
  InvoiceItem,
  InvoiceType,
} from '@app/features/sales/domain/entities/invoice.entity';

/** Reactive form model for the manual invoice modal */
interface ManualInvoiceForm {
  customerName: string;
  customerEmail: string;
  type: InvoiceType;
  discount: number;
  notes: string;
  items: ManualItemRow[];
}

interface ManualItemRow {
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number; // 0 = exento, 0.105 = 10.5%, 0.21 = 21%
}

const DEFAULT_ITEM: ManualItemRow = {
  description: '',
  quantity: 1,
  unit_price: 0,
  tax_rate: 0.21,
};

@Component({
  selector: 'app-admin-invoices-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-invoices-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminInvoicesPage implements OnInit {
  private invoiceService = inject(InvoiceService);
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
  form = signal<ManualInvoiceForm>({
    customerName: '',
    customerEmail: '',
    type: 'B',
    discount: 0,
    notes: '',
    items: [{ ...DEFAULT_ITEM }],
  });

  // ── Computed Totals (live preview in the modal) ─────────────────────────────
  formTotals = computed(() => {
    const f = this.form();
    return this.invoiceService.calculateTotals(f.items, f.discount);
  });

  // ── Lifecycle ───────────────────────────────────────────────────────────────
  async ngOnInit() {
    this.search$.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(term => {
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
    this.pageOffset.update(v => v + this.pageSize());
    this.loadInvoices(true);
  }

  onSearch(term: string) {
    this.search$.next(term);
  }

  // ── Modal Controls ──────────────────────────────────────────────────────────
  openModal() {
    this.form.set({
      customerName: '',
      customerEmail: '',
      type: 'B',
      discount: 0,
      notes: '',
      items: [{ ...DEFAULT_ITEM }],
    });
    
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  // ── Line Item Helpers ───────────────────────────────────────────────────────
  addItem() {
    this.form.update(f => ({
      ...f,
      items: [...f.items, { ...DEFAULT_ITEM }],
    }));
  }

  removeItem(index: number) {
    this.form.update(f => ({
      ...f,
      items: f.items.filter((_, i) => i !== index),
    }));
  }

  updateItem(index: number, field: keyof ManualItemRow, value: any) {
    this.form.update(f => {
      const items = f.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
      return { ...f, items };
    });
  }

  updateField<K extends keyof ManualInvoiceForm>(key: K, value: ManualInvoiceForm[K]) {
    this.form.update(f => ({ ...f, [key]: value }));
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  async submitManualInvoice() {
    const f = this.form();

    if (f.items.length === 0) {
      this.notificationService.showWarning('Agregá al menos un ítem a la factura.');
      return;
    }

    const hasEmptyDesc = f.items.some(i => !i.description.trim());
    if (hasEmptyDesc) {
      this.notificationService.showWarning('Completá la descripción de todos los ítems.');
      return;
    }

    this.saving.set(true);
    this.logger.debug('Starting manual invoice generation', f);

    try {
      // Build InvoiceItems using the service helper (single formula)
      const items: InvoiceItem[] = f.items.map(row =>
        this.invoiceService.buildItem(
          row.description,
          row.quantity,
          row.unit_price,
          row.tax_rate
        )
      );

      const { subtotal, taxAmount, total } = this.invoiceService.calculateTotals(
        f.items,
        f.discount
      );

      this.logger.debug('Calculated totals', { subtotal, taxAmount, total });

      const result = await this.invoiceService.generateInvoice({
        customer_name:  f.customerName || 'Consumidor Final',
        customer_email: f.customerEmail || undefined,
        type:           f.type,
        origin:         'manual',
        subtotal,
        tax_amount:     taxAmount,
        discount:       f.discount,
        total_amount:   total,
        items,
        notes:          f.notes || undefined,
      });

      this.logger.debug('GenerateInvoice result', result);

      if (result.error) {
        this.logger.warn('Service returned error', result.error);
        this.notificationService.showError('Error al generar la factura: ' + (result.error.message || 'Error desconocido'));
        return;
      }

      this.notificationService.showSuccess('✅ Factura manual generada correctamente.');
      this.closeModal();
      await this.loadInvoices(); // Refresh list
    } catch (error: any) {
      this.logger.error('Catastrophic error in submitManualInvoice', error);
      this.notificationService.showError('Ocurrió un error inesperado al procesar la factura.');
    } finally {
      this.saving.set(false);
    }
  }

  /** Track function for @for loops */
  trackByIndex = (i: number) => i;

  /** Tax rate display labels */
  taxLabels: Record<number, string> = {
    0:     'Exento (0%)',
    0.105: 'IVA 10.5%',
    0.21:  'IVA 21%',
  };
}
