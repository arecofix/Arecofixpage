import { Injectable, inject } from '@angular/core';
import { OnPurchaseRegisteredCashHandler } from './handlers/on-purchase-registered.handler';
import { OnSaleCompletedHandler } from './handlers/on-sale-completed.handler';
import { OnOrderDeliveredCashHandler } from './handlers/on-order-delivered.handler';
import { OnRepairDeliveredCashHandler } from './handlers/on-repair-delivered.handler';
import { OnInvoiceIssuedCashHandler } from './handlers/on-invoice-issued.handler';
import { OnSupplierPaymentMadeCashHandler } from './handlers/on-supplier-payment-made.handler';

@Injectable({ providedIn: 'root' })
export class CashMovementsSubscriberService {
  private onPurchase = inject(OnPurchaseRegisteredCashHandler);
  private onSale = inject(OnSaleCompletedHandler);
  private onOrder = inject(OnOrderDeliveredCashHandler);
  private onRepair = inject(OnRepairDeliveredCashHandler);
  private onInvoice = inject(OnInvoiceIssuedCashHandler);
  private onSupplierPayment = inject(OnSupplierPaymentMadeCashHandler);

  private initialized = false;

  init(): void {
    if (this.initialized) return;
    this.initialized = true;

    this.onPurchase.register();
    this.onSale.register();
    this.onOrder.register();
    this.onRepair.register();
    this.onInvoice.register();
    this.onSupplierPayment.register();
  }
}
