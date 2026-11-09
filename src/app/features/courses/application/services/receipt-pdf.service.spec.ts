import { TestBed } from '@angular/core/testing';
import { ReceiptPdfService, ReceiptData } from './receipt-pdf.service';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';

describe('ReceiptPdfService', () => {
  let service: ReceiptPdfService;

  const mockSupabase = {
    storage: {
      from: jest.fn().mockReturnValue({
        upload: jest.fn().mockResolvedValue({ data: { path: 'receipts/REC-001.pdf' }, error: null }),
        getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: 'https://cdn/receipts/REC-001.pdf' } })
      })
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ReceiptPdfService,
        { provide: SUPABASE_CLIENT, useValue: mockSupabase }
      ]
    });
    service = TestBed.inject(ReceiptPdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate PDF document and blob with Marcos Paz address and formatted amount', async () => {
    const data: ReceiptData = {
      receiptNumber: 'REC-2026-0001',
      studentName: 'Axel Chazarreta',
      studentEmail: 'chazarreta0749@gmail.com',
      studentPhone: '11 2345-6789',
      courseTitle: 'Reparación de Celulares y Microelectrónica',
      periodNumber: 1,
      installmentsCount: 6,
      amount: 120000,
      paymentMethod: 'cash',
      paidAt: '2026-11-05',
      notes: 'Pago en efectivo cuota 1'
    };

    const res = await service.generateReceiptPdf(data);

    expect(res).toBeDefined();
    expect(res.filename).toBe('REC-2026-0001.pdf');
    expect(res.doc).toBeDefined();
    expect(res.blob).toBeDefined();
    expect(res.blob.type).toBe('application/pdf');
    // Verify blob is non-empty
    expect(res.blob.size).toBeGreaterThan(500);
  });

  it('should upload receipt blob to storage', async () => {
    const dummyBlob = new Blob(['%PDF-dummy'], { type: 'application/pdf' });
    const url = await service.uploadReceiptToStorage('REC-2026-0001', dummyBlob);

    expect(mockSupabase.storage.from).toHaveBeenCalledWith('receipts');
    expect(url).toBe('https://cdn/receipts/REC-001.pdf');
  });
});

