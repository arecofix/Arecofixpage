export interface DbOrderItem {
    id: string;
    order_id: string;
    product_id: string | null;
    product_name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    created_at: string;
}

export interface DbOrder {
    id: string;
    created_at: string;
    updated_at: string | null;
    order_number: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string | null;
    customer_address: any | null;
    customer_id: string | null;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    subtotal: number;
    tax: number;
    discount: number;
    total_amount: number;
    notes: string | null;
    order_items?: DbOrderItem[];
}
