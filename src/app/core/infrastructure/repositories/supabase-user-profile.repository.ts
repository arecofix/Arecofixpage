import { Injectable, inject } from '@angular/core';
import { UserProfileRepository } from '../../repositories/user-profile.repository';
import { BaseRepository } from '../../repositories/base.repository';
import { UserProfile } from '@app/shared/interfaces/user.interface';
import { LoggerService } from '../../services/logger.service';
import { Observable, from, map } from 'rxjs';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';

@Injectable({
  providedIn: 'root'
})
export class SupabaseUserProfileRepository extends BaseRepository<UserProfile> implements UserProfileRepository {
  protected override tableName = 'profiles';
  
  constructor() {
    const supabase = inject(SUPABASE_CLIENT);
    const logger = inject(LoggerService);
    super(supabase, logger);
  }

  getProfile(id: string): Observable<UserProfile | null> {
    return this.getById(id);
  }

  updateProfile(id: string, profile: Partial<UserProfile>): Observable<UserProfile> {
    return this.update(id, profile);
  }

  getAdminsByTenant(tenantId: string): Observable<{ id: string }[]> {
    const query = this.supabase
      .from('profiles')
      .select('id')
      .in('role', ['admin', 'tenant_owner', 'super_admin'])
      .eq('tenant_id', tenantId);
    return from(query as any).pipe(
      map(({ data, error }: any) => {
        if (error) this.errorHandler.handleError(error, 'getAdminsByTenant');
        return data || [];
      })
    );
  }
}
