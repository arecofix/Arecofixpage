import { Injectable, inject } from '@angular/core';
import { BaseRepository } from '@app/core/repositories/base.repository';
import { UserProfile } from '@app/features/authentication/domain/entities/user.entity';
import { LoggerService } from '@app/core/services/logger.service';
import { Observable, from, map } from 'rxjs';
import { DatabaseError } from '@app/core/errors/application.error';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';

@Injectable({
  providedIn: 'root'
})
export class SupabaseEmployeeRepository extends BaseRepository<UserProfile> {
  protected override tableName = 'profiles';

  constructor() {
    const supabase = inject(SUPABASE_CLIENT);
    const logger = inject(LoggerService);
    super(supabase, logger);
  }

  createEmployee(item: any, tenantId: string): Observable<UserProfile> {
    return from(
      this.supabase.rpc('create_employee', {
        p_first_name: item.first_name,
        p_last_name: item.last_name,
        p_email: item.email,
        p_phone: item.phone,
        p_role: item.role,
        p_password: item.password,
        p_avatar_url: item.avatar_url,
        p_tenant_id: tenantId
      })
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          this.logger.error(`Error creating employee via RPC`, error);
          throw new DatabaseError(error.message, error);
        }
        return data as unknown as UserProfile;
      })
    );
  }

  getEmployees(): Observable<UserProfile[]> {
    let query = this.supabase
        .from(this.tableName)
        .select('*')
        .in('role', ['admin', 'staff'])
        .order('created_at', { ascending: false });

    query = this.applyTenantFilter(query);

    return from(query).pipe(
        map(({ data, error }) => {
            if (error) {
                this.logger.error(`Error fetching employees`, error);
                throw new DatabaseError(error.message, error);
            }
            return (data as UserProfile[]) || [];
        })
    );
  }
}
