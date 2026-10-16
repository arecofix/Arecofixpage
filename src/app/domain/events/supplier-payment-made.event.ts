import { PaymentMethod } from './types/payment-method';

export class SupplierPaymentMadeEvent {
  constructor(
    public readonly supplierId: string,
    public readonly purchaseId: string | null,
    public readonly amount: number,
    public readonly paymentMethod: PaymentMethod,
    public readonly paidAt: Date,
  ) {}
}
