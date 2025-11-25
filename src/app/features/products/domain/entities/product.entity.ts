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
    is_featured: boolean;
    is_active: boolean;
    condition?: 'new' | 'used' | 'refurbished';
    warranty?: string;
    stock: number;
    min_stock_alert?: number;
    sku?: string;
    barcode?: string;
    created_at: string;
    updated_at: string;
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
    is_featured?: boolean;
    condition?: 'new' | 'used' | 'refurbished';
    warranty?: string;
    stock: number;
    min_stock_alert?: number;
    sku?: string;
    barcode?: string;
}

/**
 * Product update DTO
 */
export interface UpdateProductDto extends Partial<CreateProductDto> {
    is_active?: boolean;
}
