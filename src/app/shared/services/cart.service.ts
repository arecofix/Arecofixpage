import { Injectable, signal, computed, effect } from '@angular/core';
import { iProduct } from '@app/public/products/interfaces';

export interface CartItem {
    product: iProduct;
    quantity: number;
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
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

    addToCart(product: iProduct) {
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
        console.log('Product added to cart:', product.name);
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
}
