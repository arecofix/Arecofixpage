import { Injectable, inject } from '@angular/core';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { TenantService } from '@app/core/services/tenant.service';
import { UserProfile } from '@app/shared/interfaces/user.interface';
import { from, Observable } from 'rxjs';
import { AuthService } from '@app/core/services/auth.service';
import { BranchContextService } from '@app/core/services/branch-context.service';

@Injectable({
  providedIn: 'root'
})
export class AdminUsersService {
  private supabase = inject(SUPABASE_CLIENT);
  private tenantService = inject(TenantService);
  private authService = inject(AuthService);
  private branchContextService = inject(BranchContextService);

  getUsers(): Observable<UserProfile[]> {
    return from((async () => {
      const tenantId = this.tenantService.getTenantId();
      let query = this.supabase
        .from('profiles')
        .select('id, email, first_name, last_name, phone, role, avatar_url, created_at, updated_at, is_active, branch_id')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      const profile = this.authService.getCurrentProfile();
      const isGlobalAdmin = this.authService.isSuperAdmin() || profile?.role === 'tenant_owner';
      const contextBranchId = this.branchContextService.getBranchId();
      const isCentralBranch = contextBranchId === 'de967f68-7b15-44c0-bc98-952ccf06e1e5' || !contextBranchId;

      if (!(isGlobalAdmin && isCentralBranch)) {
        const branchId = contextBranchId || profile?.branch_id;
        if (branchId) {
          query = query.eq('branch_id', branchId);
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as UserProfile[];
    })());
  }

  getPaginatedUsers(page: number, limit: number): Observable<{ data: UserProfile[], total: number }> {
    return from((async () => {
      const tenantId = this.tenantService.getTenantId();
      let query = this.supabase
        .from('profiles')
        .select('id, email, first_name, last_name, phone, role, avatar_url, created_at, updated_at, is_active, branch_id', { count: 'exact' })
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      const profile = this.authService.getCurrentProfile();
      const isGlobalAdmin = this.authService.isSuperAdmin() || profile?.role === 'tenant_owner';
      const contextBranchId = this.branchContextService.getBranchId();
      const isCentralBranch = contextBranchId === 'de967f68-7b15-44c0-bc98-952ccf06e1e5' || !contextBranchId;

      if (!(isGlobalAdmin && isCentralBranch)) {
        const branchId = contextBranchId || profile?.branch_id;
        if (branchId) {
          query = query.eq('branch_id', branchId);
        }
      }

      const start = (page - 1) * limit;
      const end = start + limit - 1;
      query = query.range(start, end);

      const { data, error, count } = await query;

      if (error) throw error;
      return { data: (data || []) as UserProfile[], total: count || 0 };
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

  getInstructors(): Observable<UserProfile[]> {
    return from((async () => {
      const tenantId = this.tenantService.getTenantId();
      const { data, error } = await this.supabase
        .from('profiles')
        .select('id, email, first_name, last_name, avatar_url')
        .eq('tenant_id', tenantId)
        .eq('role', 'instructor')
        .order('first_name', { ascending: true });

      if (error) throw error;
      return (data || []) as UserProfile[];
    })());
  }
}
