import { Injectable, inject } from '@angular/core';
import { BaseRepository } from '@app/core/repositories/base.repository';
import { UserProfile } from '@app/features/authentication/domain/entities/user.entity';
import { AuthService } from '@app/core/services/auth.service';
import { LoggerService } from '@app/core/services/logger.service';
import { Observable, from, map } from 'rxjs';
import { DatabaseError } from '@app/core/errors/application.error';

@Injectable({
  providedIn: 'root'
})
export class SupabaseCustomerRepository extends BaseRepository<UserProfile> {
  protected tableName = 'profiles';

  constructor() {
    const authService = inject(AuthService);
    const logger = inject(LoggerService);
    super(authService.getSupabaseClient(), logger);
  }

  createClient(item: any, tenantId: string): Observable<UserProfile> {
    return from(
      this.supabase.rpc('create_client', {
        p_first_name: item.first_name,
        p_last_name: item.last_name,
        p_email: item.email,
        p_phone: item.phone,
        p_address: item.address,
        p_dni: item.dni,
        p_tenant_id: tenantId
      })
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          this.logger.error(`Error creating client via RPC`, error);
          throw new DatabaseError(error.message, error);
        }
        return data as unknown as UserProfile;
      })
    );
  }
}
