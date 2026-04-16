export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';

export interface Address {
    street: string;
    number?: string;
    city: string;
    state?: string;
    zip?: string;
    neighborhood?: string;
    floor?: string;
    appartment?: string;
    notes?: string;
}

export interface OrderItem {
    id?: string;
    order_id?: string;
    product_id?: string;
    course_id?: string;
    product_name?: string;
    product_sku?: string;
    quantity: number;
    unit_price: number;
    unit_cost_at_time?: number;
    subtotal: number;
    tenant_id?: string;
    created_at?: string;
}

export interface Order {
    id?: string;
    order_number?: string;
    user_id?: string;
    customer_name: string;
    customer_email?: string;
    customer_phone?: string;
    shipping_address?: Address | string | any;
    status: OrderStatus;
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    total_amount?: number;
    payment_method?: string;
    notes?: string;
    invoice_url?: string;
    tenant_id?: string;
    branch_id?: string;
    created_at?: string;
    updated_at?: string;
    items?: OrderItem[];
}
