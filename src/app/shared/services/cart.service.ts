import { Injectable, signal, computed, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Product } from '@app/public/products/interfaces';
import { LoggerService } from '@app/core/services/logger.service';
import { AuthService } from '@app/core/services/auth.service';

export interface CartItem {
    product: Product;
    quantity: number;
}

import { ToastService } from './toast.service';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private logger = inject(LoggerService);
    private toastService = inject(ToastService);
    private platformId = inject(PLATFORM_ID);
    private authService = inject(AuthService);
    
    cartItems = signal<CartItem[]>([]);

    /**
     * Returns the localStorage key scoped to the current user.
     * If no user is logged in, falls back to 'cart_guest'.
     * This ensures each user has their own isolated cart.
     */
    private getCartKey(): string {
        const user = this.authService.getCurrentUser();
        return user ? `cart_${user.id}` : 'cart_guest';
    }

    constructor() {
        if (isPlatformBrowser(this.platformId)) {
            // Load cart from local storage on init
            this.loadCart();

            // Listen for auth state changes to switch carts when user logs in/out
            this.authService.authState$.subscribe((state) => {
                if (state.isInitialized) {
                    this.loadCart();
                }
            });
        }

        // Save cart to local storage whenever it changes
        effect(() => {
            const currentCart = this.cartItems();
            if (isPlatformBrowser(this.platformId)) {
                const key = this.getCartKey();
                localStorage.setItem(key, JSON.stringify(currentCart));
            }
        });
    }

    /**
     * Loads the cart from localStorage using the current user-scoped key.
     * Migrates old shared 'cart' key to user-specific key if needed.
     */
    private loadCart() {
        const key = this.getCartKey();
        let savedCart = localStorage.getItem(key);

        // Migration: if user-specific key is empty but old shared key has data, migrate it
        if (!savedCart && key !== 'cart_guest') {
            const oldSharedCart = localStorage.getItem('cart');
            if (oldSharedCart) {
                savedCart = oldSharedCart;
                localStorage.setItem(key, oldSharedCart);
                localStorage.removeItem('cart'); // Clean up old shared key
                this.logger.info(`Migrated shared cart to user-scoped key: ${key}`);
            }
        }

        if (savedCart) {
            try {
                const parsed = JSON.parse(savedCart);
                if (Array.isArray(parsed)) {
                    this.cartItems.set(parsed.filter(item => item && item.product && item.product.id));
                } else {
                    this.cartItems.set([]);
                }
            } catch (e) {
                this.cartItems.set([]);
            }
        } else {
            this.cartItems.set([]);
        }
    }

    addToCart(product: Product) {
        this.cartItems.update(items => {
            const existingItem = items.find(item => item.product.id === product.id);
            if (existingItem) {
                return items.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...items, { product, quantity: 1 }];
        });
        this.logger.debug('Product added to cart', { productName: product.name });
        this.toastService.show('Agregaste un producto al carrito', 'success', () => this.openCart());
    }

    removeFromCart(productId: string) {
        this.cartItems.update(items => items.filter(item => item.product.id !== productId));
    }

    updateQuantity(productId: string, quantity: number) {
        if (quantity <= 0) {
            this.removeFromCart(productId);
            return;
        }
        this.cartItems.update(items =>
            items.map(item =>
                item.product.id === productId
                    ? { ...item, quantity }
                    : item
            )
        );
    }

    clearCart() {
        this.cartItems.set([]);
    }

    totalItems = computed(() => this.cartItems().reduce((acc, item) => acc + (item.quantity || 0), 0));
    totalPrice = computed(() => this.cartItems().reduce((acc, item) => acc + ((item.product?.price || 0) * (item.quantity || 0)), 0));

    // Cart Visibility State
    isCartOpen = signal(false);

    openCart() {
        this.isCartOpen.set(true);
    }

    closeCart() {
        this.isCartOpen.set(false);
    }

    toggleCart() {
        this.isCartOpen.update(v => !v);
    }
}
