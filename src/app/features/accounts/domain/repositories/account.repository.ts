import { Observable } from 'rxjs';
import { CustomerAccount } from '../entities/customer-account.entity';
import { AccountTransaction } from '../entities/account-transaction.entity';

export abstract class AccountRepository {
  /**
   * Obtiene la cuenta corriente de un cliente. Si no existe, podría crearla o retornar null.
   */
  abstract getByCustomerId(customerId: string): Observable<CustomerAccount | null>;
  
  /**
   * Obtiene el listado de todas las cuentas corrientes activas del tenant.
   */
  abstract getAllAccounts(): Observable<CustomerAccount[]>;
  
  /**
   * Crea una nueva cuenta corriente para un cliente.
   */
  abstract createAccount(account: Partial<CustomerAccount>): Observable<CustomerAccount>;
  
  /**
   * Registra un nuevo movimiento y actualiza el saldo de la cuenta automáticamente.
   */
  abstract addTransaction(transaction: Partial<AccountTransaction>): Observable<AccountTransaction>;
  
  /**
   * Obtiene el historial de movimientos de una cuenta.
   */
  abstract getTransactions(accountId: string): Observable<AccountTransaction[]>;
}
