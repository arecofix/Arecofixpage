import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Product } from '@app/public/products/interfaces';
import { LoggerService } from '@app/core/services/logger.service';
import { AuthService } from '@app/core/services/auth.service';
import { OrderService } from '@app/features/orders/application/services/order.service';
import { Order, OrderItem } from '@app/features/orders/domain/entities/order.entity';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { ToastService } from './toast.service';
import { firstValueFrom } from 'rxjs';

export interface CartItem {
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
    private orderService = inject(OrderService);
    private supabase = inject(SUPABASE_CLIENT);
    
    cartItems = signal<CartItem[]>([]);
    currentOrderSignal = signal<Order | null>(null);

    // Cart Visibility State
    isCartOpen = signal(false);

    constructor() {
        if (isPlatformBrowser(this.platformId)) {
            // Load cart from DB/Local storage on init
            this.loadCart();

            // Listen for auth state changes to switch carts and merge if needed
            this.authService.authState$.subscribe((state) => {
                if (state.isInitialized) {
                    this.loadCart();
                }
            });
        }
    }

    private getOrCreateSessionId(): string {
        if (!isPlatformBrowser(this.platformId)) return '';
        let sessionId = localStorage.getItem('cart_session_id');
        if (!sessionId) {
            sessionId = crypto.randomUUID();
            localStorage.setItem('cart_session_id', sessionId);
        }
        return sessionId;
    }

    private async loadCart() {
        const user = this.authService.getCurrentUser();
        
        if (user && isPlatformBrowser(this.platformId)) {
            // Check if there is a guest cart to migrate
            const sessionId = localStorage.getItem('cart_session_id');
            if (sessionId) {
                try {
                    const guestCart = await firstValueFrom(this.orderService.getActiveCart(undefined, sessionId));
                    if (guestCart) {
                        const userCart = await firstValueFrom(this.orderService.getActiveCart(user.id, undefined));
                        if (userCart) {
                            await this.mergeCarts(guestCart, userCart);
                        } else {
                            // Link guest cart to user
                            const profile = this.authService.getCurrentProfile();
                            guestCart.user_id = user.id;
                            guestCart.session_id = undefined;
                            guestCart.customer_name = profile?.full_name || profile?.display_name || user.email || 'Usuario';
                            guestCart.customer_email = user.email;
                            guestCart.customer_phone = profile?.phone || undefined;
                            await firstValueFrom(this.orderService.updateOrder(guestCart.id!, guestCart));
                        }
                    }
                    localStorage.removeItem('cart_session_id');
                } catch (error) {
                    this.logger.error('Error migrating guest cart to user', error);
                }
            }
        }

        const userId = user?.id;
        const sessionId = !userId ? this.getOrCreateSessionId() : undefined;

        try {
            const activeOrder = await firstValueFrom(this.orderService.getActiveCart(userId, sessionId));
            console.log('DEBUG: loadCart activeOrder:', activeOrder);
            this.currentOrderSignal.set(activeOrder);

            if (activeOrder && activeOrder.items) {
                const items: CartItem[] = activeOrder.items
                    .filter(item => item.product)
                    .map(item => ({
                        product: item.product,
                        quantity: item.quantity
                    }));
                this.cartItems.set(items);
            } else {
                this.cartItems.set([]);
            }
        } catch (error) {
            this.logger.error('Error loading cart', error);
            this.cartItems.set([]);
        }
    }

    private async mergeCarts(guestCart: Order, userCart: Order) {
        const userItems = [...(userCart.items || [])];

        for (const guestItem of (guestCart.items || [])) {
            const existing = userItems.find(item => item.product_id === guestItem.product_id);
            if (existing) {
                existing.quantity += guestItem.quantity;
                existing.subtotal = existing.quantity * existing.unit_price;
            } else {
                userItems.push({
                    product_id: guestItem.product_id,
                    product_name: guestItem.product_name,
                    quantity: guestItem.quantity,
                    unit_price: guestItem.unit_price,
                    subtotal: guestItem.subtotal,
                    product: guestItem.product
                });
            }
        }

        const subtotal = userItems.reduce((acc, item) => acc + item.subtotal, 0);
        userCart.items = userItems;
        userCart.subtotal = subtotal;
        userCart.total = subtotal;
        userCart.total_amount = subtotal;

        await firstValueFrom(this.orderService.updateOrder(userCart.id!, userCart));
        await this.supabase.from('orders').delete().eq('id', guestCart.id!);
    }

    private syncOrderState(updatedOrder: Order) {
        this.currentOrderSignal.set(updatedOrder);
        this.cartItems.set(
            updatedOrder.items?.filter(item => item.product).map(item => ({
                product: item.product,
                quantity: item.quantity
            })) || []
        );
    }

    private async getOrCreateActiveOrder(): Promise<Order> {
        const user = this.authService.getCurrentUser();
        const userId = user?.id;
        const sessionId = !userId ? this.getOrCreateSessionId() : undefined;

        let activeOrder = await firstValueFrom(this.orderService.getActiveCart(userId, sessionId));
        if (activeOrder) {
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

        return firstValueFrom(this.orderService.createOrder(newOrder));
    }

    async addToCart(product: Product) {
        console.log("CART DEBUG: addToCart called with product", product?.id);
        try {
            const order = await this.getOrCreateActiveOrder();
            console.log("CART DEBUG: getOrCreateActiveOrder returned", order?.id);
            const items = order.items ? [...order.items] : [];

            const existingItem = items.find(item => item.product_id === product.id);
            
            const currentQty = existingItem ? existingItem.quantity : 0;
            if (product.stock !== undefined && product.stock !== null && (currentQty + 1) > product.stock) {
                this.toastService.show('Se alcanzó el límite máximo de stock', 'error');
                return;
            }

            if (existingItem) {
                existingItem.quantity += 1;
                existingItem.subtotal = existingItem.quantity * existingItem.unit_price;
            } else {
                items.push({
                    product_id: product.id,
                    product_name: product.name,
                    quantity: 1,
                    unit_price: product.price,
                    subtotal: product.price,
                    product: product
                });
            }

            const subtotal = items.reduce((acc, item) => acc + item.subtotal, 0);
            order.items = items;
            order.subtotal = subtotal;
            order.total = subtotal;
            order.total_amount = subtotal;

            console.log("CART DEBUG: updating order with items", items.length);
            const updatedOrder = await firstValueFrom(this.orderService.updateOrder(order.id!, order));
            console.log("CART DEBUG: updateOrder succeeded", updatedOrder?.id);
            this.syncOrderState(updatedOrder);
            console.log("CART DEBUG: syncOrderState done");

            this.logger.debug('Product added to cart', { productName: product.name });
            this.toastService.show('Agregaste un producto al carrito', 'success', () => this.openCart());
        } catch (error) {
            this.logger.error('Error adding to cart', error);
            this.toastService.show('Error al agregar el producto al carrito', 'error');
        }
    }

    async removeFromCart(productId: string) {
        try {
            const order = await this.getOrCreateActiveOrder();
            const items = order.items ? order.items.filter(item => item.product_id !== productId) : [];

            const subtotal = items.reduce((acc, item) => acc + item.subtotal, 0);
            order.items = items;
            order.subtotal = subtotal;
            order.total = subtotal;
            order.total_amount = subtotal;

            const updatedOrder = await firstValueFrom(this.orderService.updateOrder(order.id!, order));
            this.syncOrderState(updatedOrder);
        } catch (error) {
            this.logger.error('Error removing from cart', error);
            this.toastService.show('Error al eliminar el producto', 'error');
        }
    }

    async updateQuantity(productId: string, quantity: number) {
        if (quantity <= 0) {
            await this.removeFromCart(productId);
            return;
        }

        try {
            const order = await this.getOrCreateActiveOrder();
            const items = order.items ? [...order.items] : [];

            const item = items.find(i => i.product_id === productId);
            if (!item) return;

            item.quantity = quantity;
            item.subtotal = quantity * item.unit_price;

            const subtotal = items.reduce((acc, i) => acc + i.subtotal, 0);
            order.items = items;
            order.subtotal = subtotal;
            order.total = subtotal;
            order.total_amount = subtotal;

            const updatedOrder = await firstValueFrom(this.orderService.updateOrder(order.id!, order));
            this.syncOrderState(updatedOrder);
        } catch (error) {
            this.logger.error('Error updating quantity in cart', error);
            this.toastService.show('Error al actualizar la cantidad', 'error');
        }
    }

    async clearCart() {
        try {
            const order = this.currentOrderSignal();
            if (order && order.id && order.status === 'cart') {
                await this.supabase.from('orders').delete().eq('id', order.id);
            }
        } catch (error) {
            this.logger.error('Error clearing cart in database', error);
        } finally {
            this.currentOrderSignal.set(null);
            this.cartItems.set([]);
        }
    }

    totalItems = computed(() => this.cartItems().reduce((acc, item) => acc + (item.quantity || 0), 0));
    totalPrice = computed(() => this.cartItems().reduce((acc, item) => acc + ((item.product?.price || 0) * (item.quantity || 0)), 0));

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
