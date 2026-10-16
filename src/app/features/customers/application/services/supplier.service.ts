import { Injectable, inject } from '@angular/core';
import { SupplierRepository } from '@app/domain/repositories/supplier.repository';
import { Supplier, CreateSupplierDto, UpdateSupplierDto } from '../../domain/entities/supplier.entity';
import { IEventBus } from '@app/domain/events/event-bus.interface';
import { SupplierPaymentMadeEvent } from '@app/domain/events/supplier-payment-made.event';
import { PaymentMethod } from '@app/domain/events/types/payment-method';
import { SupabaseSupplierRepository } from '../../infrastructure/repositories/supabase-supplier.repository';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private repository = inject(SupplierRepository);
  private supabaseRepo = inject(SupabaseSupplierRepository);
  private eventBus = inject(IEventBus);

  async getAll(): Promise<Supplier[]> {
    return firstValueFrom(this.supabaseRepo.getAll());
  }

  async getPaginated(page: number, limit: number): Promise<{ data: Supplier[]; total: number }> {
    return firstValueFrom(this.supabaseRepo.getPaginated(page, limit));
  }

  async getById(id: string): Promise<Supplier | null> {
    return firstValueFrom(this.supabaseRepo.getById(id));
  }

  async create(data: CreateSupplierDto): Promise<Supplier> {
    return firstValueFrom(this.supabaseRepo.create(data));
  }

  async update(id: string, data: UpdateSupplierDto): Promise<Supplier> {
    return firstValueFrom(this.supabaseRepo.update(id, data));
  }

  async delete(id: string): Promise<void> {
    return firstValueFrom(this.supabaseRepo.delete(id));
  }

  /**
   * Registers a payment to a supplier and dispatches SupplierPaymentMadeEvent
   */
  async registerPayment(
    supplierId: string,
    payment: {
      purchaseId: string | null;
      amount: number;
      paymentMethod: PaymentMethod;
      paidAt?: Date;
    }
  ): Promise<void> {
    const paidAt = payment.paidAt ?? new Date();

    await this.repository.registerPayment(supplierId, {
      purchaseId: payment.purchaseId,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      paidAt,
    });

    this.eventBus.publish(
      new SupplierPaymentMadeEvent(
        supplierId,
        payment.purchaseId,
        payment.amount,
        payment.paymentMethod,
        paidAt,
      )
    );
  }
}
