import { InstallmentPlan } from './installment-plan.vo';

describe('InstallmentPlan Value Object', () => {
  it('debe inicializar un plan de cuotas correctamente', () => {
    const plan = new InstallmentPlan({
      agreedPrice: 150000,
      installmentsCount: 3,
      installmentAmount: 50000,
      installmentsPaid: 1,
      nextDueDate: new Date('2026-12-05T00:00:00Z')
    });

    expect(plan.agreedPrice.amount).toBe(150000);
    expect(plan.installmentsCount).toBe(3);
    expect(plan.installmentAmount.amount).toBe(50000);
    expect(plan.installmentsPaid).toBe(1);
    expect(plan.remainingInstallments).toBe(2);
    expect(plan.totalPaid.amount).toBe(50000);
    expect(plan.remainingBalance.amount).toBe(100000);
    expect(plan.isFullyPaid).toBe(false);
  });

  it('debe rechazar un plan con cuotas menores a 1', () => {
    expect(() => new InstallmentPlan({
      agreedPrice: 1000,
      installmentsCount: 0,
      installmentAmount: 1000
    })).toThrow('La cantidad de cuotas debe ser al menos 1');
  });

  it('debe rechazar si las cuotas pagadas superan las cuotas totales', () => {
    expect(() => new InstallmentPlan({
      agreedPrice: 1000,
      installmentsCount: 3,
      installmentAmount: 333.33,
      installmentsPaid: 4
    })).toThrow('Las cuotas pagadas no pueden superar la cantidad total de cuotas');
  });

  it('debe avanzar el plan con withNewPayment y calcular próxima fecha', () => {
    const plan = new InstallmentPlan({
      agreedPrice: 150000,
      installmentsCount: 3,
      installmentAmount: 50000,
      installmentsPaid: 0,
      nextDueDate: new Date('2026-11-05T00:00:00Z')
    });

    const updatedPlan = plan.withNewPayment(new Date('2026-11-05T00:00:00Z'));
    expect(updatedPlan.installmentsPaid).toBe(1);
    expect(updatedPlan.remainingInstallments).toBe(2);
    expect(updatedPlan.totalPaid.amount).toBe(50000);
    expect(updatedPlan.remainingBalance.amount).toBe(100000);
    expect(updatedPlan.nextDueDate).not.toBeNull();
    expect(updatedPlan.nextDueDate?.getMonth()).toBe(11); // December (0-indexed)
  });

  it('debe marcar isFullyPaid y dejar nextDueDate en null cuando se paga la última cuota', () => {
    const plan = new InstallmentPlan({
      agreedPrice: 150000,
      installmentsCount: 3,
      installmentAmount: 50000,
      installmentsPaid: 2,
      nextDueDate: new Date('2026-12-05T00:00:00Z')
    });

    const finalPlan = plan.withNewPayment(new Date('2026-12-05T00:00:00Z'));
    expect(finalPlan.installmentsPaid).toBe(3);
    expect(finalPlan.remainingInstallments).toBe(0);
    expect(finalPlan.isFullyPaid).toBe(true);
    expect(finalPlan.remainingBalance.amount).toBe(0);
    expect(finalPlan.nextDueDate).toBeNull();
  });

  it('debe lanzar error si se intenta registrar un pago en un plan ya pagado', () => {
    const plan = new InstallmentPlan({
      agreedPrice: 50000,
      installmentsCount: 1,
      installmentAmount: 50000,
      installmentsPaid: 1,
      nextDueDate: null
    });

    expect(() => plan.withNewPayment()).toThrow('El plan de cuotas ya está completamente cancelado');
  });

  describe('Real Academy Courses Pricing Logic (Hotfix)', () => {
    it('debe modelar Carrera Completa: $720.000 total en 6 cuotas de $120.000', () => {
      const carreraPlan = new InstallmentPlan({
        agreedPrice: 720000,
        installmentsCount: 6,
        installmentAmount: 120000,
        installmentsPaid: 1,
        nextDueDate: new Date('2026-12-05T00:00:00Z')
      });

      expect(carreraPlan.agreedPrice.amount).toBe(720000);
      expect(carreraPlan.installmentAmount.amount).toBe(120000);
      expect(carreraPlan.installmentsCount).toBe(6);
      expect(carreraPlan.totalPaid.amount).toBe(120000);
      expect(carreraPlan.remainingBalance.amount).toBe(600000);
      expect(carreraPlan.remainingInstallments).toBe(5);
    });

    it('debe modelar Reparación Android: $270.000 total en 3 cuotas de $90.000', () => {
      const androidPlan = new InstallmentPlan({
        agreedPrice: 270000,
        installmentsCount: 3,
        installmentAmount: 90000,
        installmentsPaid: 0,
        nextDueDate: new Date('2026-11-20T00:00:00Z')
      });

      expect(androidPlan.agreedPrice.amount).toBe(270000);
      expect(androidPlan.installmentAmount.amount).toBe(90000);
      expect(androidPlan.installmentsCount).toBe(3);
      expect(androidPlan.totalPaid.amount).toBe(0);
      expect(androidPlan.remainingBalance.amount).toBe(270000);
      expect(androidPlan.remainingInstallments).toBe(3);
    });
  });
});

