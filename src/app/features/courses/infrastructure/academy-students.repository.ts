import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '@app/core/services/supabase.service';
import { TenantService } from '@app/core/services/tenant.service';

@Injectable({
  providedIn: 'root'
})
export class AcademyStudentsRepository {
  private supabase = inject(SupabaseService).getClient();
  private tenantService = inject(TenantService);

  async getStudents() {
    const tenantId = this.tenantService.getTenantId();

    const { data, error } = await this.supabase
      .from('academy_students_view')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('last_name', { ascending: true });

    if (error) throw error;
    return data;
  }
}
