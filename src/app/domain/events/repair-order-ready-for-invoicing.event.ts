import { CustomerSnapshot } from './types/customer-snapshot';
import { RepairItemSnapshot } from './types/repair-item-snapshot';
import { RepairTotalsSnapshot } from './types/repair-totals-snapshot';
import { PaymentMethod } from './types/payment-method';

export class RepairOrderReadyForInvoicingEvent {
  constructor(
    public readonly repairOrderId: string,
    public readonly customer: CustomerSnapshot,
    public readonly items: RepairItemSnapshot[],
    public readonly totals: RepairTotalsSnapshot,
    public readonly paymentMethod: PaymentMethod,
    public readonly issuedAt: Date,
  ) {}
}
