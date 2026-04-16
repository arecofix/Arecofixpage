import { inject, Injectable } from '@angular/core';
import { LoggerService } from '@app/core/services/logger.service';
import { TenantService } from '@app/core/services/tenant.service';
import {
  CreateInvoiceDto,
  Invoice,
  InvoiceItem,
  InvoiceResult,
} from '@app/features/sales/domain/entities/invoice.entity';
import { InvoiceRepository } from '../domain/repositories/invoice.repository';

/**
 * InvoiceService — Application Layer (Use Case)
 *
 * Centralizes ALL invoice generation logic regardless of origin.
 */
@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private tenantService = inject(TenantService);
  private logger = inject(LoggerService);
  private repository = inject(InvoiceRepository);

  /**
   * UC-01: Generate Invoice
   */
  async generateInvoice(dto: CreateInvoiceDto): Promise<InvoiceResult> {
    const tenantId = this.tenantService.getTenantId();

    try {
      // ── Duplicate Guard ────────────────────────────────────────────────────
      if (dto.order_id) {
        const existing = await this.repository.getByOrderId(dto.order_id, tenantId);
        if (existing) {
          this.logger.warn(`[InvoiceService] Duplicate invoice blocked for order ${dto.order_id}`);
          return { data: existing, error: null, duplicate: true };
        }
      }

      // ── Canonical Total Calculation ────────────────────────────────────────
      const verifiedTotals = this.calculateTotals(dto.items ?? [], dto.discount ?? 0);

      const finalSubtotal = dto.items?.length ? verifiedTotals.subtotal : dto.subtotal;
      const finalTax     = dto.items?.length ? verifiedTotals.taxAmount : dto.tax_amount;
      const finalTotal   = dto.items?.length ? verifiedTotals.total     : dto.total_amount;

      // ── Persist ────────────────────────────────────────────────────────────
      const payload = {
        tenant_id:       tenantId,
        order_id:        dto.order_id       ?? null,
        sale_id:         dto.sale_id        ?? null,
        repair_id:       dto.repair_id      ?? null,
        customer_id:     dto.customer_id    ?? null,
        customer_name:   dto.customer_name  ?? 'Consumidor Final',
        customer_email:  dto.customer_email ?? null,
        type:            dto.type,
        origin:          dto.origin,
        subtotal:        finalSubtotal,
        net_amount:      finalSubtotal,
        tax_amount:      finalTax,
        discount:        dto.discount ?? 0,
        total_amount:    finalTotal,
        items:           dto.items ?? [],
        notes:           dto.notes ?? null,
        issued_at:       dto.issued_at ?? new Date().toISOString(),
      };

      const result = await this.repository.create(payload);
      if (result.error) throw result.error;

      this.logger.info(`[InvoiceService] Invoice generated: ${result.data?.id} (origin: ${dto.origin})`);
      return { data: result.data, error: null, duplicate: false };

    } catch (err: any) {
      this.logger.error('[InvoiceService] generateInvoice failed', err);
      return { data: null, error: err, duplicate: false };
    }
  }

  /**
   * UC-02: List Invoices
   */
  async getAll(limit: number = 20, offset: number = 0, searchTerm?: string): Promise<Invoice[]> {
    const tenantId = this.tenantService.getTenantId();
    try {
        return await this.repository.getAll({ limit, offset, tenantId, searchTerm });
    } catch (error) {
        this.logger.error('[InvoiceService] getAll failed', error);
        return [];
    }
  }

  async getInvoicesCount(searchTerm?: string): Promise<number> {
    const tenantId = this.tenantService.getTenantId();
    try {
        return await this.repository.getCount({ tenantId, searchTerm });
    } catch (error) {
        return 0;
    }
  }

  async getById(id: string): Promise<Invoice | null> {
    const tenantId = this.tenantService.getTenantId();
    try {
        return await this.repository.getById(id, tenantId);
    } catch (error) {
        return null;
    }
  }

  /**
   * UC-04: Get Invoice With Details
   */
  async getInvoiceWithDetails(id: string): Promise<{ invoice: Invoice | null, items: any[] }> {
    const invoice = await this.getById(id);
    if (!invoice) return { invoice: null, items: [] };

    const tenantId = this.tenantService.getTenantId();
    let items: any[] = [];

    try {
        if (invoice.sale_id) {
            items = await this.repository.getRelatedItems({ type: 'sale', id: invoice.sale_id, tenantId });
        } else if (invoice.order_id) {
            items = await this.repository.getRelatedItems({ type: 'order', id: invoice.order_id, tenantId });
        } else {
            items = (invoice as any).items || [];
        }
    } catch (error) {
        this.logger.error('Error fetching invoice items', error);
    }

    return { invoice, items };
  }

  // ─── Domain Utilities (Pure Functions) ─────────────────────────────────────

  calculateTotals(
    items: Pick<InvoiceItem, 'quantity' | 'unit_price' | 'tax_rate'>[],
    discount: number = 0
  ): { subtotal: number; taxAmount: number; total: number } {
    const subtotal = items.reduce((acc, item) => acc + item.quantity * item.unit_price, 0);
    const taxAmount = items.reduce((acc, item) => acc + item.quantity * item.unit_price * item.tax_rate, 0);
    const total = Math.max(0, subtotal + taxAmount - discount);

    return {
      subtotal: +subtotal.toFixed(2),
      taxAmount: +taxAmount.toFixed(2),
      total: +total.toFixed(2),
    };
  }

  buildItem(description: string, quantity: number, unitPrice: number, taxRate: number = 0.21): InvoiceItem {
    const subtotal = quantity * unitPrice;
    const total    = subtotal * (1 + taxRate);
    return {
      description,
      quantity,
      unit_price: unitPrice,
      tax_rate:   taxRate,
      subtotal:   +subtotal.toFixed(2),
      total:      +total.toFixed(2),
    };
  }
}
