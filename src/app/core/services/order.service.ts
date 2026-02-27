import { Injectable, inject } from '@angular/core';
import { PostgrestError } from '@supabase/supabase-js';
import { LoggerService } from './logger.service';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Order, OrderItem, OrderWithItems } from '@app/shared/interfaces/order.interface';
import { DbOrder, DbOrderItem } from '@app/shared/interfaces/db-models';
import { SUPABASE_CLIENT } from '../di/supabase-token';
import { AuthService } from './auth.service';
import { TenantService } from './tenant.service';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private supabase = inject(SUPABASE_CLIENT);
    private logger = inject(LoggerService);
    private auth = inject(AuthService);
    private tenantService = inject(TenantService);

    protected useSoftDeletes = true;

    private applyTenantFilter(query: any) {
        let enhancedQuery = query.eq('tenant_id', this.tenantService.getTenantId());
        if (this.useSoftDeletes) {
            enhancedQuery = enhancedQuery.is('deleted_at', null);
        }
        return enhancedQuery;
    }

    getOrders(): Observable<OrderWithItems[]> {
        let query = this.supabase
            .from('orders')
            .select('id, order_number, customer_name, customer_email, customer_phone, shipping_address, status, subtotal, tax, discount, total_amount, notes, user_id, tenant_id, created_at, updated_at, deleted_at, payment_method, order_items(id, order_id, product_id, course_id, product_name, quantity, unit_price, subtotal, tenant_id, created_at)');
            
        let filteredQuery = this.applyTenantFilter(query)
            .order('created_at', { ascending: false });

        return from(filteredQuery as any).pipe(
            map((res: any) => {
                const { data, error } = res;
                if (error) throw error;
                return (data || []).map((o: any) => this.mapDbOrderToDomain(o));
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
                this.applyTenantFilter(this.supabase.from('orders').select('id, order_number, customer_name, customer_email, customer_phone, shipping_address, status, subtotal, tax, discount, total_amount, notes, user_id, tenant_id, created_at, updated_at, deleted_at, payment_method').eq('id', id)).single(),
                this.supabase.from('order_items').select('id, order_id, product_id, course_id, product_name, quantity, unit_price, subtotal, tenant_id, created_at').eq('order_id', id).eq('tenant_id', this.tenantService.getTenantId())
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
            const user = this.auth.getCurrentUser();
            const orderId = crypto.randomUUID();
            const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;
            const tenantId = this.tenantService.getTenantId();

            const insertPayload: any = {
                id: orderId,
                customer_name: order.customer_name,
                customer_email: order.customer_email,
                customer_phone: order.customer_phone || null,
                shipping_address: order.shipping_address || null,
                status: order.status || 'pending',
                subtotal: order.subtotal,
                tax: order.tax,
                discount: order.discount,
                total: order.total || order.total_amount,
                total_amount: order.total || order.total_amount,
                notes: order.notes || null,
                payment_method: order.payment_method || null,
                order_number: orderNumber,
                user_id: order.user_id || null,
                tenant_id: tenantId
            };

            const { error: orderError } = await this.supabase
                .from('orders')
                .insert(insertPayload);

            if (orderError) throw orderError;

            const itemsWithOrderId = items.map(item => ({
                order_id: orderId,
                product_id: item.product_id || null,
                course_id: item.course_id || null,
                product_name: item.product_name,
                quantity: item.quantity,
                unit_price: item.unit_price,
                subtotal: item.subtotal,
                tenant_id: tenantId
            }));

            const { error: itemsError } = await this.supabase
                .from('order_items')
                .insert(itemsWithOrderId);

            if (itemsError) throw itemsError;

            const orderData: Order = { 
                ...order, 
                id: orderId, 
                order_number: orderNumber,
                created_at: new Date().toISOString(),
                tenant_id: tenantId
            };
            return { data: orderData, error: null };
        } catch (error: any) {
            this.handleError('Critical error creating order', error);
            return { data: null, error: error };
        }
    }

    async updateOrderStatus(id: string, status: Order['status']): Promise<{ error: PostgrestError | Error | null }> {
        let query = this.supabase
            .from('orders')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', id);
            
        const { error, data } = await this.applyTenantFilter(query).select('id, status');

        if (error) this.handleError('Error updating order status', error);
        
        if (!error && (!data || data.length === 0)) {
            return { error: new Error("Supabase RLS Error: Permission denied or Record filtered out.") };
        }
        
        return { error };
    }

    async deleteOrder(id: string): Promise<{ error: PostgrestError | null }> {
        let query = this.supabase
            .from('orders')
            .delete()
            .eq('id', id);
            
        const { error } = await this.applyTenantFilter(query);

        if (error) this.handleError('Error deleting order', error);
        return { error };
    }
    
    async updateOrder(id: string, order: Order, items: OrderItem[]): Promise<{ data: Order | null; error: PostgrestError | Error | null }> {
        try {
            const updatePayload: any = {
                customer_name: order.customer_name,
                customer_email: order.customer_email,
                customer_phone: order.customer_phone || null,
                shipping_address: order.shipping_address || null,
                status: order.status,
                subtotal: order.subtotal,
                tax: order.tax,
                discount: order.discount,
                total: order.total || order.total_amount,
                total_amount: order.total || order.total_amount,
                notes: order.notes || null,
                payment_method: order.payment_method || null,
                updated_at: new Date().toISOString()
            };

            let query = this.supabase
                .from('orders')
                .update(updatePayload)
                .eq('id', id);

            const { error: orderError, data: updatedOrdersData } = await this.applyTenantFilter(query).select('id');

            if (orderError) throw orderError;
            
            if (!updatedOrdersData || updatedOrdersData.length === 0) {
                throw new Error("Supabase RLS Error: Permission denied or Record filtered out.");
            }

            await this.handleItemsUpdate(id, items);

            // Fetching updated data is expensive and usually not needed on redirect
            // Let's return the basic order info we have
            return { data: { ...order, id }, error: null };
        } catch (error: unknown) {
            this.handleError('Error updating order', error);
            return { data: null, error: error as PostgrestError };
        }
    }

    private async handleItemsUpdate(orderId: string, items: OrderItem[]): Promise<void> {
        const tenantId = this.tenantService.getTenantId();
        
        // 1. Delete all existing items for this order (1 round trip)
        const { error: deleteError } = await this.supabase
            .from('order_items')
            .delete()
            .eq('order_id', orderId)
            .eq('tenant_id', tenantId);

        if (deleteError) throw deleteError;

        // 2. Insert new items (1 round trip)
        const itemsToInsert = items.map(item => ({
            order_id: orderId,
            product_name: item.product_name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            subtotal: item.subtotal,
            product_id: item.product_id || null,
            course_id: item.course_id || null,
            tenant_id: tenantId
        }));

        if (itemsToInsert.length > 0) {
            const { error: insertError } = await this.supabase
                .from('order_items')
                .insert(itemsToInsert);

            if (insertError) throw insertError;
        }
    }

    private mapDbOrderToDomain(o: any): OrderWithItems {
        return {
            id: o.id,
            created_at: o.created_at,
            updated_at: o.updated_at || undefined,
            order_number: o.order_number,
            customer_name: o.customer_name,
            customer_email: o.customer_email,
            customer_phone: o.customer_phone || undefined,
            shipping_address: o.shipping_address || o.customer_address || undefined,
            user_id: o.user_id || o.customer_id || undefined,
            status: o.status,
            subtotal: o.subtotal,
            tax: o.tax,
            discount: o.discount,
            total: o.total_amount,
            notes: o.notes || undefined,
            items: (o.order_items || []).map((i: any) => ({
                id: i.id,
                order_id: i.order_id,
                product_id: i.product_id || undefined,
                course_id: i.course_id || undefined,
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
