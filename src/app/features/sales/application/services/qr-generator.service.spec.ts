import { QrGeneratorService } from './qr-generator.service';
import { Invoice } from '../../domain/entities/invoice.entity';
import { ArcaEmitterData } from '../../domain/entities/arca.entity';

describe('QrGeneratorService (RG 4892/2020)', () => {
  let service: QrGeneratorService;

  const mockEmitter: ArcaEmitterData = {
    businessName: 'ARECOFIX',
    cuit: '30-71649281-9',
    commercialAddress: 'San Antonio de Areco',
    vatCondition: 'IVA Responsable Inscripto',
    iibb: '30-71649281-9',
    activityStartDate: '01/03/2021',
    pointOfSale: '00004',
  };

  const mockInvoiceWithCae: Invoice = {
    id: 'inv-1',
    type: 'A',
    origin: 'manual',
    status: 'issued',
    subtotal: 100000,
    tax_amount: 21000,
    discount: 0,
    total_amount: 121000,
    invoice_number: '00000042',
    cae: '74128956321458',
    cae_expires_at: '2026-10-25',
    customer_doc_type: 'CUIT',
    customer_tax_id: '20-33445566-7',
    customer_name: 'Cliente SA',
    issued_at: '2026-10-12T10:00:00Z',
  };

  const mockDraftInvoiceWithoutCae: Invoice = {
    id: 'inv-2',
    type: 'B',
    origin: 'repair',
    status: 'draft',
    subtotal: 50000,
    tax_amount: 0,
    discount: 0,
    total_amount: 50000,
    invoice_number: '00000001',
    cae: undefined, // Sin CAE
    customer_doc_type: 'DNI',
    customer_tax_id: '35123456',
    customer_name: 'Consumidor Final',
    issued_at: '2026-10-12T10:00:00Z',
  };

  beforeEach(() => {
    service = new QrGeneratorService();
  });

  it('buildQrPayload debe generar el JSON exacto conforme a RG 4892/2020', () => {
    const payload = service.buildQrPayload(mockInvoiceWithCae, mockEmitter);

    expect(payload.ver).toBe(1);
    expect(payload.fecha).toBe('2026-10-12');
    expect(payload.cuit).toBe(30716492819);
    expect(payload.ptoVta).toBe(4);
    expect(payload.tipoCmp).toBe(1); // Factura A = 1
    expect(payload.nroCmp).toBe(42);
    expect(payload.importe).toBe(121000);
    expect(payload.moneda).toBe('PES');
    expect(payload.ctz).toBe(1);
    expect(payload.tipoDocRec).toBe(80); // CUIT = 80
    expect(payload.nroDocRec).toBe(20334455667);
    expect(payload.tipoCodAut).toBe('E');
    expect(payload.codAut).toBe(74128956321458);
  });

  it('buildQrPayload debe establecer codAut en null si no hay CAE (borrador sin validez fiscal)', () => {
    const payload = service.buildQrPayload(mockDraftInvoiceWithoutCae, mockEmitter);

    expect(payload.codAut).toBeNull();
    expect(payload.tipoCmp).toBe(6); // Factura B = 6
    expect(payload.tipoDocRec).toBe(96); // DNI = 96
    expect(payload.nroDocRec).toBe(35123456);
  });

  it('buildQrUrl debe contener la URL oficial https://www.arca.gob.ar/fe/qr/?p= con base64 válido', () => {
    const payload = service.buildQrPayload(mockInvoiceWithCae, mockEmitter);
    const url = service.buildQrUrl(payload);

    expect(url.startsWith('https://www.arca.gob.ar/fe/qr/?p=')).toBe(true);

    const base64Part = url.replace('https://www.arca.gob.ar/fe/qr/?p=', '');
    expect(base64Part.length).toBeGreaterThan(20);

    // Decodificar base64 y verificar JSON
    const decodedJson = JSON.parse(Buffer.from(base64Part, 'base64').toString('utf-8'));
    expect(decodedJson.ver).toBe(1);
    expect(decodedJson.cuit).toBe(30716492819);
    expect(decodedJson.codAut).toBe(74128956321458);
  });

  it('generateQrDataUrl debe retornar un data URL de imagen PNG en base64 con qrcode', async () => {
    const payload = service.buildQrPayload(mockInvoiceWithCae, mockEmitter);
    const dataUrl = await service.generateQrDataUrl(payload);

    expect(dataUrl.startsWith('data:image/png;base64,')).toBe(true);
    expect(dataUrl.length).toBeGreaterThan(100);
  });
});
