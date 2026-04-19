import { Injectable, inject } from '@angular/core';
import { BaseRepository } from '@app/core/repositories/base.repository';
import { Supplier } from '../../domain/entities/supplier.entity';
import { LoggerService } from '@app/core/services/logger.service';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';

@Injectable({
  providedIn: 'root'
})
export class SupabaseSupplierRepository extends BaseRepository<Supplier> {
  protected override tableName = 'suppliers';

  constructor() {
    const supabase = inject(SUPABASE_CLIENT);
    const logger = inject(LoggerService);
    super(supabase, logger);
  }
}
