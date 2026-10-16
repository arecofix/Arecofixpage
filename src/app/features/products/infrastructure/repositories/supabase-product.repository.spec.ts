import { TestBed } from '@angular/core/testing';
import { EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { SupabaseProductRepository } from './supabase-product.repository';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { LoggerService } from '@app/core/services/logger.service';
import { TenantService } from '@app/core/services/tenant.service';
import { SupabaseErrorHandlerService } from '@app/core/services/supabase-error-handler.service';
import { StockManagementService } from '@app/features/products/application/services/stock-management.service';
import { BranchContextService } from '@app/core/services/branch-context.service';
import { SupabaseStorageService } from '@app/core/services/supabase-storage.service';

describe('SupabaseProductRepository', () => {
  let repository: SupabaseProductRepository;
  let mockSupabase: any;
  let mockQueryBuilder: any;

  beforeEach(() => {
    mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      is: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      range: jest.fn().mockReturnThis(),
      then: jest.fn((resolve) => resolve({ data: [], count: 0, error: null }))
    };

    mockSupabase = {
      from: jest.fn().mockReturnValue(mockQueryBuilder)
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: SUPABASE_CLIENT, useValue: mockSupabase },
        {
          provide: LoggerService,
          useValue: { info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() }
        },
        {
          provide: TenantService,
          useValue: { getTenantId: () => '00000000-0000-0000-0000-000000000000' }
        },
        {
          provide: SupabaseErrorHandlerService,
          useValue: { handleError: jest.fn() }
        },
        {
          provide: StockManagementService,
          useValue: { updateStock: jest.fn() }
        },
        {
          provide: BranchContextService,
          useValue: { getBranchId: () => null }
        },
        {
          provide: SupabaseStorageService,
          useValue: { uploadFile: jest.fn() }
        }
      ]
    });

    const injector = TestBed.inject(EnvironmentInjector);
    runInInjectionContext(injector, () => {
      repository = TestBed.inject(SupabaseProductRepository);
    });
  });

  it('getBySlug() should query products table with minimal=false selecting description and SEO metadata', (done) => {
    const fakeProductRow = {
      id: 'prod-123',
      name: 'Módulo Samsung A36 OLED',
      slug: 'modulo-samsung-a36-oled',
      description: 'Módulo original pantalla completa',
      price: 45000,
      is_active: true,
      meta_title: 'Módulo Samsung A36 OLED - Calidad Original',
      meta_description: 'Comprá tu pantalla original con garantía en Arecofix.',
      og_image: 'https://db.arecofix.com.ar/storage/v1/object/public/public-assets/products/display.webp'
    };

    mockQueryBuilder.then = jest.fn((resolve) =>
      resolve({ data: [fakeProductRow], count: 1, error: null })
    );

    repository.getBySlug('modulo-samsung-a36-oled').subscribe((product) => {
      expect(mockSupabase.from).toHaveBeenCalledWith('products');
      
      // Verify select includes description and SEO metadata
      const selectArg = mockQueryBuilder.select.mock.calls[0][0];
      expect(selectArg).toContain('description');
      expect(selectArg).toContain('meta_title');
      expect(selectArg).toContain('meta_description');
      expect(selectArg).toContain('specifications');
      expect(selectArg).toContain('gallery_urls');

      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('slug', 'modulo-samsung-a36-oled');

      expect(product).toBeDefined();
      expect(product?.name).toBe('Módulo Samsung A36 OLED');
      expect(product?.description).toBe('Módulo original pantalla completa');
      expect(product?.meta_title).toBe('Módulo Samsung A36 OLED - Calidad Original');
      expect(product?.meta_description).toBe('Comprá tu pantalla original con garantía en Arecofix.');
      done();
    });
  });

  it('findWithFilters() should automatically disable minimal mode when slug is queried', (done) => {
    mockQueryBuilder.then = jest.fn((resolve) =>
      resolve({ data: [], count: 0, error: null })
    );

    repository.findWithFilters({ slug: 'bateria-iphone-14' }).subscribe(() => {
      const selectArg = mockQueryBuilder.select.mock.calls[0][0];
      expect(selectArg).toContain('description');
      expect(selectArg).toContain('specifications');
      done();
    });
  });

  it('findWithFilters() should automatically disable minimal mode when id is queried', (done) => {
    mockQueryBuilder.then = jest.fn((resolve) =>
      resolve({ data: [], count: 0, error: null })
    );

    repository.findWithFilters({ id: 'uuid-456' }).subscribe(() => {
      const selectArg = mockQueryBuilder.select.mock.calls[0][0];
      expect(selectArg).toContain('description');
      done();
    });
  });

  it('findWithFilters() should exclude description when minimal=true for lightweight catalog grids', (done) => {
    mockQueryBuilder.then = jest.fn((resolve) =>
      resolve({ data: [], count: 0, error: null })
    );

    repository.findWithFilters({ minimal: true }).subscribe(() => {
      const selectArg = mockQueryBuilder.select.mock.calls[0][0];
      expect(selectArg).not.toContain('description');
      expect(selectArg).toContain('price');
      expect(selectArg).toContain('name');
      done();
    });
  });
});
