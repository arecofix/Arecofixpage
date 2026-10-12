import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InvoiceFormModalComponent } from './invoice-form-modal.component';
import { CompanyService } from '@app/core/services/company.service';
import { ProductRepository } from '@app/features/products/domain/repositories/product.repository';
import { NotificationService } from '@app/core/services/notification.service';
import { LoggerService } from '@app/core/services/logger.service';
import { of } from 'rxjs';

describe('InvoiceFormModalComponent', () => {
  let component: InvoiceFormModalComponent;
  let fixture: ComponentFixture<InvoiceFormModalComponent>;
  let mockCompanyService: { getSettings: jest.Mock };
  let mockProductRepo: { findAvailable: jest.Mock };
  let mockNotificationService: { showError: jest.Mock; showSuccess: jest.Mock };

  beforeEach(async () => {
    mockCompanyService = {
      getSettings: jest.fn().mockResolvedValue({
        id: 'c1',
        name: 'ARECOFIX TEST',
        tax_id: '30-12345678-9',
        address: 'San Martín 100',
        location: 'San Antonio de Areco',
      }),
    };

    mockProductRepo = {
      findAvailable: jest.fn().mockReturnValue(of([
        { id: 'p1', name: 'Módulo Pantalla iPhone 11', price: 45000, stock: 10 },
        { id: 'p2', name: 'Disyuntor Diferencial 2x40A', price: 32000, stock: 5 },
      ])),
    };

    mockNotificationService = {
      showError: jest.fn(),
      showSuccess: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [InvoiceFormModalComponent],
      providers: [
        { provide: CompanyService, useValue: mockCompanyService },
        { provide: ProductRepository, useValue: mockProductRepo },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: LoggerService, useValue: { error: jest.fn(), warn: jest.fn(), info: jest.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InvoiceFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component and synchronize emitter data on init', async () => {
    await fixture.whenStable();
    expect(component).toBeTruthy();
    expect(mockCompanyService.getSettings).toHaveBeenCalled();
    expect(component.emitter().businessName).toBe('ARECOFIX TEST');
    expect(component.emitter().cuit).toBe('30-12345678-9');
  });

  it('should calculate live totals and separate VAT breakdown according to Ley 27.743', () => {
    component.items.set([
      { description: 'Mano de obra técnica', itemType: 'labor', quantity: 1, unitPrice: 100000, taxRate: 0.21 },
      { description: 'Repuesto disyuntor', itemType: 'part', quantity: 2, unitPrice: 30000, taxRate: 0.105 },
    ]);

    const breakdown = component.taxBreakdown();

    // Line 1: Net = 100000, VAT 21% = 21000
    // Line 2: Net = 60000, VAT 10.5% = 6300
    // Total Net: 160000, Total VAT: 27300, Grand Total: 187300
    expect(breakdown.netAmount21).toBe(100000);
    expect(breakdown.vatAmount21).toBe(21000);
    expect(breakdown.netAmount105).toBe(60000);
    expect(breakdown.vatAmount105).toBe(6300);
    expect(breakdown.totalNet).toBe(160000);
    expect(breakdown.totalVat).toBe(27300);
    expect(breakdown.grandTotal).toBe(187300);
  });

  it('should flag mandatory customer identification when amount exceeds $208.644 for cash payment', () => {
    // 250000 + 21% = 302500 (exceeds $208.644)
    component.paymentMethod.set('cash');
    component.items.set([
      { description: 'Instalación eléctrica industrial', itemType: 'labor', quantity: 1, unitPrice: 250000, taxRate: 0.21 },
    ]);
    component.customer.set({
      name: 'Consumidor Final',
      docType: 'DNI',
      docNumber: '',
      vatCondition: 'Consumidor Final',
    });

    const validation = component.arcaValidation();
    expect(validation.requiresIdentification).toBe(true);
    expect(validation.isValid).toBe(false);
    expect(validation.errors.some(e => e.includes('RG 5614/2024'))).toBe(true);
  });

  it('should add item from product catalog when selected', () => {
    const prod = { id: 'prod-99', name: 'Termomagnética Sica 2x16A', price: 15000, stock: 20 };
    component.selectProductFromCatalog(prod as any);

    const items = component.items();
    const added = items.find(i => i.productId === 'prod-99');
    expect(added).toBeDefined();
    expect(added?.unitPrice).toBe(15000);
    expect(mockNotificationService.showSuccess).toHaveBeenCalled();
  });
});
