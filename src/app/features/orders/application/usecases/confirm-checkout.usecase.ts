import { Injectable, inject } from '@angular/core';
import { Observable, map, switchMap, from } from 'rxjs';
import { Order, OrderItem } from '../../domain/entities/order.entity';
import { OrderRepository } from '../../domain/repositories/order.repository';
// Using a generic message interface or cross-dependency check
import { MessageRepository } from '@app/features/messages/domain/repositories/message.repository';
import { CrmMessage } from '@app/features/messages/domain/entities/crm-message.entity';

// Basic Product Interface needed for Checkout
interface CheckoutProduct {
    id: string;
    name: string;
    price: number;
}

interface CartItem {
    product: CheckoutProduct;
    quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmCheckoutUseCase {
  private orderRepo = inject(OrderRepository);
  private messageRepo = inject(MessageRepository);

  execute(
      params: { 
          customer: { name: string; email: string; phone: string; address: string; notes?: string }, 
          items: CartItem[], 
          total: number 
      }
  ): Observable<Order> {
    
    // 1. Prepare Order Items
    const orderItems: OrderItem[] = params.items.map(i => ({
        product_id: i.product.id,
        product_name: i.product.name,
        quantity: i.quantity,
        unit_price: i.product.price,
        subtotal: i.product.price * i.quantity
    }));

    // 2. Prepare Order Object (Using interface directly)
    const newOrder: Order = {
        customer_name: params.customer.name,
        customer_email: params.customer.email,
        customer_phone: params.customer.phone,
        shipping_address: params.customer.address,
        items: orderItems,
        total: params.total,
        total_amount: params.total,
        status: 'pending',
        subtotal: params.total, // Simplified total=subtotal if no breakdown
        tax: 0,
        discount: 0
    };

    // 3. Prepare CRM Message
    const crmMessage: CrmMessage = {
        name: params.customer.name,
        email: params.customer.email,
        phone: params.customer.phone,
        address: params.customer.address,
        notes: `Pedido Web. Notas: ${params.customer.notes || '-'}`,
        date: new Date()
    };

    // 4. Save both. Sequence: Order -> Message.
    return this.orderRepo.createOrder(newOrder).pipe(
        switchMap(createdOrder => {
            return from(this.messageRepo.saveMessage(crmMessage)).pipe(
                map(() => createdOrder)
            );
        })
    );
  }
}
