import { Injectable, inject } from '@angular/core';
import { BaseRepository } from '@app/core/repositories/base.repository';
import { UserProfile } from '@app/features/authentication/domain/entities/user.entity';
import { LoggerService } from '@app/core/services/logger.service';
import { Observable, from, map, switchMap } from 'rxjs';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { AuthService } from '@app/core/services/auth.service';
import { BranchContextService } from '@app/core/services/branch-context.service';

@Injectable({
  providedIn: 'root'
})
export class SupabaseCustomerRepository extends BaseRepository<UserProfile> {
  protected override tableName = 'profiles'; // Point directly to profiles table
  protected override isGlobalTable = false;
  protected override useStrictBranchIsolation = true;

  private authService = inject(AuthService);
  protected override branchContextService = inject(BranchContextService);

  constructor() {
    const supabase = inject(SUPABASE_CLIENT);
    const logger = inject(LoggerService);
    super(supabase, logger);
  }

  private applyBranchFilter(query: any): any {
    const profile = this.authService.getCurrentProfile();
    const isGlobalAdmin = this.authService.isSuperAdmin() || profile?.role === 'tenant_owner';
    const contextBranchId = this.branchContextService.getBranchId();
    const isCentralBranch = contextBranchId === 'de967f68-7b15-44c0-bc98-952ccf06e1e5' || !contextBranchId;

    if (!(isGlobalAdmin && isCentralBranch)) {
      const branchId = contextBranchId || profile?.branch_id;
      if (branchId) {
        return query.eq('branch_id', branchId);
      }
    }
    return query;
  }

  createClient(item: any): Observable<UserProfile> {
    const branchId = this.branchContextService.getBranchId();
    const clientPayload: Partial<UserProfile> = {
      id: crypto.randomUUID(),
      role: 'user' as any,
      is_guest: true,
      branch_id: branchId || undefined,
      first_name: item.first_name,
      last_name: item.last_name || '',
      email: item.email || '',
      phone: item.phone || '',
      address: item.address || '',
      dni: item.dni || '',
      is_active: true
    };
    return this.create(clientPayload);
  }

  findByEmailOrPhone(email?: string, phone?: string): Observable<UserProfile | null> {
    if (!email && !phone) return from(Promise.resolve(null));
    
    let query = this.applyTenantFilter(this.supabase.from(this.tableName).select('*'));
    query = this.applyBranchFilter(query);
    query = query.or('role.eq.user,is_guest.eq.true');
    
    if (email && phone) {
      query = query.or(`email.eq.${email},phone.eq.${phone}`);
    } else if (email) {
      query = query.eq('email', email);
    } else {
      query = query.eq('phone', phone);
    }

    return from(query.maybeSingle() as unknown as PromiseLike<{ data: UserProfile | null, error: unknown }>).pipe(
      map(({ data }) => data)
    );
  }

  searchClients(query: string, limit: number = 20): Observable<UserProfile[]> {
    let dbQuery = this.supabase
      .from(this.tableName)
      .select('*')
      .or('role.eq.user,is_guest.eq.true');

    dbQuery = this.applyTenantFilter(dbQuery);
    dbQuery = this.applyBranchFilter(dbQuery);

    if (query && query.trim()) {
      const q = query.trim();
      dbQuery = dbQuery.or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%`);
    }

    return from(dbQuery.limit(limit) as any).pipe(
      map(({ data, error }: any) => {
        if (error) this.errorHandler.handleError(error, 'searchClients');
        return (data || []) as UserProfile[];
      })
    );
  }

  getRecentClients(limit: number = 20): Observable<UserProfile[]> {
    let dbQuery = this.supabase
      .from(this.tableName)
      .select('*')
      .or('role.eq.user,is_guest.eq.true');

    dbQuery = this.applyTenantFilter(dbQuery);
    dbQuery = this.applyBranchFilter(dbQuery);
    dbQuery = dbQuery
      .order('created_at', { ascending: false })
      .limit(limit);

    return from(dbQuery as any).pipe(
      map(({ data, error }: any) => {
        if (error) this.errorHandler.handleError(error, 'getRecentClients');
        return (data || []) as UserProfile[];
      })
    );
  }

  getUnifiedClients(): Observable<any[]> {
    let dbQuery = this.supabase
      .from(this.tableName)
      .select('*, repairs:repairs!repairs_client_id_fkey(id), orders:orders(id)')
      .or('role.eq.user,is_guest.eq.true');

    dbQuery = this.applyTenantFilter(dbQuery);
    dbQuery = this.applyBranchFilter(dbQuery);

    return from(dbQuery as any).pipe(
      map(({ data, error }: any) => {
        if (error) {
          this.logger.warn(`Error fetching unified clients with counts, trying fallback without relations`, error);
          return null; // Will trigger fallback in switchMap
        }
        return (data || []).map((c: any) => ({
          ...c,
          source: c.is_guest ? 'repair' : 'profile',
          repair_count: c.repairs?.length || 0,
          order_count: c.orders?.length || 0
        }));
      }),
      switchMap((result) => {
        if (result !== null) return from([result]);
        return this.getUnifiedClientsFallback();
      })
    );
  }

  getPaginatedUnifiedClients(page: number, limit: number, searchTerm?: string): Observable<{ data: any[], total: number }> {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let dbQuery = this.supabase
      .from('v_unified_clients')
      .select('*', { count: 'exact' });

    dbQuery = this.applyTenantFilter(dbQuery);
    dbQuery = this.applyBranchFilter(dbQuery);

    if (searchTerm && searchTerm.trim()) {
      const q = searchTerm.trim();
      dbQuery = dbQuery.or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%,dni.ilike.%${q}%`);
    }

    dbQuery = dbQuery.order('created_at', { ascending: false }).range(start, end);

    return from(dbQuery as any).pipe(
      map(({ data, error, count }: any) => {
        if (error) {
          this.logger.error(`Error fetching paginated unified clients from view`, error);
          this.errorHandler.handleError(error, 'getPaginatedUnifiedClients');
        }
        return { data: data || [], total: count || 0 };
      })
    );
  }

  private getUnifiedClientsFallback(): Observable<any[]> {
    let dbQuery = this.supabase
      .from(this.tableName)
      .select('*')
      .or('role.eq.user,is_guest.eq.true');

    dbQuery = this.applyTenantFilter(dbQuery);
    dbQuery = this.applyBranchFilter(dbQuery);

    return from(dbQuery as any).pipe(
      map(({ data, error }: any) => {
        if (error) {
          this.logger.error(`Error in fallback fetching unified clients`, error);
          this.errorHandler.handleError(error, 'getUnifiedClients fallback');
        }
        return (data || []).map((c: any) => ({
          ...c,
          source: c.is_guest ? 'repair' : 'profile',
          repair_count: 0,
          order_count: 0
        }));
      })
    );
  }
}
