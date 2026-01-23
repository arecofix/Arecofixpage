import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '@app/shared/services/cart.service';
import { OrderService } from '@app/core/services/order.service';
import { AuthService } from '@app/core/services/auth.service';
import { Order, OrderItem } from '@app/shared/interfaces/order.interface';
import { NotificationService } from '@app/core/services/notification.service';
import { ContactService } from '@app/core/services/contact.service';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './checkout-page.html',
})
export class CheckoutPage {
  cartService = inject(CartService);
  orderService = inject(OrderService);
  authService = inject(AuthService);
  contactService = inject(ContactService);
  fb = inject(FormBuilder);
  router = inject(Router);
  notificationService = inject(NotificationService);

  checkoutForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    address: ['', [Validators.required]],
    notes: [''],
  });

  isProcessing = signal(false);
  orderSuccess = signal(false);

  async placeOrder() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      this.notificationService.showError(
        'Por favor, completa todos los campos requeridos.'
      );
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
      notes: formVal.notes,
      customer_id: this.authService.getCurrentUser()?.id,
    };

    const orderItems: OrderItem[] = cartItems.map((item) => ({
      product_name: item.product.name,
      product_id: item.product.id,
      quantity: item.quantity,
      unit_price: item.product.price,
      subtotal: item.product.price * item.quantity,
    }));

    try {
      // 1. Create Order
      const { data, error } = await this.orderService.createOrder(
        order,
        orderItems
      );

      if (error) {
        console.error('Order creation error:', error);
        throw error;
      }

      // 2. Save Contact Message with Rich Details
      const itemsList = cartItems
          .map(i => `- ${i.product.name} (x${i.quantity}) - $${(i.product.price * i.quantity).toFixed(2)}`)
          .join('\n');
      
      const detailedMessage = `Nuevo Pedido #${data?.order_number || 'N/A'}
      
Detalles del Cliente:
Nombre: ${formVal.name}
Email: ${formVal.email}
Teléfono: ${formVal.phone}
Dirección: ${formVal.address}

Productos:
${itemsList}

Total: $${total.toFixed(2)}

Notas Adicionales:
${formVal.notes || 'Ninguna'}`;

      const messageDto = {
        name: formVal.name,
        email: formVal.email,
        phone: formVal.phone,
        subject: `[NUEVO PEDIDO] #${data?.order_number} - ${formVal.name} - $${total.toFixed(2)}`,
        message: detailedMessage,
      };
      
      const { error: msgError } = await this.contactService.createMessage(messageDto);
      if (msgError) {
          console.error('Message creation error (non-fatal):', msgError);
          // We don't throw here to ensure the order completion is still shown to the user, 
          // but strictly speaking we should probably ensure consistency. 
          // However for UX, if order is taken, we proceed.
      }

      // 3. Update Profile if logged in
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
         // This assumes Profile logic is simple enough to stay here or needs checking
         // For strict clean code, this should be in ProfileService.
         // Keeping it lightweight here as per 'AuthService' access.
         const supabase = this.authService.getSupabaseClient();
         await supabase
          .from('profiles')
          .update({
            phone: formVal.phone,
            address: formVal.address,
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentUser.id)
          .maybeSingle(); 
      }

      this.orderSuccess.set(true);
      this.cartService.clearCart();
      this.notificationService.showSuccess('¡Orden creada exitosamente!');

    } catch (error) {
      console.error('Checkout failed full error:', JSON.stringify(error, null, 2));
      const errMsg = (error as any)?.message || 'Error desconocido';
      const errCode = (error as any)?.code || 'N/A';
      this.notificationService.showError(
        `Hubo un error al procesar tu orden: ${errMsg} (Código: ${errCode})`
      );
    } finally {
      this.isProcessing.set(false);
    }
  }
}
