import { Injectable } from '@angular/core';
import { IEventBus } from '@app/domain/events/event-bus.interface';
import { OrderDeliveredEvent } from '@app/domain/events/order-delivered.event';
import { CashMovementRepository } from '@app/domain/repositories/cash-movement.repository';

@Injectable({ providedIn: 'root' })
export class OnOrderDeliveredCashHandler {
  constructor(
    private readonly cashRepo: CashMovementRepository,
    private readonly eventBus: IEventBus,
  ) {}

  register(): void {
    this.eventBus.subscribe(OrderDeliveredEvent, (event) => {
      this.handle(event).catch((err) =>
        console.error('[Caja] Error procesando OrderDeliveredEvent', err),
      );
    });
  }

  async handle(event: OrderDeliveredEvent): Promise<void> {
    const alreadyProcessed = await this.cashRepo.existsBySourceEventId(event.orderId);
    if (alreadyProcessed) return;

    await this.cashRepo.create({
      type: 'income',
      concept: `Pedido #${event.orderId}`,
      method: event.paymentMethod,
      amount: event.total,
      sourceEventId: event.orderId,
      sourceModule: 'orders',
      date: event.deliveredAt,
    });
  }
}
