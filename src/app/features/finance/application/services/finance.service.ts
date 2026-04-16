import { Injectable, inject } from '@angular/core';
import { FinanceRepository } from '../../domain/repositories/finance.repository';
import { CashMovement } from '../../domain/entities/cash-movement.entity';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  private repository = inject(FinanceRepository);

  async recordMovement(movement: CashMovement): Promise<CashMovement> {
    // Domain logic could go here (e.g. status validation)
    return this.repository.recordMovement(movement);
  }

  async getCashBalance(): Promise<number> {
    return this.repository.getBalance('cash');
  }

  getMovements(limit?: number, offset?: number): Observable<CashMovement[]> {
    return this.repository.getMovements(limit, offset);
  }
}
