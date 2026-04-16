import { Injectable, inject } from '@angular/core';
import { BaseRepository } from './base.repository';
import { LoggerService } from '../services/logger.service';
import { AuthService } from '../services/auth.service';
import { Observable, from, map } from 'rxjs';

export interface BranchDbRecord {
  id?: string;
  tenant_id?: string;
  name: string;
  slug: string;
  address: string;
  is_active: boolean;
  global_markup_percentage: number;
  plan_id?: string;
  official_name?: string;
  contact_email?: string;
  contact_phone?: string;
  tax_id?: string;
  branding_settings?: any;
  modules_config?: any;
}

import { SUPABASE_CLIENT } from '../di/supabase-token';

@Injectable({
  providedIn: 'root'
})
export class BranchRepository extends BaseRepository<BranchDbRecord> {
  protected override tableName = 'branches';
  protected override isGlobalTable = false;
  protected override useSoftDeletes = false; // Add if branches support it

  constructor() {
    const supabase = inject(SUPABASE_CLIENT);
    const logger = inject(LoggerService);
    super(supabase, logger);
  }

  getActiveBranches(): Observable<{ id: string; name: string }[]> {
    let query = this.supabase
      .from(this.tableName)
      .select('id, name')
      .eq('is_active', true)
      .order('name');
    
    return from(this.applyTenantFilter(query) as any).pipe(
      map(({ data, error }: any) => {
        if (error) this.errorHandler.handleError(error, 'getActiveBranches');
        return (data || []) as { id: string; name: string }[];
      })
    );
  }
}
