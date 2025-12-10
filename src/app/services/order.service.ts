import { Injectable } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { SupabaseClient, PostgrestError } from '@supabase/supabase-js';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Order, OrderItem, OrderWithItems } from '@app/shared/interfaces/order.interface';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private supabase: SupabaseClient;

    constructor(private authService: AuthService) {
        this.supabase = this.authService.getSupabaseClient();
    }

    getOrders(): Observable<Order[]> {
        return from(
            this.supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false })
        ).pipe(
            map(({ data, error }) => {
                if (error) throw error;
                return data || [];
            }),
            catchError((err) => {
                console.error('Error fetching orders:', err);
                throw err;
            })
        );
    }

    getOrderById(id: string): Observable<OrderWithItems> {
        return from(
            Promise.all([
                this.supabase.from('orders').select('*').eq('id', id).single(),
                this.supabase.from('order_items').select('*').eq('order_id', id)
            ])
        ).pipe(
            map(([orderResult, itemsResult]) => {
                if (orderResult.error) throw orderResult.error;
                if (itemsResult.error) throw itemsResult.error;

                return {
                    ...orderResult.data,
                    items: itemsResult.data || []
                } as OrderWithItems;
            }),
            catchError((err) => {
                console.error('Error fetching order:', err);
                throw err;
            })
        );
    }

    async createOrder(order: Order, items: OrderItem[]): Promise<{ data: Order | null; error: PostgrestError | null }> {
        try {
            // Generate order ID client-side to avoid needing SELECT permissions
            const orderId = crypto.randomUUID();
            // Generate order number
            const orderNumber = `ORD-${Date.now()}`;

            // Insert order
            const insertPayload = {
                id: orderId,
                customer_name: order.customer_name,
                customer_email: order.customer_email,
                customer_phone: order.customer_phone,
                customer_address: order.customer_address,
                status: order.status,
                subtotal: order.subtotal,
                tax: order.tax,
                discount: order.discount,
                total_amount: order.total, // Map total to total_amount
                notes: order.notes,
                order_number: orderNumber
            };

            const { error: orderError } = await this.supabase
                .from('orders')
                .insert(insertPayload);
                // .select() .single() removed to avoid RLS 42501 error

            if (orderError) throw orderError;

            // Insert order items
            const itemsWithOrderId = items.map(item => ({
                ...item,
                order_id: orderId
            }));

            const { error: itemsError } = await this.supabase
                .from('order_items')
                .insert(itemsWithOrderId);

            if (itemsError) throw itemsError;

            // Construct the return object since we can't select it back
            const orderData = { ...insertPayload, created_at: new Date().toISOString() };
            return { data: orderData as any, error: null };
        } catch (error) {
            console.error('Error creating order:', error);
            return { data: null, error: error as any };
        }
    }

    async updateOrderStatus(id: string, status: Order['status']): Promise<{ error: PostgrestError | null }> {
        const { error } = await this.supabase
            .from('orders')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', id);

        return { error };
    }

    async deleteOrder(id: string): Promise<{ error: PostgrestError | null }> {
        // Order items will be deleted automatically due to CASCADE
        const { error } = await this.supabase
            .from('orders')
            .delete()
            .eq('id', id);

        return { error };
    }
    async updateOrder(id: string, order: Order, items: OrderItem[]): Promise<{ data: Order | null; error: PostgrestError | Error | null }> {
        try {
            // Update order details
            // Update order details
            const updatePayload = {
                customer_name: order.customer_name,
                customer_email: order.customer_email,
                customer_phone: order.customer_phone,
                customer_address: order.customer_address,
                status: order.status,
                subtotal: order.subtotal,
                tax: order.tax,
                discount: order.discount,
                total_amount: order.total,
                notes: order.notes,
                updated_at: new Date().toISOString()
            };

            const { data: orderData, error: orderError } = await this.supabase
                .from('orders')
                .update(updatePayload)
                .eq('id', id)
                .select()
                .maybeSingle();

            if (orderError) throw orderError;
            if (!orderData) throw new Error('Order not found or permission denied');

            // Handle items
            // 1. Get existing item IDs
            const { data: existingItems, error: fetchError } = await this.supabase
                .from('order_items')
                .select('id')
                .eq('order_id', id);

            if (fetchError) throw fetchError;

            const existingIds = existingItems.map(i => i.id);
            const currentIds = items.filter(i => i.id).map(i => i.id);

            // 2. Delete removed items
            const idsToDelete = existingIds.filter(id => !currentIds.includes(id));
            if (idsToDelete.length > 0) {
                const { error: deleteError } = await this.supabase
                    .from('order_items')
                    .delete()
                    .in('id', idsToDelete);
                if (deleteError) throw deleteError;
            }

            // 3. Upsert items (update existing, insert new)
            const itemsToUpsert = items.map(item => ({
                ...item,
                order_id: id,
                // Ensure we don't send undefined/null IDs for new items if not needed, 
                // but upsert needs ID to match. New items shouldn't have ID or should have it undefined.
                // Supabase upsert: if ID is present and matches, update. If not, insert.
            }));

            const { error: upsertError } = await this.supabase
                .from('order_items')
                .upsert(itemsToUpsert);

            if (upsertError) throw upsertError;

            return { data: orderData, error: null };
        } catch (error) {
            console.error('Error updating order:', error);
            return { data: null, error: error as any };
        }
    }
}
