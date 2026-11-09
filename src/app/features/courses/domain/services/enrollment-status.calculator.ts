import {
  EnrollmentStatus,
  EffectiveEnrollmentStatus
} from '../entities/course.entity';

export class EnrollmentStatusCalculator {
  private static readonly GRACE_PERIOD_DAYS = 7;

  /**
   * Calculates effective enrollment status mirroring the PostgreSQL
   * public.effective_enrollment_status function.
   */
  public static calculate(
    status: EnrollmentStatus | string,
    nextDueDate: Date | string | null | undefined,
    referenceDate: Date = new Date()
  ): EffectiveEnrollmentStatus {
    const normalizedStatus = (status || '').toLowerCase().trim();

    if (normalizedStatus === 'completed') {
      return 'completed';
    }
    if (normalizedStatus === 'cancelled') {
      return 'cancelled';
    }
    if (normalizedStatus === 'rejected') {
      return 'rejected';
    }
    if (normalizedStatus === 'scholarship') {
      return 'scholarship';
    }

    // If no due date is defined, return base status (e.g. pending_payment / active)
    if (!nextDueDate) {
      if (normalizedStatus === 'pending_payment' || normalizedStatus === 'pending') {
        return 'pending_payment';
      }
      return 'active';
    }

    const dueDate = nextDueDate instanceof Date ? nextDueDate : new Date(nextDueDate);
    if (isNaN(dueDate.getTime())) {
      return normalizedStatus === 'pending_payment' ? 'pending_payment' : 'active';
    }

    const nowTime = referenceDate.getTime();
    const dueTime = dueDate.getTime();

    if (nowTime <= dueTime) {
      return 'active';
    }

    const gracePeriodEnd = new Date(dueDate);
    gracePeriodEnd.setDate(gracePeriodEnd.getDate() + this.GRACE_PERIOD_DAYS);

    if (nowTime <= gracePeriodEnd.getTime()) {
      return 'grace_period';
    }

    return 'suspended';
  }
}

