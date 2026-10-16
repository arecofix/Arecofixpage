import { CustomerSnapshot } from './types/customer-snapshot';
import { SaleItemSnapshot } from './types/sale-item-snapshot';
import { PaymentMethod } from './types/payment-method';

export class OrderDeliveredEvent {
  constructor(
    public readonly orderId: string,
    public readonly customer: CustomerSnapshot,
    public readonly items: SaleItemSnapshot[],
    public readonly total: number,
    public readonly paymentMethod: PaymentMethod,
    public readonly requestInvoice: boolean,
    public readonly deliveredAt: Date,
  ) {}
}
