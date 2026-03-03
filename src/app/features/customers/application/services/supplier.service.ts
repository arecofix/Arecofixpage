import { Injectable, inject } from '@angular/core';
import { SupabaseSupplierRepository } from '../../infrastructure/repositories/supabase-supplier.repository';
import { Supplier, CreateSupplierDto, UpdateSupplierDto } from '../../domain/entities/supplier.entity';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private repository = inject(SupabaseSupplierRepository);

  async getAll(): Promise<Supplier[]> {
    return firstValueFrom(this.repository.getAll());
  }

  async getById(id: string): Promise<Supplier | null> {
    return firstValueFrom(this.repository.getById(id));
  }

  async create(data: CreateSupplierDto): Promise<Supplier> {
    return firstValueFrom(this.repository.create(data));
  }

  async update(id: string, data: UpdateSupplierDto): Promise<Supplier> {
    return firstValueFrom(this.repository.update(id, data));
  }

  async delete(id: string): Promise<void> {
    return firstValueFrom(this.repository.delete(id));
  }
}
