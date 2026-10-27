import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Product } from '@app/public/products/interfaces';
import { LoggerService } from '@app/core/services/logger.service';
import { AuthService } from '@app/core/services/auth.service';
import { CartRepository } from '@app/features/orders/domain/repositories/cart.repository';
import { Order, OrderItem } from '@app/features/orders/domain/entities/order.entity';
import { ToastService } from './toast.service';
import { firstValueFrom } from 'rxjs';
import { GsmService } from '@app/public/gsm/services/gsm.service';
import { assertUuid, getOrCreateGuestSessionId, generateUuid } from '@app/core/utils/uuid.utils';

export interface CartItem {
  readonly cartItemId: string;
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private logger = inject(LoggerService);
  private toastService = inject(ToastService);
  private platformId = inject(PLATFORM_ID);
  private authService = inject(AuthService);
  private cartRepository = inject(CartRepository);
  private gsmService = inject(GsmService);

  cartItems = signal<CartItem[]>([]);
  currentOrderSignal = signal<Order | null>(null);
  usdRate = signal<number>(1240);

  // Cart Visibility & Async Processing State
  isCartOpen = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  isHydrating = signal<boolean>(false);

  // Mutex / Queue & Race Condition Prevention
  private isMutating = false;
  private pendingLoad = false;
  private mutationQueue: Promise<void> = Promise.resolve();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.initUsdRateWithCache();

      // Listen for auth state changes to switch carts and merge if needed
      this.authService.authState$.subscribe((state) => {
        if (state.isInitialized) {
          this.loadCart();
        }
      });
    }
  }

  /**
   * Initializes the USD conversion rate with 24-hour LocalStorage cache.
   * Ensures instant checkout availability even during external API downtime.
   */
  private initUsdRateWithCache(): void {
    const CACHE_KEY = 'arecofix_usd_rate_cache';
    const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
    const FALLBACK_RATE = 1240;

    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as { rate?: number; timestamp?: number };
        if (parsed.rate && parsed.timestamp && (Date.now() - parsed.timestamp) < TTL_MS) {
          this.usdRate.set(parsed.rate);
        }
      }
    } catch {
      // Safe fallback already default in signal
    }

    // Refresh rate asynchronously from DolarAPI
    this.gsmService.getUsdtRate().subscribe({
      next: (rate) => {
        const validRate = rate > 0 ? rate : FALLBACK_RATE;
        this.usdRate.set(validRate);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ rate: validRate, timestamp: Date.now() }));
        } catch {}
        this.loadCart();
      },
      error: () => {
        this.loadCart();
      }
    });
  }

  private getOrCreateSessionId(): string {
    return getOrCreateGuestSessionId();
  }

  /**
   * Enqueues cart mutations sequentially to prevent database and state race conditions.
   * Suppresses background loadCart execution while mutations are in-flight.
   */
  private enqueueMutation<T>(operation: () => Promise<T>): Promise<T> {
    this.isMutating = true;
    const nextPromise = this.mutationQueue.then(operation);
    this.mutationQueue = nextPromise
      .then(() => {})
      .catch(() => {})
      .finally(() => {
        this.isMutating = false;
        if (this.pendingLoad) {
          this.pendingLoad = false;
          this.loadCart();
        }
      });
    return nextPromise;
  }

  async loadCart(): Promise<void> {
    // BUG-004: Prevent stale background network responses from clobbering active mutations
    if (this.isMutating) {
      this.pendingLoad = true;
      this.logger.debug('Cart mutation in-flight; deferred background loadCart');
      return;
    }

    const user = this.authService.getCurrentUser();

    if (user && isPlatformBrowser(this.platformId)) {
      // Check if there is a guest cart to migrate
      const rawStoredSession = localStorage.getItem('guest_session_id') || localStorage.getItem('cart_session_id');
      const validStoredSession = assertUuid(rawStoredSession);
      if (validStoredSession) {
        try {
          const guestCart = await firstValueFrom(this.cartRepository.getActiveCart(undefined, validStoredSession));
          if (guestCart) {
            const validUserId = assertUuid(user.id);
            const userCart = validUserId ? await firstValueFrom(this.cartRepository.getActiveCart(validUserId, undefined)) : null;
            if (userCart) {
              await this.mergeCarts(guestCart, userCart);
            } else if (validUserId) {
              // Link guest cart to user
              const profile = this.authService.getCurrentProfile();
              guestCart.user_id = validUserId;
              guestCart.session_id = undefined;
              guestCart.customer_name = profile?.full_name || profile?.display_name || user.email || 'Usuario';
              guestCart.customer_email = user.email;
              guestCart.customer_phone = profile?.phone || undefined;
              await firstValueFrom(this.cartRepository.updateCart(guestCart.id!, guestCart));
            }
          }
          localStorage.removeItem('guest_session_id');
          localStorage.removeItem('cart_session_id');
        } catch (error: unknown) {
          this.logger.error('Error migrating guest cart to user', error);
        }
      }
    }

    const userId = assertUuid(user?.id) || undefined;
    const sessionId = !userId ? (assertUuid(this.getOrCreateSessionId()) || undefined) : undefined;

    if (!userId && !sessionId) {
      this.currentOrderSignal.set(null);
      this.cartItems.set([]);
      this.isLoading.set(false);
      this.isHydrating.set(false);
      return;
    }

    try {
      this.isLoading.set(true);
      this.isHydrating.set(true);
      const activeOrder = await firstValueFrom(this.cartRepository.getActiveCart(userId, sessionId));
      this.currentOrderSignal.set(activeOrder);

      if (activeOrder && activeOrder.items) {
        const items: CartItem[] = activeOrder.items
          .filter(item => item.product)
          .map(item => {
            const prod = item.product!;
            if (prod.currency === 'USD' && !prod.convertedPrice) {
              prod.convertedPrice = prod.price * this.usdRate();
            }
            const finalPrice = prod.convertedPrice || prod.price;
            item.unit_price = finalPrice;
            item.subtotal = finalPrice * item.quantity;

            // Retain or assign immutable cartItemId (retrocompatibility for legacy records)
            const existingInCart = this.cartItems().find(ci => ci.product.id === prod.id);
            const cartItemId = item.cart_item_id || item.id || existingInCart?.cartItemId || generateUuid();
            item.cart_item_id = cartItemId;

            return {
              cartItemId,
              product: prod,
              quantity: item.quantity
            };
          });
        this.cartItems.set(items);
      } else {
        this.cartItems.set([]);
      }
    } catch (error: unknown) {
      this.logger.error('Error loading cart', error);
      this.cartItems.set([]);
    } finally {
      this.isLoading.set(false);
      this.isHydrating.set(false);
    }
  }

  private async mergeCarts(guestCart: Order, userCart: Order): Promise<void> {
    const userItems = [...(userCart.items || [])];

    for (const guestItem of (guestCart.items || [])) {
      const existing = userItems.find(item => item.product_id === guestItem.product_id);
      const prod = guestItem.product;
      if (prod && prod.currency === 'USD' && !prod.convertedPrice) {
        prod.convertedPrice = prod.price * this.usdRate();
      }
      const priceToUse = prod?.convertedPrice || prod?.price || guestItem.unit_price;

      if (existing) {
        existing.quantity += guestItem.quantity;
        existing.subtotal = existing.quantity * priceToUse;
        existing.unit_price = priceToUse;
      } else {
        userItems.push({
          cart_item_id: guestItem.cart_item_id || generateUuid(),
          product_id: guestItem.product_id,
          product_name: guestItem.product_name,
          quantity: guestItem.quantity,
          unit_price: priceToUse,
          subtotal: guestItem.quantity * priceToUse,
          product: guestItem.product
        });
      }
    }

    const subtotal = userItems.reduce((acc, item) => acc + item.subtotal, 0);
    userCart.items = userItems;
    userCart.subtotal = subtotal;
    userCart.total = subtotal;
    userCart.total_amount = subtotal;

    await firstValueFrom(this.cartRepository.updateCart(userCart.id!, userCart));
    await firstValueFrom(this.cartRepository.deleteCart(guestCart.id!));
  }

  private syncOrderState(updatedOrder: Order): void {
    this.currentOrderSignal.set(updatedOrder);
    this.cartItems.set(
      updatedOrder.items?.map(item => ({
        cartItemId: item.cart_item_id || item.id || generateUuid(),
        product: item.product || {
          id: item.product_id || '',
          name: item.product_name || 'Producto',
          price: item.unit_price || 0,
          currency: 'ARS',
          stock: 999,
          slug: item.product_sku || item.product_id || '',
        },
        quantity: item.quantity
      })) || []
    );
  }

  private async getOrCreateActiveOrder(): Promise<Order> {
    const inMemoryOrder = this.currentOrderSignal();
    if (inMemoryOrder && inMemoryOrder.id && inMemoryOrder.status === 'cart') {
      return inMemoryOrder;
    }

    const user = this.authService.getCurrentUser();
    const userId = user?.id;
    const sessionId = !userId ? this.getOrCreateSessionId() : undefined;

    const activeOrder = await firstValueFrom(this.cartRepository.getActiveCart(userId, sessionId));
    if (activeOrder) {
      this.currentOrderSignal.set(activeOrder);
      return activeOrder;
    }

    const profile = this.authService.getCurrentProfile();
    const newOrder: Order = {
      user_id: userId,
      session_id: sessionId,
      customer_name: profile?.full_name || profile?.display_name || user?.email || 'Invitado',
      customer_email: user?.email || undefined,
      customer_phone: profile?.phone || undefined,
      status: 'cart',
      subtotal: 0,
      tax: 0,
      discount: 0,
      total: 0,
      total_amount: 0,
      items: []
    };

    return firstValueFrom(this.cartRepository.createCart(newOrder));
  }

  async addToCart(product: Product, quantityToAdd: number = 1): Promise<void> {
    // 1. Guard validations before database invocation
    if (!product || !product.id) {
      this.toastService.show('El producto seleccionado no es válido', 'error');
      return;
    }

    if (!quantityToAdd || isNaN(quantityToAdd) || quantityToAdd <= 0 || !isFinite(quantityToAdd)) {
      this.toastService.show('La cantidad a agregar debe ser mayor a 0', 'error');
      return;
    }

    if (product.stock !== undefined && product.stock !== null && product.stock <= 0) {
      this.toastService.show('El producto seleccionado no tiene stock disponible', 'error');
      return;
    }

    const existingInCart = this.cartItems().find(item => item.product.id === product.id);
    const currentQty = existingInCart ? existingInCart.quantity : 0;
    if (product.stock !== undefined && product.stock !== null && (currentQty + quantityToAdd) > product.stock) {
      this.toastService.show('Se alcanzó el límite máximo de stock', 'error');
      return;
    }

    return this.enqueueMutation(async () => {
      try {
        this.isLoading.set(true);
        const order = await this.getOrCreateActiveOrder();
        const items = order.items ? [...order.items] : [];

        const existingItem = items.find(item => item.product_id === product.id);

        if (product.currency === 'USD' && !product.convertedPrice) {
          product.convertedPrice = product.price * this.usdRate();
        }
        const priceToUse = product.convertedPrice || product.price;

        if (existingItem) {
          // BUG-001: Increment quantity preserving line identity
          existingItem.quantity += quantityToAdd;
          existingItem.subtotal = existingItem.quantity * priceToUse;
          existingItem.unit_price = priceToUse;
          if (!existingItem.cart_item_id) {
            existingItem.cart_item_id = existingInCart?.cartItemId || generateUuid();
          }
        } else {
          // BUG-001: New line gets unique cart_item_id
          const newCartItemId = generateUuid();
          items.push({
            cart_item_id: newCartItemId,
            product_id: product.id,
            product_name: product.name,
            quantity: quantityToAdd,
            unit_price: priceToUse,
            subtotal: priceToUse * quantityToAdd,
            product: product
          });
        }

        const subtotal = items.reduce((acc, item) => acc + item.subtotal, 0);
        order.items = items;
        order.subtotal = subtotal;
        order.total = subtotal;
        order.total_amount = subtotal;

        const updatedOrder = await firstValueFrom(this.cartRepository.updateCart(order.id!, order));
        this.syncOrderState(updatedOrder);

        this.logger.debug('Product added to cart successfully', { productName: product.name, quantity: quantityToAdd });
        this.toastService.show('Agregaste un producto al carrito', 'success', () => this.openCart());
      } catch (error: unknown) {
        this.logger.error('Error adding to cart', error);
        const err = error as { code?: string; message?: string };
        let userMsg = 'Error al agregar el producto al carrito';
        if (err?.code === '42501' || err?.message?.includes('permisos')) {
          userMsg = 'No tienes permisos para modificar el carrito. Verifica tu sesión.';
        } else if (err?.message?.includes('network') || err?.message?.includes('fetch')) {
          userMsg = 'Error de conexión. Verifica tu internet e intenta nuevamente.';
        }
        this.toastService.show(userMsg, 'error');
      } finally {
        this.isLoading.set(false);
      }
    });
  }

  async removeFromCart(cartItemId: string): Promise<void> {
    return this.enqueueMutation(async () => {
      try {
        this.isLoading.set(true);
        const order = await this.getOrCreateActiveOrder();
        // BUG-002: Filter strictly by cartItemId
        const items = order.items
          ? order.items.filter(item => (item.cart_item_id || item.id) !== cartItemId)
          : [];

        const subtotal = items.reduce((acc, item) => acc + item.subtotal, 0);
        order.items = items;
        order.subtotal = subtotal;
        order.total = subtotal;
        order.total_amount = subtotal;

        // Optimistic update of UI
        this.syncOrderState(order);

        const updatedOrder = await firstValueFrom(this.cartRepository.updateCart(order.id!, order));
        this.syncOrderState(updatedOrder);
        this.logger.debug('Cart item removed', { cartItemId });
      } catch (error: unknown) {
        this.logger.error('Error removing from cart', error);
        this.toastService.show('Error al eliminar el producto', 'error');
      } finally {
        this.isLoading.set(false);
      }
    });
  }

  async updateQuantity(cartItemId: string, quantity: number): Promise<void> {
    if (!quantity || isNaN(quantity) || quantity <= 0 || !isFinite(quantity)) {
      await this.removeFromCart(cartItemId);
      return;
    }

    return this.enqueueMutation(async () => {
      try {
        this.isLoading.set(true);
        const order = await this.getOrCreateActiveOrder();
        const items = order.items ? [...order.items] : [];

        // BUG-002: Find strictly by cartItemId
        const item = items.find(i => (i.cart_item_id || i.id) === cartItemId);
        if (!item) {
          this.logger.warn('Item not found in order for updateQuantity', { cartItemId });
          return;
        }

        if (item.product?.stock !== undefined && item.product.stock !== null && quantity > item.product.stock) {
          this.toastService.show('Se alcanzó el límite máximo de stock', 'error');
          return;
        }

        const priceToUse = item.product?.convertedPrice || item.product?.price || item.unit_price;

        item.quantity = quantity;
        item.unit_price = priceToUse;
        item.subtotal = quantity * priceToUse;

        const subtotal = items.reduce((acc, i) => acc + i.subtotal, 0);
        order.items = items;
        order.subtotal = subtotal;
        order.total = subtotal;
        order.total_amount = subtotal;

        this.syncOrderState(order);

        const updatedOrder = await firstValueFrom(this.cartRepository.updateCart(order.id!, order));
        this.syncOrderState(updatedOrder);
        this.logger.debug('Cart item quantity updated', { cartItemId, quantity });
      } catch (error: unknown) {
        this.logger.error('Error updating quantity in cart', error);
        this.toastService.show('Error al actualizar la cantidad', 'error');
      } finally {
        this.isLoading.set(false);
      }
    });
  }

  async clearCart(): Promise<void> {
    return this.enqueueMutation(async () => {
      try {
        this.isLoading.set(true);
        const order = this.currentOrderSignal();
        if (order && order.id && order.status === 'cart') {
          await firstValueFrom(this.cartRepository.deleteCart(order.id));
        }
      } catch (error: unknown) {
        this.logger.error('Error clearing cart in database', error);
      } finally {
        this.currentOrderSignal.set(null);
        this.cartItems.set([]);
        this.isLoading.set(false);
      }
    });
  }

  totalItems = computed(() => this.cartItems().reduce((acc, item) => acc + (item.quantity || 0), 0));
  totalPrice = computed(() => this.cartItems().reduce((acc, item) => acc + ((item.product?.convertedPrice || item.product?.price || 0) * (item.quantity || 0)), 0));

  openCart(): void {
    this.isCartOpen.set(true);
  }

  closeCart(): void {
    this.isCartOpen.set(false);
  }

  toggleCart(): void {
    this.isCartOpen.update(v => !v);
  }
}
