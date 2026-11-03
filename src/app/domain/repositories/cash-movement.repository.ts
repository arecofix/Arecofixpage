import { PaymentMethod } from '../events/types/payment-method';

export interface CreateCashMovementDto {
  type: 'income' | 'expense';
  concept: string;
  method: PaymentMethod | string;
  amount: number;
  sourceEventId: string;
  sourceModule: string;
  date: Date | string;
  branch_id?: string | null;
  tenant_id?: string;
}

/**
 * Port for Cash Movement data access (DIP)
 */
export abstract class CashMovementRepository {
  abstract existsBySourceEventId(sourceEventId: string): Promise<boolean>;
  abstract create(movement: CreateCashMovementDto): Promise<unknown>;
}
