import { inject, Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '@app/core/services/auth.service';
import { TenantService } from '@app/core/services/tenant.service';
import { LoggerService } from '@app/core/services/logger.service';
import {
  CreateInvoiceDto,
  Invoice,
  InvoiceItem,
  InvoiceResult,
} from '@app/features/sales/domain/entities/invoice.entity';

/**
 * InvoiceService — Application Layer (Use Case)
 *
 * Centralizes ALL invoice generation logic regardless of origin:
 *   - Automatic: triggered by checkout() or order completion
 *   - Manual: triggered by the admin "Crear Factura Manual" flow
 *
 * Clean Architecture rule: controllers (components) MUST NOT call
 * Supabase directly for invoice creation. They call this service.
 */
@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private auth = inject(AuthService);
  private tenantService = inject(TenantService);
  private logger = inject(LoggerService);

  // ─── Public Use Cases ──────────────────────────────────────────────────────

  /**
   * UC-01: Generate Invoice
   *
   * Core business logic, shared between automatic and manual flows.
   * - Validates that no duplicate exists for the given order_id
   * - Calculates totals using the canonical formula
   * - Persists to Supabase and returns the created invoice
   *
   * @param dto - The invoice data (origin distinguishes auto vs manual)
   */
  async generateInvoice(dto: CreateInvoiceDto): Promise<InvoiceResult> {
    const supabase = this.auth.getSupabaseClient();
    const tenantId = this.tenantService.getTenantId();

    try {
      // ── Duplicate Guard ────────────────────────────────────────────────────
      // Only check for duplicates when the invoice is tied to an order/sale.
      // Manual invoices (no order_id) are always allowed.
      if (dto.order_id) {
        const { data: existing } = await supabase
          .from('invoices')
          .select('id')
          .eq('tenant_id', tenantId)
          .eq('order_id', dto.order_id)
          .maybeSingle();

        if (existing) {
          this.logger.warn(`[InvoiceService] Duplicate invoice blocked for order ${dto.order_id}`);
          return { data: existing as unknown as Invoice, error: null, duplicate: true };
        }
      }

      // ── Canonical Total Calculation ────────────────────────────────────────
      // Single source of truth for all totals — same formula for auto & manual.
      const verifiedTotals = this.calculateTotals(dto.items ?? [], dto.discount ?? 0);

      // For DTOs without items (legacy checkout path), trust the provided totals.
      const finalSubtotal = dto.items?.length ? verifiedTotals.subtotal : dto.subtotal;
      const finalTax     = dto.items?.length ? verifiedTotals.taxAmount : dto.tax_amount;
      const finalTotal   = dto.items?.length ? verifiedTotals.total     : dto.total_amount;

      // ── Persist ────────────────────────────────────────────────────────────
      const payload = {
        tenant_id:       tenantId,
        order_id:        dto.order_id       ?? null,
        sale_id:         dto.sale_id        ?? null,
        repair_id:       null,                          // repuestos: no aplica en este flujo
        customer_id:     dto.customer_id    ?? null,
        customer_name:   dto.customer_name  ?? 'Consumidor Final',
        customer_email:  dto.customer_email ?? null,
        // invoice_number: auto-asignado por trigger trg_set_invoice_number
        type:            dto.type,
        origin:          dto.origin,
        // subtotal: columna nueva (post-migración)
        subtotal:        finalSubtotal,
        // net_amount: columna legacy — mismo valor que subtotal
        net_amount:      finalSubtotal,
        tax_amount:      finalTax,
        discount:        dto.discount ?? 0,
        total_amount:    finalTotal,
        items:           dto.items ?? [],
        notes:           dto.notes ?? null,
        issued_at:       dto.issued_at ?? new Date().toISOString(),
        pdf_url:         null,
        deleted_at:      null,
      };

      const { data, error } = await supabase
        .from('invoices')
        .insert(payload)
        .select()
        .single();

      if (error) throw error;

      this.logger.info(`[InvoiceService] Invoice generated: ${data.id} (origin: ${dto.origin})`);
      return { data: data as Invoice, error: null, duplicate: false };

    } catch (err: any) {
      this.logger.error('[InvoiceService] generateInvoice failed', err);
      return { data: null, error: err, duplicate: false };
    }
  }

  /**
   * UC-02: List Invoices
   * Returns all invoices for the current tenant, ordered by date descending.
   */
  async getAll(): Promise<Invoice[]> {
    const supabase = this.auth.getSupabaseClient();
    const tenantId = this.tenantService.getTenantId();

    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('issued_at', { ascending: false });

    if (error) {
      this.logger.error('[InvoiceService] getAll failed', error);
      return [];
    }
    return (data ?? []) as Invoice[];
  }

  /**
   * UC-03: Get Invoice by ID
   */
  async getById(id: string): Promise<Invoice | null> {
    const supabase = this.auth.getSupabaseClient();
    const tenantId = this.tenantService.getTenantId();

    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .maybeSingle();

    if (error || !data) return null;
    return data as Invoice;
  }

  // ─── Domain Utilities (Pure Functions) ─────────────────────────────────────

  /**
   * Canonical total calculation — SINGLE SOURCE OF TRUTH.
   * Used by both automatic checkout and manual invoice form.
   *
   * @param items    - Line items with individual tax_rate per item
   * @param discount - Flat discount amount applied after subtotal
   */
  calculateTotals(
    items: Pick<import('@app/features/sales/domain/entities/invoice.entity').InvoiceItem, 'quantity' | 'unit_price' | 'tax_rate'>[],
    discount: number = 0
  ): { subtotal: number; taxAmount: number; total: number } {
    const subtotal = items.reduce(
      (acc, item) => acc + item.quantity * item.unit_price,
      0
    );

    const taxAmount = items.reduce(
      (acc, item) => acc + item.quantity * item.unit_price * item.tax_rate,
      0
    );

    const total = Math.max(0, subtotal + taxAmount - discount);

    return {
      subtotal: +subtotal.toFixed(2),
      taxAmount: +taxAmount.toFixed(2),
      total: +total.toFixed(2),
    };
  }

  /**
   * Builds an InvoiceItem from basic inputs (unit_price already includes tax for
   * the "Excento / IVA incluido" model; set tax_rate to 0 in that case).
   */
  buildItem(
    description: string,
    quantity: number,
    unitPrice: number,
    taxRate: number = 0.21
  ): InvoiceItem {
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
