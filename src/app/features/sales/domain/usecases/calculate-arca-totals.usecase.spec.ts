import { CalculateArcaTotalsUseCase } from './calculate-arca-totals.usecase';
import { ValidateArcaInvoiceUseCase } from './validate-arca-invoice.usecase';

describe('CalculateArcaTotalsUseCase & Fiscal Rules (RG 5614/2024 / Ley 27.743)', () => {

  describe('1. Factura A: Discriminación de IVA (Precios Netos + IVA)', () => {
    it('Factura A con IVA 21%: total correcto con discriminación', () => {
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

    it('Factura A con IVA 10.5%: total correcto con discriminación', () => {
      const items = [{ quantity: 2, unit_price: 2000, tax_rate: 0.105 }];
      const result = CalculateArcaTotalsUseCase.execute(items, 0, 'A');

      expect(result.netAmount105).toBe(4000);
      expect(result.vatAmount105).toBe(420);
      expect(result.totalNet).toBe(4000);
      expect(result.totalVat).toBe(420);
      expect(result.grandTotal).toBe(4420);
    });

    it('Factura A con IVA 27%: total correcto con discriminación', () => {
      const items = [{ quantity: 1, unit_price: 5000, tax_rate: 0.27 }];
      const result = CalculateArcaTotalsUseCase.execute(items, 0, 'A');

      expect(result.netAmount27).toBe(5000);
      expect(result.vatAmount27).toBe(1350);
      expect(result.totalNet).toBe(5000);
      expect(result.totalVat).toBe(1350);
      expect(result.grandTotal).toBe(6350);
    });

    it('Factura A con múltiples alícuotas: suma correcta', () => {
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

    it('Caso Oficial Factura A: $149.000 neto + IVA 21% $31.290 - descuento $40.400 = $139.890', () => {
      const items = [{ quantity: 1, unit_price: 149000, tax_rate: 0.21 }];
      const result = CalculateArcaTotalsUseCase.execute(items, 40400, 'A');

      expect(result.totalNet).toBe(149000);
      expect(result.vatAmount21).toBe(31290);
      expect(result.totalVat).toBe(31290);
      expect(result.discount).toBe(40400);
      expect(result.grandTotal).toBe(139890);
    });
  });

  describe('2. Factura B: Precios con IVA Incluido y Transparencia Fiscal (RG 5614/2024)', () => {
    it('Factura B con IVA incluido: NO discrimina, total correcto', () => {
      // Precio final bruto: $12.100 (incluye IVA 21%)
      const items = [{ quantity: 1, unit_price: 12100, tax_rate: 0.21 }];
      const result = CalculateArcaTotalsUseCase.execute(items, 0, 'B');

      expect(result.grandTotal).toBe(12100);
      expect(result.totalNet).toBe(10000);
      expect(result.totalVat).toBe(2100);
      expect(result.isVatIncluded).toBe(true);
      expect(result.vatIncludedLegend).toBe('El IVA se encuentra incluido en el precio');
      expect(result.transparencyLegend).toContain('Régimen de Transparencia Fiscal al Consumidor');
    });

    it('Caso Oficial Factura B: $149.000 precio final sin descuento → neto $123.140,50 + IVA incluido $25.859,50 = $149.000', () => {
      const items = [{ quantity: 1, unit_price: 149000, tax_rate: 0.21 }];
      const result = CalculateArcaTotalsUseCase.execute(items, 0, 'B');

      expect(result.grandTotal).toBe(149000);
      expect(result.totalNet).toBe(123140.5);
      expect(result.totalVat).toBe(25859.5);
      expect(result.vatIncludedLegend).toBe('El IVA se encuentra incluido en el precio');
    });

    it('Caso Oficial Factura B con descuento: $149.000 precio final - descuento $40.400 = $108.600', () => {
      const items = [{ quantity: 1, unit_price: 149000, tax_rate: 0.21 }];
      const result = CalculateArcaTotalsUseCase.execute(items, 40400, 'B');

      expect(result.grandTotal).toBe(108600);
      expect(result.discount).toBe(40400);
      // Neto implícito informativo = 108.600 / 1.21 = 89.752,07
      expect(result.totalNet).toBe(89752.07);
      // IVA implícito informativo = 108.600 - 89.752,07 = 18.847,93
      expect(result.totalVat).toBe(18847.93);
      expect(result.isVatIncluded).toBe(true);
      expect(result.vatIncludedLegend).toBe('El IVA se encuentra incluido en el precio');
    });

    it('Factura B con múltiples alícuotas: neto implícito por alícuota', () => {
      // Item 1: $12.100 al 21% (Neto implícito: 10.000, IVA: 2.100)
      // Item 2: $11.050 al 10.5% (Neto implícito: 10.000, IVA: 1.050)
      const items = [
        { quantity: 1, unit_price: 12100, tax_rate: 0.21 },
        { quantity: 1, unit_price: 11050, tax_rate: 0.105 },
      ];
      const result = CalculateArcaTotalsUseCase.execute(items, 0, 'B');

      expect(result.grandTotal).toBe(23150);
      expect(result.netAmount21).toBe(10000);
      expect(result.netAmount105).toBe(10000);
      expect(result.totalNet).toBe(20000);
      expect(result.totalVat).toBe(3150);
      expect(result.isVatIncluded).toBe(true);
    });
  });

  describe('3. Factura C y Comprobantes Internos (Sin IVA)', () => {
    it('Factura C: sin discriminación de IVA, sin leyenda de transparencia', () => {
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

    it('Factura C con descuento: total = precio - descuento, IVA = 0', () => {
      const items = [{ quantity: 1, unit_price: 5000, tax_rate: 0.21 }];
      const result = CalculateArcaTotalsUseCase.execute(items, 1000, 'C');

      expect(result.grandTotal).toBe(4000);
      expect(result.totalNet).toBe(4000);
      expect(result.totalVat).toBe(0);
      expect(result.discount).toBe(1000);
    });

    it('Factura X: comprobante interno no fiscal sin IVA', () => {
      const items = [{ quantity: 1, unit_price: 8000, tax_rate: 0.21 }];
      const result = CalculateArcaTotalsUseCase.execute(items, 0, 'X');

      expect(result.totalVat).toBe(0);
      expect(result.grandTotal).toBe(8000);
      expect(result.isVatExempt).toBe(true);
    });
  });

  describe('4. Comparación de Descuento: Factura A vs Factura B', () => {
    it('Descuento aplicado en Factura A resta del total tras sumar IVA', () => {
      // 1000 neto + 210 IVA - 300 desc = 910
      const items = [{ quantity: 1, unit_price: 1000, tax_rate: 0.21 }];
      const resultA = CalculateArcaTotalsUseCase.execute(items, 300, 'A');

      expect(resultA.totalNet).toBe(1000);
      expect(resultA.totalVat).toBe(210);
      expect(resultA.grandTotal).toBe(910);
    });

    it('Descuento aplicado en Factura B resta directamente del precio final bruto', () => {
      // 1210 bruto - 210 desc = 1000 total final
      const items = [{ quantity: 1, unit_price: 1210, tax_rate: 0.21 }];
      const resultB = CalculateArcaTotalsUseCase.execute(items, 210, 'B');

      expect(resultB.grandTotal).toBe(1000);
      expect(resultB.totalNet).toBeCloseTo(826.45, 2);
      expect(resultB.totalVat).toBeCloseTo(173.55, 2);
    });
  });

  describe('5. Validaciones de Condición del Emisor (Monotributista vs Responsable Inscripto)', () => {
    const defaultParams = {
      customer: {
        docType: 'CUIT' as const,
        docNumber: '20438529161',
        name: 'Cliente Empresa SA',
        vatCondition: 'IVA Responsable Inscripto' as const,
      },
      items: [{ description: 'Servicio técnico', quantity: 1, unit_price: 1000, tax_rate: 0.21 }],
      paymentMethod: 'cash' as const,
      grandTotal: 1000,
    };

    it('Si el emisor es Monotributista y se intenta emitir Factura A → error', () => {
      const result = ValidateArcaInvoiceUseCase.execute({
        ...defaultParams,
        type: 'A',
        emitterVatCondition: 'Responsable Monotributo',
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('Monotributista') && e.includes('Factura A'))).toBe(true);
    });

    it('Si el emisor es Monotributista y se intenta emitir Factura B → error', () => {
      const result = ValidateArcaInvoiceUseCase.execute({
        ...defaultParams,
        type: 'B',
        emitterVatCondition: 'Monotributista',
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('Monotributista') && e.includes('Factura B'))).toBe(true);
    });

    it('Si el emisor es Monotributista y se intenta emitir Factura C → OK', () => {
      const result = ValidateArcaInvoiceUseCase.execute({
        ...defaultParams,
        type: 'C',
        emitterVatCondition: 'Responsable Monotributo',
      });

      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });
  });
});
