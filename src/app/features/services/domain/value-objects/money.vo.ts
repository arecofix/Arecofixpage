export class Money {
  private readonly amount: number | null;
  private readonly currency: string;

  constructor(amount: number | null | undefined, currency = 'ARS') {
    if (amount !== null && amount !== undefined) {
      if (typeof amount !== 'number' || isNaN(amount) || amount < 0) {
        throw new Error('El monto de Money debe ser un número positivo o null');
      }
      this.amount = Math.round(amount * 100) / 100;
    } else {
      this.amount = null;
    }
    this.currency = currency.toUpperCase();
  }

  getAmount(): number | null {
    return this.amount;
  }

  getCurrency(): string {
    return this.currency;
  }

  isConsult(): boolean {
    return this.amount === null;
  }

  format(): string {
    if (this.isConsult()) {
      return 'Consultar';
    }
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: this.currency,
      minimumFractionDigits: 2,
    }).format(this.amount!);
  }

  static fromNullable(amount: number | null | undefined, currency = 'ARS'): Money {
    return new Money(amount, currency);
  }
}
