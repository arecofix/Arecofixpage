import { Injectable } from '@angular/core';
import { IEventBus } from '@app/domain/events/event-bus.interface';
import { SaleCompletedEvent } from '@app/domain/events/sale-completed.event';
import { CashMovementRepository } from '@app/domain/repositories/cash-movement.repository';

@Injectable({ providedIn: 'root' })
export class OnSaleCompletedHandler {
  constructor(
    private readonly cashRepo: CashMovementRepository,
    private readonly eventBus: IEventBus,
  ) {}

  register(): void {
    this.eventBus.subscribe(SaleCompletedEvent, (event) => {
      this.handle(event).catch((err) =>
        console.error('[Caja] Error procesando SaleCompletedEvent', err),
      );
    });
  }

  async handle(event: SaleCompletedEvent): Promise<void> {
    const alreadyProcessed = await this.cashRepo.existsBySourceEventId(event.saleId);
    if (alreadyProcessed) return;

    await this.cashRepo.create({
      type: 'income',
      concept: `Venta #${event.saleId}`,
      method: event.paymentMethod,
      amount: event.total,
      sourceEventId: event.saleId,
      sourceModule: 'sales',
      date: event.completedAt,
    });
  }
}
