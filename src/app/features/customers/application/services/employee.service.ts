import { Injectable, inject } from '@angular/core';
import { SupabaseEmployeeRepository } from '../../infrastructure/repositories/supabase-employee.repository';
import { UserProfile } from '@app/features/authentication/domain/entities/user.entity';
import { firstValueFrom } from 'rxjs';
import { TenantService } from '@app/core/services/tenant.service';
import { AuthService } from '@app/core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private repository = inject(SupabaseEmployeeRepository);
  private tenantService = inject(TenantService);
  private authService = inject(AuthService);

  async getAll(): Promise<UserProfile[]> {
    return firstValueFrom(this.repository.getEmployees());
  }

  async getPaginated(page: number, limit: number): Promise<{ data: UserProfile[], total: number }> {
    return firstValueFrom(this.repository.getPaginatedEmployees(page, limit));
  }

  async getById(id: string): Promise<UserProfile | null> {
    return firstValueFrom(this.repository.getById(id));
  }

  /**
   * 🛡️ Llama a la Edge Function segura para crear al empleado.
   * Supabase-js inyecta automáticamente el JWT del administrador autenticado.
   * La Edge Function se encargará de usar la API de Admin (auth.admin.createUser).
   */
  async create(data: any): Promise<UserProfile> {
    const tenantId = this.tenantService.getTenantId()!;
    const supabase = this.authService.getSupabaseClient();

    const { data: functionData, error } = await supabase.functions.invoke('create-employee', {
      body: {
        ...data,
        tenant_id: tenantId,
      }
    });

    if (error) {
      console.error('Error invoking edge function:', error);
      let errorMsg = error.message || 'Error de conexión con el servidor al crear empleado';
      
      // 🐛 Extraer el mensaje REAL de la Edge Function (el JSON que enviamos con status 400/500)
      if (error.name === 'FunctionsHttpError' && error.context && typeof error.context.json === 'function') {
        try {
          // error.context contiene el objeto Response original del fetch
          const errBody = await error.context.json();
          errorMsg = errBody.error || errorMsg;
        } catch (e) {
          console.warn('No se pudo parsear el JSON del error:', e);
        }
      }

      throw new Error(errorMsg);
    }

    if (functionData?.error) {
      throw new Error(functionData.error);
    }

    // Opcional: Una vez creado en el servidor, recuperamos el perfil fresco de la DB.
    if (functionData?.user?.id) {
       const newProfile = await this.getById(functionData.user.id);
       if (newProfile) return newProfile;
    }
    
    return data as UserProfile; // Fallback
  }

  async update(id: string, data: any): Promise<UserProfile> {
    return firstValueFrom(this.repository.update(id, data));
  }

  async delete(id: string): Promise<void> {
    return firstValueFrom(this.repository.delete(id));
  }
}
