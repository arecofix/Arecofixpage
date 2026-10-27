import { DomainEvent } from '@app/core/events/domain-event.interface';

/**
 * Immutable Customer Snapshot captured at the time of invoicing
 */
export interface RepairOrderCustomerSnapshot {
  readonly customerId?: string;
  readonly name: string;
  readonly taxId?: string; // DNI / CUIT / CUIL
  readonly email?: string;
  readonly phone?: string;
  readonly address?: string;
  readonly vatCondition?: string;
}

/**
 * Immutable Item Snapshot for labor or parts
 */
export interface RepairOrderItemSnapshot {
  readonly id?: string;
  readonly productId?: string;
  readonly type: 'labor' | 'part' | 'service';
  readonly description: string;
  readonly quantity: number;
  readonly unitPrice: number;
  readonly taxRate: number; // e.g. 0.21 or 0
  readonly subtotal: number;
  readonly isLabor?: boolean;
}

/**
 * Immutable Totals Snapshot including adjustments and advances
 */
export interface RepairOrderTotalsSnapshot {
  readonly technicalLaborCost: number;
  readonly sparePartsCost: number;
  readonly surchargePercentage: number;
  readonly surchargeAmount: number;
  readonly depositAmount: number; // Seña / anticipo pagado
  readonly totalAmount: number; // Subtotal + Surcharge + IVA
  readonly balanceDue: number; // Saldo a cobrar = totalAmount - depositAmount
}

/**
 * Payload for RepairOrderReadyForInvoicing event
 */
export interface RepairOrderReadyForInvoicingPayload {
  readonly repairOrderId: string;
  readonly trackingCode?: string;
  readonly customerSnapshot: RepairOrderCustomerSnapshot;
  readonly itemsSnapshot: readonly RepairOrderItemSnapshot[];
  readonly totalsSnapshot: RepairOrderTotalsSnapshot;
  readonly issuedAt: string;
  readonly warranty?: string;
  readonly paymentMethod?: string;
  readonly notes?: string;
  readonly technicalReport?: string;
  readonly tenantId?: string;
}

export const REPAIR_ORDER_READY_FOR_INVOICING = 'RepairOrderReadyForInvoicing';

/**
 * Domain Event emitted exclusively when a repair order transitions to LISTO_PARA_ENTREGAR (5)
 * or when the operator explicitly clicks "Generar Factura".
 */
export class RepairOrderReadyForInvoicingEvent implements DomainEvent<RepairOrderReadyForInvoicingPayload> {
  readonly eventName = REPAIR_ORDER_READY_FOR_INVOICING;
  readonly occurredAt: string;

  constructor(public readonly payload: RepairOrderReadyForInvoicingPayload) {
    this.occurredAt = payload.issuedAt || new Date().toISOString();
  }
}

/**
 * Payload for RepairOrderCancelled event
 */
export interface RepairOrderCancelledPayload {
  readonly repairOrderId: string;
  readonly cancelledAt: string;
  readonly reason?: string;
  readonly tenantId?: string;
}

export const REPAIR_ORDER_CANCELLED = 'RepairOrderCancelled';

export class RepairOrderCancelledEvent implements DomainEvent<RepairOrderCancelledPayload> {
  readonly eventName = REPAIR_ORDER_CANCELLED;
  readonly occurredAt: string;

  constructor(public readonly payload: RepairOrderCancelledPayload) {
    this.occurredAt = payload.cancelledAt || new Date().toISOString();
  }
}

/**
 * Payload for RepairOrderRolledBack event (moved backward from READY_FOR_PICKUP)
 */
export interface RepairOrderRolledBackPayload {
  readonly repairOrderId: string;
  readonly previousStatusId: number;
  readonly newStatusId: number;
  readonly rolledBackAt: string;
  readonly tenantId?: string;
}

export const REPAIR_ORDER_ROLLED_BACK = 'RepairOrderRolledBack';

export class RepairOrderRolledBackEvent implements DomainEvent<RepairOrderRolledBackPayload> {
  readonly eventName = REPAIR_ORDER_ROLLED_BACK;
  readonly occurredAt: string;

  constructor(public readonly payload: RepairOrderRolledBackPayload) {
    this.occurredAt = payload.rolledBackAt || new Date().toISOString();
  }
}
