import { CalculateArcaTotalsUseCase, ArcaItemCalcInput } from './calculate-arca-totals.usecase';

describe('CalculateArcaTotalsUseCase (Destructive Tax & Mutation Suite)', () => {
  describe('Unhappy Paths, Nulls, Undefined and Corrupted Inputs', () => {
    it('should withstand null and undefined items parameter without throwing', () => {
      expect(() => CalculateArcaTotalsUseCase.execute(null as any)).not.toThrow();
      expect(() => CalculateArcaTotalsUseCase.execute(undefined as any)).not.toThrow();

      const res = CalculateArcaTotalsUseCase.execute(null as any);
      expect(res.grandTotal).toBe(0);
      expect(res.totalNet).toBe(0);
      expect(res.totalVat).toBe(0);
      expect(res.balanceDue).toBe(0);
    });

    it('should handle items containing NaN, null, and undefined numbers gracefully', () => {
      const corruptedItems: ArcaItemCalcInput[] = [
        { quantity: NaN, unit_price: 1000 },
        { quantity: 2, unit_price: undefined as any },
        { quantity: null as any, unit_price: 500 },
        { quantity: 3, unit_price: 1000, tax_rate: NaN } // should default to 0.21
      ];

      const res = CalculateArcaTotalsUseCase.execute(corruptedItems, 0, 'B');
      expect(isNaN(res.grandTotal)).toBe(false);
      expect(isFinite(res.grandTotal)).toBe(true);
      // Valid item: 3 * 1000 = 3000
      expect(res.grandTotal).toBe(3000);
    });

    it('should handle negative and extreme discount percentages (discount > subtotal)', () => {
      const items: ArcaItemCalcInput[] = [{ quantity: 1, unit_price: 10000 }];

      // Discount of $20,000 on a $10,000 subtotal (200% discount)
      const res = CalculateArcaTotalsUseCase.execute(items, { discount: 20000, type: 'B' });
      expect(res.grandTotal).toBe(0); // Cannot be negative!
      expect(res.balanceDue).toBe(0);

      // Negative discount should be clamped to 0
      const resNeg = CalculateArcaTotalsUseCase.execute(items, { discount: -5000, type: 'B' });
      expect(resNeg.discount).toBe(0);
      expect(resNeg.grandTotal).toBe(10000);
    });

    it('should handle advancePayment > grandTotal without negative balanceDue', () => {
      const items: ArcaItemCalcInput[] = [{ quantity: 1, unit_price: 5000 }];
      const res = CalculateArcaTotalsUseCase.execute(items, { advancePayment: 10000, type: 'B' });

      expect(res.grandTotal).toBe(5000);
      expect(res.advancePayment).toBe(10000);
      expect(res.balanceDue).toBe(0); // Must clamp to 0
    });
  });

  describe('Tax Law & Discrimination Rigor (Ley 27.743 & RG 5614/2024)', () => {
    it('Factura A: should accurately discriminate VAT across multiple alícuotas (21%, 10.5%, 27%, Exempt)', () => {
      const items: ArcaItemCalcInput[] = [
        { quantity: 2, unit_price: 1000, tax_rate: 0.21 },  // Net: 2000, VAT: 420
        { quantity: 1, unit_price: 2000, tax_rate: 0.105 }, // Net: 2000, VAT: 210
        { quantity: 1, unit_price: 1000, tax_rate: 0.27 },  // Net: 1000, VAT: 270
        { quantity: 1, unit_price: 500, tax_rate: 0 }       // Net: 500,  Exempt: 500
      ];

      const res = CalculateArcaTotalsUseCase.execute(items, 0, 'A');

      expect(res.netAmount21).toBe(2000);
      expect(res.vatAmount21).toBe(420);
      expect(res.netAmount105).toBe(2000);
      expect(res.vatAmount105).toBe(210);
      expect(res.netAmount27).toBe(1000);
      expect(res.vatAmount27).toBe(270);
      expect(res.exemptAmount).toBe(500);

      expect(res.totalNet).toBe(5500);
      expect(res.totalVat).toBe(900);
      expect(res.grandTotal).toBe(6400);
      expect(res.isVatIncluded).toBe(false);
      expect(res.isVatExempt).toBe(false);
    });

    it('Factura B: should extract implicit VAT from gross totals with proportional discount factor', () => {
      const items: ArcaItemCalcInput[] = [
        { quantity: 1, unit_price: 1210, tax_rate: 0.21 } // Gross: 1210 => Net: 1000, VAT: 210
      ];

      const res = CalculateArcaTotalsUseCase.execute(items, { discount: 242, type: 'B' });

      // Grand total = 1210 - 242 = 968
      expect(res.grandTotal).toBe(968);
      expect(res.totalNet + res.totalVat).toBe(968);
      expect(res.isVatIncluded).toBe(true);
    });

    it('Factura C / X: should be 100% tax exempt (Monotributo)', () => {
      const items: ArcaItemCalcInput[] = [
        { quantity: 2, unit_price: 5000, tax_rate: 0.21 }
      ];

      const res = CalculateArcaTotalsUseCase.execute(items, 0, 'C');
      expect(res.totalVat).toBe(0);
      expect(res.grandTotal).toBe(10000);
      expect(res.isVatExempt).toBe(true);
    });
  });

  describe('Massive Scale Stress (50,000 items)', () => {
    it('should compute totals for 50,000 items in under 50ms without heap overflow', () => {
      const massiveItems: ArcaItemCalcInput[] = [];
      for (let i = 0; i < 50000; i++) {
        massiveItems.push({
          quantity: 1,
          unit_price: 10,
          tax_rate: 0.21
        });
      }

      const start = Date.now();
      const res = CalculateArcaTotalsUseCase.execute(massiveItems, 0, 'A');
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(150); // Generous threshold for CI/Windows
      expect(res.totalNet).toBe(500000);
      expect(res.totalVat).toBe(105000);
      expect(res.grandTotal).toBe(605000);
    });
  });
});
