import { PaymentMethod } from '../events/types/payment-method';

export interface SupplierPaymentDto {
  purchaseId: string | null;
  amount: number;
  paymentMethod: PaymentMethod;
  paidAt?: Date;
}

/**
 * Port for Supplier repository abstraction (DIP)
 */
export abstract class SupplierRepository {
  abstract registerPayment(supplierId: string, payment: SupplierPaymentDto): Promise<void>;
  abstract updateBalance(supplierId: string, deltaAmount: number): Promise<void>;
  abstract updateAccountStatus(
    supplierId: string,
    purchaseId: string,
    amount: number,
    paymentStatus: 'pending' | 'paid'
  ): Promise<void>;
  abstract getById(id: string): import('rxjs').Observable<unknown> | Promise<unknown>;
}
