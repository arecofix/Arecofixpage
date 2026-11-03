import { Injectable } from '@angular/core';
import { IEventBus } from '@app/domain/events/event-bus.interface';
import { PurchaseRegisteredEvent } from '@app/domain/events/purchase-registered.event';
import { SupplierRepository } from '@app/domain/repositories/supplier.repository';

@Injectable({ providedIn: 'root' })
export class OnPurchaseRegisteredSupplierHandler {
  constructor(
    private readonly supplierRepo: SupplierRepository,
    private readonly eventBus: IEventBus,
  ) {}

  register(): void {
    this.eventBus.subscribe(PurchaseRegisteredEvent, (event) => {
      this.handle(event).catch((err) =>
        console.error('[Proveedores] Error procesando PurchaseRegisteredEvent', err),
      );
    });
  }

  async handle(event: PurchaseRegisteredEvent): Promise<void> {
    if (!event.supplierId) return;

    await this.supplierRepo.updateAccountStatus(
      event.supplierId,
      event.purchaseId,
      event.total,
      event.paymentStatus,
    );
  }
}
