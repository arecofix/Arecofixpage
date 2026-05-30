import { Injectable, inject } from '@angular/core';
import { SUPABASE_CLIENT } from '../di/supabase-token';
import { AuthService } from './auth.service';
import { TenantService } from './tenant.service';

export interface BugReportPayload {
  description: string;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class BugReportService {
  private supabase = inject(SUPABASE_CLIENT);
  private authService = inject(AuthService);
  private tenantService = inject(TenantService);

  async submitReport(payload: BugReportPayload): Promise<void> {
    const user = this.authService.getCurrentUser();
    const tenant = this.tenantService.getCurrentTenant();
    
    if (!user) throw new Error('Usuario no autenticado');

    const { error } = await this.supabase
      .from('bug_reports')
      .insert({
        user_id: user.id,
        tenant_id: tenant?.id || null,
        description: payload.description,
        category: payload.category,
        status: 'open',
        created_at: new Date().toISOString()
      });

    if (error) {
      throw error;
    }
  }
}
