import { Injectable } from '@angular/core';
import { IEventBus } from '@app/domain/events/event-bus.interface';
import { InvoiceIssuedEvent } from '@app/domain/events/invoice-issued.event';
import { CashMovementRepository } from '@app/domain/repositories/cash-movement.repository';

@Injectable({ providedIn: 'root' })
export class OnInvoiceIssuedCashHandler {
  constructor(
    private readonly cashRepo: CashMovementRepository,
    private readonly eventBus: IEventBus,
  ) {}

  register(): void {
    this.eventBus.subscribe(InvoiceIssuedEvent, (event) => {
      this.handle(event).catch((err) =>
        console.error('[Caja] Error procesando InvoiceIssuedEvent', err),
      );
    });
  }

  async handle(event: InvoiceIssuedEvent): Promise<void> {
    // 1. Idempotency guard: prevent duplicate processing of the same invoice
    const alreadyProcessed = await this.cashRepo.existsBySourceEventId(event.invoiceId);
    if (alreadyProcessed) return;

    // 2. Double-counting guard: sales, orders, and repairs already record cash movement upon completion
    if (event.origin !== 'manual') {
      return;
    }

    // 3. Register cash income for manual invoices
    await this.cashRepo.create({
      type: 'income',
      concept: `Factura #${event.invoiceNumber}`,
      method: event.paymentMethod,
      amount: event.total,
      sourceEventId: event.invoiceId,
      sourceModule: 'invoice',
      date: event.issuedAt,
    });
  }
}
