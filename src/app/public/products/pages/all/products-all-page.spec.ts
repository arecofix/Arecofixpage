import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { ProductsAllPage } from './products-all-page';
import { ProductService } from '@app/public/products/services';
import { PaginationService } from '@app/shared/components/pagination';
import { CartService } from '@app/shared/services/cart.service';
import { SeoService } from '@app/core/services/seo.service';
import { TenantService, Tenant } from '@app/core/services/tenant.service';
import { GsmService } from '@app/public/gsm/services/gsm.service';
import { Product } from '@app/public/products/interfaces';

describe('ProductsAllPage - Reactive Updates', () => {
  let queryParamsSubject: BehaviorSubject<Record<string, string>>;
  let currentTenantSignal: ReturnType<typeof signal<Tenant | null>>;

  const product1: Product = {
    id: 'prod-1',
    name: 'Módulo Pantalla',
    slug: 'modulo-pantalla',
    price: 10000,
    currency: 'ARS',
  } as Product;

  const product2: Product = {
    id: 'prod-2',
    name: 'Batería iPhone',
    slug: 'bateria-iphone',
    price: 8000,
    currency: 'ARS',
  } as Product;

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

    productServiceMock = {
      getData: jest.fn((params: { _page?: number; q?: string }) => {
        if (params.q === 'batería') {
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
        ProductsAllPage,
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: queryParamsSubject.asObservable(),
          },
        },
        { provide: Router, useValue: routerMock },
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

  it('should initialize and load default products list', () => {
    const page = TestBed.inject(ProductsAllPage);
    TestBed.flushEffects();

    expect(productServiceMock.getData).toHaveBeenCalledWith(
      expect.objectContaining({
        _page: 1,
      })
    );
    expect(page.productsRs.value()?.data).toEqual([product1]);
  });

  it('should reactively update when page query parameter changes', () => {
    const page = TestBed.inject(ProductsAllPage);
    TestBed.flushEffects();

    queryParamsSubject.next({ _page: '2' });
    TestBed.flushEffects();

    expect(productServiceMock.getData).toHaveBeenCalledWith(
      expect.objectContaining({
        _page: 2,
      })
    );
  });

  it('should reactively update when search query param changes', () => {
    const page = TestBed.inject(ProductsAllPage);
    TestBed.flushEffects();

    queryParamsSubject.next({ q: 'batería' });
    TestBed.flushEffects();

    expect(productServiceMock.getData).toHaveBeenCalledWith(
      expect.objectContaining({
        q: 'batería',
      })
    );
    expect(page.productsRs.value()?.data).toEqual([product2]);
  });
});

