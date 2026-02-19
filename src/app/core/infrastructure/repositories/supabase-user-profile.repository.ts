import { Injectable, inject } from '@angular/core';
import { UserProfileRepository } from '../../repositories/user-profile.repository';
import { BaseRepository } from '../../repositories/base.repository';
import { UserProfile } from '@app/shared/interfaces/user.interface';
import { LoggerService } from '../../services/logger.service';
import { Observable } from 'rxjs';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';

@Injectable({
  providedIn: 'root'
})
export class SupabaseUserProfileRepository extends BaseRepository<UserProfile> implements UserProfileRepository {
  protected tableName = 'profiles';
  
  constructor() {
    const supabase = inject(SUPABASE_CLIENT);
    const logger = inject(LoggerService);
    super(supabase, logger);
  }

  getProfile(id: string): Observable<UserProfile> {
    return this.getById(id);
  }

  updateProfile(id: string, profile: Partial<UserProfile>): Observable<UserProfile> {
    return this.update(id, profile);
  }
}
