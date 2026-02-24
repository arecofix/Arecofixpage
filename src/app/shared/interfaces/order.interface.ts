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

export interface Order {
    id?: string;
    order_number?: string;
    user_id?: string; // in DB it's user_id, not customer_id
    customer_name: string;
    customer_email: string;
    customer_phone?: string;
    shipping_address?: Address | string; // in DB it's shipping_address
    status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';

    subtotal: number;
    tax: number;
    discount: number;
    total: number; // in DB it's total_amount but also total
    total_amount?: number;
    payment_method?: string;
    notes?: string;
    invoice_url?: string;
    invoice_generated?: boolean;
    tenant_id?: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
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
    unit_cost_at_time?: number; // As requested
    subtotal: number;
    tenant_id?: string;
    created_at?: string;
}

export interface OrderWithItems extends Order {
    items: OrderItem[];
}
