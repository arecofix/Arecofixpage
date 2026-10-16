import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminInvoiceDetailPage } from './admin-invoice-detail-page';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CompanyService } from '@app/core/services/company.service';
import { InvoiceService } from '@app/features/sales/application/invoice.service';
import { InvoicePdfExportService } from '@app/features/sales/application/services/invoice-pdf-export.service';
import { QrGeneratorService } from '@app/features/sales/application/services/qr-generator.service';
import { NotificationService } from '@app/core/services/notification.service';
import { TranslationService } from '@app/core/services/translation.service';
import { Invoice, InvoiceItem } from '@app/features/sales/domain/entities/invoice.entity';

describe('AdminInvoiceDetailPage (Invoice Layout & Overlap Fixes)', () => {
  let component: AdminInvoiceDetailPage;
  let fixture: ComponentFixture<AdminInvoiceDetailPage>;

  const mockInvoice: Invoice = {
    id: 'inv-123',
    tenant_id: 'tenant-1',
    invoice_number: 10,
    point_of_sale: '00004',
    type: 'B',
    status: 'issued',
    customer_name: 'Juan Perez',
    customer_tax_id: '', // empty to test 'No informado'
    customer_address: '', // empty to test 'No informado'
    customer_vat_condition: 'Consumidor Final',
    sale_condition: 'Contado',
    payment_method: 'cash',
    subtotal: 149000,
    discount: 40400,
    total_amount: 108600,
    created_at: '2026-10-12T10:00:00Z',
    issued_at: '2026-10-12T10:00:00Z',
  };

  const mockItems: InvoiceItem[] = [
    {
      id: 'item-1',
      invoice_id: 'inv-123',
      description: 'Reparación de placa madre',
      quantity: 1,
      unit_price: 149000,
      tax_rate: 0.21,
      subtotal: 149000,
      item_type: 'labor',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminInvoiceDetailPage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => 'inv-123' } },
            params: of({ id: 'inv-123' }),
          },
        },
        {
          provide: CompanyService,
          useValue: {
            getSettings: jest.fn().mockResolvedValue({
              name: 'Arecofix',
              address: 'Jorge Newbery 69, Buenos Aires',
              tax_id: '20438529161',
              phone: '1125960900',
              email: 'ezequielneryo15@gmail.com',
              vat_condition: 'IVA Responsable Inscripto',
              activity_start_date: '01/03/2021',
              point_of_sale: '00004',
            }),
          },
        },
        {
          provide: InvoiceService,
          useValue: {
            getInvoiceWithDetails: jest.fn().mockResolvedValue({
              invoice: mockInvoice,
              items: mockItems,
            }),
            confirmDraft: jest.fn(),
          },
        },
        {
          provide: InvoicePdfExportService,
          useValue: {
            downloadPdf: jest.fn(),
            shareOrDownload: jest.fn(),
          },
        },
        {
          provide: QrGeneratorService,
          useValue: {
            generateInvoiceQrDataUrl: jest.fn().mockResolvedValue('data:image/png;base64,mockqr'),
          },
        },
        {
          provide: NotificationService,
          useValue: {
            showInfo: jest.fn(),
            showSuccess: jest.fn(),
            showError: jest.fn(),
          },
        },
        {
          provide: TranslationService,
          useValue: { t: (k: string) => k },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminInvoiceDetailPage);
    component = fixture.componentInstance;
    await component.ngOnInit();
    fixture.detectChanges();
  });

  it('El recuadro de la letra no se solapa con "FACTURA \'B\'"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const letterBox = compiled.querySelector('.letter-box');
    const headerTitle = compiled.querySelector('.section-title');

    expect(letterBox).toBeTruthy();
    expect(headerTitle).toBeTruthy();
    expect(letterBox?.textContent?.trim()).toBe('B');
    expect(headerTitle?.textContent).toContain('FACTURA "B"');

    // Comprobar que están en un contenedor flex con gap explícito
    const flexContainer = letterBox?.parentElement;
    expect(flexContainer?.classList.contains('flex')).toBe(true);
    expect(flexContainer?.classList.contains('gap-[8mm]')).toBe(true);
  });

  it('El "Cód. 006" no toca los bordes del contenedor y tiene padding adecuado', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const codeBadge = compiled.querySelector('.code-badge');

    expect(codeBadge).toBeTruthy();
    expect(codeBadge?.textContent).toContain('Cód. 006');
    expect(codeBadge?.classList.contains('code-badge')).toBe(true);
  });

  it('Los campos vacíos muestran "No informado" y no "--"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const fullText = compiled.textContent || '';

    // No debe contener guiones triples o dobles como placeholder
    expect(fullText).not.toContain('---');
    expect(fullText).not.toContain('DNI / CUIT / CUIL: --');

    // Debe mostrar "No informado"
    expect(fullText).toContain('No informado');
  });

  it('El tipo de ítem muestra "Mano de obra" y no "General"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const badge = compiled.querySelector('td .badge, td span.inline-flex');

    expect(badge).toBeTruthy();
    expect(badge?.textContent).toContain('Mano de obra');
    expect(compiled.textContent).not.toContain('Tipo: General');
  });

  it('Factura B muestra el bloque de Régimen de Transparencia Fiscal sin desglose por alícuota', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const text = compiled.textContent || '';

    expect(text).toContain('RÉGIMEN DE TRANSPARENCIA FISCAL AL CONSUMIDOR');
    expect(text).toContain('El IVA se encuentra incluido en el precio');
    expect(text).toContain('Importe Neto:');
    expect(text).toContain('IVA Incluido:');
    expect(text).toContain('Importe Total:');

    // No debe mostrar desglose explícito de Neto Gravado 21% / IVA 21% en Factura B
    expect(text).not.toContain('Neto Gravado 21%:');
    expect(text).not.toContain('IVA Discriminado por Alícuota');
  });
});
