import { Injectable } from '@angular/core';
import { IEventBus } from '@app/domain/events/event-bus.interface';
import { RepairOrderDeliveredEvent } from '@app/domain/events/repair-order-delivered.event';
import { CashMovementRepository } from '@app/domain/repositories/cash-movement.repository';

@Injectable({ providedIn: 'root' })
export class OnRepairDeliveredCashHandler {
  constructor(
    private readonly cashRepo: CashMovementRepository,
    private readonly eventBus: IEventBus,
  ) {}

  register(): void {
    this.eventBus.subscribe(RepairOrderDeliveredEvent, (event) => {
      this.handle(event).catch((err) =>
        console.error('[Caja] Error procesando RepairOrderDeliveredEvent', err),
      );
    });
  }

  async handle(event: RepairOrderDeliveredEvent): Promise<void> {
    const alreadyProcessed = await this.cashRepo.existsBySourceEventId(event.repairOrderId);
    if (alreadyProcessed) return;

    await this.cashRepo.create({
      type: 'income',
      concept: `Reparación #${event.repairOrderId}`,
      method: event.paymentMethod,
      amount: event.totalPaid,
      sourceEventId: event.repairOrderId,
      sourceModule: 'repairs',
      date: event.deliveredAt,
    });
  }
}
