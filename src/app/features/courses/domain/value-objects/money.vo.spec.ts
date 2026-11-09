import { Money } from './money.vo';

describe('Money Value Object', () => {
  it('debe crear una instancia con monto válido y redondear a 2 decimales', () => {
    const money = Money.create(150.556);
    expect(money.amount).toBe(150.56);
  });

  it('debe crear un Money cero', () => {
    const zero = Money.zero();
    expect(zero.amount).toBe(0);
  });

  it('debe lanzar error ante números no válidos o negativos', () => {
    expect(() => Money.create(NaN)).toThrow('El monto debe ser un número válido');
    expect(() => Money.create(-10)).toThrow('El monto no puede ser negativo');
  });

  it('debe sumar dos montos correctamente', () => {
    const m1 = Money.create(100.50);
    const m2 = Money.create(50.25);
    const sum = m1.add(m2);
    expect(sum.amount).toBe(150.75);
  });

  it('debe restar dos montos y lanzar error si el resultado fuera negativo', () => {
    const m1 = Money.create(100);
    const m2 = Money.create(40);
    expect(m1.subtract(m2).amount).toBe(60);

    expect(() => m2.subtract(m1)).toThrow('La resta de montos no puede resultar en un valor negativo');
  });

  it('debe multiplicar por un factor positivo', () => {
    const m = Money.create(25);
    expect(m.multiply(3).amount).toBe(75);
    expect(() => m.multiply(-2)).toThrow('El factor multiplicador no puede ser negativo');
  });

  it('debe comparar igualdad con equals', () => {
    const m1 = Money.create(100.00);
    const m2 = Money.create(100);
    const m3 = Money.create(100.01);
    expect(m1.equals(m2)).toBe(true);
    expect(m1.equals(m3)).toBe(false);
  });

  it('debe formatear a texto con moneda', () => {
    const m = Money.create(12500.5);
    const formatted = m.format('$');
    expect(formatted).toContain('12.500,50');
  });
});

