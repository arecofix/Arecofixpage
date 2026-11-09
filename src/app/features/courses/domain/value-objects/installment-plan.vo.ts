import { Money } from './money.vo';

export interface InstallmentPlanProps {
  agreedPrice: number;
  installmentsCount: number;
  installmentAmount: number;
  installmentsPaid?: number;
  nextDueDate?: Date | string | null;
}

export class InstallmentPlan {
  private readonly _agreedPrice: Money;
  private readonly _installmentsCount: number;
  private readonly _installmentAmount: Money;
  private readonly _installmentsPaid: number;
  private readonly _nextDueDate: Date | null;

  constructor(props: InstallmentPlanProps) {
    if (props.installmentsCount < 1) {
      throw new Error('La cantidad de cuotas debe ser al menos 1');
    }
    this._agreedPrice = Money.create(props.agreedPrice);
    this._installmentsCount = Math.floor(props.installmentsCount);
    this._installmentAmount = Money.create(props.installmentAmount);
    this._installmentsPaid = Math.max(0, Math.floor(props.installmentsPaid ?? 0));

    if (this._installmentsPaid > this._installmentsCount) {
      throw new Error('Las cuotas pagadas no pueden superar la cantidad total de cuotas');
    }

    if (props.nextDueDate) {
      this._nextDueDate = props.nextDueDate instanceof Date ? props.nextDueDate : new Date(props.nextDueDate);
    } else {
      this._nextDueDate = null;
    }
  }

  public get agreedPrice(): Money {
    return this._agreedPrice;
  }

  public get installmentsCount(): number {
    return this._installmentsCount;
  }

  public get installmentAmount(): Money {
    return this._installmentAmount;
  }

  public get installmentsPaid(): number {
    return this._installmentsPaid;
  }

  public get nextDueDate(): Date | null {
    return this._nextDueDate;
  }

  public get remainingInstallments(): number {
    return Math.max(0, this._installmentsCount - this._installmentsPaid);
  }

  public get isFullyPaid(): boolean {
    return this._installmentsPaid >= this._installmentsCount;
  }

  public get totalPaid(): Money {
    return this._installmentAmount.multiply(this._installmentsPaid);
  }

  public get remainingBalance(): Money {
    const diff = this._agreedPrice.amount - this.totalPaid.amount;
    return Money.create(Math.max(0, diff));
  }

  public withNewPayment(paidAt: Date = new Date()): InstallmentPlan {
    if (this.isFullyPaid) {
      throw new Error('El plan de cuotas ya está completamente cancelado');
    }
    const newPaidCount = this._installmentsPaid + 1;
    let newNextDueDate: Date | null = null;

    if (newPaidCount < this._installmentsCount) {
      const baseDate = this._nextDueDate && this._nextDueDate.getTime() > paidAt.getTime()
        ? new Date(this._nextDueDate)
        : new Date(paidAt);
      baseDate.setMonth(baseDate.getMonth() + 1);
      newNextDueDate = baseDate;
    }

    return new InstallmentPlan({
      agreedPrice: this._agreedPrice.amount,
      installmentsCount: this._installmentsCount,
      installmentAmount: this._installmentAmount.amount,
      installmentsPaid: newPaidCount,
      nextDueDate: newNextDueDate
    });
  }
}

