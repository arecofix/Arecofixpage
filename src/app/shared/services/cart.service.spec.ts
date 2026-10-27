import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { CartService } from './cart.service';
import { LoggerService } from '../../core/services/logger.service';
import { ToastService } from './toast.service';
import { Product } from '../interfaces/product.interface';
import { AuthService } from '../../core/services/auth.service';
import { CartRepository } from '../../features/orders/domain/repositories/cart.repository';
import { GsmService } from '../../public/gsm/services/gsm.service';
import { Order } from '../../features/orders/domain/entities/order.entity';
import { BehaviorSubject, of, Subject } from 'rxjs';

describe('CartService (QA & Testing)', () => {
  let service: CartService;
  let loggerMock: { debug: jest.Mock; error: jest.Mock; warn: jest.Mock };
  let toastMock: { show: jest.Mock };
  let authMock: {
    authState$: BehaviorSubject<{ isInitialized: boolean }>;
    getCurrentUser: jest.Mock;
    getCurrentProfile: jest.Mock;
  };
  let cartRepoMock: {
    getActiveCart: jest.Mock;
    createCart: jest.Mock;
    updateCart: jest.Mock;
    deleteCart: jest.Mock;
  };
  let gsmMock: { getUsdtRate: jest.Mock };

  let fakeOrder: Order | null;

  beforeEach(() => {
    fakeOrder = null;

    loggerMock = {
      debug: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    };

    toastMock = {
      show: jest.fn()
    };

    authMock = {
      authState$: new BehaviorSubject({ isInitialized: true }),
      getCurrentUser: jest.fn().mockReturnValue(null),
      getCurrentProfile: jest.fn().mockReturnValue(null)
    };

    cartRepoMock = {
      getActiveCart: jest.fn().mockImplementation(() => of(fakeOrder)),
      createCart: jest.fn().mockImplementation((order: Order) => {
        fakeOrder = { ...order, id: 'fake-order-id' };
        return of(fakeOrder);
      }),
      updateCart: jest.fn().mockImplementation((id: string, order: Order) => {
        fakeOrder = { ...order, id };
        return of(fakeOrder);
      }),
      deleteCart: jest.fn().mockImplementation(() => {
        fakeOrder = null;
        return of(undefined);
      })
    };

    gsmMock = {
      getUsdtRate: jest.fn().mockReturnValue(of(1000)) // For easy math: 1 USD = 1000 ARS
    };

    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        CartService,
        { provide: LoggerService, useValue: loggerMock },
        { provide: ToastService, useValue: toastMock },
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: AuthService, useValue: authMock },
        { provide: CartRepository, useValue: cartRepoMock },
        { provide: GsmService, useValue: gsmMock }
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
    expect(service.cartItems()[0].cartItemId).toBeDefined();
    expect(service.cartItems()[0].quantity).toBe(1);
    expect(service.totalPrice()).toBe(15000);
    expect(toastMock.show).toHaveBeenCalled();
  });

  it('debería aplicar la conversión a ARS si el producto está en USD (Unit Test: USD Price)', async () => {
    const usdProduct: Product = {
      id: 'prod-usd', name: 'MacBook Pro', price: 2, slug: 'macbook-pro', currency: 'USD'
    } as Product;

    await service.addToCart(usdProduct);
    
    // rate is mocked to 1000, so $2 USD = $2000 ARS
    expect(service.cartItems().length).toBe(1);
    expect(service.cartItems()[0].product.convertedPrice).toBe(2000);
    expect(service.totalPrice()).toBe(2000);
  });

  it('debería incrementar la cantidad si el producto ya existe preservando cartItemId (Unit Test: Duplicates)', async () => {
    const product: Product = {
      id: 'prod-2', name: 'Batería iPhone 11', price: 25000, slug: 'bateria-iphone-11',
    } as Product;

    await service.addToCart(product);
    const initialCartItemId = service.cartItems()[0].cartItemId;

    await service.addToCart(product);

    expect(service.cartItems().length).toBe(1);
    expect(service.cartItems()[0].quantity).toBe(2);
    expect(service.cartItems()[0].cartItemId).toBe(initialCartItemId);
    expect(service.totalPrice()).toBe(50000);
  });

  it('debería bloquear agregar producto con stock cero o superado (Stock Validation)', async () => {
    const outOfStock: Product = {
      id: 'prod-no-stock', name: 'Sin Stock', price: 1000, stock: 0
    } as Product;

    await service.addToCart(outOfStock);
    expect(service.cartItems().length).toBe(0);
    expect(toastMock.show).toHaveBeenCalledWith('El producto seleccionado no tiene stock disponible', 'error');

    const lowStock: Product = {
      id: 'prod-low', name: 'Stock 1', price: 1000, stock: 1
    } as Product;

    await service.addToCart(lowStock, 1);
    expect(service.cartItems().length).toBe(1);

    // Try adding another one exceeding stock limit
    await service.addToCart(lowStock, 1);
    expect(service.cartItems()[0].quantity).toBe(1);
    expect(toastMock.show).toHaveBeenCalledWith('Se alcanzó el límite máximo de stock', 'error');
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

  it('debería actualizar manualmente la cantidad usando cartItemId (Unit Test: Bounds/Limits)', async () => {
    const product = { id: 'p3', price: 1000 } as Product;
    await service.addToCart(product);
    const cartItemId = service.cartItems()[0].cartItemId;

    await service.updateQuantity(cartItemId, 5);
    expect(service.cartItems()[0].quantity).toBe(5);
    expect(service.totalPrice()).toBe(5000);

    await service.updateQuantity(cartItemId, 0);
    expect(service.cartItems().length).toBe(0);
  });

  it('debería guardar y recuperar persistencia con retrocompatibilidad (Integration Test)', async () => {
    const product = { id: 'p10', price: 500, name: 'Glass' } as Product;
    await service.addToCart(product);
    
    let reloadedServiceNew: CartService;
    TestBed.runInInjectionContext(() => {
      reloadedServiceNew = new CartService();
    });

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(reloadedServiceNew!.cartItems().length).toBe(1);
    expect(reloadedServiceNew!.cartItems()[0].product.id).toBe('p10');
    expect(reloadedServiceNew!.cartItems()[0].cartItemId).toBeDefined();
    expect(reloadedServiceNew!.totalPrice()).toBe(500);
  });

  describe('D-01 / BUG-001 & BUG-002: Line Identity & Isolated Removal (REQ-F-01)', () => {
    it('debería eliminar de forma aislada una línea (line-A) manteniendo intacta otra línea (line-B)', async () => {
      const productA = { id: 'prod-A', name: 'Pin de Carga Type-C', price: 3500 } as Product;
      const productB = { id: 'prod-B', name: 'Cámara Trasera iPhone 12', price: 42000 } as Product;

      await service.addToCart(productA, 2);
      await service.addToCart(productB, 1);

      expect(service.cartItems().length).toBe(2);
      const lineA = service.cartItems().find(i => i.product.id === 'prod-A')!;
      const lineB = service.cartItems().find(i => i.product.id === 'prod-B')!;

      expect(lineA.cartItemId).toBeDefined();
      expect(lineB.cartItemId).toBeDefined();
      expect(lineA.cartItemId).not.toBe(lineB.cartItemId);

      // Eliminar estrictamente line-A por su cartItemId
      await service.removeFromCart(lineA.cartItemId);

      expect(service.cartItems().length).toBe(1);
      expect(service.cartItems()[0].cartItemId).toBe(lineB.cartItemId);
      expect(service.cartItems()[0].product.id).toBe('prod-B');
      expect(service.cartItems()[0].quantity).toBe(1);
      expect(service.totalPrice()).toBe(42000);
    });

    it('debería preservar de forma determinista el mismo cartItemId al ejecutar loadCart() múltiples veces sobre ítems legados', async () => {
      const legacyItem = {
        id: 'legacy-order-item-uuid-999',
        product_id: 'prod-legacy',
        product_name: 'Batería iPhone 11',
        quantity: 1,
        unit_price: 25000,
        subtotal: 25000,
        product: { id: 'prod-legacy', name: 'Batería iPhone 11', price: 25000 } as Product
      };

      cartRepoMock.getActiveCart.mockReturnValue(of({
        id: 'order-legacy-1',
        status: 'cart',
        items: [legacyItem]
      } as unknown as Order));

      // Primera pasada de hidratación
      await service.loadCart();
      expect(service.cartItems().length).toBe(1);
      const firstCartItemId = service.cartItems()[0].cartItemId;
      expect(firstCartItemId).toBe('legacy-order-item-uuid-999');

      // Segunda pasada de hidratación (simulando navegación o reconexión)
      await service.loadCart();
      expect(service.cartItems().length).toBe(1);
      const secondCartItemId = service.cartItems()[0].cartItemId;

      // El cartItemId debe ser estrictamente idéntico (inmutable), sin generar nuevos UUIDs
      expect(secondCartItemId).toBe(firstCartItemId);
    });
  });

  describe('BUG-004: Concurrency & Stale Network Race Conditions', () => {
    it('no debería reaparecer un ítem eliminado ante una llamada concurrente de loadCart', async () => {
      const product = { id: 'prod-race', name: 'Pantalla OLED', price: 90000 } as Product;
      await service.addToCart(product);
      expect(service.cartItems().length).toBe(1);
      const cartItemId = service.cartItems()[0].cartItemId;

      // Mock the repository to simulate a delayed active cart response containing the old item
      const staleCartResponse = new Subject<Order | null>();
      cartRepoMock.getActiveCart.mockReturnValue(staleCartResponse);

      // Start removing item
      const removePromise = service.removeFromCart(cartItemId);

      // In the middle of mutation, an authState$ background trigger fires loadCart()
      authMock.authState$.next({ isInitialized: true });

      await removePromise;

      // Now stale network response arrives late
      staleCartResponse.next({
        id: 'fake-order-id',
        status: 'cart',
        customer_name: 'Test',
        subtotal: 90000,
        tax: 0,
        discount: 0,
        total: 90000,
        items: [
          {
            id: 'old-item',
            cart_item_id: cartItemId,
            product_id: 'prod-race',
            product_name: 'Pantalla OLED',
            quantity: 1,
            unit_price: 90000,
            subtotal: 90000,
            product: product
          }
        ]
      });

      // Cart should remain empty (optimistic state preserved, mutation queue deferred stale load)
      expect(service.cartItems().length).toBe(0);
    });
  });
});
