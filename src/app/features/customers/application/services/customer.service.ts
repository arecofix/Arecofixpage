import { Injectable, inject } from '@angular/core';
import { CustomerRepository } from '../../domain/repositories/customer.repository';
import { UserProfile } from '@app/features/authentication/domain/entities/user.entity';
import { firstValueFrom } from 'rxjs';
import { TenantService } from '@app/core/services/tenant.service';
import { AuthService } from '@app/core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private customerRepository = inject(CustomerRepository);
  private tenantService = inject(TenantService);
  private authService = inject(AuthService);

  async getAll(): Promise<UserProfile[]> {
    return this.getRecentClients(1000);
  }

  async getById(id: string): Promise<UserProfile | null> {
    return firstValueFrom(this.customerRepository.getById(id));
  }

  async create(data: any): Promise<UserProfile> {
    // 1. Re-use existing client to avoid duplicates ONLY if it is actually the same person
    const existing = await firstValueFrom(
      this.customerRepository.findByEmailOrPhone(data.email, data.phone)
    );
    
    let shouldReuse = false;
    if (existing) {
        if (data.email && existing.email === data.email) {
            shouldReuse = true;
        } else if (data.phone && existing.phone === data.phone) {
            const newName = `${data.first_name || ''} ${data.last_name || ''}`.toLowerCase().trim();
            const existingName = `${existing.first_name || ''} ${existing.last_name || ''}`.toLowerCase().trim();
            
            const newParts = newName.split(' ').filter(p => p.length > 2);
            // If they didn't provide a meaningful name, or at least one significant part of the name matches
            if (newParts.length === 0 || newParts.some(p => existingName.includes(p))) {
                shouldReuse = true;
            }
        }
    }
    
    if (shouldReuse && existing) return existing;

    // 2. Create profile through the repository (handles offline/online)
    const profile = await firstValueFrom(this.customerRepository.createClient(data));
    
    if (!profile?.id) {
      throw new Error('No se pudo crear el perfil del cliente (respuesta vacía).');
    }

    return profile;
  }

  async update(id: string, data: any): Promise<UserProfile> {
    return firstValueFrom(this.customerRepository.update(id, data));
  }

  async delete(id: string): Promise<void> {
    return firstValueFrom(this.customerRepository.delete(id));
  }

  async searchClients(query: string, limit: number = 20): Promise<UserProfile[]> {
    return firstValueFrom(this.customerRepository.searchClients(query, limit));
  }

  findByEmailOrPhone(email?: string, phone?: string): Promise<UserProfile | null> {
    return firstValueFrom(this.customerRepository.findByEmailOrPhone(email, phone));
  }

  async getRecentClients(limit: number = 20): Promise<UserProfile[]> {
    return firstValueFrom(this.customerRepository.getRecentClients(limit));
  }

  async getUnifiedClients(): Promise<any[]> {
    const profiles = await firstValueFrom(this.customerRepository.getUnifiedClients());
    // Fallback logic for standalone orders should be handled gracefully offline
    return profiles || [];
  }

  async getPaginatedUnifiedClients(page: number, limit: number, searchTerm?: string): Promise<{ data: any[], total: number }> {
    return firstValueFrom(this.customerRepository.getPaginatedUnifiedClients(page, limit, searchTerm));
  }
}
