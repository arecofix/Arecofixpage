import { Injectable, inject } from '@angular/core';
import {
  AcademyPaymentRepository,
  RegisterPaymentParams,
  RegisterPaymentResult,
  VoidPaymentResult
} from '../../domain/repositories/academy-payment.repository';
import { AcademyPayment } from '../../domain/entities/academy-subscription.entity';
import { TenantScopedQueryService } from '@app/core/infrastructure/supabase/tenant-scoped-query.service';

@Injectable({
  providedIn: 'root'
})
export class SupabaseAcademyPaymentRepository extends AcademyPaymentRepository {
  private scoped = inject(TenantScopedQueryService);

  async registerPayment(params: RegisterPaymentParams): Promise<RegisterPaymentResult> {
    const { data, error } = await this.scoped.client.rpc('register_academy_payment', {
      p_enrollment_id: params.enrollmentId,
      p_amount: params.amount,
      p_payment_method: params.paymentMethod,
      p_paid_at: params.paidAt ? params.paidAt.toISOString() : new Date().toISOString(),
      p_period_number: params.periodNumber ?? null,
      p_notes: params.notes ?? null,
      p_created_by: params.createdBy
    });

    if (error) {
      throw new Error(error.message || 'Error al registrar el pago de academia');
    }

    return {
      paymentId: data.payment_id,
      receiptNumber: data.receipt_number,
      enrollmentId: data.enrollment_id,
      amount: Number(data.amount),
      periodNumber: data.period_number,
      installmentsPaid: data.installments_paid,
      installmentsCount: data.installments_count,
      nextDueDate: data.next_due_date,
      paymentPlanStatus: data.payment_plan_status
    };
  }

  async getPaymentsByEnrollment(enrollmentId: string): Promise<AcademyPayment[]> {
    const { data, error } = await this.scoped.from('academy_payments')
      .select('*')
      .eq('enrollment_id', enrollmentId)
      .order('paid_at', { ascending: false });

    if (error) throw error;
    return (data || []) as AcademyPayment[];
  }

  async voidPayment(paymentId: string, adminUserId: string, reason: string): Promise<VoidPaymentResult> {
    const { data, error } = await this.scoped.client.rpc('void_academy_payment', {
      p_payment_id: paymentId,
      p_user_id_admin: adminUserId,
      p_reason: reason
    });

    if (error) {
      throw new Error(error.message || 'Error al anular el pago');
    }

    return {
      paymentId: data.payment_id,
      status: data.status,
      enrollmentId: data.enrollment_id,
      installmentsPaid: data.installments_paid,
      paymentPlanStatus: data.payment_plan_status,
      nextDueDate: data.next_due_date,
      cashMovementId: data.cash_movement_id
    };
  }

  async getAllPayments(): Promise<AcademyPayment[]> {
    const { data, error } = await this.scoped.from('academy_payments')
      .select('*')
      .order('paid_at', { ascending: false });

    if (error) throw error;
    return (data || []) as AcademyPayment[];
  }
}

