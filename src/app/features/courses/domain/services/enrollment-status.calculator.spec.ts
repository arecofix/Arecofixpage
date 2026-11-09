import { EnrollmentStatusCalculator } from './enrollment-status.calculator';

describe('EnrollmentStatusCalculator', () => {
  const referenceDate = new Date('2026-11-05T12:00:00Z');

  it('debe devolver scholarship si el estado base es scholarship', () => {
    expect(EnrollmentStatusCalculator.calculate('scholarship', '2026-01-01', referenceDate)).toBe('scholarship');
  });

  it('debe devolver pending_payment si el estado base es pending_payment sin fecha de vencimiento', () => {
    expect(EnrollmentStatusCalculator.calculate('pending_payment', null, referenceDate)).toBe('pending_payment');
    expect(EnrollmentStatusCalculator.calculate('pending', undefined, referenceDate)).toBe('pending_payment');
  });

  it('debe devolver suspended para alumnos pendientes con vencimiento mayor a 7 dias (Emmanuel, Ludmila, Juan Topo, Marcelo)', () => {
    // Vencimiento hace más de 7 días
    expect(EnrollmentStatusCalculator.calculate('pending_payment', '2026-09-18', referenceDate)).toBe('suspended');
    expect(EnrollmentStatusCalculator.calculate('pending_payment', '2026-10-24', referenceDate)).toBe('suspended');
  });

  it('debe devolver completed si el estado base es completed independientemente de la fecha', () => {
    expect(EnrollmentStatusCalculator.calculate('completed', '2026-01-01', referenceDate)).toBe('completed');
  });

  it('debe devolver cancelled si el estado base es cancelled', () => {
    expect(EnrollmentStatusCalculator.calculate('cancelled', '2026-01-01', referenceDate)).toBe('cancelled');
  });

  it('debe devolver rejected si el estado base es rejected', () => {
    expect(EnrollmentStatusCalculator.calculate('rejected', '2026-01-01', referenceDate)).toBe('rejected');
  });

  it('debe devolver pending_payment si el estado base es pending sin fecha de vencimiento', () => {
    expect(EnrollmentStatusCalculator.calculate('pending', null, referenceDate)).toBe('pending_payment');
  });

  it('debe devolver active si nextDueDate es null o undefined (sin vencimiento pendiente)', () => {
    expect(EnrollmentStatusCalculator.calculate('confirmed', null, referenceDate)).toBe('active');
    expect(EnrollmentStatusCalculator.calculate('active', undefined, referenceDate)).toBe('active');
  });

  it('debe devolver active si nextDueDate es hoy o posterior a la fecha actual', () => {
    const futureDate = new Date('2026-11-10T00:00:00Z');
    expect(EnrollmentStatusCalculator.calculate('confirmed', futureDate, referenceDate)).toBe('active');
  });

  it('debe devolver grace_period si está vencido por 1 a 7 días', () => {
    // 3 days overdue
    const overdue3Days = new Date('2026-11-02T12:00:00Z');
    expect(EnrollmentStatusCalculator.calculate('confirmed', overdue3Days, referenceDate)).toBe('grace_period');

    // 7 days overdue exactly
    const overdue7Days = new Date('2026-10-29T12:00:00Z');
    expect(EnrollmentStatusCalculator.calculate('confirmed', overdue7Days, referenceDate)).toBe('grace_period');
  });

  it('debe devolver suspended si está vencido por más de 7 días (día 8 en adelante)', () => {
    // 8 days overdue
    const overdue8Days = new Date('2026-10-28T11:59:59Z');
    expect(EnrollmentStatusCalculator.calculate('confirmed', overdue8Days, referenceDate)).toBe('suspended');

    // 30 days overdue
    const overdue30Days = new Date('2026-10-06T12:00:00Z');
    expect(EnrollmentStatusCalculator.calculate('confirmed', overdue30Days, referenceDate)).toBe('suspended');
  });
});

