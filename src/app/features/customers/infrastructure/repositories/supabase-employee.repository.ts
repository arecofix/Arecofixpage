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
  protected override isGlobalTable = false;
  protected override useStrictBranchIsolation = true;

  constructor() {
    const supabase = inject(SUPABASE_CLIENT);
    const logger = inject(LoggerService);
    super(supabase, logger);
  }

  // El método createEmployee vía RPC fue eliminado. 
  // Ahora se maneja a través de Edge Functions en employee.service.ts

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

  getPaginatedEmployees(page: number, limit: number): Observable<{ data: UserProfile[], total: number }> {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let query = this.supabase
        .from(this.tableName)
        .select('*', { count: 'exact' })
        .in('role', ['admin', 'staff'])
        .order('created_at', { ascending: false })
        .range(start, end);

    query = this.applyTenantFilter(query);

    return from(query).pipe(
        map(({ data, count, error }) => {
            if (error) {
                this.logger.error(`Error fetching paginated employees`, error);
                throw new DatabaseError(error.message, error);
            }
            return { data: (data as UserProfile[]) || [], total: count || 0 };
        })
    );
  }
}
