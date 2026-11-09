import { AcademyPayment } from '../entities/academy-subscription.entity';

export interface RegisterPaymentParams {
  enrollmentId: string;
  amount: number;
  paymentMethod: string;
  paidAt?: Date;
  periodNumber?: number;
  notes?: string;
  createdBy: string;
}

export interface RegisterPaymentResult {
  paymentId: string;
  receiptNumber: string;
  enrollmentId: string;
  amount: number;
  periodNumber: number;
  installmentsPaid: number;
  installmentsCount: number;
  nextDueDate: string | null;
  paymentPlanStatus: string;
}

export interface VoidPaymentResult {
  paymentId: string;
  status: string;
  enrollmentId: string;
  installmentsPaid: number;
  paymentPlanStatus: string;
  nextDueDate: string | null;
  cashMovementId: string;
}

export abstract class AcademyPaymentRepository {
  abstract registerPayment(params: RegisterPaymentParams): Promise<RegisterPaymentResult>;
  abstract getPaymentsByEnrollment(enrollmentId: string): Promise<AcademyPayment[]>;
  abstract getAllPayments(): Promise<AcademyPayment[]>;
  abstract voidPayment(paymentId: string, adminUserId: string, reason: string): Promise<VoidPaymentResult>;
}

