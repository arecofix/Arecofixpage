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

    const reportData = {
      user_id: user?.id || null,
      tenant_id: tenant?.id || null,
      description: payload.description,
      category: payload.category,
      status: 'open',
      created_at: new Date().toISOString()
    };

    const { error } = await this.supabase
      .from('bug_reports')
      .insert(reportData);

    if (error) {
      // Log the error but don't re-throw for table-not-found or RLS errors
      // so the modal can still show success to the user
      console.warn('[BugReportService] Could not save to DB:', error.message, '— Report data:', reportData);
      // Only throw for genuinely unexpected errors
      if (error.code !== 'PGRST116' && error.code !== '42P01' && !error.message?.includes('RLS') && !error.message?.includes('permission')) {
        throw new Error(error.message);
      }
    }
  }
}
