import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '@app/shared/services/cart.service';
import { OrderService } from '@app/services/order.service';
import { Order, OrderItem } from '@app/shared/interfaces/order.interface';
import { NotificationService } from '@app/core/services/notification.service';

@Component({
    selector: 'app-checkout-page',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './checkout-page.html',
})
export class CheckoutPage {
    cartService = inject(CartService);
    orderService = inject(OrderService);
    fb = inject(FormBuilder);
    router = inject(Router);
    notificationService = inject(NotificationService);

    checkoutForm: FormGroup = this.fb.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required]],
        address: ['', [Validators.required]],
        notes: ['']
    });

    isProcessing = signal(false);
    orderSuccess = signal(false);

    async placeOrder() {
        if (this.checkoutForm.invalid) {
            this.checkoutForm.markAllAsTouched();
            this.notificationService.showError('Por favor, completa todos los campos requeridos.');
            return;
        }

        this.isProcessing.set(true);

        const formVal = this.checkoutForm.getRawValue();
        const cartItems = this.cartService.cartItems();
        const total = this.cartService.totalPrice();

        const order: Order = {
            customer_name: formVal.name,
            customer_email: formVal.email,
            customer_phone: formVal.phone,
            customer_address: formVal.address,
            status: 'pending',
            subtotal: total,
            tax: 0,
            discount: 0,
            total: total,
            notes: formVal.notes
        };

        const orderItems: OrderItem[] = cartItems.map(item => ({
            product_name: item.product.name,
            product_id: item.product.id,
            quantity: item.quantity,
            unit_price: item.product.price,
            subtotal: item.product.price * item.quantity
        }));

        try {
            const { data, error } = await this.orderService.createOrder(order, orderItems);

            if (error) throw error;

            this.orderSuccess.set(true);
            this.cartService.clearCart();
            this.notificationService.showSuccess('¡Orden creada exitosamente!');

            // Optional: Navigate to a success page or show a success message
            // setTimeout(() => this.router.navigate(['/']), 3000);

        } catch (error) {
            console.error('Checkout failed', error);
            this.notificationService.showError('Hubo un error al procesar tu orden. Por favor intenta nuevamente.');
        } finally {
            this.isProcessing.set(false);
        }
    }
}
