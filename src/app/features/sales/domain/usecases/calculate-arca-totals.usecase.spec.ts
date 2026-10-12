import { CalculateArcaTotalsUseCase } from './calculate-arca-totals.usecase';

describe('CalculateArcaTotalsUseCase', () => {
  describe('Factura A: Discriminación de IVA', () => {
    it('Factura A con IVA 21% → discriminación correcta', () => {
      const items = [{ quantity: 1, unit_price: 1000, tax_rate: 0.21 }];
      const result = CalculateArcaTotalsUseCase.execute(items, 0, 'A');

      expect(result.netAmount21).toBe(1000);
      expect(result.vatAmount21).toBe(210);
      expect(result.totalNet).toBe(1000);
      expect(result.totalVat).toBe(210);
      expect(result.grandTotal).toBe(1210);
      expect(result.isVatIncluded).toBe(false);
      expect(result.isVatExempt).toBe(false);
    });

    it('Factura A con IVA 10.5% → discriminación correcta', () => {
      const items = [{ quantity: 2, unit_price: 2000, tax_rate: 0.105 }];
      const result = CalculateArcaTotalsUseCase.execute(items, 0, 'A');

      expect(result.netAmount105).toBe(4000);
      expect(result.vatAmount105).toBe(420);
      expect(result.totalNet).toBe(4000);
      expect(result.totalVat).toBe(420);
      expect(result.grandTotal).toBe(4420);
    });

    it('Factura A con IVA 27% → discriminación correcta', () => {
      const items = [{ quantity: 1, unit_price: 5000, tax_rate: 0.27 }];
      const result = CalculateArcaTotalsUseCase.execute(items, 0, 'A');

      expect(result.netAmount27).toBe(5000);
      expect(result.vatAmount27).toBe(1350);
      expect(result.totalNet).toBe(5000);
      expect(result.totalVat).toBe(1350);
      expect(result.grandTotal).toBe(6350);
    });

    it('Factura A con múltiples alícuotas → suma correcta', () => {
      const items = [
        { quantity: 1, unit_price: 10000, tax_rate: 0.21 }, // Net 10000, IVA 2100
        { quantity: 1, unit_price: 4000, tax_rate: 0.105 }, // Net 4000, IVA 420
        { quantity: 1, unit_price: 2000, tax_rate: 0.27 },  // Net 2000, IVA 540
        { quantity: 1, unit_price: 1000, tax_rate: 0 },     // Exento 1000, IVA 0
      ];
      const result = CalculateArcaTotalsUseCase.execute(items, 0, 'A');

      expect(result.netAmount21).toBe(10000);
      expect(result.vatAmount21).toBe(2100);
      expect(result.netAmount105).toBe(4000);
      expect(result.vatAmount105).toBe(420);
      expect(result.netAmount27).toBe(2000);
      expect(result.vatAmount27).toBe(540);
      expect(result.exemptAmount).toBe(1000);
      expect(result.totalNet).toBe(17000);
      expect(result.totalVat).toBe(3060);
      expect(result.grandTotal).toBe(20060);
    });
  });

  describe('Factura B: IVA Incluido y Transparencia RG 5614/2024', () => {
    it('Factura B con IVA incluido → no discrimina en precio, total correcto y desglose informativo', () => {
      // Precio bruto de lista: $12.100 (incluye IVA 21%)
      const items = [{ quantity: 1, unit_price: 12100, tax_rate: 0.21 }];
      const result = CalculateArcaTotalsUseCase.execute(items, 0, 'B');

      expect(result.grandTotal).toBe(12100);
      expect(result.totalNet).toBe(10000);
      expect(result.totalVat).toBe(2100);
      expect(result.isVatIncluded).toBe(true);
      expect(result.vatIncludedLegend).toBe('El IVA se encuentra incluido en el precio');
      expect(result.transparencyLegend).toContain('Régimen de Transparencia Fiscal al Consumidor');
    });

    it('Factura B con descuento → total = subtotal - descuento y desglose informativo ajustado', () => {
      // Precio bruto: $12.100, descuento $2.100 => Total a pagar $10.000
      const items = [{ quantity: 1, unit_price: 12100, tax_rate: 0.21 }];
      const result = CalculateArcaTotalsUseCase.execute(items, 2100, 'B');

      expect(result.grandTotal).toBe(10000);
      // subtotal informativo = 10000 / 1.21 = 8264.46
      expect(result.totalNet).toBeCloseTo(8264.46, 2);
      // iva informativo = 10000 - 8264.46 = 1735.54
      expect(result.totalVat).toBeCloseTo(1735.54, 2);
      expect(result.discount).toBe(2100);
    });
  });

  describe('Factura C y X: Sin IVA', () => {
    it('Factura C → sin IVA, sin leyenda de transparencia', () => {
      const items = [
        { quantity: 2, unit_price: 1500, tax_rate: 0.21 }, // Monotributista emite C sin IVA
      ];
      const result = CalculateArcaTotalsUseCase.execute(items, 0, 'C');

      expect(result.totalNet).toBe(3000);
      expect(result.totalVat).toBe(0);
      expect(result.grandTotal).toBe(3000);
      expect(result.isVatExempt).toBe(true);
      expect(result.isVatIncluded).toBe(false);
      expect(result.transparencyLegend).toBeUndefined();
      expect(result.vatIncludedLegend).toBeUndefined();
    });

    it('Factura X → comprobante interno sin IVA ni transparencia', () => {
      const items = [{ quantity: 1, unit_price: 5000, tax_rate: 0.21 }];
      const result = CalculateArcaTotalsUseCase.execute(items, 0, 'X');

      expect(result.totalVat).toBe(0);
      expect(result.grandTotal).toBe(5000);
      expect(result.isVatExempt).toBe(true);
    });
  });

  describe('Ajustes: Descuento, Recargo y Seña', () => {
    it('Descuento sobre subtotal → total correcto', () => {
      // Factura A: 2000 neto - 500 desc = 1500 neto => 1500 * 0.21 = 315 IVA => total = 1815
      const items = [{ quantity: 2, unit_price: 1000, tax_rate: 0.21 }];
      const result = CalculateArcaTotalsUseCase.execute(items, 500, 'A');

      expect(result.totalNet).toBe(1500);
      expect(result.totalVat).toBe(315);
      expect(result.grandTotal).toBe(1815);
      expect(result.discount).toBe(500);
    });

    it('Recargo sobre subtotal → total correcto', () => {
      // Factura A: 1000 neto + 200 recargo = 1200 neto => 1200 * 0.21 = 252 IVA => total = 1452
      const items = [{ quantity: 1, unit_price: 1000, tax_rate: 0.21 }];
      const result = CalculateArcaTotalsUseCase.execute(items, 0, 'A', 200);

      expect(result.surcharge).toBe(200);
      expect(result.totalNet).toBe(1200);
      expect(result.totalVat).toBe(252);
      expect(result.grandTotal).toBe(1452);
    });

    it('Seña descontada del total → saldo a cobrar correcto', () => {
      // Total $1210, seña $500 => saldo $710
      const items = [{ quantity: 1, unit_price: 1000, tax_rate: 0.21 }];
      const result = CalculateArcaTotalsUseCase.execute(items, 0, 'A', 0, 500);

      expect(result.grandTotal).toBe(1210);
      expect(result.advancePayment).toBe(500);
      expect(result.balanceDue).toBe(710);
    });

    it('Seña mayor al total → saldo a cobrar 0 (no negativo)', () => {
      const items = [{ quantity: 1, unit_price: 1000, tax_rate: 0.21 }];
      const result = CalculateArcaTotalsUseCase.execute(items, 0, 'A', 0, 2000);

      expect(result.grandTotal).toBe(1210);
      expect(result.balanceDue).toBe(0);
    });
  });
});
