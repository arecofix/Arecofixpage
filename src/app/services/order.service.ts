import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { SupabaseClient } from '@supabase/supabase-js';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface Order {
    id?: string;
    order_number?: string;
    customer_id?: string;
    customer_name: string;
    customer_email: string;
    customer_phone?: string;
    customer_address?: string; // Added address field
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    notes?: string;
    created_at?: string;
    updated_at?: string;
}

export interface OrderItem {
    id?: string;
    order_id?: string;
    product_id?: string;
    product_name: string;
    product_sku?: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    created_at?: string;
}

export interface OrderWithItems extends Order {
    items: OrderItem[];
}

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

    async createOrder(order: Order, items: OrderItem[]): Promise<{ data: Order | null; error: any }> {
        try {
            // Generate order number
            const orderNumber = `ORD-${Date.now()}`;

            // Insert order
            const { data: orderData, error: orderError } = await this.supabase
                .from('orders')
                .insert({
                    ...order,
                    order_number: orderNumber,
                    total_amount: order.total,
                    customer_address: order.customer_address // Map address
                })
                .select()
                .single();

            if (orderError) throw orderError;

            // Insert order items
            const itemsWithOrderId = items.map(item => ({
                ...item,
                order_id: orderData.id
            }));

            const { error: itemsError } = await this.supabase
                .from('order_items')
                .insert(itemsWithOrderId);

            if (itemsError) throw itemsError;

            return { data: orderData, error: null };
        } catch (error) {
            console.error('Error creating order:', error);
            return { data: null, error };
        }
    }

    async updateOrderStatus(id: string, status: Order['status']): Promise<{ error: any }> {
        const { error } = await this.supabase
            .from('orders')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', id);

        return { error };
    }

    async deleteOrder(id: string): Promise<{ error: any }> {
        // Order items will be deleted automatically due to CASCADE
        const { error } = await this.supabase
            .from('orders')
            .delete()
            .eq('id', id);

        return { error };
    }
}
