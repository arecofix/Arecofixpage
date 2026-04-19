import { Injectable, inject } from '@angular/core';
import { BaseRepository } from '@app/core/repositories/base.repository';
import { AppServiceEntity } from '../../domain/entities/app-service.entity';
import { LoggerService } from '@app/core/services/logger.service';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';

@Injectable({
  providedIn: 'root'
})
export class SupabaseAppServiceRepository extends BaseRepository<AppServiceEntity> {
  protected override tableName = 'services';

  constructor() {
    const supabase = inject(SUPABASE_CLIENT);
    const logger = inject(LoggerService);
    super(supabase, logger);
  }
}
