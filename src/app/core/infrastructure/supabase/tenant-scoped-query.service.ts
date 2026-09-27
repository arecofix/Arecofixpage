import { Injectable, inject } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { TenantService } from '@app/core/services/tenant.service';
import { TENANT_CONSTANTS } from '@app/core/constants/tenant.constants';

/**
 * DRY helper for repositories that do not extend BaseRepository.
 */
@Injectable({ providedIn: 'root' })
export class TenantScopedQueryService {
  private supabase = inject(SUPABASE_CLIENT);
  private tenantService = inject(TenantService);

  get client(): SupabaseClient {
    return this.supabase;
  }

  getTenantId(): string {
    return this.tenantService.getTenantId();
  }

  shouldScopeByTenant(): boolean {
    return this.getTenantId() !== TENANT_CONSTANTS.FALLBACK_ID;
  }

  from(table: string) {
    return this.supabase.from(table);
  }

  /** Applies tenant_id filter when the query builder supports .or() */
  withTenantScope<T>(query: T): T {
    if (!this.shouldScopeByTenant()) {
      return query;
    }
    // Usamos .or() para permitir tanto el tenant del usuario como el tenant global
    const scoped = query as unknown as { or: (filter: string) => T };
    const tenantId = this.getTenantId();
    return scoped.or(`tenant_id.eq.${tenantId},tenant_id.is.null,tenant_id.eq.${TENANT_CONSTANTS.FALLBACK_ID}`);
  }

  withTenant<T extends object>(payload: T): T & { tenant_id: string } {
    return { ...payload, tenant_id: this.getTenantId() };
  }
}
