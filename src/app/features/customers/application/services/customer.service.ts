import { Injectable, inject } from '@angular/core';
import { SupabaseCustomerRepository } from '../../infrastructure/repositories/supabase-customer.repository';
import { UserProfile } from '@app/features/authentication/domain/entities/user.entity';
import { firstValueFrom } from 'rxjs';
import { TenantService } from '@app/core/services/tenant.service';
import { AuthService } from '@app/core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private repository = inject(SupabaseCustomerRepository);
  private tenantService = inject(TenantService);
  private authService = inject(AuthService);

  async getAll(): Promise<UserProfile[]> {
    return this.getRecentClients(1000);
  }

  async getById(id: string): Promise<UserProfile | null> {
    return firstValueFrom(this.repository.getById(id));
  }

  async create(data: any): Promise<UserProfile> {
    // 1. Intentar encontrar cliente existente para evitar error 409 Conflict
    const existing = await firstValueFrom(this.repository.findByEmailOrPhone(data.email, data.phone));
    if (existing) {
      return existing;
    }

    // 2. Usar la Edge Function para crear el cliente de forma segura en auth.users
    // Esto previene el error 23503 (Foreign Key Constraint) con profiles
    const tenantId = this.tenantService.getCurrentTenant()?.id || data.tenant_id;
    const supabase = this.authService.getSupabaseClient();
    
    // Generar datos requeridos para auth.users
    const dummyEmail = data.email || `cliente_${data.phone?.replace(/\D/g, '') || Date.now()}@arecofix.com`;
    const dummyPassword = crypto.randomUUID(); // Contraseña segura al azar
    
    try {
      const { data: functionData, error } = await supabase.functions.invoke('create-employee', {
        body: {
          ...data,
          email: dummyEmail,
          password: dummyPassword,
          role: 'user', // Forzar rol
          tenant_id: tenantId,
        }
      });

      if (error) {
        throw error;
      }

      if (functionData?.error) {
        throw new Error(functionData.error);
      }

      if (functionData?.user?.id) {
         // Marcarlo como invitado
         await this.update(functionData.user.id, { is_guest: true });
         const newProfile = await this.getById(functionData.user.id);
         if (newProfile) return newProfile;
      }
    } catch (e: any) {
      console.warn('Error en Edge Function create-employee o en actualización posterior:', e);
      throw e;
    }

    throw new Error('No se pudo crear el cliente, respuesta vacía del servidor.');
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

  findByEmailOrPhone(email?: string, phone?: string): Promise<UserProfile | null> {
    return firstValueFrom(this.repository.findByEmailOrPhone(email, phone));
  }

  async getRecentClients(limit: number = 20): Promise<UserProfile[]> {
    return firstValueFrom(this.repository.getRecentClients(limit));
  }

  async getUnifiedClients(): Promise<any[]> {
    return firstValueFrom(this.repository.getUnifiedClients());
  }
}
