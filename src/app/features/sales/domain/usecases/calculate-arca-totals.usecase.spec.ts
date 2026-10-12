import { CalculateArcaTotalsUseCase } from './calculate-arca-totals.usecase';

describe('CalculateArcaTotalsUseCase', () => {
  it('should accurately calculate 21% VAT, net amount, and total', () => {
    const items = [
      { quantity: 2, unit_price: 1000, tax_rate: 0.21 }, // Net: 2000, VAT: 420
    ];

    const result = CalculateArcaTotalsUseCase.execute(items, 0);

    expect(result.netAmount21).toBe(2000);
    expect(result.vatAmount21).toBe(420);
    expect(result.totalNet).toBe(2000);
    expect(result.totalVat).toBe(420);
    expect(result.grandTotal).toBe(2420);
  });

  it('should accurately handle multiple rates (21%, 10.5%, 27%, and Exempt) as required by Ley 27.743', () => {
    const items = [
      { quantity: 1, unit_price: 10000, tax_rate: 0.21 },  // Net: 10000, VAT: 2100
      { quantity: 2, unit_price: 5000, tax_rate: 0.105 },  // Net: 10000, VAT: 1050
      { quantity: 1, unit_price: 4000, tax_rate: 0.27 },   // Net: 4000, VAT: 1080
      { quantity: 1, unit_price: 2000, tax_rate: 0 },      // Net: 2000, VAT: 0
    ];

    const result = CalculateArcaTotalsUseCase.execute(items, 500);

    expect(result.netAmount21).toBe(10000);
    expect(result.vatAmount21).toBe(2100);
    expect(result.netAmount105).toBe(10000);
    expect(result.vatAmount105).toBe(1050);
    expect(result.netAmount27).toBe(4000);
    expect(result.vatAmount27).toBe(1080);
    expect(result.exemptAmount).toBe(2000);

    expect(result.totalNet).toBe(26000);
    expect(result.totalVat).toBe(4230);
    expect(result.discount).toBe(500);
    // 26000 + 4230 - 500 = 29730
    expect(result.grandTotal).toBe(29730);
  });

  it('should not return negative grandTotal if discount exceeds total', () => {
    const items = [{ quantity: 1, unit_price: 100, tax_rate: 0.21 }];
    const result = CalculateArcaTotalsUseCase.execute(items, 500);

    expect(result.grandTotal).toBe(0);
  });
});
