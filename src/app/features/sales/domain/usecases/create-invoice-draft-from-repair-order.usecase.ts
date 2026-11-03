import { Invoice, InvoiceStatus } from '../entities/invoice.entity';
import { InvoiceRepository } from '../repositories/invoice.repository';
import {
  RepairOrderReadyForInvoicingPayload,
  RepairOrderCancelledPayload,
  RepairOrderRolledBackPayload,
} from '@app/features/repairs/domain/events/repair-order-ready-for-invoicing.event';
import { RepairOrderToInvoiceMapper } from '../../application/mappers/repair-order-to-invoice.mapper';
import { ArcaEmitterData } from '../entities/arca.entity';

export interface CreateInvoiceDraftResult {
  readonly invoice: Invoice;
  readonly isNew: boolean;
  readonly updated: boolean;
  readonly unchanged: boolean;
}

export interface VoidInvoiceDraftResult {
  readonly voided: boolean;
  readonly invoiceId?: string;
  readonly previousStatus?: InvoiceStatus;
}

export interface StaleInvoiceDraftResult {
  readonly stale: boolean;
  readonly invoiceId?: string;
}

/**
 * Use Case: CreateInvoiceDraftFromRepairOrderUseCase
 * Orchestrates the creation, recalculation, and lifecycle management of invoice drafts
 * from repair order events in an idempotent and decoupled manner.
 * 
 * Clean Architecture & DDD:
 * - Depends only on abstractions (InvoiceRepository) (DIP)
 * - Single Responsibility: Only orchestrates draft lifecycle from domain events (SRP)
 * - Idempotent: Never duplicates invoices on repeated event delivery
 */
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CreateInvoiceDraftFromRepairOrderUseCase {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  /**
   * Processes the RepairOrderReadyForInvoicing event payload.
   * - If no invoice exists: creates a new invoice draft with status 'draft'.
   * - If an existing invoice is in 'draft' or 'stale' or 'pending_review': updates it with refreshed items and totals.
   * - If existing invoice is 'confirmed' or 'issued': leaves it untouched (idempotency & immutability).
   */
  async execute(
    payload: RepairOrderReadyForInvoicingPayload,
    emitter?: ArcaEmitterData | null
  ): Promise<CreateInvoiceDraftResult> {
    const tenantId = payload.tenantId || '';
    const repairOrderId = payload.repairOrderId;

    if (!repairOrderId) {
      throw new Error('El payload de reparación carece de repairOrderId.');
    }

    // 1. Check for existing invoice linked to this repair order
    const existing = await this.invoiceRepository.getByRepairId(repairOrderId, tenantId);

    // 2. Map snapshot to invoice draft DTO via Anti-Corruption Layer
    const mappedDto = RepairOrderToInvoiceMapper.map(payload, emitter);

    // 3. Case: Invoice already exists
    if (existing) {
      const currentStatus = existing.status || 'draft';

      // If already confirmed or issued, do NOT overwrite (immutability)
      if (currentStatus === 'confirmed' || currentStatus === 'issued') {
        return {
          invoice: existing,
          isNew: false,
          updated: false,
          unchanged: true,
        };
      }

      // If draft, stale, or pending_review: recalculate and update
      const updatePayload: Partial<Invoice> = {
        subtotal: mappedDto.subtotal,
        tax_amount: mappedDto.tax_amount,
        total_amount: mappedDto.total_amount,
        advance_payment: mappedDto.advance_payment,
        balance_due: mappedDto.balance_due,
        items: mappedDto.items,
        notes: mappedDto.notes,
        internal_notes: mappedDto.internal_notes,
        payment_method: mappedDto.payment_method,
        type: mappedDto.type,
        customer_name: mappedDto.customer_name,
        customer_tax_id: mappedDto.customer_tax_id,
        customer_email: mappedDto.customer_email,
        customer_address: mappedDto.customer_address,
        customer_doc_type: mappedDto.customer_doc_type,
        customer_vat_condition: mappedDto.customer_vat_condition,
        repair_id: mappedDto.repair_id,
        repair_order_id: mappedDto.repair_order_id,
        repair_order_number: mappedDto.repair_order_number,
        status: 'draft', // Reset stale status back to fresh draft
      };

      const updateResult = await this.invoiceRepository.update(existing.id, updatePayload);
      const updatedInvoice = updateResult.data || { ...existing, ...updatePayload };

      return {
        invoice: updatedInvoice,
        isNew: false,
        updated: true,
        unchanged: false,
      };
    }

    // 4. Case: No invoice exists -> create new draft
    const createResult = await this.invoiceRepository.create({
      ...mappedDto,
      status: 'draft',
      tenant_id: tenantId,
    });

    if (createResult.error || !createResult.data) {
      throw new Error(
        `Fallo al crear el borrador de factura: ${JSON.stringify(createResult.error)}`
      );
    }

    return {
      invoice: createResult.data,
      isNew: true,
      updated: false,
      unchanged: false,
    };
  }

  /**
   * Handles cancellation of a repair order.
   * If an active draft exists, it marks it as 'voided'.
   */
  async handleOrderCancelled(
    payload: RepairOrderCancelledPayload
  ): Promise<VoidInvoiceDraftResult> {
    const tenantId = payload.tenantId || '';
    const existing = await this.invoiceRepository.getByRepairId(payload.repairOrderId, tenantId);

    if (!existing) {
      return { voided: false };
    }

    const currentStatus = existing.status || 'draft';
    // Only void drafts or pending review invoices; do not void already issued ARCA invoices without credit note
    if (currentStatus === 'draft' || currentStatus === 'pending_review' || currentStatus === 'stale') {
      await this.invoiceRepository.update(existing.id, {
        status: 'voided',
        internal_notes: `${existing.internal_notes || ''} | Anulado automáticamente por cancelación de orden #${payload.repairOrderId}`,
      });

      return {
        voided: true,
        invoiceId: existing.id,
        previousStatus: currentStatus,
      };
    }

    return {
      voided: false,
      invoiceId: existing.id,
      previousStatus: currentStatus,
    };
  }

  /**
   * Handles rolling back a repair order from READY_FOR_PICKUP to an earlier status.
   * Marks draft as 'stale' so operator knows it requires recalculation on next transition.
   */
  async handleOrderRolledBack(
    payload: RepairOrderRolledBackPayload
  ): Promise<StaleInvoiceDraftResult> {
    const tenantId = payload.tenantId || '';
    const existing = await this.invoiceRepository.getByRepairId(payload.repairOrderId, tenantId);

    if (!existing) {
      return { stale: false };
    }

    const currentStatus = existing.status || 'draft';
    if (currentStatus === 'draft' || currentStatus === 'pending_review') {
      await this.invoiceRepository.update(existing.id, {
        status: 'stale',
      });

      return {
        stale: true,
        invoiceId: existing.id,
      };
    }

    return {
      stale: false,
      invoiceId: existing.id,
    };
  }
}
