import { Observable } from 'rxjs';
import { CashMovement } from '../entities/cash-movement.entity';

export abstract class FinanceRepository {
  abstract recordMovement(movement: CashMovement): Promise<CashMovement>;
  abstract getBalance(paymentMethod?: string): Promise<number>;
  abstract getMovements(limit?: number, offset?: number): Observable<CashMovement[]>;
}
