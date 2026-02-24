import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';
import { TenantService } from './tenant.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private auth = inject(AuthService);
  private tenantService = inject(TenantService);
  private supabase = this.auth.getSupabaseClient();

  async getSettings(): Promise<any> {
    const tenantId = this.tenantService.getTenantId();
    const { data, error } = await this.supabase
      .from('tenants')
      .select('*')
      .eq('id', tenantId)
      .maybeSingle();

    if (error) throw error;
    
    if (data) {
       // Support backward compatibility mapping in case other components expect old properties
       return {
          ...data,
          address: data.location || '',
          email: data.contact_email || '',
          phone: data.contact_phone || '',
          logo_url: data.branding_settings?.logo_url || ''
       };
    }
    return data;
  }
}
