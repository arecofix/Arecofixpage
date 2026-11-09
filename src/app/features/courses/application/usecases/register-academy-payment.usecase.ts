import { Injectable, inject } from '@angular/core';
import {
  AcademyPaymentRepository,
  RegisterPaymentParams,
  RegisterPaymentResult
} from '../../domain/repositories/academy-payment.repository';
import { Money } from '../../domain/value-objects/money.vo';

export interface RegisterPaymentResponse {
  success: boolean;
  data?: RegisterPaymentResult;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegisterAcademyPaymentUseCase {
  private paymentRepository = inject(AcademyPaymentRepository);

  async execute(params: RegisterPaymentParams): Promise<RegisterPaymentResponse> {
    try {
      if (!params.enrollmentId || !params.enrollmentId.trim()) {
        return { success: false, error: 'El ID de matrícula es obligatorio' };
      }

      if (!params.createdBy || !params.createdBy.trim()) {
        return { success: false, error: 'El usuario operador (createdBy) es obligatorio' };
      }

      if (!params.paymentMethod || !params.paymentMethod.trim()) {
        return { success: false, error: 'El método de pago es obligatorio' };
      }

      let money: Money;
      try {
        money = Money.create(params.amount);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Monto inválido';
        return { success: false, error: msg };
      }

      if (money.amount <= 0) {
        return { success: false, error: 'El monto a registrar debe ser estrictamente mayor a 0' };
      }

      const result = await this.paymentRepository.registerPayment({
        ...params,
        amount: money.amount
      });

      return {
        success: true,
        data: result
      };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error inesperado al registrar el pago';
      return {
        success: false,
        error: msg
      };
    }
  }
}

