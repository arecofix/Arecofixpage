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
    const dummyEmail = data.email || `cliente_${data.phone?.replace(/\D/g, '') || Date.now()}@arecofix.com`;
    const dummyPassword = crypto.randomUUID(); // Contraseña segura al azar
    
    const payload = {
      ...data,
      email: dummyEmail,
      password: dummyPassword,
      role: 'user', // Forzar rol
      tenant_id: tenantId,
    };

    try {
      const functionData = await this.invokeCreateEmployeeRecursive(payload);

      if (functionData?.user?.id) {
         // Marcarlo como invitado
         await this.update(functionData.user.id, { is_guest: true });
         const newProfile = await this.getById(functionData.user.id);
         if (newProfile) return newProfile;
      }
    } catch (e: any) {
      console.warn('Error en Edge Function create-employee o en actualización posterior:', e);
      throw new Error(`Error del servidor al crear cliente: ${e.message || 'Desconocido'}`);
    }

    throw new Error('No se pudo crear el cliente, respuesta vacía del servidor.');
  }

  /**
   * Recursive function to invoke the Edge Function with retries.
   * Applying clean architecture and recursive retry pattern for resilience.
   */
  private async invokeCreateEmployeeRecursive(payload: any, retriesLeft: number = 2): Promise<any> {
    const supabase = this.authService.getSupabaseClient();
    
    const { data: functionData, error } = await supabase.functions.invoke('create-employee', {
      body: payload
    });

    if (error || functionData?.error) {
      const errorMessage = error?.message || functionData?.error || 'Unknown edge function error';
      
      // Don't retry on 403 Forbidden or 400 Bad Request, as these are client errors
      const isClientError = errorMessage.includes('Forbidden') || errorMessage.includes('Bad Request') || errorMessage.includes('non-2xx status code');
      
      if (retriesLeft > 0 && !isClientError) {
        console.warn(`[CustomerService] Edge function failed, retrying... (${retriesLeft} retries left). Error: ${errorMessage}`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Delay before retry
        return this.invokeCreateEmployeeRecursive(payload, retriesLeft - 1);
      }
      
      // Throw clear error message to bubble up to the UI
      if (errorMessage.includes('non-2xx status code')) {
         throw new Error('Permisos insuficientes o error interno en el servidor al intentar registrar al usuario.');
      }
      throw new Error(errorMessage);
    }

    return functionData;
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
    const profiles = await firstValueFrom(this.repository.getUnifiedClients());
    const supabase = this.authService.getSupabaseClient();
    const { data: standaloneOrders } = await supabase
      .from('orders')
      .select('customer_name, customer_email, customer_phone, created_at')
      .is('user_id', null);

    const merged = [...(profiles || [])];

    if (standaloneOrders) {
      // Group by email or phone
      const guestMap = new Map<string, any>();
      for (const order of standaloneOrders) {
        const key = order.customer_email || order.customer_phone;
        if (!key) continue;
        
        // Skip if this email/phone is already in profiles
        if (merged.some(p => p.email === order.customer_email || p.phone === order.customer_phone)) continue;

        if (!guestMap.has(key)) {
          guestMap.set(key, {
            id: 'guest_' + key,
            first_name: order.customer_name?.split(' ')[0] || 'Invitado',
            last_name: order.customer_name?.split(' ').slice(1).join(' ') || '',
            full_name: order.customer_name,
            email: order.customer_email,
            phone: order.customer_phone,
            source: 'order',
            repair_count: 0,
            order_count: 1,
            created_at: order.created_at
          });
        } else {
          guestMap.get(key).order_count++;
        }
      }
      
      merged.push(...Array.from(guestMap.values()));
    }

    return merged.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  async getPaginatedUnifiedClients(page: number, limit: number, searchTerm?: string): Promise<{ data: any[], total: number }> {
    return firstValueFrom(this.repository.getPaginatedUnifiedClients(page, limit, searchTerm));
  }
}
