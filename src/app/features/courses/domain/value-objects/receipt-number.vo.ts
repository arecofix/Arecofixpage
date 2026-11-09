export class ReceiptNumber {
  private readonly _value: string;
  private static readonly PATTERN = /^REC-ACAD-\d{8}-[A-F0-9]{6}$/;

  private constructor(value: string) {
    const trimmed = value.trim().toUpperCase();
    if (!ReceiptNumber.PATTERN.test(trimmed)) {
      throw new Error(`Número de recibo inválido: "${value}". Debe coincidir con REC-ACAD-YYYYMMDD-XXXXXX`);
    }
    this._value = trimmed;
  }

  public static create(value: string): ReceiptNumber {
    return new ReceiptNumber(value);
  }

  public static generate(date: Date = new Date()): ReceiptNumber {
    const yyyy = date.getFullYear().toString();
    const mm = (date.getMonth() + 1).toString().padStart(2, '0');
    const dd = date.getDate().toString().padStart(2, '0');
    const randHex = Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .toUpperCase()
      .padStart(6, '0');
    return new ReceiptNumber(`REC-ACAD-${yyyy}${mm}${dd}-${randHex}`);
  }

  public get value(): string {
    return this._value;
  }

  public equals(other: ReceiptNumber): boolean {
    return this._value === other.value;
  }

  public toString(): string {
    return this._value;
  }
}

