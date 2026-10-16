import { ValidateArcaInvoiceUseCase } from './validate-arca-invoice.usecase';
import { ARCA_CONSTANTS } from '../entities/arca.entity';

describe('ValidateArcaInvoiceUseCase', () => {
  describe('Identificación obligatoria por Umbrales RG 5614/2024 / Ley 27.743', () => {
    it('Monto < $208.644 sin identificación (efectivo) → válido como Consumidor Final anónimo', () => {
      const result = ValidateArcaInvoiceUseCase.execute({
        type: 'B',
        customer: {
          name: 'Consumidor Final',
          docType: 'DNI',
          docNumber: '',
          vatCondition: 'Consumidor Final',
        },
        items: [
          { description: 'Reparación de módulo', quantity: 1, unit_price: 50000, tax_rate: 0.21 },
        ],
        paymentMethod: 'cash',
        grandTotal: 60500,
      });

      expect(result.isValid).toBe(true);
      expect(result.requiresIdentification).toBe(false);
      expect(result.errors.length).toBe(0);
    });

    it('Monto ≥ $208.644 sin identificación (efectivo) → error', () => {
      const result = ValidateArcaInvoiceUseCase.execute({
        type: 'B',
        customer: {
          name: 'Consumidor Final',
          docType: 'DNI',
          docNumber: '',
          vatCondition: 'Consumidor Final',
        },
        items: [
          { description: 'Instalación eléctrica industrial', quantity: 1, unit_price: 250000, tax_rate: 0.21 },
        ],
        paymentMethod: 'cash', // Efectivo
        grandTotal: 302500, // >= $208.644
      });

      expect(result.isValid).toBe(false);
      expect(result.requiresIdentification).toBe(true);
      expect(result.currentThreshold).toBe(ARCA_CONSTANTS.LIMIT_NON_ELECTRONIC_CONSUMER_FINAL);
      expect(result.errors.some((e) => e.includes('RG 5614/2024') || e.includes('OBLIGATORIO'))).toBe(true);
    });

    it('Monto ≥ $208.644 pero < $417.288 con pago electrónico → permitido sin identificación', () => {
      const result = ValidateArcaInvoiceUseCase.execute({
        type: 'B',
        customer: {
          name: 'Consumidor Final',
          docType: 'DNI',
          docNumber: '',
          vatCondition: 'Consumidor Final',
        },
        items: [
          { description: 'Cambio de pantalla iPhone 15', quantity: 1, unit_price: 250000, tax_rate: 0.21 },
        ],
        paymentMethod: 'transfer', // Medios electrónicos
        grandTotal: 302500, // < $417.288
      });

      expect(result.isValid).toBe(true);
      expect(result.requiresIdentification).toBe(false);
    });

    it('Monto ≥ $417.288 sin identificación (electrónico) → error', () => {
      const result = ValidateArcaInvoiceUseCase.execute({
        type: 'B',
        customer: {
          name: 'Consumidor Final',
          docType: 'DNI',
          docNumber: '',
          vatCondition: 'Consumidor Final',
        },
        items: [
          { description: 'Cableado trifásico y tablero principal', quantity: 1, unit_price: 400000, tax_rate: 0.21 },
        ],
        paymentMethod: 'transfer', // Electrónico
        grandTotal: 484000, // >= $417.288
      });

      expect(result.isValid).toBe(false);
      expect(result.requiresIdentification).toBe(true);
      expect(result.currentThreshold).toBe(ARCA_CONSTANTS.LIMIT_ELECTRONIC_CONSUMER_FINAL);
      expect(result.errors.some((e) => e.includes('RG 5614/2024') || e.includes('OBLIGATORIO'))).toBe(true);
    });

    it('Monto ≥ $417.288 con identificación completa (Nombre y DNI) → válido', () => {
      const result = ValidateArcaInvoiceUseCase.execute({
        type: 'B',
        customer: {
          name: 'Juan Perez',
          docType: 'DNI',
          docNumber: '32123456',
          vatCondition: 'Consumidor Final',
        },
        items: [
          { description: 'Instalación eléctrica', quantity: 1, unit_price: 400000, tax_rate: 0.21 },
        ],
        paymentMethod: 'cash',
        grandTotal: 484000,
      });

      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });
  });

  describe('Validaciones de Factura A y Condición del Emisor', () => {
    it('Factura A sin CUIT → error', () => {
      const result = ValidateArcaInvoiceUseCase.execute({
        type: 'A',
        customer: {
          name: 'Empresa SA',
          docType: 'DNI',
          docNumber: '30716492819',
          vatCondition: 'IVA Responsable Inscripto',
        },
        items: [{ description: 'Servicio técnico', quantity: 1, unit_price: 10000, tax_rate: 0.21 }],
        paymentMethod: 'transfer',
        grandTotal: 12100,
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('CUIT'))).toBe(true);
    });

    it('Factura A con CUIT inválido (distinto de 11 dígitos) → error', () => {
      const result = ValidateArcaInvoiceUseCase.execute({
        type: 'A',
        customer: {
          name: 'Empresa SA',
          docType: 'CUIT',
          docNumber: '12345678', // solo 8 dígitos
          vatCondition: 'IVA Responsable Inscripto',
        },
        items: [{ description: 'Servicio técnico', quantity: 1, unit_price: 10000, tax_rate: 0.21 }],
        paymentMethod: 'transfer',
        grandTotal: 12100,
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('11 dígitos'))).toBe(true);
    });

    it('Factura A con cliente Consumidor Final → error', () => {
      const result = ValidateArcaInvoiceUseCase.execute({
        type: 'A',
        customer: {
          name: 'Consumidor Final',
          docType: 'CUIT',
          docNumber: '30716492819',
          vatCondition: 'Consumidor Final', // Inválido para Factura A
        },
        items: [{ description: 'Servicio técnico', quantity: 1, unit_price: 10000, tax_rate: 0.21 }],
        paymentMethod: 'transfer',
        grandTotal: 12100,
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Consumidor Final'))).toBe(true);
    });

    it('Monotributista intentando emitir Factura A → error', () => {
      const result = ValidateArcaInvoiceUseCase.execute({
        type: 'A',
        customer: {
          name: 'Empresa SA',
          docType: 'CUIT',
          docNumber: '30716492819',
          vatCondition: 'IVA Responsable Inscripto',
        },
        items: [{ description: 'Servicio técnico', quantity: 1, unit_price: 10000, tax_rate: 0.21 }],
        paymentMethod: 'transfer',
        grandTotal: 12100,
        emitterVatCondition: 'Responsable Monotributo', // Emisor Monotributista
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Monotributista') && e.includes('Factura C'))).toBe(true);
    });

    it('Monotributista intentando emitir Factura B → error', () => {
      const result = ValidateArcaInvoiceUseCase.execute({
        type: 'B',
        customer: {
          name: 'Juan Perez',
          docType: 'DNI',
          docNumber: '32123456',
          vatCondition: 'Consumidor Final',
        },
        items: [{ description: 'Servicio técnico', quantity: 1, unit_price: 10000, tax_rate: 0.21 }],
        paymentMethod: 'cash',
        grandTotal: 10000,
        emitterVatCondition: 'Monotributo',
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Factura C'))).toBe(true);
    });

    it('Monotributista emitiendo Factura C → válido', () => {
      const result = ValidateArcaInvoiceUseCase.execute({
        type: 'C',
        customer: {
          name: 'Consumidor Final',
          docType: 'DNI',
          docNumber: '',
          vatCondition: 'Consumidor Final',
        },
        items: [{ description: 'Servicio técnico', quantity: 1, unit_price: 10000, tax_rate: 0 }],
        paymentMethod: 'cash',
        grandTotal: 10000,
        emitterVatCondition: 'Responsable Monotributo',
      });

      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });
  });
});
