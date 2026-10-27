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
import { BehaviorSubject, of, throwError } from 'rxjs';

describe('CartService (Destructive QA & Concurrency Stress Battery)', () => {
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

  let activeOrder: Order;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();

    activeOrder = {
      id: '00000000-0000-0000-0000-000000000001',
      status: 'cart',
      subtotal: 0,
      tax: 0,
      discount: 0,
      total: 0,
      total_amount: 0,
      items: []
    };

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
      getActiveCart: jest.fn().mockImplementation(() => of(activeOrder)),
      createCart: jest.fn().mockImplementation((order: Order) => {
        activeOrder = { ...order, id: '00000000-0000-0000-0000-000000000001' };
        return of(activeOrder);
      }),
      updateCart: jest.fn().mockImplementation((id: string, order: Order) => {
        activeOrder = { ...order, id };
        return of(activeOrder);
      }),
      deleteCart: jest.fn().mockImplementation(() => {
        activeOrder = {
          id: '00000000-0000-0000-0000-000000000001',
          status: 'cart',
          subtotal: 0,
          total: 0,
          total_amount: 0,
          items: []
        };
        return of(undefined);
      })
    };

    gsmMock = {
      getUsdtRate: jest.fn().mockReturnValue(of(1200))
    };

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
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  describe('Adversarial Fuzzing & Mutation Attacks', () => {
    it('should reject null, undefined and corrupted product objects without throwing uncaught exceptions', async () => {
      await expect(service.addToCart(null as any)).resolves.not.toThrow();
      await expect(service.addToCart(undefined as any)).resolves.not.toThrow();
      await expect(service.addToCart({} as any)).resolves.not.toThrow();
      await expect(service.addToCart({ id: '' } as any)).resolves.not.toThrow();

      expect(toastMock.show).toHaveBeenCalledWith(
        'El producto seleccionado no es válido',
        'error'
      );
      expect(service.cartItems().length).toBe(0);
    });

    it('should block negative, zero, NaN and infinite quantities on addToCart', async () => {
      const validProd: Product = { id: 'p1', name: 'Pin de Carga', price: 5000, slug: 'pin-carga' };

      await service.addToCart(validProd, 0);
      await service.addToCart(validProd, -5);
      await service.addToCart(validProd, NaN);
      await service.addToCart(validProd, -Infinity);

      expect(toastMock.show).toHaveBeenCalledWith(
        'La cantidad a agregar debe ser mayor a 0',
        'error'
      );
      expect(service.cartItems().length).toBe(0);
    });

    it('should prevent stock overflow when stock is depleted or exceeded', async () => {
      const limitedProd: Product = {
        id: 'p-limited',
        name: 'Batería iPhone 15 Pro Max',
        price: 35000,
        stock: 3,
        slug: 'bateria-iphone-15'
      };

      // Adding 4 when stock is 3
      await service.addToCart(limitedProd, 4);
      expect(toastMock.show).toHaveBeenCalledWith(
        'Se alcanzó el límite máximo de stock',
        'error'
      );
      expect(service.cartItems().length).toBe(0);

      // Adding 2 (within stock)
      await service.addToCart(limitedProd, 2);
      expect(service.cartItems().length).toBe(1);
      expect(service.totalItems()).toBe(2);

      // Adding another 2 (exceeding stock 2 + 2 > 3)
      await service.addToCart(limitedProd, 2);
      expect(toastMock.show).toHaveBeenCalledWith(
        'Se alcanzó el límite máximo de stock',
        'error'
      );
      expect(service.totalItems()).toBe(2);
    });

    it('should handle zero stock products gracefully', async () => {
      const outOfStockProd: Product = {
        id: 'p-empty',
        name: 'Placa Madre',
        price: 80000,
        stock: 0,
        slug: 'placa-madre'
      };

      await service.addToCart(outOfStockProd, 1);
      expect(toastMock.show).toHaveBeenCalledWith(
        'El producto seleccionado no tiene stock disponible',
        'error'
      );
      expect(service.cartItems().length).toBe(0);
    });
  });

  describe('Concurrency & Race Condition Mutex Stress', () => {
    it('should withstand 30 rapid concurrent addToCart calls without race condition or state corruption', async () => {
      const prodA: Product = { id: 'prod-a', name: 'Item A', price: 100, slug: 'item-a' };
      const prodB: Product = { id: 'prod-b', name: 'Item B', price: 200, slug: 'item-b' };

      // Fire 30 concurrent asynchronous addToCart mutations
      const promises: Promise<void>[] = [];
      for (let i = 0; i < 15; i++) {
        promises.push(service.addToCart(prodA, 1));
        promises.push(service.addToCart(prodB, 1));
      }

      await Promise.all(promises);

      // Verify clean final state
      expect(service.isLoading()).toBe(false);
      expect(service.cartItems().length).toBe(2);
      
      const itemA = service.cartItems().find(ci => ci.product.id === 'prod-a');
      const itemB = service.cartItems().find(ci => ci.product.id === 'prod-b');

      expect(itemA?.quantity).toBe(15);
      expect(itemB?.quantity).toBe(15);
      expect(service.totalItems()).toBe(30);
      expect(service.totalPrice()).toBe(15 * 100 + 15 * 200);
    });

    it('should handle rapid interleaved addToCart, updateQuantity, and removeFromCart gracefully', async () => {
      const prod: Product = { id: 'interleaved', name: 'Test Product', price: 50, slug: 'test' };

      await service.addToCart(prod, 1);
      const cartItemId = service.cartItems()[0].cartItemId;

      // Interleaved rapid mutations
      const p1 = service.updateQuantity(cartItemId, 10);
      const p2 = service.updateQuantity(cartItemId, 5);
      const p3 = service.addToCart(prod, 2);

      await Promise.all([p1, p2, p3]);

      expect(service.isLoading()).toBe(false);
      expect(service.cartItems().length).toBe(1);
      expect(service.cartItems()[0].quantity).toBeGreaterThan(0);
    });
  });

  describe('Database Drops, 500 Network Errors & State Rollback', () => {
    it('should catch database update errors (500), display friendly error toast and reset isLoading', async () => {
      const prod: Product = { id: 'crash-prod', name: 'Crash Prod', price: 1000, slug: 'crash' };

      // Simulate database internal crash on update
      cartRepoMock.updateCart.mockReturnValueOnce(
        throwError(() => ({ code: '500', message: 'Internal Server Error: database connection died' }))
      );

      await service.addToCart(prod, 1);

      expect(loggerMock.error).toHaveBeenCalled();
      expect(toastMock.show).toHaveBeenCalledWith(
        'Error al agregar el producto al carrito',
        'error'
      );
      expect(service.isLoading()).toBe(false);
    });

    it('should handle permission denied 42501 gracefully with informative toast', async () => {
      const prod: Product = { id: 'perm-prod', name: 'Perm Prod', price: 1000, slug: 'perm' };

      cartRepoMock.updateCart.mockReturnValueOnce(
        throwError(() => ({ code: '42501', message: 'permission denied for table orders' }))
      );

      await service.addToCart(prod, 1);

      expect(toastMock.show).toHaveBeenCalledWith(
        expect.stringContaining('No tienes permisos para modificar el carrito'),
        'error'
      );
      expect(service.isLoading()).toBe(false);
    });
  });

  describe('Massive Scale & Floating-Point Rigor', () => {
    it('should handle floating point prices (0.1 + 0.2) and compute totals accurately without drift', async () => {
      const prodFloatA: Product = { id: 'fa', name: 'Float A', price: 0.1, slug: 'fa' };
      const prodFloatB: Product = { id: 'fb', name: 'Float B', price: 0.2, slug: 'fb' };

      await service.addToCart(prodFloatA, 1);
      await service.addToCart(prodFloatB, 1);

      expect(service.totalItems()).toBe(2);
      expect(Number(service.totalPrice().toFixed(2))).toBe(0.3);
    });

    it('should convert USD currency products dynamically using usdRate', async () => {
      service.usdRate.set(1250);

      const usdProduct: Product = {
        id: 'p-usd',
        name: 'Kit Herramientas iFixit Pro',
        price: 50,
        currency: 'USD',
        slug: 'ifixit-pro'
      };

      await service.addToCart(usdProduct, 2);

      const item = service.cartItems()[0];
      expect(item.product.convertedPrice).toBe(50 * 1250);
      expect(service.totalPrice()).toBe(2 * (50 * 1250));
    });
  });
});
