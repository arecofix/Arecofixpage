export class Money {
  private readonly _amount: number;

  private constructor(amount: number) {
    if (isNaN(amount) || !isFinite(amount)) {
      throw new Error('El monto debe ser un número válido');
    }
    if (amount < 0) {
      throw new Error('El monto no puede ser negativo');
    }
    // Round to 2 decimal places
    this._amount = Math.round(amount * 100) / 100;
  }

  public static create(amount: number): Money {
    return new Money(amount);
  }

  public static zero(): Money {
    return new Money(0);
  }

  public get amount(): number {
    return this._amount;
  }

  public add(other: Money): Money {
    return new Money(this._amount + other.amount);
  }

  public subtract(other: Money): Money {
    const diff = this._amount - other.amount;
    if (diff < 0) {
      throw new Error('La resta de montos no puede resultar en un valor negativo');
    }
    return new Money(diff);
  }

  public multiply(factor: number): Money {
    if (factor < 0) {
      throw new Error('El factor multiplicador no puede ser negativo');
    }
    return new Money(this._amount * factor);
  }

  public equals(other: Money): boolean {
    return Math.abs(this._amount - other.amount) < 0.001;
  }

  public format(currency: string = '$'): string {
    return `${currency} ${this._amount.toLocaleString('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }
}

