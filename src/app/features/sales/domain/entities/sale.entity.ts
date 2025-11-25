/**
 * Sale Entity
 * Represents a sale transaction
 */
export interface Sale {
    id: string;
    customer_id?: string;
    employee_id?: string;
    total_amount: number;
    payment_method: 'cash' | 'card' | 'transfer' | 'other';
    status: 'pending' | 'completed' | 'cancelled';
    notes?: string;
    created_at: string;
    updated_at: string;
}

/**
 * Sale Item Entity
 */
export interface SaleItem {
    id: string;
    sale_id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    created_at: string;
}

/**
 * Sale creation DTO
 */
export interface CreateSaleDto {
    customer_id?: string;
    employee_id?: string;
    total_amount: number;
    payment_method: 'cash' | 'card' | 'transfer' | 'other';
    items: CreateSaleItemDto[];
    notes?: string;
}

/**
 * Sale item creation DTO
 */
export interface CreateSaleItemDto {
    product_id: string;
    quantity: number;
    unit_price: number;
}
