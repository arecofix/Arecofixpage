import { Injectable, inject } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { SupabaseClient, PostgrestError } from '@supabase/supabase-js';
import { LoggerService } from '../core/services/logger.service';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Order, OrderItem, OrderWithItems } from '@app/shared/interfaces/order.interface';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private supabase: SupabaseClient;
    private logger = inject(LoggerService);

    constructor(private authService: AuthService) {
        this.supabase = this.authService.getSupabaseClient();
    }

    getOrders(): Observable<OrderWithItems[]> {
        return from(
            this.supabase
                .from('orders' as any)
                .select('*, order_items(*)')
                .order('created_at', { ascending: false })
        ).pipe(
            map(({ data, error }) => {
                if (error) throw error;
                // Explicit mapping to ensure clean data flowing into the app
                return (data || []).map((o: any) => ({
                    id: o.id,
                    created_at: o.created_at,
                    updated_at: o.updated_at || undefined,
                    order_number: o.order_number,
                    customer_name: o.customer_name,
                    customer_email: o.customer_email,
                    customer_phone: o.customer_phone || undefined,
                    customer_address: o.customer_address || undefined,
                    customer_id: o.customer_id || undefined,
                    status: o.status,
                    subtotal: o.subtotal,
                    tax: o.tax,
                    discount: o.discount,
                    total: o.total_amount, // Map total_amount form DB to total in Interface
                    notes: o.notes || undefined,
                    items: (o.order_items || []).map((i: any) => ({
                        id: i.id,
                        order_id: i.order_id,
                        product_id: i.product_id,
                        product_name: i.product_name,
                        quantity: i.quantity,
                        unit_price: i.unit_price,
                        subtotal: i.subtotal,
                        created_at: i.created_at
                    }))
                })) as OrderWithItems[];
            }),
            catchError((err) => {
                this.logger.error('Error fetching orders:', err);
                throw err;
            })
        );
    }

    getOrderById(id: string): Observable<OrderWithItems> {
        return from(
            Promise.all([
                this.supabase.from('orders' as any).select('*').eq('id', id).single(),
                this.supabase.from('order_items' as any).select('*').eq('order_id', id)
            ])
        ).pipe(
            map(([orderResult, itemsResult]) => {
                if (orderResult.error) throw orderResult.error;
                if (itemsResult.error) throw itemsResult.error;

                const o: any = orderResult.data;
                const items: any[] = itemsResult.data || [];

                const order: OrderWithItems = {
                    id: o.id,
                    created_at: o.created_at,
                    updated_at: o.updated_at || undefined,
                    order_number: o.order_number,
                    customer_name: o.customer_name,
                    customer_email: o.customer_email,
                    customer_phone: o.customer_phone || undefined,
                    customer_address: o.customer_address || undefined,
                    customer_id: o.customer_id || undefined,
                    status: o.status,
                    subtotal: o.subtotal,
                    tax: o.tax,
                    discount: o.discount,
                    total: o.total_amount,
                    notes: o.notes || undefined,
                    items: items.map(i => ({
                        id: i.id,
                        order_id: i.order_id,
                        product_id: i.product_id || undefined,
                        product_name: i.product_name,
                        quantity: i.quantity,
                        unit_price: i.unit_price,
                        subtotal: i.subtotal,
                        created_at: i.created_at
                    }))
                };
                return order;
            }),
            catchError((err) => {
                this.logger.error('Error fetching order:', err);
                throw err;
            })
        );
    }

    async createOrder(order: Order, items: OrderItem[]): Promise<{ data: Order | null; error: PostgrestError | null }> {
        try {
            const orderId = crypto.randomUUID();
            const orderNumber = `ORD-${Date.now()}`;

            const insertPayload = {
                id: orderId,
                customer_name: order.customer_name,
                customer_email: order.customer_email,
                customer_phone: order.customer_phone,
                customer_address: order.customer_address,
                status: order.status || 'pending',
                subtotal: order.subtotal,
                tax: order.tax,
                discount: order.discount,
                total_amount: order.total,
                notes: order.notes,
                order_number: orderNumber,
                customer_id: order.customer_id
            };

            const { error: orderError } = await this.supabase
                .from('orders' as any)
                .insert(insertPayload);

            if (orderError) throw orderError;

            const itemsWithOrderId = items.map(item => ({
                order_id: orderId,
                product_id: item.product_id,
                product_name: item.product_name,
                quantity: item.quantity,
                unit_price: item.unit_price,
                subtotal: item.subtotal
            }));

            const { error: itemsError } = await this.supabase
                .from('order_items' as any)
                .insert(itemsWithOrderId);

            if (itemsError) throw itemsError;

            const orderData: Order = { 
                ...order, 
                id: orderId, 
                order_number: orderNumber,
                created_at: new Date().toISOString() 
            };
            return { data: orderData, error: null };
        } catch (error) {
            this.logger.error('Error creating order:', error);
            return { data: null, error: error as PostgrestError };
        }
    }

    async updateOrderStatus(id: string, status: Order['status']): Promise<{ error: PostgrestError | null }> {
        const { error } = await this.supabase
            .from('orders' as any)
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', id);

        return { error };
    }

    async deleteOrder(id: string): Promise<{ error: PostgrestError | null }> {
        const { error } = await this.supabase
            .from('orders' as any)
            .delete()
            .eq('id', id);

        return { error };
    }
    
    async updateOrder(id: string, order: Order, items: OrderItem[]): Promise<{ data: Order | null; error: PostgrestError | Error | null }> {
        try {
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
                .from('orders' as any)
                .update(updatePayload)
                .eq('id', id)
                .select()
                .maybeSingle();

            if (orderError) throw orderError;
            if (!orderData) throw new Error('Order not found or permission denied');

            const { data: existingItems, error: fetchError } = await this.supabase
                .from('order_items' as any)
                .select('id')
                .eq('order_id', id);

            if (fetchError) throw fetchError;

            const existingIds = (existingItems || []).map((i: any) => i.id);
            const currentIds = items.filter(i => i.id).map(i => i.id);

            const idsToDelete = existingIds.filter(eid => !currentIds.includes(eid));
            if (idsToDelete.length > 0) {
                const { error: deleteError } = await this.supabase
                    .from('order_items' as any)
                    .delete()
                    .in('id', idsToDelete);
                if (deleteError) throw deleteError;
            }

            const itemsToUpsert = items.map(item => ({
                ...(item.id ? { id: item.id } : {}),
                order_id: id,
                product_name: item.product_name,
                quantity: item.quantity,
                unit_price: item.unit_price,
                subtotal: item.subtotal,
                product_id: item.product_id
            }));

            const { error: upsertError } = await this.supabase
                .from('order_items' as any)
                .upsert(itemsToUpsert);

            if (upsertError) throw upsertError;

            const mappedOrder: Order = {
                id: orderData.id,
                order_number: orderData.order_number,
                customer_name: orderData.customer_name,
                customer_email: orderData.customer_email,
                customer_phone: orderData.customer_phone || undefined,
                customer_address: orderData.customer_address || undefined,
                status: orderData.status,
                subtotal: orderData.subtotal,
                tax: orderData.tax,
                discount: orderData.discount,
                total: orderData.total_amount,
                notes: orderData.notes || undefined,
                created_at: orderData.created_at,
                updated_at: orderData.updated_at || undefined
            };

            return { data: mappedOrder, error: null };
        } catch (error) {
            this.logger.error('Error updating order:', error);
            return { data: null, error: error as PostgrestError };
        }
    }
}
