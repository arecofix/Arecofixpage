import { CustomerSnapshot } from './types/customer-snapshot';
import { PaymentMethod } from './types/payment-method';

export class InvoiceIssuedEvent {
  constructor(
    public readonly invoiceId: string,
    public readonly invoiceNumber: string,
    public readonly invoiceType: 'A' | 'B' | 'C' | 'X',
    public readonly origin: 'manual' | 'sale' | 'order' | 'repair',
    public readonly customer: CustomerSnapshot,
    public readonly total: number,
    public readonly paymentMethod: PaymentMethod,
    public readonly issuedAt: Date,
  ) {}
}
