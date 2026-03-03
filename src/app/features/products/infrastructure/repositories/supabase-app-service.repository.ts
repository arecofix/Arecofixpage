import { Injectable, inject } from '@angular/core';
import { BaseRepository } from '@app/core/repositories/base.repository';
import { AppServiceEntity } from '../../domain/entities/app-service.entity';
import { AuthService } from '@app/core/services/auth.service';
import { LoggerService } from '@app/core/services/logger.service';

@Injectable({
  providedIn: 'root'
})
export class SupabaseAppServiceRepository extends BaseRepository<AppServiceEntity> {
  protected tableName = 'services';

  constructor() {
    const authService = inject(AuthService);
    const logger = inject(LoggerService);
    super(authService.getSupabaseClient(), logger);
  }
}
