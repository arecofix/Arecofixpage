import { PurchaseItemSnapshot } from './types/purchase-item-snapshot';
import { PaymentMethod } from './types/payment-method';

export class PurchaseRegisteredEvent {
  constructor(
    public readonly purchaseId: string,
    public readonly supplierId: string,
    public readonly supplierName: string,
    public readonly items: PurchaseItemSnapshot[],
    public readonly subtotal: number,
    public readonly taxAmount: number,
    public readonly total: number,
    public readonly paymentMethod: PaymentMethod,
    public readonly paymentStatus: 'pending' | 'paid',
    public readonly registeredAt: Date,
  ) {}
}
