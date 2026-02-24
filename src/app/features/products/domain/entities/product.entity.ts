export interface ProductStockPerBranch {
    id: string;
    product_id: string;
    branch_id: string;
    quantity: number;
    min_stock_alert: number;
    updated_at: string;
}

/**
 * Product Entity
 * Represents a product in the catalog
 */
export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    category_id: string;
    brand_id?: string;
    image_url?: string;
    gallery_urls?: string[];
    is_featured: boolean;
    is_active: boolean;
    condition?: 'new' | 'used' | 'refurbished';
    warranty?: string;
    stock: number; // General stock (aggregate or legacy)
    min_stock_alert?: number;
    sku?: string;
    barcode?: string;
    currency?: 'ARS' | 'USD';
    created_at: string;
    updated_at: string;
    tenant_id?: string;
    deleted_at?: string;
    
    // Relations
    branch_stock?: ProductStockPerBranch[];
}

/**
 * Product creation DTO
 */
export interface CreateProductDto {
    name: string;
    slug: string;
    description: string;
    price: number;
    category_id: string;
    brand_id?: string;
    image_url?: string;
    gallery_urls?: string[];
    is_featured?: boolean;
    condition?: 'new' | 'used' | 'refurbished';
    warranty?: string;
    stock: number;
    min_stock_alert?: number;
    sku?: string;
    barcode?: string;
    currency?: 'ARS' | 'USD';
}

/**
 * Product update DTO
 */
export interface UpdateProductDto extends Partial<CreateProductDto> {
    is_active?: boolean;
}
