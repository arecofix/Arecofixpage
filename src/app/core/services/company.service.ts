import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private auth = inject(AuthService);
  private supabase = this.auth.getSupabaseClient();

  async getSettings(): Promise<any> {
    const { data, error } = await this.supabase
      .from('company_settings')
      .select('*')
      .maybeSingle();

    if (error) throw error;
    return data;
  }
}
