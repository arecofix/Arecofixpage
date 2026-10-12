import { ValidateArcaInvoiceUseCase } from './validate-arca-invoice.usecase';
import { ARCA_CONSTANTS } from '../entities/arca.entity';

describe('ValidateArcaInvoiceUseCase', () => {
  it('should pass valid Consumer Final invoice below limits', () => {
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

  it('should block anonymous Consumer Final when amount >= $208.644 with non-electronic payment', () => {
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
      paymentMethod: 'cash', // Non-electronic!
      grandTotal: 302500,
    });

    expect(result.isValid).toBe(false);
    expect(result.requiresIdentification).toBe(true);
    expect(result.currentThreshold).toBe(ARCA_CONSTANTS.LIMIT_NON_ELECTRONIC_CONSUMER_FINAL);
    expect(result.errors.some((e) => e.includes('RG 5614/2024') || e.includes('OBLIGATORIO'))).toBe(true);
  });

  it('should allow Consumer Final when amount >= $208.644 but < $417.288 if payment is ELECTRONIC', () => {
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
      paymentMethod: 'transfer', // Electronic!
      grandTotal: 302500, // < 417288
    });

    expect(result.isValid).toBe(true);
    expect(result.requiresIdentification).toBe(false);
  });

  it('should block anonymous Consumer Final when amount >= $417.288 even with ELECTRONIC payment', () => {
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
      paymentMethod: 'transfer', // Electronic!
      grandTotal: 484000, // >= 417288
    });

    expect(result.isValid).toBe(false);
    expect(result.requiresIdentification).toBe(true);
    expect(result.currentThreshold).toBe(ARCA_CONSTANTS.LIMIT_ELECTRONIC_CONSUMER_FINAL);
  });

  it('should pass if customer identification (Name and DNI) is provided when exceeding limit', () => {
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

  it('should require valid CUIT and business name for Factura A', () => {
    const resultInvalid = ValidateArcaInvoiceUseCase.execute({
      type: 'A',
      customer: {
        name: '',
        docType: 'CUIT',
        docNumber: '123', // invalid length
        vatCondition: 'IVA Responsable Inscripto',
      },
      items: [{ description: 'Servicio técnico', quantity: 1, unit_price: 10000, tax_rate: 0.21 }],
      paymentMethod: 'transfer',
      grandTotal: 12100,
    });

    expect(resultInvalid.isValid).toBe(false);
    expect(resultInvalid.errors.some((e) => e.includes('11 dígitos'))).toBe(true);
  });
});
