import { Injectable, signal, computed, effect, inject } from '@angular/core';
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
    cartItems = signal<CartItem[]>([]);

    constructor() {
        // Load cart from local storage on init
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.cartItems.set(JSON.parse(savedCart));
        }

        // Save cart to local storage whenever it changes
        effect(() => {
            localStorage.setItem('cart', JSON.stringify(this.cartItems()));
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

    totalItems = computed(() => this.cartItems().reduce((acc, item) => acc + item.quantity, 0));
    totalPrice = computed(() => this.cartItems().reduce((acc, item) => acc + (item.product.price * item.quantity), 0));

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
