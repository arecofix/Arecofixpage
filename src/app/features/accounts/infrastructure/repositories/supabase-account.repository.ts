import { Injectable, inject } from '@angular/core';
import { Observable, from, throwError, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { BaseRepository } from '@app/core/repositories/base.repository';
import { AccountRepository } from '../../domain/repositories/account.repository';
import { CustomerAccount } from '../../domain/entities/customer-account.entity';
import { AccountTransaction } from '../../domain/entities/account-transaction.entity';

import { LoggerService } from '@app/core/services/logger.service';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';

@Injectable({
  providedIn: 'root'
})
export class SupabaseAccountRepository extends BaseRepository<CustomerAccount> implements AccountRepository {
  protected override tableName = 'customer_accounts';
  protected override isGlobalTable = false; // Requiere tenant_id
  
  constructor() {
    const supabase = inject(SUPABASE_CLIENT);
    const logger = inject(LoggerService);
    super(supabase, logger);
  }
  
  /**
   * Obtiene la cuenta por customerId
   */
  getByCustomerId(customerId: string): Observable<CustomerAccount | null> {
    return from(
      this.supabase
        .from(this.tableName)
        .select('*, customer:customers(first_name, last_name, email)')
        .eq('customer_id', customerId)
        .eq('tenant_id', this.tenantService.getTenantId())
        .maybeSingle()
    ).pipe(
      map(res => {
        if (res.error) throw res.error;
        return (res.data as any) || null;
      }),
      catchError(err => throwError(() => err))
    );
  }

  /**
   * Obtiene todas las cuentas del tenant
   */
  getAllAccounts(): Observable<CustomerAccount[]> {
    return from(
      this.supabase
        .from(this.tableName)
        .select('*, customer:customers(first_name, last_name, email)')
        .eq('tenant_id', this.tenantService.getTenantId())
        .order('created_at', { ascending: false })
    ).pipe(
      map(res => {
        if (res.error) throw res.error;
        return (res.data as any[]) || [];
      }),
      catchError(err => throwError(() => err))
    );
  }

  /**
   * Crea una nueva cuenta (asegurando el tenant)
   */
  createAccount(account: Partial<CustomerAccount>): Observable<CustomerAccount> {
    const payload = this.applyTenantFilter(account as any);
    return from(
      this.supabase
        .from(this.tableName)
        .insert(payload)
        .select()
        .single()
    ).pipe(
      map(res => {
        if (res.error) throw res.error;
        return res.data as CustomerAccount;
      }),
      catchError(err => throwError(() => err))
    );
  }

  /**
   * Registra una transacción y actualiza el balance usando una transacción RPC
   * (Nota: Como no tenemos una función RPC de base de datos específica todavía, 
   * lo hacemos secuencialmente por ahora, o idealmente requerirá un trigger de BD)
   */
  addTransaction(transaction: Partial<AccountTransaction>): Observable<AccountTransaction> {
    const payload = this.applyTenantFilter(transaction as any);
    return from(
      this.supabase
        .from('account_transactions')
        .insert(payload)
        .select()
        .single()
    ).pipe(
      switchMap((res: any) => {
        if (res.error) throw res.error;
        const newTransaction = res.data as AccountTransaction;
        
        // Actualizamos el saldo de la cuenta (RPC o Trigger es mejor, pero fallback frontend)
        return this.updateAccountBalance(newTransaction.account_id, newTransaction.amount, newTransaction.type).pipe(
          map(() => newTransaction)
        );
      }),
      catchError(err => throwError(() => err))
    );
  }
  
  /**
   * Actualiza el saldo (Uso interno)
   */
  private updateAccountBalance(accountId: string, amount: number, type: 'charge' | 'payment' | 'adjustment'): Observable<any> {
    // Para simplificar, obtenemos y sumamos. Un trigger en BD sería más seguro en producción contra concurrencia.
    return from(
      this.supabase
        .from(this.tableName)
        .select('balance')
        .eq('id', accountId)
        .single()
    ).pipe(
      switchMap(res => {
        if (res.error) throw res.error;
        let currentBalance = Number(res.data.balance || 0);
        let amountValue = Number(amount);
        
        // Asumiendo que Charge = Aumenta la deuda (Negativo), Payment = Disminuye la deuda (Positivo)
        // La lógica de negocio depende si vemos el balance desde el punto del cliente o la empresa.
        // Asumimos Balance = Saldo (Positivo es favor del cliente, Negativo es deuda del cliente)
        if (type === 'charge') {
          currentBalance -= amountValue;
        } else if (type === 'payment') {
          currentBalance += amountValue;
        } else {
          // adjustment: sumamos directamente el monto (puede ser negativo o positivo)
          currentBalance += amountValue;
        }
        
        return from(
          this.supabase
            .from(this.tableName)
            .update({ balance: currentBalance })
            .eq('id', accountId)
        );
      })
    );
  }

  /**
   * Historial de movimientos
   */
  getTransactions(accountId: string): Observable<AccountTransaction[]> {
    return from(
      this.supabase
        .from('account_transactions')
        .select('*')
        .eq('account_id', accountId)
        .eq('tenant_id', this.tenantService.getTenantId())
        .order('created_at', { ascending: false })
    ).pipe(
      map(res => {
        if (res.error) throw res.error;
        return (res.data as any[]) || [];
      }),
      catchError(err => throwError(() => err))
    );
  }
}
