import { Injectable } from '@angular/core';
import { IEventBus } from '@app/domain/events/event-bus.interface';
import { SupplierPaymentMadeEvent } from '@app/domain/events/supplier-payment-made.event';
import { SupplierRepository } from '@app/domain/repositories/supplier.repository';

@Injectable({ providedIn: 'root' })
export class OnSupplierPaymentMadeSupplierHandler {
  constructor(
    private readonly supplierRepo: SupplierRepository,
    private readonly eventBus: IEventBus,
  ) {}

  register(): void {
    this.eventBus.subscribe(SupplierPaymentMadeEvent, (event) => {
      this.handle(event).catch((err) =>
        console.error('[Proveedores] Error procesando SupplierPaymentMadeEvent', err),
      );
    });
  }

  async handle(event: SupplierPaymentMadeEvent): Promise<void> {
    if (!event.supplierId) return;

    await this.supplierRepo.registerPayment(event.supplierId, {
      purchaseId: event.purchaseId,
      amount: event.amount,
      paymentMethod: event.paymentMethod,
      paidAt: event.paidAt,
    });
  }
}
