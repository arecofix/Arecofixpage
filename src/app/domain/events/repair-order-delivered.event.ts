import { CustomerSnapshot } from './types/customer-snapshot';
import { PaymentMethod } from './types/payment-method';

export class RepairOrderDeliveredEvent {
  constructor(
    public readonly repairOrderId: string,
    public readonly customer: CustomerSnapshot,
    public readonly totalPaid: number,
    public readonly paymentMethod: PaymentMethod,
    public readonly deliveredAt: Date,
  ) {}
}
