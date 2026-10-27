import { Injectable, inject } from '@angular/core';
import { BaseRepository } from '@app/core/repositories/base.repository';
import { Supplier } from '../../domain/entities/supplier.entity';
import { SupplierMapper } from '../mappers/supplier.mapper';
import { LoggerService } from '@app/core/services/logger.service';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { SupplierRepository, SupplierPaymentDto } from '@app/domain/repositories/supplier.repository';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupabaseSupplierRepository extends BaseRepository<Supplier> implements SupplierRepository {
  protected override tableName = 'suppliers';
  protected override isGlobalTable = false;
  protected override useStrictBranchIsolation = false;

  constructor() {
    const supabase = inject(SUPABASE_CLIENT);
    const logger = inject(LoggerService);
    super(supabase, logger);
  }

  override update(id: string, item: Partial<Supplier>): Observable<Supplier> {
    const dbPayload = SupplierMapper.mapUpdateToDb(item);
    return super.update(id, dbPayload as Partial<Supplier>);
  }

  async registerPayment(supplierId: string, payment: SupplierPaymentDto): Promise<void> {
    try {
      this.logger.info(`[SupabaseSupplierRepository] Registering payment for supplier ${supplierId}:`, payment);
      await this.updateBalance(supplierId, -payment.amount);
    } catch (err) {
      this.logger.error(`[SupabaseSupplierRepository] registerPayment failed:`, err);
    }
  }

  async updateBalance(supplierId: string, deltaAmount: number): Promise<void> {
    try {
      const supplier = await firstValueFrom(this.getById(supplierId));
      if (!supplier) return;

      const currentBalance = Number(supplier.balance ?? 0);
      const newBalance = currentBalance + deltaAmount;

      await firstValueFrom(this.update(supplierId, { balance: newBalance } as Partial<Supplier>));
    } catch (err) {
      this.logger.warn(`[SupabaseSupplierRepository] updateBalance failed:`, err);
    }
  }

  async updateAccountStatus(
    supplierId: string,
    purchaseId: string,
    amount: number,
    paymentStatus: 'pending' | 'paid'
  ): Promise<void> {
    try {
      // If purchase is pending payment, increase supplier balance due
      if (paymentStatus === 'pending') {
        await this.updateBalance(supplierId, amount);
      }
    } catch (err) {
      this.logger.warn(`[SupabaseSupplierRepository] updateAccountStatus failed:`, err);
    }
  }
}

