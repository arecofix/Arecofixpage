import { Injectable, inject } from '@angular/core';
import { BaseRepository } from '@app/core/repositories/base.repository';
import { UserProfile } from '@app/features/authentication/domain/entities/user.entity';
import { LoggerService } from '@app/core/services/logger.service';
import { Observable, from, map, switchMap } from 'rxjs';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';

@Injectable({
  providedIn: 'root'
})
export class SupabaseCustomerRepository extends BaseRepository<UserProfile> {
  protected override tableName = 'profiles'; // Point directly to profiles table

  constructor() {
    const supabase = inject(SUPABASE_CLIENT);
    const logger = inject(LoggerService);
    super(supabase, logger);
  }

  createClient(item: any): Observable<UserProfile> {
    const clientPayload: Partial<UserProfile> = {
      id: crypto.randomUUID(),
      role: 'user' as any,
      is_guest: true,
      first_name: item.first_name,
      last_name: item.last_name || '',
      email: item.email || '',
      phone: item.phone || '',
      address: item.address || '',
      dni: item.dni || '',
      notes: item.notes || '',
      is_active: true
    };
    return this.create(clientPayload);
  }

  findByEmailOrPhone(email?: string, phone?: string): Observable<UserProfile | null> {
    if (!email && !phone) return from(Promise.resolve(null));
    
    let query = this.applyTenantFilter(this.supabase.from(this.tableName).select('*'));
    query = query.or('role.eq.user,is_guest.eq.true');
    
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
    let dbQuery = this.supabase
      .from(this.tableName)
      .select('*')
      .or('role.eq.user,is_guest.eq.true');

    dbQuery = this.applyTenantFilter(dbQuery);

    if (query && query.trim()) {
      const q = query.trim();
      dbQuery = dbQuery.or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%,full_name.ilike.%${q}%`);
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

    dbQuery = this.applyTenantFilter(dbQuery)
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

  private getUnifiedClientsFallback(): Observable<any[]> {
    let dbQuery = this.supabase
      .from(this.tableName)
      .select('*')
      .or('role.eq.user,is_guest.eq.true');

    dbQuery = this.applyTenantFilter(dbQuery);

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
