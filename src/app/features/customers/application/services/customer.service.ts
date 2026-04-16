import { Injectable, inject } from '@angular/core';
import { SupabaseCustomerRepository } from '../../infrastructure/repositories/supabase-customer.repository';
import { UserProfile } from '@app/features/authentication/domain/entities/user.entity';
import { firstValueFrom } from 'rxjs';
import { TenantService } from '@app/core/services/tenant.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private repository = inject(SupabaseCustomerRepository);
  private tenantService = inject(TenantService);

  async getAll(): Promise<UserProfile[]> {
    return firstValueFrom(this.repository.getWhere('role', 'user', { column: 'created_at', ascending: false }));
  }

  async getById(id: string): Promise<UserProfile | null> {
    return firstValueFrom(this.repository.getById(id));
  }

  async create(data: any): Promise<UserProfile> {
    return firstValueFrom(this.repository.createClient(data));
  }

  async update(id: string, data: any): Promise<UserProfile> {
    return firstValueFrom(this.repository.update(id, data));
  }

  async delete(id: string): Promise<void> {
    return firstValueFrom(this.repository.delete(id));
  }

  async searchClients(query: string, limit: number = 20): Promise<UserProfile[]> {
    return firstValueFrom(this.repository.searchClients(query, limit));
  }

  async getRecentClients(limit: number = 20): Promise<UserProfile[]> {
    return firstValueFrom(this.repository.getRecentClients(limit));
  }

  async getUnifiedClients(): Promise<any[]> {
    return firstValueFrom(this.repository.getUnifiedClients());
  }
}
