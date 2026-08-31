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
    description?: string;
    price: number;
    sale_price?: number;
    category_id: string;
    brand_id?: string;
    model_id?: string;
    image_url?: string;
    gallery_urls?: string[];
    media_metadata?: Array<{ url: string; color?: string; order?: number }>;
    specifications?: Record<string, any>;
    is_featured: boolean;
    is_active: boolean;
    is_global?: boolean;
    branch_id?: string;
    stock: number; // General stock (aggregate or legacy)
    min_stock_alert?: number;
    sku?: string;
    barcode?: string;
    currency?: 'ARS' | 'USD';
    convertedPrice?: number;
    cost_price?: number;
    created_at: string;
    updated_at: string;
    tenant_id?: string;
    deleted_at?: string;
    search_tsv?: string;
    // SEO fields
    meta_title?: string;
    meta_description?: string;
    og_image?: string;
    // Mercado Libre integration
    ml_item_id?: string;
    ml_sync_status?: 'pending' | 'synced' | 'error';
    ml_last_sync?: string;
    ml_category_id?: string;
    // strategic fields for UI
    discount_percentage?: number;
    category_name?: string;
    
    // Relations
    branch_stock?: ProductStockPerBranch[];
    branches?: { name: string };
}

/**
 * Product creation DTO
 */
export interface CreateProductDto {
    name: string;
    slug: string;
    description?: string;
    price: number;
    sale_price?: number;
    category_id: string;
    brand_id?: string;
    model_id?: string;
    image_url?: string;
    gallery_urls?: string[];
    media_metadata?: Array<{ url: string; color?: string; order?: number }>;
    specifications?: Record<string, any>;
    is_featured?: boolean;
    stock: number;
    min_stock_alert?: number;
    sku?: string;
    barcode?: string;
    currency?: 'ARS' | 'USD';
    cost_price?: number;
    meta_title?: string;
    meta_description?: string;
    og_image?: string;
    ml_category_id?: string;
}

/**
 * Product update DTO
 */
export interface UpdateProductDto extends Partial<CreateProductDto> {
    is_active?: boolean;
}
