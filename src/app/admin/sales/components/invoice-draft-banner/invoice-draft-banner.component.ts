import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Invoice } from '@app/features/sales/domain/entities/invoice.entity';

@Component({
  selector: 'app-invoice-draft-banner',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './invoice-draft-banner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceDraftBannerComponent {
  @Input() invoice: Invoice | null = null;
  @Input() emitterVatCondition?: string;
  @Input() confirming: boolean = false;
  @Output() confirmRequested = new EventEmitter<void>();

  isDraftOrFromRepair = computed(() => {
    if (!this.invoice) return false;
    const s = this.invoice.status;
    return s === 'draft' || s === 'pending_review' || s === 'stale' || s === 'voided' || !!this.invoice.repair_id;
  });

  repairOrderNumber = computed(() => {
    return this.invoice?.repair_order_number || this.invoice?.repair_id?.substring(0, 8);
  });

  statusLabel = computed(() => {
    switch (this.invoice?.status) {
      case 'draft':
        return 'Borrador';
      case 'stale':
        return 'Desactualizado';
      case 'pending_review':
        return 'En Revisión';
      case 'confirmed':
        return 'Confirmada';
      case 'voided':
        return 'Anulada';
      case 'issued':
        return 'Emitida';
      default:
        return 'Borrador';
    }
  });

  hasAdvancePayment = computed(() => {
    return (this.invoice?.advance_payment ?? 0) > 0;
  });

  advancePayment = computed(() => {
    return this.invoice?.advance_payment ?? 0;
  });

  balanceDue = computed(() => {
    if (this.invoice?.balance_due !== undefined) return this.invoice.balance_due;
    const total = this.invoice?.total_amount ?? 0;
    const advance = this.invoice?.advance_payment ?? 0;
    return Math.max(0, total - advance);
  });

  isMonotributista = computed(() => {
    const vat = (this.emitterVatCondition || '').toLowerCase();
    return vat.includes('monotributo') || vat.includes('monotributista');
  });

  canConfirm = computed(() => {
    const s = this.invoice?.status;
    return s === 'draft' || s === 'pending_review' || s === 'stale';
  });

  onConfirm(): void {
    this.confirmRequested.emit();
  }
}
