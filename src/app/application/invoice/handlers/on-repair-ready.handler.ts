import { Injectable } from '@angular/core';
import { IEventBus } from '@app/domain/events/event-bus.interface';
import { RepairOrderReadyForInvoicingEvent } from '@app/domain/events/repair-order-ready-for-invoicing.event';
import { CreateInvoiceDraftFromRepairOrderUseCase } from '@app/features/sales/domain/usecases/create-invoice-draft-from-repair-order.usecase';
import { RepairOrderReadyForInvoicingPayload } from '@app/features/repairs/domain/events/repair-order-ready-for-invoicing.event';

import { TenantService } from '@app/core/services/tenant.service';

@Injectable({ providedIn: 'root' })
export class OnRepairReadyHandler {
  constructor(
    private readonly createDraft: CreateInvoiceDraftFromRepairOrderUseCase,
    private readonly eventBus: IEventBus,
    private readonly tenantService: TenantService,
  ) {}

  register(): void {
    this.eventBus.subscribe(RepairOrderReadyForInvoicingEvent, (event) => {
      this.handle(event).catch((err) =>
        console.error('[Facturación] Error procesando RepairOrderReady', err),
      );
    });
  }

  async handle(event: RepairOrderReadyForInvoicingEvent): Promise<void> {
    const payload: RepairOrderReadyForInvoicingPayload = {
      tenantId: this.tenantService.getTenantId() || undefined,
      repairOrderId: event.repairOrderId,
      customerSnapshot: {
        name: event.customer.name,
        taxId: event.customer.taxId,
        email: event.customer.email,
        address: event.customer.address,
      },
      itemsSnapshot: event.items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        type: item.itemType === 'labor' ? 'labor' : 'part',
        taxRate: 0.21,
        subtotal: item.quantity * item.unitPrice,
        isLabor: item.itemType === 'labor',
      })),
      totalsSnapshot: {
        technicalLaborCost: 0,
        sparePartsCost: 0,
        surchargePercentage: 0,
        surchargeAmount: event.totals.surcharge,
        depositAmount: event.totals.advancePayment,
        totalAmount: event.totals.total,
        balanceDue: Math.max(0, event.totals.total - event.totals.advancePayment),
      },
      paymentMethod: event.paymentMethod,
      issuedAt: typeof event.issuedAt === 'string' ? event.issuedAt : event.issuedAt.toISOString(),
    };

    await this.createDraft.execute(payload);
  }
}
