import { Injectable } from '@angular/core';
import { IEventBus } from '@app/domain/events/event-bus.interface';
import { PurchaseRegisteredEvent } from '@app/domain/events/purchase-registered.event';
import { CashMovementRepository } from '@app/domain/repositories/cash-movement.repository';

@Injectable({ providedIn: 'root' })
export class OnPurchaseRegisteredCashHandler {
  constructor(
    private readonly cashRepo: CashMovementRepository,
    private readonly eventBus: IEventBus,
  ) {}

  register(): void {
    this.eventBus.subscribe(PurchaseRegisteredEvent, (event) => {
      this.handle(event).catch((err) =>
        console.error('[Caja] Error procesando PurchaseRegisteredEvent', err),
      );
    });
  }

  async handle(event: PurchaseRegisteredEvent): Promise<void> {
    // Only paid purchases trigger immediate cash disbursement
    if (event.paymentStatus !== 'paid') return;

    const alreadyProcessed = await this.cashRepo.existsBySourceEventId(event.purchaseId);
    if (alreadyProcessed) return;

    await this.cashRepo.create({
      type: 'expense',
      concept: `Compra a ${event.supplierName || 'proveedor'}`,
      method: event.paymentMethod,
      amount: event.total,
      sourceEventId: event.purchaseId,
      sourceModule: 'purchases',
      date: event.registeredAt,
    });
  }
}
