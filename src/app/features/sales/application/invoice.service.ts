import { inject, Injectable } from '@angular/core';
import { LoggerService } from '@app/core/services/logger.service';
import { TenantService } from '@app/core/services/tenant.service';
import {
  CreateInvoiceDto,
  Invoice,
  InvoiceItem,
  InvoiceResult,
  InvoiceStatus,
} from '@app/features/sales/domain/entities/invoice.entity';
import { InvoiceRepository } from '../domain/repositories/invoice.repository';
import { InvoicesStore } from './services/invoices.store';
import { firstValueFrom } from 'rxjs';
import { CalculateArcaTotalsUseCase } from '../domain/usecases/calculate-arca-totals.usecase';
import { ValidateArcaInvoiceUseCase } from '../domain/usecases/validate-arca-invoice.usecase';
import { IEventBus } from '@app/core/events/event-bus.interface';
import {
  REPAIR_ORDER_READY_FOR_INVOICING,
  REPAIR_ORDER_CANCELLED,
  REPAIR_ORDER_ROLLED_BACK,
  RepairOrderReadyForInvoicingPayload,
  RepairOrderCancelledPayload,
  RepairOrderRolledBackPayload,
} from '@app/features/repairs/domain/events/repair-order-ready-for-invoicing.event';
import { CreateInvoiceDraftFromRepairOrderUseCase } from '../domain/usecases/create-invoice-draft-from-repair-order.usecase';
import { CompanyService, CompanySettings } from '@app/core/services/company.service';
import { ArcaEmitterData } from '../domain/entities/arca.entity';

/**
 * InvoiceService — Application Layer (Use Case & Event Handler)
 *
 * Centralizes ALL invoice generation logic regardless of origin,
 * and orchestrates ARCA draft creation via domain events.
 */
@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private tenantService = inject(TenantService);
  private logger = inject(LoggerService);
  private repository = inject(InvoiceRepository);
  private invoicesStore = inject(InvoicesStore);
  private eventBus = inject(IEventBus);
  private companyService = inject(CompanyService);

  private createDraftUseCase = new CreateInvoiceDraftFromRepairOrderUseCase(this.repository);

  constructor() {
    this.initEventListeners();
  }

  /**
   * Initializes decoupled domain event listeners
   */
  private initEventListeners(): void {
    // 1. Repair order ready for pickup -> generate or update draft
    this.eventBus
      .on<RepairOrderReadyForInvoicingPayload>(REPAIR_ORDER_READY_FOR_INVOICING)
      .subscribe(async (event) => {
        try {
          this.logger.info(
            `[InvoiceService] Handling RepairOrderReadyForInvoicing event for order #${event.payload.repairOrderId}`
          );
          await this.createDraftFromRepairOrder(event.payload);
        } catch (err) {
          this.logger.error(
            `[InvoiceService] Failed to process ${REPAIR_ORDER_READY_FOR_INVOICING}:`,
            err
          );
        }
      });

    // 2. Repair order cancelled -> void associated draft
    this.eventBus
      .on<RepairOrderCancelledPayload>(REPAIR_ORDER_CANCELLED)
      .subscribe(async (event) => {
        try {
          this.logger.info(
            `[InvoiceService] Handling RepairOrderCancelled event for order #${event.payload.repairOrderId}`
          );
          await this.createDraftUseCase.handleOrderCancelled(event.payload);
          this.invoicesStore.clearCache();
        } catch (err) {
          this.logger.error(
            `[InvoiceService] Failed to process ${REPAIR_ORDER_CANCELLED}:`,
            err
          );
        }
      });

    // 3. Repair order rolled back -> mark associated draft as stale
    this.eventBus
      .on<RepairOrderRolledBackPayload>(REPAIR_ORDER_ROLLED_BACK)
      .subscribe(async (event) => {
        try {
          this.logger.info(
            `[InvoiceService] Handling RepairOrderRolledBack event for order #${event.payload.repairOrderId}`
          );
          await this.createDraftUseCase.handleOrderRolledBack(event.payload);
          this.invoicesStore.clearCache();
        } catch (err) {
          this.logger.error(
            `[InvoiceService] Failed to process ${REPAIR_ORDER_ROLLED_BACK}:`,
            err
          );
        }
      });
  }

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
      const payload: Record<string, unknown> = {
        tenant_id:        tenantId,
        order_id:         dto.order_id       ?? null,
        repair_id:        dto.repair_id      ?? null,
        repair_order_id:  dto.repair_order_id ?? dto.repair_id ?? null,
        repair_order_number: dto.repair_order_number ?? null,
        customer_id:      dto.customer_id    ?? null,
        customer_name:    dto.customer_name  ?? 'Consumidor Final',
        customer_email:   dto.customer_email ?? null,
        customer_tax_id:  dto.customer_tax_id ?? null,
        customer_doc_type: dto.customer_doc_type ?? null,
        customer_vat_condition: dto.customer_vat_condition ?? null,
        customer_address: dto.customer_address ?? null,
        type:             dto.type,
        origin:           dto.origin,
        status:           dto.status ?? 'issued',
        subtotal:         finalSubtotal,
        net_amount:       finalSubtotal,
        tax_amount:       finalTax,
        discount:         dto.discount ?? 0,
        total_amount:     finalTotal,
        advance_payment:  dto.advance_payment ?? 0,
        balance_due:      dto.balance_due ?? finalTotal,
        items:            dto.items ?? [],
        notes:            dto.notes ?? null,
        internal_notes:   dto.internal_notes ?? null,
        payment_method:   dto.payment_method ?? null,
        sale_condition:   dto.sale_condition ?? 'contado',
        issued_at:        dto.issued_at ?? new Date().toISOString(),
      };

      const result = await this.repository.create(payload);
      if (result.error) throw result.error;

      // Invalidate cache on new invoice creation
      this.invoicesStore.clearCache();

      this.logger.info(`[InvoiceService] Invoice generated: ${result.data?.id} (origin: ${dto.origin})`);
      return { data: result.data, error: null, duplicate: false };

    } catch (err: unknown) {
      this.logger.error('[InvoiceService] generateInvoice failed', err);
      return { data: null, error: err instanceof Error ? err : new Error(String(err)), duplicate: false };
    }
  }

  /**
   * UC: Create or Update Invoice Draft from Repair Order Domain Event
   */
  async createDraftFromRepairOrder(
    payload: RepairOrderReadyForInvoicingPayload
  ): Promise<Invoice> {
    const companySettings = await this.companyService.getSettings();
    const emitterData = companySettings ? this.mapSettingsToEmitter(companySettings) : null;

    const result = await this.createDraftUseCase.execute(payload, emitterData);
    this.invoicesStore.clearCache();

    this.logger.info(
      `[InvoiceService] Draft from repair #${payload.repairOrderId}: isNew=${result.isNew}, updated=${result.updated}, unchanged=${result.unchanged}`
    );

    return result.invoice;
  }

  /**
   * UC: Get count of pending drafts ('draft' or 'pending_review')
   */
  async getDraftCount(): Promise<number> {
    const tenantId = this.tenantService.getTenantId();
    return this.repository.getDraftCount(tenantId);
  }

  /**
   * UC: Update draft contents (prices, items, notes, status)
   */
  async updateDraft(id: string, partial: Partial<Invoice>): Promise<{ data: Invoice | null; error: unknown }> {
    const result = await this.repository.update(id, partial);
    this.invoicesStore.clearCache();
    return result;
  }

  /**
   * UC: Confirm invoice draft to 'confirmed'
   */
  async confirmDraft(id: string): Promise<{ data: Invoice | null; error: unknown }> {
    const result = await this.repository.update(id, {
      status: 'confirmed',
    });
    this.invoicesStore.clearCache();
    return result;
  }

  /**
   * UC-02: List Invoices
   */
  async getAll(
    limit: number = 20,
    offset: number = 0,
    searchTerm?: string,
    status?: InvoiceStatus
  ): Promise<Invoice[]> {
    const tenantId = this.tenantService.getTenantId();
    try {
      if (status) {
        return await this.repository.getAll({
          limit,
          offset,
          tenantId,
          searchTerm,
          status,
        });
      }
      return await firstValueFrom(
        this.invoicesStore.getInvoicesList({ limit, offset, tenantId, searchTerm })
      );
    } catch (error) {
      this.logger.error('[InvoiceService] getAll failed', error);
      return [];
    }
  }

  async getInvoicesCount(searchTerm?: string, status?: InvoiceStatus): Promise<number> {
    const tenantId = this.tenantService.getTenantId();
    try {
      return await this.repository.getCount({ tenantId, searchTerm, status });
    } catch (error) {
      return 0;
    }
  }

  async getById(id: string): Promise<Invoice | null> {
    const tenantId = this.tenantService.getTenantId();
    try {
      return await firstValueFrom(this.invoicesStore.getInvoiceDetail(id, tenantId));
    } catch (error) {
      return null;
    }
  }

  /**
   * UC-04: Get Invoice With Details
   */
  async getInvoiceWithDetails(id: string): Promise<{ invoice: Invoice | null; items: InvoiceItem[] }> {
    const invoice = await this.getById(id);
    if (!invoice) return { invoice: null, items: [] };

    const tenantId = this.tenantService.getTenantId();
    let items: InvoiceItem[] = [];

    try {
      const referenceId = invoice.order_id ?? invoice.repair_id ?? invoice.repair_order_id;
      if (referenceId) {
        items = (await this.repository.getLineItems({
          origin: invoice.origin,
          referenceId,
          tenantId,
          embeddedItems: invoice.items,
        })) as InvoiceItem[];
      } else {
        items = invoice.items ?? [];
      }
    } catch (error) {
      this.logger.error('Error fetching invoice items', error);
    }

    return { invoice, items };
  }

  // ─── Domain Utilities (Pure Functions / ARCA Standards) ────────────────────

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

  calculateArcaTotals(
    items: Array<Pick<InvoiceItem, 'quantity' | 'unit_price' | 'tax_rate'>>,
    discount: number = 0
  ) {
    return CalculateArcaTotalsUseCase.execute(items, discount);
  }

  validateArca(params: Parameters<typeof ValidateArcaInvoiceUseCase.execute>[0]) {
    return ValidateArcaInvoiceUseCase.execute(params);
  }

  buildItem(
    description: string,
    quantity: number,
    unitPrice: number,
    taxRate: number = 0.21,
    itemType: any = 'product',
    productId?: string
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
      item_type:  itemType,
      product_id: productId,
    };
  }

  private mapSettingsToEmitter(c: CompanySettings): ArcaEmitterData {
    return {
      businessName: c.name || 'ARECOFIX SERVICIOS INTEGRALES',
      cuit: c.tax_id || '30-71649281-9',
      commercialAddress: c.address || c.location || 'Buenos Aires, Argentina',
      vatCondition: (c as any).vat_condition || 'IVA Responsable Inscripto',
      iibb: (c as any).iibb || c.tax_id || '30-71649281-9',
      activityStartDate: (c as any).activity_start_date || '01/03/2021',
      pointOfSale: (c as any).point_of_sale || '00004',
      phone: c.phone || '',
      email: c.email || '',
      logoUrl: c.logo_url || '',
    };
  }
}
