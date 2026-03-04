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
import { InvoiceService } from '@app/features/sales/application/invoice.service';
import { NotificationService } from '@app/core/services/notification.service';
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

  // ── Page State ──────────────────────────────────────────────────────────────
  invoices = signal<Invoice[]>([]);
  loading = signal(true);
  saving = signal(false);

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
    console.log('🚀 AdminInvoicesPage ngOnInit called');
    console.log('📊 Initial isModalOpen state:', this.isModalOpen());
    console.log('📝 Initial form state:', this.form());
    
    await this.loadInvoices();
    
    console.log('✅ AdminInvoicesPage initialized');
  }

  async loadInvoices() {
    this.loading.set(true);
    try {
      this.invoices.set(await this.invoiceService.getAll());
    } catch (e) {
      this.notificationService.showError('Error al cargar comprobantes');
      console.error(e);
    } finally {
      this.loading.set(false);
    }
  }

  // ── Modal Controls ──────────────────────────────────────────────────────────
  openModal() {
    console.log('🚀 openModal() called');
    console.log('📊 Current isModalOpen state:', this.isModalOpen());
    
    this.form.set({
      customerName: '',
      customerEmail: '',
      type: 'B',
      discount: 0,
      notes: '',
      items: [{ ...DEFAULT_ITEM }],
    });
    
    console.log('📝 Form reset completed');
    this.isModalOpen.set(true);
    console.log('✅ isModalOpen set to true:', this.isModalOpen());
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

    this.saving.set(false);

    if (result.error) {
      this.notificationService.showError('Error al generar la factura. Intentá de nuevo.');
      return;
    }

    this.notificationService.showSuccess('✅ Factura manual generada correctamente.');
    this.closeModal();
    await this.loadInvoices(); // Refresh list
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
