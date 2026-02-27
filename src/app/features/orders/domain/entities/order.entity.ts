
export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';

export interface Cliente {
    name: string;
    email: string;
    phone: string;
    address: string;
}

export interface ProductoPedido {
    product_id: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
}

export class Order {
    id?: string;
    clienteInfo: Cliente;
    items: ProductoPedido[];
    status: OrderStatus;
    total: number;
    createdAt?: Date;
    invoiceUrl?: string;

    constructor(data: Partial<Order>) {
        this.id = data.id;
        this.clienteInfo = data.clienteInfo!;
        this.items = data.items || [];
        this.status = data.status || 'pending';
        this.total = data.total || 0;
        this.createdAt = data.createdAt;
        this.invoiceUrl = data.invoiceUrl;
    }
}
