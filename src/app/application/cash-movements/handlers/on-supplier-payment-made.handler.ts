import { Injectable } from '@angular/core';
import { IEventBus } from '@app/domain/events/event-bus.interface';
import { SupplierPaymentMadeEvent } from '@app/domain/events/supplier-payment-made.event';
import { CashMovementRepository } from '@app/domain/repositories/cash-movement.repository';

@Injectable({ providedIn: 'root' })
export class OnSupplierPaymentMadeCashHandler {
  constructor(
    private readonly cashRepo: CashMovementRepository,
    private readonly eventBus: IEventBus,
  ) {}

  register(): void {
    this.eventBus.subscribe(SupplierPaymentMadeEvent, (event) => {
      this.handle(event).catch((err) =>
        console.error('[Caja] Error procesando SupplierPaymentMadeEvent', err),
      );
    });
  }

  async handle(event: SupplierPaymentMadeEvent): Promise<void> {
    const sourceEventId = event.purchaseId
      ? `pay-${event.supplierId}-${event.purchaseId}-${event.paidAt.getTime()}`
      : `pay-${event.supplierId}-${event.paidAt.getTime()}`;

    const alreadyProcessed = await this.cashRepo.existsBySourceEventId(sourceEventId);
    if (alreadyProcessed) return;

    await this.cashRepo.create({
      type: 'expense',
      concept: 'Pago a proveedor',
      method: event.paymentMethod,
      amount: event.amount,
      sourceEventId,
      sourceModule: 'suppliers',
      date: event.paidAt,
    });
  }
}
