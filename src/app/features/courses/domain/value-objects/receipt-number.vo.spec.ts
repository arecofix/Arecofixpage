import { ReceiptNumber } from './receipt-number.vo';

describe('ReceiptNumber Value Object', () => {
  it('debe crear una instancia con un formato REC-ACAD-YYYYMMDD-XXXXXX válido', () => {
    const rec = ReceiptNumber.create('REC-ACAD-20261105-ABCDEF');
    expect(rec.value).toBe('REC-ACAD-20261105-ABCDEF');
    expect(rec.toString()).toBe('REC-ACAD-20261105-ABCDEF');
  });

  it('debe normalizar a mayúsculas y quitar espacios en blanco', () => {
    const rec = ReceiptNumber.create('  rec-acad-20261105-1a2b3c  ');
    expect(rec.value).toBe('REC-ACAD-20261105-1A2B3C');
  });

  it('debe rechazar formatos inválidos', () => {
    expect(() => ReceiptNumber.create('REC-123')).toThrow('Número de recibo inválido');
    expect(() => ReceiptNumber.create('REC-ACAD-2026-ABC')).toThrow('Número de recibo inválido');
    expect(() => ReceiptNumber.create('REC-ACAD-20261105-TOOLONGSTRING')).toThrow('Número de recibo inválido');
  });

  it('debe generar un recibo automáticamente con la fecha dada y sufijo hexadecimal de 6 dígitos', () => {
    const fixedDate = new Date(2026, 10, 5); // Nov 5, 2026
    const generated = ReceiptNumber.generate(fixedDate);
    expect(generated.value).toMatch(/^REC-ACAD-20261105-[A-F0-9]{6}$/);
  });

  it('debe comparar igualdad entre recibos', () => {
    const r1 = ReceiptNumber.create('REC-ACAD-20261105-112233');
    const r2 = ReceiptNumber.create('REC-ACAD-20261105-112233');
    const r3 = ReceiptNumber.create('REC-ACAD-20261105-998877');
    expect(r1.equals(r2)).toBe(true);
    expect(r1.equals(r3)).toBe(false);
  });
});

