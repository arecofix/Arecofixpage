import {
  ARCA_LEGENDS,
  ArcaInvoiceType,
  ArcaTaxBreakdown,
} from '../entities/arca.entity';

export interface ArcaItemCalcInput {
  quantity: number;
  unit_price: number;
  tax_rate?: number;
}

export interface CalculateArcaTotalsOptions {
  type?: ArcaInvoiceType;
  discount?: number;
  surcharge?: number;
  advancePayment?: number;
}

/**
 * Clean Architecture Use Case: Pure domain calculations for Argentine ARCA Invoices.
 * Compliant with Ley 27.743 and RG 5614/2024 (Régimen de Transparencia Fiscal al Consumidor).
 *
 * Reglas fiscales por tipo de comprobante:
 * - Factura A: El IVA se discrimina explícitamente por alícuota (21%, 10.5%, 27%). Total = Subtotal Neto + IVA - Descuento + Recargo.
 * - Factura B: El precio unitario tiene el IVA INCLUIDO. Total = Subtotal Bruto - Descuento + Recargo.
 *              Subtotal Neto = Total / (1 + Alícuota), IVA = Total - Subtotal Neto (informativo Ley 27.743, no discriminado en ítem).
 * - Factura C: Monotributista. Operación sin IVA. Total = Subtotal - Descuento + Recargo. Sin cuadro de transparencia fiscal.
 * - Factura X: Comprobante interno no fiscal. Sin discriminación impositiva.
 */
export class CalculateArcaTotalsUseCase {
  static execute(
    items: ArcaItemCalcInput[],
    discountOrOptions: number | CalculateArcaTotalsOptions = 0,
    explicitType: ArcaInvoiceType = 'B',
    explicitSurcharge: number = 0,
    explicitAdvancePayment: number = 0
  ): ArcaTaxBreakdown {
    let type: ArcaInvoiceType = explicitType;
    let discount = 0;
    let surcharge = explicitSurcharge;
    let advancePayment = explicitAdvancePayment;

    if (typeof discountOrOptions === 'object' && discountOrOptions !== null) {
      type = discountOrOptions.type || 'B';
      discount = discountOrOptions.discount || 0;
      surcharge = discountOrOptions.surcharge || 0;
      advancePayment = discountOrOptions.advancePayment || 0;
    } else {
      discount = Number(discountOrOptions) || 0;
    }

    const safeDiscount = Math.max(0, Number(discount) || 0);
    const safeSurcharge = Math.max(0, Number(surcharge) || 0);
    const safeAdvancePayment = Math.max(0, Number(advancePayment) || 0);

    // ────────────────────────────────────────────────────────────────────────
    // 1. FACTURA C o X: Sin IVA (Monotributo o Comprobante Interno)
    // ────────────────────────────────────────────────────────────────────────
    if (type === 'C' || type === 'X') {
      const grossSubtotal = items.reduce((sum, item) => {
        const qty = Number(item.quantity) || 0;
        const price = Number(item.unit_price) || 0;
        return sum + qty * price;
      }, 0);

      const grandTotal = this.round(
        Math.max(0, grossSubtotal - safeDiscount + safeSurcharge)
      );
      const balanceDue = this.round(Math.max(0, grandTotal - safeAdvancePayment));

      return {
        netAmount21: 0,
        vatAmount21: 0,
        netAmount105: 0,
        vatAmount105: 0,
        netAmount27: 0,
        vatAmount27: 0,
        exemptAmount: grandTotal,
        totalNet: grandTotal,
        totalVat: 0,
        discount: this.round(safeDiscount),
        surcharge: this.round(safeSurcharge),
        grandTotal,
        advancePayment: this.round(safeAdvancePayment),
        balanceDue,
        isVatIncluded: false,
        isVatExempt: true,
      };
    }

    // ────────────────────────────────────────────────────────────────────────
    // 2. FACTURA B: IVA INCLUIDO en el precio (Consumidor Final)
    // ────────────────────────────────────────────────────────────────────────
    if (type === 'B') {
      // En Factura B los precios unitarios son finales (IVA ya incluido en el precio)
      const grossSubtotal = items.reduce((sum, item) => {
        const qty = Number(item.quantity) || 0;
        const price = Number(item.unit_price) || 0;
        return sum + qty * price;
      }, 0);

      // El total a abonar es el precio final menos descuento más recargo
      const grandTotal = this.round(
        Math.max(0, grossSubtotal - safeDiscount + safeSurcharge)
      );

      // Prorrateo del total para cálculo del neto implícito por alícuota
      let net21 = 0;
      let net105 = 0;
      let net27 = 0;
      let exempt = 0;

      const factor = grossSubtotal > 0 ? grandTotal / grossSubtotal : 1;

      for (const item of items) {
        const qty = Number(item.quantity) || 0;
        const price = Number(item.unit_price) || 0;
        const rate = Number(item.tax_rate ?? 0.21);
        const adjustedGrossItem = qty * price * factor;

        if (rate > 0) {
          const itemNet = adjustedGrossItem / (1 + rate);

          if (Math.abs(rate - 0.21) < 0.001) {
            net21 += itemNet;
          } else if (Math.abs(rate - 0.105) < 0.001) {
            net105 += itemNet;
          } else if (Math.abs(rate - 0.27) < 0.001) {
            net27 += itemNet;
          } else {
            exempt += adjustedGrossItem;
          }
        } else {
          exempt += adjustedGrossItem;
        }
      }

      const totalNet = this.round(net21 + net105 + net27 + exempt);
      const totalVat = this.round(Math.max(0, grandTotal - totalNet));
      const vat21 = this.round(grandTotal > 0 && totalNet > 0 ? (net21 * 0.21) * factor : 0);
      const vat105 = this.round(grandTotal > 0 && totalNet > 0 ? (net105 * 0.105) * factor : 0);
      const vat27 = this.round(grandTotal > 0 && totalNet > 0 ? (net27 * 0.27) * factor : 0);

      const balanceDue = this.round(Math.max(0, grandTotal - safeAdvancePayment));

      return {
        netAmount21: this.round(net21),
        vatAmount21: this.round(vat21),
        netAmount105: this.round(net105),
        vatAmount105: this.round(vat105),
        netAmount27: this.round(net27),
        vatAmount27: this.round(vat27),
        exemptAmount: this.round(exempt),
        totalNet,
        totalVat,
        discount: this.round(safeDiscount),
        surcharge: this.round(safeSurcharge),
        grandTotal,
        advancePayment: this.round(safeAdvancePayment),
        balanceDue,
        isVatIncluded: true,
        isVatExempt: false,
        vatIncludedLegend: ARCA_LEGENDS.VAT_INCLUDED_B,
        transparencyLegend: ARCA_LEGENDS.TRANSPARENCY_FISCAL,
      };
    }

    // ────────────────────────────────────────────────────────────────────────
    // 3. FACTURA A: IVA DISCRIMINADO (Precios Netos, se adiciona IVA)
    // ────────────────────────────────────────────────────────────────────────
    let net21 = 0;
    let net105 = 0;
    let net27 = 0;
    let exempt = 0;

    let subtotalNet = 0;
    for (const item of items) {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.unit_price) || 0;
      const rate = Number(item.tax_rate) || 0;
      const itemNet = qty * price;
      subtotalNet += itemNet;

      if (Math.abs(rate - 0.21) < 0.001) {
        net21 += itemNet;
      } else if (Math.abs(rate - 0.105) < 0.001) {
        net105 += itemNet;
      } else if (Math.abs(rate - 0.27) < 0.001) {
        net27 += itemNet;
      } else {
        exempt += itemNet;
      }
    }

    const vat21 = this.round(net21 * 0.21);
    const vat105 = this.round(net105 * 0.105);
    const vat27 = this.round(net27 * 0.27);
    const totalVat = this.round(vat21 + vat105 + vat27);
    const totalNet = this.round(subtotalNet);
    // En Factura A: Total = Subtotal Neto + Total IVA - Descuento + Recargo
    const grandTotal = this.round(
      Math.max(0, totalNet + totalVat - safeDiscount + safeSurcharge)
    );
    const balanceDue = this.round(Math.max(0, grandTotal - safeAdvancePayment));

    return {
      netAmount21: this.round(net21),
      vatAmount21: this.round(vat21),
      netAmount105: this.round(net105),
      vatAmount105: this.round(vat105),
      netAmount27: this.round(net27),
      vatAmount27: this.round(vat27),
      exemptAmount: this.round(exempt),
      totalNet,
      totalVat,
      discount: this.round(safeDiscount),
      surcharge: this.round(safeSurcharge),
      grandTotal,
      advancePayment: this.round(safeAdvancePayment),
      balanceDue,
      isVatIncluded: false,
      isVatExempt: false,
      transparencyLegend: ARCA_LEGENDS.TRANSPARENCY_FISCAL,
    };
  }

  private static round(val: number): number {
    return Math.round((val + Number.EPSILON) * 100) / 100;
  }
}

