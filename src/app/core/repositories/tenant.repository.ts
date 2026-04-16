import { Injectable, inject } from '@angular/core';
import { BaseRepository } from './base.repository';
import { LoggerService } from '../services/logger.service';
import { AuthService } from '../services/auth.service';

export interface TenantDbRecord {
  id?: string;
  name?: string;
  subdomain?: string;
  contact_email?: string;
  contact_phone?: string;
  location?: string;
  branding_settings?: any;
}

@Injectable({
  providedIn: 'root'
})
export class TenantRepository extends BaseRepository<TenantDbRecord> {
  protected override tableName = 'tenants';
  protected override isGlobalTable = true;
  protected override useSoftDeletes = false;

  constructor() {
    const authService = inject(AuthService);
    const logger = inject(LoggerService);
    super(authService.getSupabaseClient(), logger);
  }
}
