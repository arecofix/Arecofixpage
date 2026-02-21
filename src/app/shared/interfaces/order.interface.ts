export interface Order {
    id?: string;
    order_number?: string;
    customer_id?: string;
    customer_name: string;
    customer_email: string;
    customer_phone?: string;
    customer_address?: string;
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
