import { Injectable, inject } from '@angular/core';
import { BaseRepository } from './base.repository';
import { LoggerService } from '../services/logger.service';
import { Observable, from, firstValueFrom, map } from 'rxjs';
import { Branch } from '@app/shared/interfaces/branch.interface';
import { SUPABASE_CLIENT } from '../di/supabase-token';

import { SupabaseStorageService } from '../services/supabase-storage.service';

@Injectable({
  providedIn: 'root'
})
export class BranchRepository extends BaseRepository<Branch> {
  protected override tableName = 'branches';
  protected override isGlobalTable = false;
  protected override useSoftDeletes = false;

  private storageService = inject(SupabaseStorageService);

  constructor() {
    const supabase = inject(SUPABASE_CLIENT);
    const logger = inject(LoggerService);
    super(supabase, logger);
  }

  async uploadLogo(file: File): Promise<string> {
    return this.storageService.uploadFile(file, 'branches', 'public-assets');
  }

  /**
   * Safe getter: Tries authenticated 'branches' table first; if empty or unauthenticated (e.g. public storefront),
   * falls back to the safe 'public_branch_profile' view which strips sensitive banking/tax columns.
   */
  override getWhere(
    column: string,
    value: string | number | boolean | null,
    options?: { column?: string; ascending?: boolean; select?: string }
  ): Observable<Branch[]> {
    return from(
      (async () => {
        const primary = await firstValueFrom(super.getWhere(column, value, options));
        if (primary && primary.length > 0) {
          return primary;
        }
        const { data, error } = await this.supabase
          .from('public_branch_profile')
          .select(options?.select || '*')
          .eq(column, value);
        if (error || !data) return [];
        return data as Branch[];
      })()
    );
  }

  override getById(id: string, options?: { select?: string }): Observable<Branch | null> {
    return from(
      (async () => {
        const primary = await firstValueFrom(super.getById(id, options));
        if (primary) return primary;
        const { data, error } = await this.supabase
          .from('public_branch_profile')
          .select(options?.select || '*')
          .eq('id', id)
          .maybeSingle();
        if (error || !data) return null;
        return data as Branch;
      })()
    );
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
    
    return from(this.applyTenantFilter(query) as PromiseLike<{ data: Branch[] | null, error: unknown }>).pipe(
      map(({ data, error }) => {
        if (error) this.errorHandler.handleError(error, 'getActiveBranches');
        return data || [];
      })
    );
  }
}
