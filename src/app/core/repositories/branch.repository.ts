import { Injectable, inject } from '@angular/core';
import { BaseRepository } from './base.repository';
import { LoggerService } from '../services/logger.service';
import { Observable, from, map } from 'rxjs';
import { Branch } from '@app/shared/interfaces/branch.interface';
import { SUPABASE_CLIENT } from '../di/supabase-token';

@Injectable({
  providedIn: 'root'
})
export class BranchRepository extends BaseRepository<Branch> {
  protected override tableName = 'branches';
  protected override isGlobalTable = false;
  protected override useSoftDeletes = false;

  constructor() {
    const supabase = inject(SUPABASE_CLIENT);
    const logger = inject(LoggerService);
    super(supabase, logger);
  }

  /**
   * Returns all active branches for the current tenant.
   */
  getActiveBranches(): Observable<Branch[]> {
    const query = this.supabase
      .from(this.tableName)
      .select('*')
      .eq('is_active', true)
      .order('name');
    
    return from(this.applyTenantFilter(query)).pipe(
      map((res: any) => {
        const { data, error } = res;
        if (error) this.errorHandler.handleError(error, 'getActiveBranches');
        return (data || []) as Branch[];
      })
    );
  }
}
