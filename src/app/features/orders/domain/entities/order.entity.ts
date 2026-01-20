
export type OrderStatus = 'A_PAGAR' | 'ABONADO' | 'CANCELADO';

export class Order {
    id?: string;
    customer_info: {
        name: string;
        email: string;
        phone: string;
        address: string;
    };
    cart_items: OrderItem[];
    status: OrderStatus;
    total: number;
    created_at?: Date;

    constructor(data: Partial<Order>) {
        this.id = data.id;
        this.customer_info = data.customer_info!;
        this.cart_items = data.cart_items || [];
        this.status = data.status || 'A_PAGAR';
        this.total = data.total || 0;
        this.created_at = data.created_at;
    }
}

export interface OrderItem {
    product_id: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
}
