import { Injectable, inject } from '@angular/core';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { TenantService } from '@app/core/services/tenant.service';
import { UserProfile } from '@app/shared/interfaces/user.interface';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminUsersService {
  private supabase = inject(SUPABASE_CLIENT);
  private tenantService = inject(TenantService);

  getUsers(): Observable<UserProfile[]> {
    return from((async () => {
      const tenantId = this.tenantService.getTenantId();
      const { data, error } = await this.supabase
        .from('profiles')
        .select('id, email, first_name, last_name, phone, role, avatar_url, created_at, updated_at, is_active, branch_id')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as UserProfile[];
    })());
  }

  updateRole(userId: string, newRole: string): Observable<void> {
    return from((async () => {
      const { error } = await this.supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
    })());
  }

  updateBranch(userId: string, newBranchId: string): Observable<void> {
    return from((async () => {
      const { error } = await this.supabase
        .from('profiles')
        .update({ branch_id: newBranchId || null })
        .eq('id', userId);

      if (error) throw error;
    })());
  }
}
