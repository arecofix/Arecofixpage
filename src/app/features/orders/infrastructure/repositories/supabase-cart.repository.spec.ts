import { TestBed } from '@angular/core/testing';
import { EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { SupabaseCartRepository } from './supabase-cart.repository';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { LoggerService } from '@app/core/services/logger.service';
import { TenantService } from '@app/core/services/tenant.service';
import { SupabaseErrorHandlerService } from '@app/core/services/supabase-error-handler.service';
import { BranchContextService } from '@app/core/services/branch-context.service';
import { Order } from '../../domain/entities/order.entity';

interface MockQueryBuilder {
  select: jest.Mock;
  insert: jest.Mock;
  update: jest.Mock;
  upsert: jest.Mock;
  delete: jest.Mock;
  in: jest.Mock;
  eq: jest.Mock;
  is: jest.Mock;
  order: jest.Mock;
  limit: jest.Mock;
  maybeSingle: jest.Mock;
  single: jest.Mock;
  then: (onfulfilled?: (value: { data: unknown; error: unknown }) => unknown, onrejected?: (reason: unknown) => unknown) => Promise<unknown>;
}

describe('SupabaseCartRepository Unit Tests', () => {
  let repository: SupabaseCartRepository;
  let mockSupabase: { from: jest.Mock };
  let mockLogger: { info: jest.Mock; warn: jest.Mock; error: jest.Mock; debug: jest.Mock };
  let mockTenantService: { getTenantId: jest.Mock };
  let mockErrorHandler: { handleError: jest.Mock };
  let mockBranchService: { getBranchId: jest.Mock };

  const TEST_TENANT_ID = 'bba26ccd-59ce-471c-aac0-4c1f5513de3b';
  const VALID_USER_ID = '11111111-1111-1111-1111-111111111111';
  const VALID_SESSION_ID = '22222222-2222-2222-2222-222222222222';
  const VALID_ORDER_ID = '33333333-3333-3333-3333-333333333333';
  const VALID_PRODUCT_ID = '44444444-4444-4444-4444-444444444444';

  function createMockQueryBuilder(resolvedResult: { data: unknown; error: unknown } = { data: null, error: null }): MockQueryBuilder {
    const builder = {} as MockQueryBuilder;
    builder.select = jest.fn().mockReturnValue(builder);
    builder.insert = jest.fn().mockReturnValue(builder);
    builder.update = jest.fn().mockReturnValue(builder);
    builder.upsert = jest.fn().mockReturnValue(builder);
    builder.delete = jest.fn().mockReturnValue(builder);
    builder.in = jest.fn().mockReturnValue(builder);
    builder.eq = jest.fn().mockReturnValue(builder);
    builder.is = jest.fn().mockReturnValue(builder);
    builder.order = jest.fn().mockReturnValue(builder);
    builder.limit = jest.fn().mockReturnValue(builder);
    builder.maybeSingle = jest.fn().mockImplementation(() => Promise.resolve(resolvedResult));
    builder.single = jest.fn().mockImplementation(() => Promise.resolve(resolvedResult));
    // Make builder thenable for direct `await query`
    builder.then = (onfulfilled?: (value: { data: unknown; error: unknown }) => unknown, onrejected?: (reason: unknown) => unknown) =>
      Promise.resolve(resolvedResult).then(onfulfilled, onrejected);

    return builder;
  }

  beforeEach(() => {
    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };

    mockTenantService = {
      getTenantId: jest.fn().mockReturnValue(TEST_TENANT_ID),
    };

    mockErrorHandler = {
      handleError: jest.fn(),
    };

    mockBranchService = {
      getBranchId: jest.fn().mockReturnValue(null),
    };

    mockSupabase = {
      from: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: SUPABASE_CLIENT, useValue: mockSupabase },
        { provide: LoggerService, useValue: mockLogger },
        { provide: TenantService, useValue: mockTenantService },
        { provide: SupabaseErrorHandlerService, useValue: mockErrorHandler },
        { provide: BranchContextService, useValue: mockBranchService },
      ],
    });

    const injector = TestBed.inject(EnvironmentInjector);
    runInInjectionContext(injector, () => {
      repository = new SupabaseCartRepository();
    });
  });

  describe('getActiveCart', () => {
    it('should return null observable if neither valid userId nor valid sessionId is provided', async () => {
      const cart = await firstValueFrom(repository.getActiveCart('invalid-id', 'not-a-uuid'));
      expect(cart).toBeNull();
      expect(mockSupabase.from).not.toHaveBeenCalled();
    });

    it('should query active cart by sessionId and return mapped Order', async () => {
      const mockRawRow = {
        id: VALID_ORDER_ID,
        order_number: 'CART-TEST-001',
        session_id: VALID_SESSION_ID,
        status: 'cart',
        subtotal: 149000,
        tax: 0,
        discount: 0,
        total: 149000,
        tenant_id: TEST_TENANT_ID,
        created_at: new Date().toISOString(),
        items: [
          {
            id: 'item-1',
            order_id: VALID_ORDER_ID,
            product_id: VALID_PRODUCT_ID,
            product_name: 'Módulo Pantalla iPhone 13 OLED',
            quantity: 1,
            unit_price: 149000,
            subtotal: 149000,
            tenant_id: TEST_TENANT_ID,
            product: {
              id: VALID_PRODUCT_ID,
              name: 'Módulo Pantalla iPhone 13 OLED',
              slug: 'modulo-pantalla-iphone-13-oled',
              price: 149000,
              currency: 'ARS',
              image_url: 'https://images.unsplash.com/photo-iphone13',
              stock: 5,
            },
          },
        ],
      };

      const builder = createMockQueryBuilder({ data: [mockRawRow], error: null });
      mockSupabase.from.mockReturnValue(builder);

      const cart = await firstValueFrom(repository.getActiveCart(undefined, VALID_SESSION_ID));

      expect(cart).not.toBeNull();
      expect(cart?.id).toBe(VALID_ORDER_ID);
      expect(cart?.order_number).toBe('CART-TEST-001');
      expect(cart?.items?.length).toBe(1);
      expect(cart?.items?.[0].product_name).toBe('Módulo Pantalla iPhone 13 OLED');
      expect(mockSupabase.from).toHaveBeenCalledWith('orders');
      expect(builder.eq).toHaveBeenCalledWith('status', 'cart');
      expect(builder.eq).toHaveBeenCalledWith('session_id', VALID_SESSION_ID);
      expect(builder.eq).toHaveBeenCalledWith('tenant_id', TEST_TENANT_ID);
    });

    it('should query active cart by userId when valid userId is provided', async () => {
      const builder = createMockQueryBuilder({ data: [], error: null });
      mockSupabase.from.mockReturnValue(builder);

      const cart = await firstValueFrom(repository.getActiveCart(VALID_USER_ID, undefined));

      expect(cart).toBeNull();
      expect(mockSupabase.from).toHaveBeenCalledWith('orders');
      expect(builder.eq).toHaveBeenCalledWith('user_id', VALID_USER_ID);
    });

    it('should handle database errors via errorHandler and throw', async () => {
      const dbError = { message: 'Database query failed', code: 'PGRST500' };
      const builder = createMockQueryBuilder({ data: null, error: dbError });
      mockSupabase.from.mockReturnValue(builder);

      await expect(firstValueFrom(repository.getActiveCart(VALID_USER_ID, undefined))).rejects.toEqual(dbError);
      expect(mockErrorHandler.handleError).toHaveBeenCalledWith(dbError, 'getActiveCart');
    });
  });

  describe('createCart', () => {
    it('should insert order and items into Supabase and return mapped Order', async () => {
      const newCart: Order = {
        id: VALID_ORDER_ID,
        order_number: 'CART-INIT-01',
        session_id: VALID_SESSION_ID,
        customer_name: 'Cliente Prueba',
        status: 'cart',
        subtotal: 55000,
        tax: 0,
        discount: 0,
        total: 55000,
        items: [
          {
            id: 'item-2',
            order_id: VALID_ORDER_ID,
            product_id: VALID_PRODUCT_ID,
            product_name: 'Batería Motorola G84',
            quantity: 1,
            unit_price: 55000,
            subtotal: 55000,
          },
        ],
      };

      const orderBuilder = createMockQueryBuilder({ data: null, error: null });
      const itemsBuilder = createMockQueryBuilder({ data: null, error: null });

      mockSupabase.from.mockImplementation((tableName: string) => {
        if (tableName === 'orders') return orderBuilder;
        if (tableName === 'order_items') return itemsBuilder;
        return createMockQueryBuilder();
      });

      const createdOrder = await firstValueFrom(repository.createCart(newCart));

      expect(createdOrder.id).toBe(VALID_ORDER_ID);
      expect(createdOrder.order_number).toBe('CART-INIT-01');
      expect(orderBuilder.insert).toHaveBeenCalled();
      expect(itemsBuilder.upsert).toHaveBeenCalled();

      const insertedPayload = orderBuilder.insert.mock.calls[0][0];
      expect(insertedPayload.tenant_id).toBe(TEST_TENANT_ID);
      expect(insertedPayload.status).toBe('cart');
    });

    it('should map 42883 undefined function error to user-friendly message and log context without leaking SQL', async () => {
      const newCart: Order = {
        id: VALID_ORDER_ID,
        order_number: 'CART-INIT-02',
        session_id: VALID_SESSION_ID,
        customer_name: 'Cliente Prueba',
        status: 'cart',
        subtotal: 55000,
        tax: 0,
        discount: 0,
        total: 55000,
        items: [
          {
            id: 'item-2',
            order_id: VALID_ORDER_ID,
            product_id: VALID_PRODUCT_ID,
            product_name: 'Batería Motorola G84',
            quantity: 2,
            unit_price: 55000,
            subtotal: 110000,
          },
        ],
      };

      const dbError = {
        code: '42883',
        message: 'function public.get_current_tenant_id() does not exist',
        details: null,
        hint: null,
      };

      const orderBuilder = createMockQueryBuilder({ data: null, error: dbError });
      mockSupabase.from.mockReturnValue(orderBuilder);

      await expect(firstValueFrom(repository.createCart(newCart))).rejects.toThrow(
        'No se pudo inicializar el carrito en este momento. Por favor, reintenta en unos instantes.'
      );

      expect(mockLogger.error).toHaveBeenCalledWith(
        '[SupabaseCartRepository] createCart failed',
        expect.objectContaining({
          tenantId: TEST_TENANT_ID,
          errorCode: '42883',
          items: [{ sku: VALID_PRODUCT_ID, qty: 2 }],
        })
      );
      expect(mockErrorHandler.handleError).toHaveBeenCalled();
    });

    it('should map PGRST202 error to user-friendly message', async () => {
      const newCart: Order = {
        id: VALID_ORDER_ID,
        customer_name: 'Cliente Prueba',
        status: 'cart',
        subtotal: 1000,
        tax: 0,
        discount: 0,
        total: 1000,
      };

      const dbError = {
        code: 'PGRST202',
        message: 'Could not find the function in schema cache',
      };

      const orderBuilder = createMockQueryBuilder({ data: null, error: dbError });
      mockSupabase.from.mockReturnValue(orderBuilder);

      await expect(firstValueFrom(repository.createCart(newCart))).rejects.toThrow(
        'No se pudo inicializar el carrito en este momento. Por favor, reintenta en unos instantes.'
      );
    });
  });

  describe('updateCart', () => {
    it('should perform differential upsert of items without mass deleting order_items', async () => {
      const existingItemId = 'item-existing-1';
      const activeCartItemId = '11111111-2222-3333-4444-555555555555';
      const removedCartItemId = '99999999-8888-7777-6666-555555555555';

      const updateData: Partial<Order> = {
        subtotal: 75000,
        total: 75000,
        items: [
          {
            cart_item_id: activeCartItemId,
            product_id: VALID_PRODUCT_ID,
            product_name: 'Módulo Pantalla iPhone 13 OLED',
            quantity: 1,
            unit_price: 75000,
            subtotal: 75000,
          },
        ],
      };

      const refreshedRow = {
        id: VALID_ORDER_ID,
        order_number: 'CART-UPDATED-01',
        status: 'cart',
        subtotal: 75000,
        total: 75000,
        tenant_id: TEST_TENANT_ID,
        items: [
          {
            id: 'item-refreshed',
            order_id: VALID_ORDER_ID,
            cart_item_id: activeCartItemId,
            product_id: VALID_PRODUCT_ID,
            product_name: 'Módulo Pantalla iPhone 13 OLED',
            quantity: 1,
            unit_price: 75000,
            subtotal: 75000,
          },
        ],
      };

      // Mock existing items in DB: one active, one removed
      const existingDbRows = [
        { id: existingItemId, cart_item_id: activeCartItemId },
        { id: 'item-to-remove', cart_item_id: removedCartItemId },
      ];

      const ordersBuilder = createMockQueryBuilder({ data: refreshedRow, error: null });
      const itemsBuilder = createMockQueryBuilder({ data: existingDbRows, error: null });

      mockSupabase.from.mockImplementation((tableName: string) => {
        if (tableName === 'orders') return ordersBuilder;
        if (tableName === 'order_items') return itemsBuilder;
        return createMockQueryBuilder();
      });

      const updated = await firstValueFrom(repository.updateCart(VALID_ORDER_ID, updateData));

      expect(updated.id).toBe(VALID_ORDER_ID);
      expect(updated.total).toBe(75000);

      // Verify selective deletion of removed item only (ARCH-002)
      expect(itemsBuilder.delete).toHaveBeenCalled();
      expect(itemsBuilder.in).toHaveBeenCalledWith('id', ['item-to-remove']);

      // Verify upsert on conflict of cart_item_id
      expect(itemsBuilder.upsert).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            cart_item_id: activeCartItemId,
            order_id: VALID_ORDER_ID,
          }),
        ]),
        { onConflict: 'cart_item_id' }
      );
    });

    it('should delete all items when items array is empty (cart emptied)', async () => {
      const ordersBuilder = createMockQueryBuilder({ data: { id: VALID_ORDER_ID, status: 'cart', items: [] }, error: null });
      const itemsBuilder = createMockQueryBuilder({ data: null, error: null });

      mockSupabase.from.mockImplementation((tableName: string) => {
        if (tableName === 'orders') return ordersBuilder;
        if (tableName === 'order_items') return itemsBuilder;
        return createMockQueryBuilder();
      });

      await firstValueFrom(repository.updateCart(VALID_ORDER_ID, { items: [] }));

      expect(itemsBuilder.delete).toHaveBeenCalled();
      expect(itemsBuilder.eq).toHaveBeenCalledWith('order_id', VALID_ORDER_ID);
    });
  });

  describe('deleteCart', () => {
    it('should delete associated order_items and then delete the order header', async () => {
      const itemsBuilder = createMockQueryBuilder({ data: null, error: null });
      const ordersBuilder = createMockQueryBuilder({ data: null, error: null });

      mockSupabase.from.mockImplementation((tableName: string) => {
        if (tableName === 'order_items') return itemsBuilder;
        if (tableName === 'orders') return ordersBuilder;
        return createMockQueryBuilder();
      });

      await firstValueFrom(repository.deleteCart(VALID_ORDER_ID));

      expect(mockSupabase.from).toHaveBeenCalledWith('order_items');
      expect(mockSupabase.from).toHaveBeenCalledWith('orders');
      expect(itemsBuilder.delete).toHaveBeenCalled();
      expect(ordersBuilder.delete).toHaveBeenCalled();
    });
  });
});
