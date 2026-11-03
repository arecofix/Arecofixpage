/**
 * ARCA (Agencia de Recaudación y Control Aduanero - ex AFIP) Domain Entities & Standards
 * Compliant with:
 * - Ley 27.743 (Régimen de Transparencia Fiscal al Consumidor)
 * - RG 5614/2024 & RG 5616 (Identificación obligatoria y desglose de IVA)
 */

export const ARCA_CONSTANTS = {
  /**
   * Monto límite a partir del cual es OBLIGATORIA la identificación del Consumidor Final
   * en operaciones con medios de pago NO ELECTRÓNICOS (Efectivo) - Actualización 2025
   */
  LIMIT_NON_ELECTRONIC_CONSUMER_FINAL: 208644,

  /**
   * Monto límite a partir del cual es OBLIGATORIA la identificación del Consumidor Final
   * en operaciones con medios de pago ELECTRÓNICOS (Tarjetas, transferencias, QR, billeteras) - Actualización 2025
   */
  LIMIT_ELECTRONIC_CONSUMER_FINAL: 417288,

  /**
   * Alícuotas de IVA válidas en Argentina
   */
  VAT_RATES: [0, 0.105, 0.21, 0.27] as const,

  /**
   * Códigos de Comprobantes oficiales ARCA
   */
  INVOICE_CODES: {
    A: '001',
    B: '006',
    C: '011',
    X: '099', // Comprobante interno / Documento no fiscal
  } as const,
};

export type ArcaVatRate = 0 | 0.105 | 0.21 | 0.27;

export type ArcaInvoiceType = 'A' | 'B' | 'C' | 'X';

/**
 * Clasificación de ítems para abarcar tanto talleres técnicos de celulares
 * como instalaciones eléctricas domiciliarias e industriales.
 */
export type ArcaItemType = 'labor' | 'part' | 'product' | 'service';

export const ARCA_ITEM_TYPES: Record<ArcaItemType, { label: string; icon: string; description: string }> = {
  labor: {
    label: 'Mano de Obra',
    icon: 'fa-screwdriver-wrench',
    description: 'Instalación eléctrica, montaje, reparación técnica en banco',
  },
  part: {
    label: 'Repuesto',
    icon: 'fa-microchip',
    description: 'Pantallas, baterías, disyuntores, térmicas, componentes',
  },
  product: {
    label: 'Producto',
    icon: 'fa-box',
    description: 'Equipos terminados, accesorios, materiales eléctricos en rollo/caja',
  },
  service: {
    label: 'Servicio',
    icon: 'fa-briefcase',
    description: 'Diagnóstico, peritaje, mantenimiento preventivo o industrial',
  },
};

export type ArcaVatCondition =
  | 'IVA Responsable Inscripto'
  | 'Responsable Monotributo'
  | 'Consumidor Final'
  | 'IVA Exento'
  | 'Sujeto No Categorizado';

export type ArcaDocType = 'DNI' | 'CUIT' | 'CUIL' | 'Pasaporte' | 'Sin Identificar';

export type ArcaPaymentMethod =
  | 'cash'
  | 'transfer'
  | 'debit_card'
  | 'credit_card'
  | 'qr_mercadopago';

export interface PaymentMethodMetadata {
  id: ArcaPaymentMethod;
  label: string;
  isElectronic: boolean;
  icon: string;
}

export const ARCA_PAYMENT_METHODS: Record<ArcaPaymentMethod, PaymentMethodMetadata> = {
  cash: {
    id: 'cash',
    label: 'Efectivo',
    isElectronic: false,
    icon: 'fa-money-bill-wave',
  },
  transfer: {
    id: 'transfer',
    label: 'Transferencia Bancaria',
    isElectronic: true,
    icon: 'fa-building-columns',
  },
  debit_card: {
    id: 'debit_card',
    label: 'Tarjeta de Débito',
    isElectronic: true,
    icon: 'fa-credit-card',
  },
  credit_card: {
    id: 'credit_card',
    label: 'Tarjeta de Crédito',
    isElectronic: true,
    icon: 'fa-credit-card',
  },
  qr_mercadopago: {
    id: 'qr_mercadopago',
    label: 'Mercado Pago / QR',
    isElectronic: true,
    icon: 'fa-qrcode',
  },
};

export type ArcaSaleCondition =
  | 'Contado'
  | 'Cuenta Corriente'
  | '15 Días'
  | '30 Días'
  | 'Anticipado';

/**
 * Perfil de datos del Emisor (Empresa) según exigencias de ARCA
 */
export interface ArcaEmitterData {
  businessName: string; // Razón Social
  cuit: string; // CUIT sin guiones o con formato
  commercialAddress: string; // Domicilio Comercial
  vatCondition: ArcaVatCondition; // Condición frente al IVA
  iibb: string; // Ingresos Brutos (ej. número de inscripción o CM)
  activityStartDate: string; // Fecha de Inicio de Actividades (ej. DD/MM/AAAA)
  pointOfSale: string; // Punto de venta (ej. 00004)
  phone?: string;
  email?: string;
  logoUrl?: string;
}

/**
 * Perfil de datos del Cliente / Receptor
 */
export interface ArcaCustomerData {
  name: string; // Nombre y apellido o Razón Social
  docType: ArcaDocType; // DNI, CUIT, CUIL, etc.
  docNumber: string; // Número de identificación
  vatCondition: ArcaVatCondition; // Condición frente al IVA
  address?: string; // Domicilio comercial o particular
  email?: string;
}

/**
 * Ítem de comprobante ARCA
 */
export interface ArcaInvoiceItem {
  id?: string;
  productId?: string;
  description: string;
  itemType: ArcaItemType;
  quantity: number;
  unitPrice: number; // Precio neto o bruto según tipo
  taxRate: ArcaVatRate; // 0, 0.105, 0.21, 0.27
  subtotalNet: number; // Cantidad * Precio Unitario Neto
  taxAmount: number; // subtotalNet * taxRate
  totalWithTax: number; // subtotalNet + taxAmount
}

/**
 * Desglose de IVA exigido por Ley 27.743 y RG 5614/2024
 */
export interface ArcaTaxBreakdown {
  netAmount21: number;
  vatAmount21: number;
  netAmount105: number;
  vatAmount105: number;
  netAmount27: number;
  vatAmount27: number;
  exemptAmount: number;
  totalNet: number; // Subtotal neto gravado
  totalVat: number; // Total IVA liquidado (informativo en B, no discriminado en factura)
  discount: number; // Descuento aplicado
  surcharge: number; // Recargo aplicado
  grandTotal: number; // Total final facturado
  advancePayment: number; // Seña o anticipo abonado
  balanceDue: number; // Saldo pendiente a cobrar
  isVatIncluded: boolean; // True en Factura B (el IVA está incluido en el precio)
  isVatExempt: boolean; // True en Factura C / X (sin IVA ni discriminación)
  vatIncludedLegend?: string; // "El IVA se encuentra incluido en el precio" (RG 5614/2024)
  transparencyLegend?: string; // Ley 27.743 / RG 5614
}

/**
 * Mapeo de tipos de documento a códigos numéricos oficiales de ARCA
 */
export const ARCA_DOC_TYPE_CODES: Record<ArcaDocType, number> = {
  CUIT: 80,
  CUIL: 86,
  DNI: 96,
  Pasaporte: 94,
  'Sin Identificar': 99,
};

/**
 * Mapeo de tipos de comprobante a códigos numéricos oficiales de ARCA
 */
export const ARCA_INVOICE_NUMERIC_CODES: Record<ArcaInvoiceType, number> = {
  A: 1,
  B: 6,
  C: 11,
  X: 99,
};

/**
 * Leyendas oficiales y normativas de ARCA
 */
export const ARCA_LEGENDS = {
  VAT_INCLUDED_B: 'El IVA se encuentra incluido en el precio',
  TRANSPARENCY_FISCAL: 'Régimen de Transparencia Fiscal al Consumidor (Ley 27.743 / RG 5614)',
  DRAFT_NO_CAE: 'Este comprobante es un borrador interno. No tiene validez fiscal hasta obtener el CAE de ARCA.',
  AUTHORIZED_VOUCHER: 'Comprobante autorizado por ARCA (ex AFIP) - Régimen de Factura Electrónica',
  VALID_DOCUMENT: 'Documento válido como Factura Electrónica conforme R.G. AFIP/ARCA.',
  CAE_PENDING: 'PENDIENTE DE CAE',
};

/**
 * Estructura oficial del código QR según RG 4892/2020 de ARCA
 */
export interface ArcaQrData {
  ver: number;
  fecha: string; // YYYY-MM-DD
  cuit: number; // CUIT sin guiones (11 dígitos)
  ptoVta: number;
  tipoCmp: number; // 1: A, 6: B, 11: C, 99: X
  nroCmp: number;
  importe: number;
  moneda: string; // 'PES'
  ctz: number; // 1
  tipoDocRec?: number;
  nroDocRec?: number;
  tipoCodAut: string; // 'E'
  codAut: number | null; // CAE o null si está pendiente
}

/**
 * Validación de reglas ARCA
 */
export interface ArcaValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  requiresIdentification: boolean;
  currentThreshold: number;
}

