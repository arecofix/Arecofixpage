import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AdminProductFormPage } from './admin-product-form-page';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminProductService } from './services/admin-product.service';
import { NotificationService } from '@app/core/services/notification.service';
import { BranchContextService } from '@app/core/services/branch-context.service';
import { GsmService } from '@app/public/gsm/services/gsm.service';
import { ProductMediaService } from './services/product-media.service';
import { of } from 'rxjs';
import { Product } from '@app/features/products/domain/entities/product.entity';

describe('AdminProductFormPage - Monedas y Validación (D-03)', () => {
  let component: AdminProductFormPage;
  let fixture: ComponentFixture<AdminProductFormPage>;
  let mockProductService: {
    getBrands: jest.Mock;
    getCategories: jest.Mock;
    getBranches: jest.Mock;
    getProduct: jest.Mock;
    createProduct: jest.Mock;
    updateProduct: jest.Mock;
    slugify: jest.Mock;
  };
  let mockNotificationService: {
    showSuccess: jest.Mock;
    showError: jest.Mock;
  };
  let mockRouter: {
    navigate: jest.Mock;
  };
  let mockGsmService: {
    getUsdtRate: jest.Mock;
  };

  beforeEach(async () => {
    mockProductService = {
      getBrands: jest.fn().mockResolvedValue([]),
      getCategories: jest.fn().mockResolvedValue([]),
      getBranches: jest.fn().mockResolvedValue([]),
      getProduct: jest.fn().mockResolvedValue(null),
      createProduct: jest.fn().mockResolvedValue({ id: 'new-prod-id' }),
      updateProduct: jest.fn().mockResolvedValue({ id: 'prod-id' }),
      slugify: jest.fn().mockImplementation((val: string) => val.toLowerCase().replace(/\s+/g, '-')),
    };

    mockNotificationService = {
      showSuccess: jest.fn(),
      showError: jest.fn(),
    };

    mockRouter = {
      navigate: jest.fn(),
    };

    mockGsmService = {
      getUsdtRate: jest.fn().mockReturnValue(of(1200)),
    };

    await TestBed.configureTestingModule({
      imports: [AdminProductFormPage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: jest.fn().mockReturnValue(null),
              },
            },
          },
        },
        { provide: Router, useValue: mockRouter },
        { provide: AdminProductService, useValue: mockProductService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: BranchContextService, useValue: { getBranchId: () => null } },
        { provide: GsmService, useValue: mockGsmService },
        {
          provide: ProductMediaService,
          useValue: {
            uploadImage: jest.fn(),
            uploadFile: jest.fn(),
            deleteImage: jest.fn(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminProductFormPage);
    component = fixture.componentInstance;
    await component.ngOnInit();
  });

  it('debe inicializarse por defecto en moneda ARS', () => {
    expect(component.formVal.currency).toBe('ARS');
    expect(component.exchangeRate()).toBe(1200);
  });

  it('debe permitir cambiar de moneda a USD y reactivar validación', () => {
    component.formVal.price = 150;
    component.setCurrency('USD');

    expect(component.formVal.currency).toBe('USD');
    expect(component.priceValidationError()).toBeNull();
    expect(component.previewMainPrice()).toBe('U$D 150,00');
    expect(component.previewConvertedPrice()).toBe('⇄ AR$ 180.000');
  });

  it('debe calcular la previsualización en vivo para ARS convirtiendo a USD con cotización de referencia', () => {
    component.formVal.price = 120000;
    component.setCurrency('ARS');

    expect(component.previewMainPrice()).toBe('AR$ 120.000');
    expect(component.previewConvertedPrice()).toBe('⇄ U$D 100,00');
  });

  it('debe rechazar precio menor o igual a cero', () => {
    component.formVal.price = 0;
    const isValid = component.validatePriceField();

    expect(isValid).toBe(false);
    expect(component.priceValidationError()).toBe('El precio debe ser mayor a 0.');
  });

  it('debe rechazar precio no numérico o nulo', () => {
    (component.formVal as unknown as { price: unknown }).price = null;
    const isValid = component.validatePriceField();

    expect(isValid).toBe(false);
    expect(component.priceValidationError()).toBe('El precio debe ser un valor numérico.');
  });

  it('debe persistir el campo currency en el payload al crear producto en USD', async () => {
    component.formVal.name = 'Módulo Pantalla iPhone 13 Pro';
    component.formVal.price = 120.5;
    component.formVal.currency = 'USD';
    component.formVal.stock = 10;
    component.formVal.images = [{ url: 'https://example.com/img.jpg' }];

    await component.save();

    expect(mockProductService.createProduct).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Módulo Pantalla iPhone 13 Pro',
        price: 120.5,
        currency: 'USD',
        stock: 10,
      })
    );
    expect(mockNotificationService.showSuccess).toHaveBeenCalledWith(expect.stringContaining('creado'));
  });

  it('debe persistir el campo currency en el payload al crear producto en ARS', async () => {
    component.formVal.name = 'Funda Silicona Antigolpes';
    component.formVal.price = 4500;
    component.formVal.currency = 'ARS';
    component.formVal.stock = 25;
    component.formVal.images = [{ url: 'https://example.com/funda.jpg' }];

    await component.save();

    expect(mockProductService.createProduct).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Funda Silicona Antigolpes',
        price: 4500,
        currency: 'ARS',
        stock: 25,
      })
    );
  });
});
