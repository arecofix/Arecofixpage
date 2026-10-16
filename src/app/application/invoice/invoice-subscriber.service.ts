import { Injectable, inject } from '@angular/core';
import { OnSaleCompletedInvoiceHandler } from './handlers/on-sale-completed.handler';
import { OnOrderDeliveredInvoiceHandler } from './handlers/on-order-delivered.handler';
import { OnRepairReadyHandler } from './handlers/on-repair-ready.handler';

@Injectable({ providedIn: 'root' })
export class InvoiceSubscriberService {
  private onSale = inject(OnSaleCompletedInvoiceHandler);
  private onOrder = inject(OnOrderDeliveredInvoiceHandler);
  private onRepairReady = inject(OnRepairReadyHandler);

  private initialized = false;

  init(): void {
    if (this.initialized) return;
    this.initialized = true;

    this.onSale.register();
    this.onOrder.register();
    this.onRepairReady.register();
  }
}
