/**
 * Purchase Entity
 * Represents a purchase from a supplier
 */
export interface Purchase {
    id: string;
    supplier_id: string;
    suppliers?: { name: string }; // Joined data from Supabase
    total_amount: number;
    status: 'pending' | 'ordered' | 'received' | 'cancelled';
    notes?: string;
    created_at: string;
    updated_at: string;
}

/**
 * Purchase Item Entity
 */
export interface PurchaseItem {
    id: string;
    purchase_id: string;
    product_id: string;
    quantity: number;
    unit_cost: number;
    subtotal: number;
}

/**
 * Purchase creation DTO
 */
export interface CreatePurchaseDto {
    supplier_id: string;
    total_amount: number;
    items: CreatePurchaseItemDto[];
    notes?: string;
}

/**
 * Purchase item creation DTO
 */
export interface CreatePurchaseItemDto {
    product_id: string;
    quantity: number;
    unit_cost: number;
}
