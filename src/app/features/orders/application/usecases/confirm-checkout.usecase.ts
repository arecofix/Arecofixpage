import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { Order, OrderItem } from '../../domain/entities/order.entity';
import { OrderRepository } from '../../domain/repositories/order.repository';
import { MessageRepository } from '../../../messages/domain/repositories/message.repository'; // Cross-boundary import or shared
import { CrmMessage } from '../../../messages/domain/entities/crm-message.entity';
import { SupabaseOrderRepository } from '../../infrastructure/repositories/supabase-order.repository';
import { SupabaseMessageRepository } from '../../../messages/infrastructure/repositories/supabase-message.repository';

@Injectable({
  providedIn: 'root'
})
export class ConfirmCheckoutUseCase {
  // Relaxing strict DI for simplicity in this specific "feature-sliced" like structure, 
  // but ideally we'd use tokens for Repository Interfaces.
  constructor(
      private orderRepo: SupabaseOrderRepository, 
      private messageRepo: SupabaseMessageRepository
  ) {}

  execute(
      params: { 
          customer: { name: string; email: string; phone: string; address: string; notes?: string }, 
          items: any[], 
          total: number 
      }
  ): Observable<Order> {
    
    // 1. Prepare Order Entity
    const orderItems: OrderItem[] = params.items.map(i => ({
        product_id: i.product.id,
        product_name: i.product.name,
        quantity: i.quantity,
        unit_price: i.product.price,
        subtotal: i.product.price * i.quantity
    }));

    const newOrder = new Order({
        customer_info: {
            name: params.customer.name,
            email: params.customer.email,
            phone: params.customer.phone,
            address: params.customer.address
        },
        cart_items: orderItems,
        total: params.total,
        status: 'A_PAGAR' // Requirement: Default Status
    });

    // 2. Prepare CRM Message Entity
    const crmMessage = new CrmMessage({
        name: params.customer.name,
        email: params.customer.email,
        phone: params.customer.phone,
        address: params.customer.address,
        notes: `Pedido Web. Notas: ${params.customer.notes || '-'}`,
        date: new Date()
    });

    // 3. Execute both. Order is critical, Message is important but failure shouldn't necessarily block order (or maybe it should?)
    // We will chain them.
    return this.orderRepo.createOrder(newOrder).pipe(
        switchMap(createdOrder => {
            return this.messageRepo.saveMessage(crmMessage).pipe(
                map(() => createdOrder) // Return the order result
            );
        })
    );
  }
}
