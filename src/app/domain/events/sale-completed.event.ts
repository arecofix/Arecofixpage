import { SaleItemSnapshot } from './types/sale-item-snapshot';
import { CustomerSnapshot } from './types/customer-snapshot';
import { PaymentMethod } from './types/payment-method';

export class SaleCompletedEvent {
  constructor(
    public readonly saleId: string,
    public readonly items: SaleItemSnapshot[],
    public readonly subtotal: number,
    public readonly discount: number,
    public readonly total: number,
    public readonly paymentMethod: PaymentMethod,
    public readonly customer: CustomerSnapshot | null,
    public readonly requestInvoice: boolean,
    public readonly completedAt: Date,
  ) {}
}
