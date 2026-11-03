import {
  Component,
  Input,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminRepairService } from '@app/features/repairs/application/services/admin-repair.service';
import { NotificationService } from '@app/core/services/notification.service';

@Component({
  selector: 'app-generate-invoice-button',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      (click)="generateInvoiceDraft()"
      [disabled]="disabled || loading()"
      class="btn btn-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-none shadow-md shadow-emerald-500/20 rounded-lg flex items-center gap-1.5 transition-all transform active:scale-95 disabled:opacity-50"
      [attr.aria-label]="'Generar borrador de factura para orden ' + (trackingCode || repairId)"
      id="btn-generar-factura-draft"
    >
      @if (loading()) {
        <span class="loading loading-spinner loading-xs"></span>
        <span class="text-xs font-semibold">Generando...</span>
      } @else {
        <i class="fas fa-file-invoice text-xs"></i>
        <span class="text-xs font-semibold">Generar Factura</span>
      }
    </button>
  `,
})
export class GenerateInvoiceButtonComponent {
  @Input({ required: true }) repairId!: string;
  @Input() trackingCode?: string;
  @Input() disabled: boolean = false;

  private adminRepairService = inject(AdminRepairService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  loading = signal(false);

  async generateInvoiceDraft(): Promise<void> {
    if (!this.repairId || this.loading()) return;

    this.loading.set(true);
    try {
      await this.adminRepairService.triggerInvoicingDraft(this.repairId);
      this.notificationService.showSuccess(
        `Borrador de factura generado para orden #${this.trackingCode || this.repairId.substring(0, 8)}. Redirigiendo a Facturación...`
      );

      // Brief delay so operator sees feedback before navigating to billing drafts
      setTimeout(() => {
        this.router.navigate(['/admin/sales/invoices'], {
          queryParams: { status: 'draft' },
        });
      }, 700);
    } catch (err: unknown) {
      console.error('[GenerateInvoiceButton] Error creating invoice draft:', err);
      const msg = err instanceof Error ? err.message : 'Error al generar el borrador de factura';
      this.notificationService.showError(msg);
    } finally {
      this.loading.set(false);
    }
  }
}
