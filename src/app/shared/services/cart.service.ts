import { Injectable, signal, computed, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Product } from '@app/public/products/interfaces';
import { LoggerService } from '@app/core/services/logger.service';

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
    
    cartItems = signal<CartItem[]>([]);

    constructor() {
        if (isPlatformBrowser(this.platformId)) {
            // Load cart from local storage on init
            const savedCart = localStorage.getItem('cart');
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
            }
        }

        // Save cart to local storage whenever it changes
        effect(() => {
            const currentCart = this.cartItems();
            if (isPlatformBrowser(this.platformId)) {
                localStorage.setItem('cart', JSON.stringify(currentCart));
            }
        });
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
