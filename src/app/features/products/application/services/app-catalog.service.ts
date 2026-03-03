import { Injectable, inject } from '@angular/core';
import { SupabaseAppServiceRepository } from '../../infrastructure/repositories/supabase-app-service.repository';
import { AppServiceEntity, CreateAppServiceDto, UpdateAppServiceDto } from '../../domain/entities/app-service.entity';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppCatalogService {
  private repository = inject(SupabaseAppServiceRepository);

  async getAll(): Promise<AppServiceEntity[]> {
    return firstValueFrom(this.repository.getAll({ column: 'created_at', ascending: false }));
  }

  async getById(id: string): Promise<AppServiceEntity | null> {
    return firstValueFrom(this.repository.getById(id));
  }

  async create(data: CreateAppServiceDto): Promise<AppServiceEntity> {
    return firstValueFrom(this.repository.create(data));
  }

  async update(id: string, data: UpdateAppServiceDto): Promise<AppServiceEntity> {
    return firstValueFrom(this.repository.update(id, data));
  }

  async delete(id: string): Promise<void> {
    return firstValueFrom(this.repository.delete(id));
  }
}
