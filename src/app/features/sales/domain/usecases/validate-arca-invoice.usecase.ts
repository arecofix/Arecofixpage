import {
  ARCA_CONSTANTS,
  ARCA_PAYMENT_METHODS,
  ArcaCustomerData,
  ArcaInvoiceItem,
  ArcaInvoiceType,
  ArcaPaymentMethod,
  ArcaValidationResult,
  ArcaVatCondition,
} from '../entities/arca.entity';
import { InvoiceItem } from '../entities/invoice.entity';

export interface ValidateArcaInvoiceParams {
  type: ArcaInvoiceType;
  customer: ArcaCustomerData;
  items: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    tax_rate?: number;
  }>;
  paymentMethod: ArcaPaymentMethod;
  grandTotal: number;
  emitterVatCondition?: ArcaVatCondition | string;
}

/**
 * Clean Architecture Use Case: Validates ARCA (ex AFIP) fiscal rules.
 * Strictly enforces identification limits, emitter eligibility, and document requirements.
 */
export class ValidateArcaInvoiceUseCase {
  static execute(params: ValidateArcaInvoiceParams): ArcaValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 0. Validar Condición del Emisor (Monotributista vs Responsable Inscripto)
    if (params.emitterVatCondition) {
      const emitterCond = params.emitterVatCondition.toString().toLowerCase().trim();
      const isMonotributista =
        emitterCond.includes('monotribut') || emitterCond === 'responsable monotributo';

      if (isMonotributista) {
        if (params.type === 'A') {
          errors.push(
            'Un contribuyente Monotributista solo puede emitir Factura C o comprobantes internos X, no puede emitir Factura A.'
          );
        } else if (params.type === 'B') {
          errors.push(
            'Un contribuyente Monotributista solo puede emitir Factura C o comprobantes internos X, no puede emitir Factura B.'
          );
        }
      }
    }

    // 1. Validar Ítems
    if (!params.items || params.items.length === 0) {
      errors.push('La factura debe contener al menos un ítem.');
    } else {
      params.items.forEach((item, idx) => {
        if (!item.description || !item.description.trim()) {
          errors.push(`El ítem #${idx + 1} no tiene una descripción válida.`);
        }
        if (Number(item.quantity) <= 0) {
          errors.push(`El ítem #${idx + 1} debe tener una cantidad mayor a 0.`);
        }
        if (Number(item.unit_price) < 0) {
          errors.push(`El ítem #${idx + 1} no puede tener un precio unitario negativo.`);
        }
      });
    }

    // 2. Determinar Medio de Pago y Umbral de Identificación ARCA
    const methodMeta = ARCA_PAYMENT_METHODS[params.paymentMethod] || ARCA_PAYMENT_METHODS.cash;
    const isElectronic = methodMeta.isElectronic;
    const currentThreshold = isElectronic
      ? ARCA_CONSTANTS.LIMIT_ELECTRONIC_CONSUMER_FINAL
      : ARCA_CONSTANTS.LIMIT_NON_ELECTRONIC_CONSUMER_FINAL;

    const isConsumerFinal =
      params.customer.vatCondition === 'Consumidor Final' ||
      params.type === 'B';

    const exceedsLimit = params.grandTotal >= currentThreshold;
    const hasDocNumber = !!(params.customer.docNumber && params.customer.docNumber.trim());
    const hasCustomerName = !!(
      params.customer.name &&
      params.customer.name.trim() &&
      params.customer.name.trim().toLowerCase() !== 'consumidor final'
    );

    const requiresIdentification = isConsumerFinal && exceedsLimit;

    // 3. Regla ARCA 2025 para Consumidor Final (RG 5614/2024 y Ley 27.743)
    if (requiresIdentification) {
      if (!hasDocNumber) {
        errors.push(
          `Normativa ARCA 2025 (RG 5614/2024): Para operaciones iguales o mayores a $${currentThreshold.toLocaleString(
            'es-AR'
          )} con ${methodMeta.label.toLowerCase()}, es OBLIGATORIO identificar al cliente con DNI, CUIL o CUIT.`
        );
      }
      if (!hasCustomerName) {
        errors.push(
          `Normativa ARCA: Debe ingresar el Apellido y Nombre o Razón Social del cliente al superar los $${currentThreshold.toLocaleString(
            'es-AR'
          )}.`
        );
      }
    } else if (isConsumerFinal && params.grandTotal > currentThreshold * 0.85) {
      // Advertencia preventiva cuando se acerca al límite
      warnings.push(
        `Atención: El importe está próximo al límite legal de identificación obligatoria ($${currentThreshold.toLocaleString(
          'es-AR'
        )}).`
      );
    }

    // 4. Reglas específicas para Factura A
    if (params.type === 'A') {
      if (params.customer.vatCondition === 'Consumidor Final') {
        errors.push(
          'No se puede emitir Factura "A" a un Consumidor Final. Debe ser Responsable Inscripto o Monotributista.'
        );
      }
      if (params.customer.docType !== 'CUIT') {
        errors.push('La Factura "A" requiere obligatoriamente el CUIT del cliente (no se admite DNI).');
      }
      if (!hasDocNumber) {
        errors.push('La Factura "A" requiere obligatoriamente el CUIT del cliente.');
      } else {
        const cleanCuit = params.customer.docNumber.replace(/\D/g, '');
        if (cleanCuit.length !== 11) {
          errors.push('El CUIT ingresado para Factura "A" debe tener 11 dígitos válidos.');
        }
      }
      if (!hasCustomerName) {
        errors.push('La Factura "A" requiere la Razón Social del cliente.');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      requiresIdentification,
      currentThreshold,
    };
  }
}

