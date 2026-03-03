import { Injectable, inject } from '@angular/core';
import { SupabaseEmployeeRepository } from '../../infrastructure/repositories/supabase-employee.repository';
import { UserProfile } from '@app/features/authentication/domain/entities/user.entity';
import { firstValueFrom } from 'rxjs';
import { TenantService } from '@app/core/services/tenant.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private repository = inject(SupabaseEmployeeRepository);
  private tenantService = inject(TenantService);

  async getAll(): Promise<UserProfile[]> {
    return firstValueFrom(this.repository.getEmployees());
  }

  async getById(id: string): Promise<UserProfile | null> {
    return firstValueFrom(this.repository.getById(id));
  }

  async create(data: any): Promise<UserProfile> {
    const tenantId = this.tenantService.getTenantId()!;
    return firstValueFrom(this.repository.createEmployee(data, tenantId));
  }

  async update(id: string, data: any): Promise<UserProfile> {
    return firstValueFrom(this.repository.update(id, data));
  }

  async delete(id: string): Promise<void> {
    return firstValueFrom(this.repository.delete(id));
  }
}
