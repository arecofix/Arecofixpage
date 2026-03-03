import { Injectable, inject } from '@angular/core';
import { BaseRepository } from '@app/core/repositories/base.repository';
import { Supplier } from '../../domain/entities/supplier.entity';
import { AuthService } from '@app/core/services/auth.service';
import { LoggerService } from '@app/core/services/logger.service';

@Injectable({
  providedIn: 'root'
})
export class SupabaseSupplierRepository extends BaseRepository<Supplier> {
  protected tableName = 'suppliers';

  constructor() {
    const authService = inject(AuthService);
    const logger = inject(LoggerService);
    super(authService.getSupabaseClient(), logger);
  }
}
