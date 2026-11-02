import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ActivatedRoute, Router, convertToParamMap, ParamMap } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { ProductsByCategoryPage } from './products-by-category-page';
import { CategoryService } from '@app/public/categories/services';
import { ProductService } from '@app/public/products/services';
import { PaginationService } from '@app/shared/components/pagination';
import { CartService } from '@app/shared/services/cart.service';
import { SeoService } from '@app/core/services/seo.service';
import { TenantService, Tenant } from '@app/core/services/tenant.service';
import { GsmService } from '@app/public/gsm/services/gsm.service';
import { iCategory } from '@app/public/categories/interfaces';
import { Product } from '@app/public/products/interfaces';

describe('ProductsByCategoryPage - Reactive Category Updates', () => {
  let paramMapSubject: BehaviorSubject<ParamMap>;
  let queryParamsSubject: BehaviorSubject<Record<string, string>>;
  let currentTenantSignal: ReturnType<typeof signal<Tenant | null>>;

  const catRepuestos: iCategory = {
    id: 'cat-1',
    name: 'Repuestos',
    slug: 'repuestos',
    parent_id: null,
    level: 1,
  };

  const catModulos: iCategory = {
    id: 'cat-2',
    name: 'Módulos',
    slug: 'modulos',
    parent_id: 'cat-1',
    level: 2,
  };

  const catHerramientas: iCategory = {
    id: 'cat-3',
    name: 'Herramientas',
    slug: 'herramientas',
    parent_id: null,
    level: 1,
  };

  const allCategories: iCategory[] = [catRepuestos, catModulos, catHerramientas];

  const product1: Product = {
    id: 'prod-1',
    name: 'Módulo Samsung A10',
    slug: 'modulo-samsung-a10',
    price: 15000,
    category_id: 'cat-2',
    currency: 'ARS',
  } as Product;

  const product2: Product = {
    id: 'prod-2',
    name: 'Destornillador Precision',
    slug: 'destornillador-precision',
    price: 5000,
    category_id: 'cat-3',
    currency: 'ARS',
  } as Product;

  let categoryServiceMock: {
    resolveSlugFromPath: jest.Mock;
    getDataBySlug: jest.Mock;
    getAll: jest.Mock;
    getFeaturedData: jest.Mock;
    buildAncestorChain: jest.Mock;
  };

  let productServiceMock: {
    getData: jest.Mock;
  };

  let tenantServiceMock: {
    currentTenant: ReturnType<typeof signal<Tenant | null>>;
  };

  let gsmServiceMock: {
    getUsdtRate: jest.Mock;
  };

  let seoServiceMock: {
    setPageData: jest.Mock;
  };

  let routerMock: {
    navigate: jest.Mock;
  };

  beforeEach(() => {
    paramMapSubject = new BehaviorSubject<ParamMap>(
      convertToParamMap({ categorySlug: 'repuestos' })
    );
    queryParamsSubject = new BehaviorSubject<Record<string, string>>({});

    const mockTenant: Tenant = {
      id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b',
      name: 'Arecofix',
      slug: 'arecofix',
      is_active: true,
      plan_type: 'enterprise',
      currency: 'ARS',
      usd_rate: 1200,
      tax_percentage: 21,
      branding_settings: {},
    };

    currentTenantSignal = signal<Tenant | null>(mockTenant);

    categoryServiceMock = {
      resolveSlugFromPath: jest.fn((path: string) => {
        const parts = path.split('/');
        return parts[parts.length - 1];
      }),
      getDataBySlug: jest.fn((slug: string) => {
        const found = allCategories.find((c) => c.slug === slug);
        return of({
          data: found ? [found] : [],
          items: found ? 1 : 0,
          pages: 1,
          first: 1,
          last: 1,
        });
      }),
      getAll: jest.fn(() => of(allCategories)),
      getFeaturedData: jest.fn(() => of({ data: allCategories, first: 1, last: 1, pages: 1, items: 3 })),
      buildAncestorChain: jest.fn((id: string, cats: iCategory[]) => {
        const current = cats.find((c) => c.id === id);
        return current ? [current] : [];
      }),
    };

    productServiceMock = {
      getData: jest.fn((params: { category_ids?: string[] }) => {
        if (params.category_ids?.includes('cat-3')) {
          return of({
            data: [product2],
            items: 1,
            pages: 1,
            first: 1,
            last: 1,
          });
        }
        return of({
          data: [product1],
          items: 1,
          pages: 1,
          first: 1,
          last: 1,
        });
      }),
    };

    tenantServiceMock = {
      currentTenant: currentTenantSignal,
    };

    gsmServiceMock = {
      getUsdtRate: jest.fn(() => of(1250)),
    };

    seoServiceMock = {
      setPageData: jest.fn(),
    };

    routerMock = {
      navigate: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        ProductsByCategoryPage,
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: paramMapSubject.asObservable(),
            queryParams: queryParamsSubject.asObservable(),
          },
        },
        { provide: Router, useValue: routerMock },
        { provide: CategoryService, useValue: categoryServiceMock },
        { provide: ProductService, useValue: productServiceMock },
        { provide: TenantService, useValue: tenantServiceMock },
        { provide: GsmService, useValue: gsmServiceMock },
        { provide: SeoService, useValue: seoServiceMock },
        {
          provide: PaginationService,
          useValue: {
            currentPage: signal(1),
            setTotalPages: jest.fn(),
          },
        },
        {
          provide: CartService,
          useValue: {
            addToCart: jest.fn(),
          },
        },
      ],
    });
  });

  it('should initialize and load products for the initial category "repuestos"', async () => {
    const page = TestBed.inject(ProductsByCategoryPage);
    TestBed.flushEffects();

    // Verify category resolution
    expect(categoryServiceMock.getDataBySlug).toHaveBeenCalledWith('repuestos');
    expect(page.currentCategory()?.slug).toBe('repuestos');

    // Wait for rxResource stream
    const productsData = page.productsRs.value();
    expect(productsData?.data).toEqual([product1]);
    expect(productServiceMock.getData).toHaveBeenCalledWith(
      expect.objectContaining({
        category_ids: expect.arrayContaining(['cat-1', 'cat-2']),
      })
    );
  });

  it('should reactively update products and category when categorySlug param changes', async () => {
    const page = TestBed.inject(ProductsByCategoryPage);
    TestBed.flushEffects();

    expect(page.currentCategory()?.slug).toBe('repuestos');
    expect(page.productsRs.value()?.data).toEqual([product1]);

    // Simulate navigation to another category: 'herramientas'
    paramMapSubject.next(convertToParamMap({ categorySlug: 'herramientas' }));
    TestBed.flushEffects();

    expect(categoryServiceMock.getDataBySlug).toHaveBeenCalledWith('herramientas');
    expect(page.currentCategory()?.slug).toBe('herramientas');

    const updatedData = page.productsRs.value();
    expect(updatedData?.data).toEqual([product2]);
    expect(productServiceMock.getData).toHaveBeenCalledWith(
      expect.objectContaining({
        category_ids: expect.arrayContaining(['cat-3']),
      })
    );
  });

  it('should reactively update products when query params (e.g. price, search) change', async () => {
    const page = TestBed.inject(ProductsByCategoryPage);
    TestBed.flushEffects();

    queryParamsSubject.next({ q: 'batería', min_price: '1000' });
    TestBed.flushEffects();

    expect(productServiceMock.getData).toHaveBeenCalledWith(
      expect.objectContaining({
        q: 'batería',
        min_price: 1000,
      })
    );
  });
});

