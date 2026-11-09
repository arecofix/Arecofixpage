import { Injectable, inject } from '@angular/core';
import { CourseRepository } from '../../domain/repositories/course.repository';
import { StudentEnrollment, PaymentPlanStatus } from '../../domain/entities/course.entity';

export interface CreateEnrollmentDTO {
  studentName: string;
  email: string;
  phone?: string;
  courseId: string;
  courseTitle?: string;
  agreedPrice?: number;
  installmentsCount?: number;
  startDate?: Date;
  paymentDay?: number;
  isScholarship?: boolean;
  notes?: string;
  userId?: string | null;
  tenantId?: string;
}

export interface CreateEnrollmentResult {
  success: boolean;
  enrollment?: StudentEnrollment;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CreateEnrollmentUseCase {
  private courseRepo = inject(CourseRepository);

  async execute(dto: CreateEnrollmentDTO): Promise<CreateEnrollmentResult> {
    try {
      if (!dto.studentName || !dto.studentName.trim()) {
        return { success: false, error: 'El nombre del alumno es obligatorio' };
      }

      if (!dto.email || !dto.email.trim()) {
        return { success: false, error: 'El email del alumno es obligatorio' };
      }

      if (!dto.courseId || !dto.courseId.trim()) {
        return { success: false, error: 'El curso es obligatorio' };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(dto.email.trim())) {
        return { success: false, error: 'El formato de email es inválido' };
      }

      let agreedPrice = dto.agreedPrice ?? 0;
      let installmentsCount = dto.installmentsCount ?? 6;
      let installmentAmount = 0;
      let paymentPlanStatus: PaymentPlanStatus = 'pending_payment';
      let nextDueDate: string | null = null;
      let expiresAt: string | null = null;

      if (dto.isScholarship) {
        agreedPrice = 0;
        installmentsCount = 0;
        installmentAmount = 0;
        paymentPlanStatus = 'scholarship';
        nextDueDate = null;
        expiresAt = null;
      } else {
        if (agreedPrice < 0) {
          return { success: false, error: 'El precio acordado no puede ser negativo' };
        }
        if (installmentsCount <= 0) {
          installmentsCount = 6;
        }

        installmentAmount = Math.round((agreedPrice / installmentsCount) * 100) / 100;
        paymentPlanStatus = 'pending_payment';

        const baseStart = dto.startDate ? new Date(dto.startDate) : new Date();
        const dueDate = new Date(baseStart);
        dueDate.setMonth(dueDate.getMonth() + 1);

        if (dto.paymentDay && dto.paymentDay >= 1 && dto.paymentDay <= 28) {
          dueDate.setDate(dto.paymentDay);
        }

        nextDueDate = dueDate.toISOString();
        expiresAt = nextDueDate;
      }

      const enrollmentToCreate: StudentEnrollment = {
        course_id: dto.courseId,
        user_id: dto.userId || null,
        full_name: dto.studentName.trim(),
        email: dto.email.trim().toLowerCase(),
        phone: dto.phone?.trim() || undefined,
        status: 'confirmed',
        agreed_price: agreedPrice,
        installments_count: installmentsCount,
        installment_amount: installmentAmount,
        installments_paid: 0,
        next_due_date: nextDueDate,
        expires_at: expiresAt,
        payment_plan_status: paymentPlanStatus,
        notes: dto.notes?.trim() || (dto.isScholarship ? 'Alumno becado' : null),
        tenant_id: dto.tenantId
      };

      const created = await this.courseRepo.enrollStudent(enrollmentToCreate);

      return {
        success: true,
        enrollment: created
      };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error inesperado al matricular alumno';
      return {
        success: false,
        error: msg
      };
    }
  }
}

