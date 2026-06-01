import { Injectable, inject } from '@angular/core';
import { BaseRepository } from '@app/core/repositories/base.repository';
import { AppServiceEntity } from '../../domain/entities/app-service.entity';
import { LoggerService } from '@app/core/services/logger.service';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';

import { AppServiceRepository } from '../../domain/repositories/app-service.repository';

@Injectable({
  providedIn: 'root'
})
export class SupabaseAppServiceRepository extends BaseRepository<AppServiceEntity> implements AppServiceRepository {
  protected override tableName = 'services';
  protected override isGlobalTable = false;
  protected override useSoftDeletes = true;
  protected override useStrictBranchIsolation = true;
  protected override suppressAuthNotifications = true;

  constructor() {
    const supabase = inject(SUPABASE_CLIENT);
    const logger = inject(LoggerService);
    super(supabase, logger);
  }
}
