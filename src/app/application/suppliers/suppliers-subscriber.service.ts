import { Injectable, inject } from '@angular/core';
import { OnPurchaseRegisteredSupplierHandler } from './handlers/on-purchase-registered.handler';
import { OnSupplierPaymentMadeSupplierHandler } from './handlers/on-supplier-payment-made.handler';

@Injectable({ providedIn: 'root' })
export class SuppliersSubscriberService {
  private onPurchase = inject(OnPurchaseRegisteredSupplierHandler);
  private onSupplierPayment = inject(OnSupplierPaymentMadeSupplierHandler);

  private initialized = false;

  init(): void {
    if (this.initialized) return;
    this.initialized = true;

    this.onPurchase.register();
    this.onSupplierPayment.register();
  }
}
