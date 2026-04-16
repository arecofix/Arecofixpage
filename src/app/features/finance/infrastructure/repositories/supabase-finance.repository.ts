import { Injectable, inject } from '@angular/core';
import { BaseRepository } from '@app/core/repositories/base.repository';
import { CashMovement } from '../../domain/entities/cash-movement.entity';
import { FinanceRepository } from '../../domain/repositories/finance.repository';
import { AuthService } from '@app/core/services/auth.service';
import { LoggerService } from '@app/core/services/logger.service';
import { Observable, from, map, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupabaseFinanceRepository extends BaseRepository<CashMovement> implements FinanceRepository {
  protected override tableName = 'cash_movements';

  constructor() {
    const authService = inject(AuthService);
    const logger = inject(LoggerService);
    super(authService.getSupabaseClient(), logger);
  }

  async recordMovement(movement: CashMovement): Promise<CashMovement> {
    const result = await firstValueFrom(this.create(movement));
    return result;
  }

  async getBalance(paymentMethod: string = 'cash'): Promise<number> {
    let query = this.supabase
      .from(this.tableName)
      .select('amount, type')
      .eq('payment_method', paymentMethod);
    
    query = this.applyTenantFilter(query);

    const { data, error } = await (query as any);

    if (error) {
      this.logger.error('Error fetching balance', error);
      return 0;
    }

    return (data || []).reduce((acc: number, curr: any) => {
      return curr.type === 'income' ? acc + curr.amount : acc - curr.amount;
    }, 0);
  }

  getMovements(limit: number = 20, offset: number = 0): Observable<CashMovement[]> {
    let query = this.supabase
      .from(this.tableName)
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    query = this.applyTenantFilter(query);

    return from(query as any).pipe(
      map(({ data, error }: any) => {
        if (error) throw error;
        return (data || []) as CashMovement[];
      })
    );
  }
}
