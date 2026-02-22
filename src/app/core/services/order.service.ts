import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { SupabaseClient, PostgrestError } from '@supabase/supabase-js';
import { LoggerService } from './logger.service';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Order, OrderItem, OrderWithItems } from '@app/shared/interfaces/order.interface';
import { DbOrder, DbOrderItem } from '@app/shared/interfaces/db-models';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private authService = inject(AuthService);
    private logger = inject(LoggerService);
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = this.authService.getSupabaseClient();
    }

    getOrders(): Observable<OrderWithItems[]> {
        return from(
            this.supabase
                .from('orders')
                .select('*, order_items(*)')
                .order('created_at', { ascending: false })
                .returns<DbOrder[]>()
        ).pipe(
            map(({ data, error }) => {
                if (error) throw error;
                return (data || []).map(this.mapDbOrderToDomain);
            }),
            catchError((err: unknown) => {
                this.handleError('Error fetching orders', err);
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

                const dbOrder = orderResult.data as DbOrder;
                dbOrder.order_items = itemsResult.data as DbOrderItem[];

                return this.mapDbOrderToDomain(dbOrder);
            }),
            catchError((err: unknown) => {
                this.handleError('Error fetching order', err);
                throw err;
            })
        );
    }

    async createOrder(order: Order, items: OrderItem[]): Promise<{ data: Order | null; error: Error | PostgrestError | null }> {
        try {
            const orderId = crypto.randomUUID();
            const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;

            // Strict Payload construction for Supabase JSONB
            const insertPayload: Partial<DbOrder> = {
                id: orderId,
                customer_name: order.customer_name,
                customer_email: order.customer_email,
                customer_phone: order.customer_phone || null,
                customer_address: order.customer_address || null, // Sent as JSON object
                status: order.status || 'pending',
                subtotal: order.subtotal,
                tax: order.tax,
                discount: order.discount,
                total_amount: order.total,
                notes: order.notes || null,
                order_number: orderNumber,
                customer_id: order.customer_id || null
            };

            const { error: orderError } = await this.supabase
                .from('orders')
                .insert(insertPayload);

            if (orderError) throw orderError;

            const itemsWithOrderId = items.map(item => ({
                order_id: orderId,
                product_id: item.product_id || null,
                product_name: item.product_name,
                quantity: item.quantity,
                unit_price: item.unit_price,
                subtotal: item.subtotal
            }));

            const { error: itemsError } = await this.supabase
                .from('order_items')
                .insert(itemsWithOrderId);

            if (itemsError) throw itemsError;

            const orderData: Order = { 
                ...order, 
                id: orderId, 
                order_number: orderNumber,
                created_at: new Date().toISOString() 
            };
            return { data: orderData, error: null };
        } catch (error: any) {
            this.handleError('Critical error creating order', error);
            return { data: null, error: error };
        }
    }

    async updateOrderStatus(id: string, status: Order['status']): Promise<{ error: PostgrestError | Error | null }> {
        const { error, data } = await this.supabase
            .from('orders')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select();

        if (error) this.handleError('Error updating order status', error);
        
        if (!error && (!data || data.length === 0)) {
            return { error: new Error("Supabase RLS Error: No tienes permisos en la Base de Datos para cambiar el Estado de esta Orden. Ejecuta el SQL de ADMIN en Supabase.") };
        }
        
        return { error };
    }

    async deleteOrder(id: string): Promise<{ error: PostgrestError | null }> {
        const { error } = await this.supabase
            .from('orders')
            .delete()
            .eq('id', id);

        if (error) this.handleError('Error deleting order', error);
        return { error };
    }
    
    async updateOrder(id: string, order: Order, items: OrderItem[]): Promise<{ data: Order | null; error: PostgrestError | Error | null }> {
        try {
            const updatePayload: Partial<DbOrder> = {
                customer_name: order.customer_name,
                customer_email: order.customer_email,
                customer_phone: order.customer_phone || null,
                customer_address: order.customer_address || null,
                status: order.status,
                subtotal: order.subtotal,
                tax: order.tax,
                discount: order.discount,
                total_amount: order.total,
                notes: order.notes || null,
                updated_at: new Date().toISOString()
            };

            const { error: orderError, data: updatedOrdersData } = await this.supabase
                .from('orders')
                .update(updatePayload)
                .eq('id', id)
                .select();

            if (orderError) throw orderError;
            
            if (!updatedOrdersData || updatedOrdersData.length === 0) {
                throw new Error("Supabase RLS Error: El servidor bloqueó la actualización de la Orden. Activa los permisos de edición para 'orders' en Supabase.");
            }

            // Handle items update (delete missing, upsert current)
            await this.handleItemsUpdate(id, items);

            // Refetch the updated order to properly construct the updatedDbOrder
            const { data: fetchUpdatedData, error: fetchUpdatedError } = await this.supabase
                .from('orders')
                .select('*')
                .eq('id', id)
                .single();
            
            if (fetchUpdatedError) throw fetchUpdatedError;

            const updatedDbOrder = fetchUpdatedData as DbOrder;
            // Fetch fresh items to return complete object
            const { data: freshItems } = await this.supabase.from('order_items').select('*').eq('order_id', id);
            
            updatedDbOrder.order_items = freshItems as DbOrderItem[];
            
            return { data: this.mapDbOrderToDomain(updatedDbOrder), error: null };
        } catch (error: unknown) {
            this.handleError('Error updating order', error);
            return { data: null, error: error as PostgrestError };
        }
    }

    // --- Private Helper Methods ---

    private async handleItemsUpdate(orderId: string, items: OrderItem[]): Promise<void> {
        const { data: existingItems, error: fetchError } = await this.supabase
            .from('order_items')
            .select('id')
            .eq('order_id', orderId);

        if (fetchError) throw fetchError;

        const existingIds: string[] = (existingItems || []).map((i: { id: string }) => i.id);
        const currentIds = items.filter(i => i.id).map(i => i.id);
        const idsToDelete = existingIds.filter((eid: string) => !currentIds.includes(eid));

        if (idsToDelete.length > 0) {
            const { error: deleteError } = await this.supabase
                .from('order_items')
                .delete()
                .in('id', idsToDelete);
            if (deleteError) throw deleteError;
        }

        const itemsToUpsert = items.map(item => ({
            ...(item.id ? { id: item.id } : {}),
            order_id: orderId,
            product_name: item.product_name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            subtotal: item.subtotal,
            product_id: item.product_id || null
        }));

        const { error: upsertError } = await this.supabase
            .from('order_items')
            .upsert(itemsToUpsert);

        if (upsertError) throw upsertError;
    }

    private mapDbOrderToDomain(o: DbOrder): OrderWithItems {
        return {
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
            items: (o.order_items || []).map((i) => ({
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
    }

    private handleError(msg: string, error: unknown) {
        this.logger.error(`${msg}:`, error);
    }
}
