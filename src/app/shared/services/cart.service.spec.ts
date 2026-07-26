import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { CartService } from './cart.service';
import { LoggerService } from '../../core/services/logger.service';
import { ToastService } from './toast.service';
import { Product } from '../interfaces/product.interface';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../features/orders/application/services/order.service';
import { SUPABASE_CLIENT } from '../../core/di/supabase-token';
import { BehaviorSubject, of } from 'rxjs';

describe('CartService (QA & Testing)', () => {
  let service: CartService;
  let loggerMock: any;
  let toastMock: any;
  let authMock: any;
  let orderMock: any;
  let supabaseMock: any;

  let fakeOrder: any;

  beforeEach(() => {
    fakeOrder = null;

    loggerMock = {
      debug: jest.fn(),
      error: jest.fn()
    };

    toastMock = {
      show: jest.fn()
    };

    authMock = {
      authState$: new BehaviorSubject({ isInitialized: true }),
      getCurrentUser: jest.fn().mockReturnValue(null),
      getCurrentProfile: jest.fn().mockReturnValue(null)
    };

    orderMock = {
      getActiveCart: jest.fn().mockImplementation(() => of(fakeOrder)),
      createOrder: jest.fn().mockImplementation((order: any) => {
        fakeOrder = { ...order, id: 'fake-order-id' };
        return of(fakeOrder);
      }),
      updateOrder: jest.fn().mockImplementation((id: string, order: any) => {
        fakeOrder = { ...order, id };
        return of(fakeOrder);
      })
    };

    supabaseMock = {
      from: jest.fn().mockReturnValue({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue(Promise.resolve({ error: null }))
        })
      })
    };

    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        CartService,
        { provide: LoggerService, useValue: loggerMock },
        { provide: ToastService, useValue: toastMock },
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: AuthService, useValue: authMock },
        { provide: OrderService, useValue: orderMock },
        { provide: SUPABASE_CLIENT, useValue: supabaseMock }
      ]
    });
    service = TestBed.inject(CartService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debería inicializarse vacío (Unit Test: Setup)', async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(service.cartItems().length).toBe(0);
    expect(service.totalItems()).toBe(0);
    expect(service.totalPrice()).toBe(0);
  });

  it('debería agregar un nuevo producto correctamente (Integration Test: State)', async () => {
    const product: Product = {
      id: 'prod-1', name: 'Módulo Display Motorola', price: 15000, slug: 'modulo-display-motorola',
    } as Product;

    await service.addToCart(product);

    expect(service.cartItems().length).toBe(1);
    expect(service.cartItems()[0].product.id).toBe('prod-1');
    expect(service.cartItems()[0].quantity).toBe(1);
    expect(service.totalPrice()).toBe(15000);
    expect(toastMock.show).toHaveBeenCalled();
  });

  it('debería incrementar la cantidad si el producto ya existe (Unit Test: Duplicates)', async () => {
    const product: Product = {
        id: 'prod-2', name: 'Batería iPhone 11', price: 25000, slug: 'bateria-iphone-11',
    } as Product;

    await service.addToCart(product);
    await service.addToCart(product);

    expect(service.cartItems().length).toBe(1);
    expect(service.cartItems()[0].quantity).toBe(2);
    expect(service.totalPrice()).toBe(50000);
  });

  it('debería calcular matemáticamente correcto items múltiples (Red Team: Fuzzing Prices)', async () => {
    const p1 = { id: 'p1', price: 10.50 } as Product;
    const p2 = { id: 'p2', price: 5.25 } as Product;
    
    await service.addToCart(p1);
    await service.addToCart(p1);
    await service.addToCart(p2);

    expect(service.totalItems()).toBe(3);
    expect(service.totalPrice()).toBe(26.25);
  });

  it('debería actualizar manualmente la cantidad (Unit Test: Bounds/Limits)', async () => {
    const product = { id: 'p3', price: 1000 } as Product;
    await service.addToCart(product);

    await service.updateQuantity('p3', 5);
    expect(service.cartItems()[0].quantity).toBe(5);
    expect(service.totalPrice()).toBe(5000);

    await service.updateQuantity('p3', 0);
    expect(service.cartItems().length).toBe(0);
  });

  it('debería guardar y recuperar persistencia (Integration Test)', async () => {
    const product = { id: 'p10', price: 500, name: 'Glass' } as Product;
    await service.addToCart(product);
    
    let reloadedServiceNew: CartService;
    TestBed.runInInjectionContext(() => {
      reloadedServiceNew = new CartService();
    });

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(reloadedServiceNew!.cartItems().length).toBe(1);
    expect(reloadedServiceNew!.cartItems()[0].product.id).toBe('p10');
    expect(reloadedServiceNew!.totalPrice()).toBe(500);
  });
});
