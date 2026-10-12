import {
  CreateInvoiceDto,
  InvoiceItem,
  InvoiceType,
} from '../../domain/entities/invoice.entity';
import {
  ArcaEmitterData,
  ArcaItemType,
  ArcaDocType,
  ArcaVatCondition,
  ArcaPaymentMethod,
} from '../../domain/entities/arca.entity';
import {
  RepairOrderReadyForInvoicingPayload,
  RepairOrderItemSnapshot,
} from '@app/features/repairs/domain/events/repair-order-ready-for-invoicing.event';

/**
 * Strategy interface for mapping different item types (OCP - Open/Closed Principle).
 * Adding new item types (e.g. electrical installation, diagnostics) only requires adding a strategy.
 */
export interface ItemMappingStrategy {
  supports(itemType: string): boolean;
  map(item: RepairOrderItemSnapshot, isMonotributo: boolean): InvoiceItem;
}

export class LaborItemStrategy implements ItemMappingStrategy {
  supports(itemType: string): boolean {
    return itemType === 'labor' || itemType === 'mano_de_obra';
  }

  map(item: RepairOrderItemSnapshot, isMonotributo: boolean): InvoiceItem {
    const taxRate = isMonotributo ? 0 : item.taxRate ?? 0.21;
    const subtotal = item.subtotal || item.unitPrice * (item.quantity || 1);
    const taxAmount = isMonotributo ? 0 : subtotal * taxRate;
    const total = isMonotributo ? subtotal : subtotal + taxAmount;

    return {
      description: item.description || 'Mano de obra de servicio técnico',
      quantity: item.quantity || 1,
      unit_price: item.unitPrice,
      tax_rate: taxRate,
      subtotal,
      total,
      tax_amount: taxAmount,
      item_type: 'labor' as ArcaItemType,
      is_labor: true,
    };
  }
}

export class PartItemStrategy implements ItemMappingStrategy {
  supports(itemType: string): boolean {
    return itemType === 'part' || itemType === 'repuesto';
  }

  map(item: RepairOrderItemSnapshot, isMonotributo: boolean): InvoiceItem {
    const taxRate = isMonotributo ? 0 : item.taxRate ?? 0.21;
    const subtotal = item.subtotal || item.unitPrice * (item.quantity || 1);
    const taxAmount = isMonotributo ? 0 : subtotal * taxRate;
    const total = isMonotributo ? subtotal : subtotal + taxAmount;

    return {
      product_id: item.productId,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      tax_rate: taxRate,
      subtotal,
      total,
      tax_amount: taxAmount,
      item_type: 'part' as ArcaItemType,
      is_labor: false,
    };
  }
}

export class ServiceItemStrategy implements ItemMappingStrategy {
  supports(itemType: string): boolean {
    return itemType === 'service' || itemType === 'servicio';
  }

  map(item: RepairOrderItemSnapshot, isMonotributo: boolean): InvoiceItem {
    const taxRate = isMonotributo ? 0 : item.taxRate ?? 0.21;
    const subtotal = item.subtotal || item.unitPrice * (item.quantity || 1);
    const taxAmount = isMonotributo ? 0 : subtotal * taxRate;
    const total = isMonotributo ? subtotal : subtotal + taxAmount;

    return {
      description: item.description,
      quantity: item.quantity || 1,
      unit_price: item.unitPrice,
      tax_rate: taxRate,
      subtotal,
      total,
      tax_amount: taxAmount,
      item_type: 'service' as ArcaItemType,
      is_labor: false,
    };
  }
}

export class FallbackItemStrategy implements ItemMappingStrategy {
  supports(_itemType: string): boolean {
    return true;
  }

  map(item: RepairOrderItemSnapshot, isMonotributo: boolean): InvoiceItem {
    const taxRate = isMonotributo ? 0 : item.taxRate ?? 0.21;
    const subtotal = item.subtotal || item.unitPrice * (item.quantity || 1);
    const taxAmount = isMonotributo ? 0 : subtotal * taxRate;
    const total = isMonotributo ? subtotal : subtotal + taxAmount;

    return {
      product_id: item.productId,
      description: item.description || 'Ítem de reparación',
      quantity: item.quantity || 1,
      unit_price: item.unitPrice,
      tax_rate: taxRate,
      subtotal,
      total,
      tax_amount: taxAmount,
      item_type: (item.type as ArcaItemType) || 'product',
      is_labor: !!item.isLabor,
    };
  }
}

/**
 * Anti-Corruption Layer (ACL): RepairOrderToInvoiceMapper
 * Pure mapper that transforms RepairOrderReadyForInvoicingPayload into CreateInvoiceDto
 * without coupling the Sales/Invoice domain to the internal Repair domain entities.
 */
export class RepairOrderToInvoiceMapper {
  private static strategies: ItemMappingStrategy[] = [
    new LaborItemStrategy(),
    new PartItemStrategy(),
    new ServiceItemStrategy(),
    new FallbackItemStrategy(),
  ];

  /**
   * Allows registering additional item mapping strategies at runtime (OCP)
   */
  public static registerStrategy(strategy: ItemMappingStrategy): void {
    // Add before fallback
    this.strategies.splice(this.strategies.length - 1, 0, strategy);
  }

  /**
   * Determines the ARCA invoice type ('A', 'B', 'C') based on fiscal rules:
   * 1. Monotributista emitter -> Always Factura C (IVA is not discriminated)
   * 2. Responsable Inscripto emitter + Client with CUIT -> Factura A
   * 3. Responsable Inscripto emitter + Client Consumidor Final -> Factura B
   */
  public static resolveInvoiceType(
    emitterVatCondition?: string | ArcaVatCondition,
    clientTaxId?: string,
    clientVatCondition?: string | ArcaVatCondition
  ): InvoiceType {
    const emitterCond = (emitterVatCondition || '').toString().toLowerCase().trim();

    // 1. Monotributista emitter -> Force Factura C
    if (emitterCond.includes('monotribut')) {
      return 'C';
    }

    // Check if client has a CUIT (11 numeric digits)
    const sanitizedTaxId = (clientTaxId || '').replace(/\D/g, '');
    const clientCond = (clientVatCondition || '').toString().toLowerCase().trim();
    const hasValidCuit = sanitizedTaxId.length === 11;
    const isClientRI = clientCond.includes('inscripto');

    // 2. Responsable Inscripto emitter
    if (emitterCond.includes('inscripto') || emitterCond.includes('responsable')) {
      if (hasValidCuit || isClientRI) {
        return 'A';
      }
      return 'B';
    }

    // Default fallback
    return 'B';
  }

  /**
   * Resolves client document type from tax ID length
   */
  private static resolveDocType(taxId?: string): ArcaDocType {
    if (!taxId) return 'DNI';
    const clean = taxId.replace(/\D/g, '');
    if (clean.length === 11) return 'CUIT';
    return 'DNI';
  }

  /**
   * Resolves client VAT condition
   */
  private static resolveClientVatCondition(
    docType: ArcaDocType,
    explicitCond?: string
  ): ArcaVatCondition {
    if (explicitCond) {
      const lower = explicitCond.toLowerCase();
      if (lower.includes('inscripto')) return 'IVA Responsable Inscripto';
      if (lower.includes('monotribut')) return 'Responsable Monotributo';
      if (lower.includes('exento')) return 'IVA Exento';
      return 'Consumidor Final';
    }
    if (docType === 'CUIT') return 'IVA Responsable Inscripto';
    return 'Consumidor Final';
  }

  /**
   * Maps a single snapshot item using the registered strategy chain
   */
  private static mapSnapshotItem(
    item: RepairOrderItemSnapshot,
    isMonotributo: boolean
  ): InvoiceItem {
    const strategy =
      this.strategies.find((s) => s.supports(item.type)) ||
      this.strategies[this.strategies.length - 1];
    return strategy.map(item, isMonotributo);
  }

  /**
   * Maps the RepairOrderReadyForInvoicingPayload and emitter configuration into CreateInvoiceDto
   */
  public static map(
    payload: RepairOrderReadyForInvoicingPayload,
    emitter?: ArcaEmitterData | null
  ): CreateInvoiceDto {
    const emitterVat = (emitter as any)?.vat_condition || emitter?.vatCondition || 'monotributo';
    const isMonotributo =
      emitterVat.toLowerCase().includes('monotributo') ||
      emitterVat.toLowerCase().trim() === 'monotributista';

    const customerTaxId = payload.customerSnapshot?.taxId || '';
    const invoiceType = this.resolveInvoiceType(
      emitterVat,
      customerTaxId,
      payload.customerSnapshot?.vatCondition
    );

    const docType = this.resolveDocType(customerTaxId);
    const clientVat = this.resolveClientVatCondition(
      docType,
      payload.customerSnapshot?.vatCondition
    );

    const invoiceItems: InvoiceItem[] = [];

    // 1. Mandatory Labor line: check if present in itemsSnapshot; if not, create from totalsSnapshot
    const hasLaborSnapshot = payload.itemsSnapshot.some(
      (item) => item.type === 'labor' || item.isLabor
    );

    if (hasLaborSnapshot) {
      for (const item of payload.itemsSnapshot) {
        if (item.type === 'labor' || item.isLabor) {
          invoiceItems.push(this.mapSnapshotItem(item, isMonotributo));
        }
      }
    } else {
      // Mandatory labor line from totalsSnapshot / description
      const laborCost = payload.totalsSnapshot?.technicalLaborCost ?? 0;
      const laborDescription =
        payload.technicalReport?.trim() ||
        (payload.notes
          ? `Mano de obra: ${payload.notes.substring(0, 80)}`
          : 'Mano de obra y servicio técnico de reparación');

      const taxRate = isMonotributo ? 0 : 0.21;
      const taxAmount = isMonotributo ? 0 : laborCost * taxRate;
      const total = isMonotributo ? laborCost : laborCost + taxAmount;

      invoiceItems.push({
        description: laborDescription,
        quantity: 1,
        unit_price: laborCost,
        tax_rate: taxRate,
        subtotal: laborCost,
        total,
        tax_amount: taxAmount,
        item_type: 'labor',
        is_labor: true,
      });
    }

    // 2. Used Parts lines from itemsSnapshot
    for (const item of payload.itemsSnapshot) {
      if (item.type !== 'labor' && !item.isLabor) {
        invoiceItems.push(this.mapSnapshotItem(item, isMonotributo));
      }
    }

    // 3. Surcharge (%) line if applicable: applied before VAT and shown as separate line
    const surchargePct = payload.totalsSnapshot?.surchargePercentage || 0;
    const surchargeAmt = payload.totalsSnapshot?.surchargeAmount || 0;
    if (surchargePct > 0 || surchargeAmt > 0) {
      const baseSubtotalBeforeSurcharge = invoiceItems.reduce(
        (sum, it) => sum + it.subtotal,
        0
      );
      const calculatedSurcharge =
        surchargeAmt > 0
          ? surchargeAmt
          : (baseSubtotalBeforeSurcharge * surchargePct) / 100;

      const taxRate = isMonotributo ? 0 : 0.21;
      const taxAmount = isMonotributo ? 0 : calculatedSurcharge * taxRate;
      const total = isMonotributo
        ? calculatedSurcharge
        : calculatedSurcharge + taxAmount;

      invoiceItems.push({
        description: `Recargo por servicio (${surchargePct > 0 ? surchargePct + '%' : 'Ajuste'})`,
        quantity: 1,
        unit_price: calculatedSurcharge,
        tax_rate: taxRate,
        subtotal: calculatedSurcharge,
        total,
        tax_amount: taxAmount,
        item_type: 'service',
        is_labor: false,
      });
    }

    // 4. Totals calculation
    const calculatedSubtotal = invoiceItems.reduce((acc, i) => acc + i.subtotal, 0);
    const calculatedTaxAmount = isMonotributo
      ? 0
      : invoiceItems.reduce((acc, i) => acc + (i.tax_amount || 0), 0);
    const calculatedTotalAmount = isMonotributo
      ? calculatedSubtotal
      : invoiceItems.reduce((acc, i) => acc + i.total, 0);

    // 5. Advance payment (seña): NOT an invoice item, but registered as advance_payment
    const depositAmount = payload.totalsSnapshot?.depositAmount || 0;
    const balanceDue = Math.max(0, calculatedTotalAmount - depositAmount);

    // 6. Notes & Warranty
    const notesParts: string[] = [];
    if (payload.warranty) {
      notesParts.push(`Garantía otorgada: ${payload.warranty}`);
    }
    if (payload.trackingCode) {
      notesParts.push(`Orden de Reparación: #${payload.trackingCode}`);
    }
    if (payload.notes) {
      notesParts.push(`Observaciones: ${payload.notes}`);
    }
    const notes = notesParts.join(' | ');

    // 7. Payment method mapping
    let paymentMethod: ArcaPaymentMethod = 'cash';
    if (payload.paymentMethod) {
      const pm = payload.paymentMethod.toLowerCase();
      if (pm.includes('transf')) paymentMethod = 'transfer';
      else if (pm.includes('deb')) paymentMethod = 'debit_card';
      else if (pm.includes('cred') || pm.includes('tarj')) paymentMethod = 'credit_card';
      else if (pm.includes('mercadopago') || pm.includes('mp') || pm.includes('qr')) paymentMethod = 'qr_mercadopago';
    }

    return {
      order_id: undefined,
      repair_id: payload.repairOrderId,
      repair_order_id: payload.repairOrderId,
      repair_order_number: payload.trackingCode || payload.repairOrderId,
      customer_id: payload.customerSnapshot?.customerId,
      customer_name: payload.customerSnapshot?.name || 'Cliente de Taller',
      customer_email: payload.customerSnapshot?.email,
      customer_tax_id: customerTaxId || undefined,
      customer_doc_type: docType,
      customer_vat_condition: clientVat,
      customer_address: payload.customerSnapshot?.address,
      type: invoiceType,
      origin: 'repair',
      status: 'draft',
      subtotal: Math.round(calculatedSubtotal * 100) / 100,
      tax_amount: Math.round(calculatedTaxAmount * 100) / 100,
      discount: 0,
      total_amount: Math.round(calculatedTotalAmount * 100) / 100,
      advance_payment: Math.round(depositAmount * 100) / 100,
      balance_due: Math.round(balanceDue * 100) / 100,
      items: invoiceItems,
      notes,
      internal_notes: payload.technicalReport
        ? `Informe técnico: ${payload.technicalReport}`
        : undefined,
      payment_method: paymentMethod,
      sale_condition: 'Contado',
      emitter_snapshot: emitter || undefined,
      issued_at: payload.issuedAt || new Date().toISOString(),
      tenant_id: payload.tenantId,
    };
  }
}
