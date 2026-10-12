import { ArcaTaxBreakdown } from '../entities/arca.entity';

export interface ArcaItemCalcInput {
  quantity: number;
  unit_price: number;
  tax_rate: number;
}

/**
 * Clean Architecture Use Case: Pure domain calculations for Argentine ARCA Invoices.
 * Compliant with Ley 27.743 and RG 5614/2024 (Régimen de Transparencia Fiscal).
 */
export class CalculateArcaTotalsUseCase {
  static execute(
    items: ArcaItemCalcInput[],
    discount: number = 0
  ): ArcaTaxBreakdown {
    let net21 = 0;
    let net105 = 0;
    let net27 = 0;
    let exempt = 0;

    let vat21 = 0;
    let vat105 = 0;
    let vat27 = 0;

    for (const item of items) {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.unit_price) || 0;
      const rate = Number(item.tax_rate) || 0;

      const itemNet = qty * price;

      if (Math.abs(rate - 0.21) < 0.001) {
        net21 += itemNet;
        vat21 += itemNet * 0.21;
      } else if (Math.abs(rate - 0.105) < 0.001) {
        net105 += itemNet;
        vat105 += itemNet * 0.105;
      } else if (Math.abs(rate - 0.27) < 0.001) {
        net27 += itemNet;
        vat27 += itemNet * 0.27;
      } else {
        exempt += itemNet;
      }
    }

    const totalNet = net21 + net105 + net27 + exempt;
    const totalVat = vat21 + vat105 + vat27;
    const safeDiscount = Math.max(0, Number(discount) || 0);
    const grandTotal = Math.max(0, totalNet + totalVat - safeDiscount);

    return {
      netAmount21: this.round(net21),
      vatAmount21: this.round(vat21),
      netAmount105: this.round(net105),
      vatAmount105: this.round(vat105),
      netAmount27: this.round(net27),
      vatAmount27: this.round(vat27),
      exemptAmount: this.round(exempt),
      totalNet: this.round(totalNet),
      totalVat: this.round(totalVat),
      discount: this.round(safeDiscount),
      grandTotal: this.round(grandTotal),
    };
  }

  private static round(val: number): number {
    return Math.round((val + Number.EPSILON) * 100) / 100;
  }
}
