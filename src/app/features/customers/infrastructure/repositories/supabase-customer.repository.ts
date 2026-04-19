import { Injectable, inject } from '@angular/core';
import { BaseRepository } from '@app/core/repositories/base.repository';
import { UserProfile } from '@app/features/authentication/domain/entities/user.entity';
import { LoggerService } from '@app/core/services/logger.service';
import { Observable, from, map } from 'rxjs';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';

@Injectable({
  providedIn: 'root'
})
export class SupabaseCustomerRepository extends BaseRepository<UserProfile> {
  protected override tableName = 'clients'; // Main table for counter/repair customers

  constructor() {
    const supabase = inject(SUPABASE_CLIENT);
    const logger = inject(LoggerService);
    super(supabase, logger);
  }

  createClient(item: any): Observable<UserProfile> {
    const tenantId = this.tenantService.getTenantId();
    return from(
      this.supabase.rpc('create_client', {
        p_first_name: item.first_name,
        p_last_name: item.last_name || '',
        p_email: item.email || '',
        p_phone: item.phone || '',
        p_address: item.address || '',
        p_dni: item.dni || '',
        p_tenant_id: tenantId
      })
    ).pipe(
      map(({ data, error }: any) => {
        if (error) {
          throw error;
        }
        return data as unknown as UserProfile;
      })
    );
  }

  findByEmailOrPhone(email?: string, phone?: string): Observable<UserProfile | null> {
    if (!email && !phone) return from(Promise.resolve(null));
    
    let query = this.applyTenantFilter(this.supabase.from(this.tableName).select('*'));
    
    if (email && phone) {
      query = query.or(`email.eq.${email},phone.eq.${phone}`);
    } else if (email) {
      query = query.eq('email', email);
    } else {
      query = query.eq('phone', phone);
    }

    return from(query.maybeSingle() as Promise<any>).pipe(
      map((res) => res.data as UserProfile | null)
    );
  }

  searchClients(query: string, limit: number = 20): Observable<UserProfile[]> {
    const tenantId = this.tenantService.getTenantId();
    return from(
      this.supabase.rpc('search_unified_customers', {
        p_query: query,
        p_tenant_id: tenantId,
        p_limit: limit
      })
    ).pipe(
      map(({ data, error }: any) => {
        if (error) this.errorHandler.handleError(error, 'searchClients');
        return data as UserProfile[];
      })
    );
  }

  getRecentClients(limit: number = 20): Observable<UserProfile[]> {
    const dbQuery = this.applyTenantFilter(
      this.supabase
        .from('unified_customers')
        .select('*')
    )
      .order('created_at', { ascending: false })
      .limit(limit);

    return from(dbQuery as any).pipe(
      map(({ data, error }: any) => {
        if (error) this.errorHandler.handleError(error, 'getRecentClients');
        return data as UserProfile[];
      })
    );
  }

  getUnifiedClients(): Observable<any[]> {
    const tenantId = this.tenantService.getTenantId();
    return from(
      this.supabase.rpc('get_unified_clients_list', {
        p_tenant_id: tenantId
      })
    ).pipe(
      map(({ data, error }: any) => {
        if (error) {
          this.logger.error(`Error fetching unified clients`, error);
          this.errorHandler.handleError(error, 'getUnifiedClients RPC');
        }
        return data || [];
      })
    );
  }
}
