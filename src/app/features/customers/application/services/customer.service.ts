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
    // 1. Re-use existing client to avoid duplicates
    const existing = await firstValueFrom(
      this.repository.findByEmailOrPhone(data.email, data.phone)
    );
    if (existing) return existing;

    // 2. Create guest profile via Postgres RPC (SECURITY DEFINER).
    //    This bypasses the profiles.id → auth.users FK constraint, which blocked
    //    direct INSERT of guest profiles (error 23503). The Edge Function approach
    //    also failed because it needs service_role credentials not available client-side.
    const tenantId = this.tenantService.getCurrentTenant()?.id ?? data.tenant_id;
    const supabase = this.authService.getSupabaseClient();

    // Generar un email falso único si no se provee uno, para evitar el error de constraint único
    // si el RPC internamente convierte null a ''.
    const finalEmail = (data.email && data.email.trim() !== '') 
        ? data.email.trim() 
        : `guest_${crypto.randomUUID().substring(0, 8)}@noemail.com`;

    const { data: rpcResult, error } = await supabase.rpc('create_guest_profile', {
      p_first_name: data.first_name   || '',
      p_last_name:  data.last_name    || '',
      p_email:      finalEmail,
      p_phone:      data.phone        || null,
      p_address:    data.address      || '',
      p_dni:        data.dni          || null,
      p_tenant_id:  tenantId          || null,
      p_branch_id:  data.branch_id    || null,
    });

    if (error) {
      console.error('[CustomerService] create_guest_profile RPC failed:', error);
      throw new Error(`Error al crear el cliente: ${error.message}`);
    }

    // rpcResult is the JSON of the inserted profile row
    const profile = rpcResult as UserProfile;
    if (!profile?.id) {
      throw new Error('No se pudo crear el perfil del cliente (respuesta vacía).');
    }

    return profile;
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
