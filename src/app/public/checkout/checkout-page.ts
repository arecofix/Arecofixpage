import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '@app/shared/services/cart.service';
import { OrderService, Order, OrderItem } from '@app/services/order.service';

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
            return;
        }

        this.isProcessing.set(true);

        const formVal = this.checkoutForm.value;
        const cartItems = this.cartService.cartItems();
        const total = this.cartService.totalPrice();

        const order: Order = {
            customer_name: formVal.name,
            customer_email: formVal.email,
            customer_phone: formVal.phone,
            customer_address: formVal.address, // Map address
            status: 'pending',
            subtotal: total,
            tax: 0, // Implement tax logic if needed
            discount: 0, // Implement discount logic if needed
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

            // Optional: Navigate to a success page or show a success message
            // setTimeout(() => this.router.navigate(['/']), 3000);

        } catch (error) {
            console.error('Checkout failed', error);
            // Handle error (show toast, etc.)
        } finally {
            this.isProcessing.set(false);
        }
    }
}
