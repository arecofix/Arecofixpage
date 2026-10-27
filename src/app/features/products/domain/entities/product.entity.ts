export interface ProductStockPerBranch {
    id: string;
    product_id: string;
    branch_id: string;
    quantity: number;
    min_stock_alert: number;
    updated_at: string;
}

export interface ProductVariant {
    id: string;
    product_id: string;
    tenant_id?: string;
    name: string;
    sku?: string;
    barcode?: string;
    price?: number;
    stock: number;
    attributes: Record<string, any>;
    is_active: boolean;
    image_url?: string;
    created_at: string;
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
    description?: string | null;
    price: number;
    retail_price?: number | null;
    sale_price?: number | null;
    category_id: string | null;
    brand_id?: string | null;
    model_id?: string | null;
    image_url?: string | null;
    gallery_urls?: string[];
    media_metadata?: Array<{ url: string; color?: string; order?: number }>;
    specifications?: Record<string, any>;
    is_featured: boolean;
    is_active: boolean;
    is_global?: boolean;
    branch_id?: string | null;
    stock: number; // General stock (aggregate or legacy)
    min_stock_alert?: number;
    sku?: string | null;
    barcode?: string | null;
    currency?: 'ARS' | 'USD';
    convertedPrice?: number;
    cost_price?: number;
    created_at: string;
    updated_at: string;
    tenant_id?: string;
    deleted_at?: string | null;
    search_tsv?: string;
    // SEO fields
    meta_title?: string | null;
    meta_description?: string | null;
    og_image?: string | null;
    seo_keywords?: string | null;
    
    // Marketing & Logistics
    offer_start_date?: string | null; // fecha_inicio_oferta
    offer_end_date?: string | null; // fecha_fin_oferta
    warranty_days?: number; // garantia_meses
    tax_percentage?: number; // porcentaje_impuesto
    weight?: number | null; // peso_kg
    dimensions?: { length: number; width: number; height: number }; // largo_cm, ancho_cm, alto_cm
    cross_sell_products?: string[]; // productos_relacionados
    reference_exchange_rate?: number; // tasa_cambio_referencia
    free_shipping?: boolean; // envio_gratis
    supplier_id?: string | null; // proveedor_id
    condition?: 'Nuevo' | 'Usado' | 'Reacondicionado'; // condicion
    warranty_type?: 'Fábrica' | 'Vendedor' | 'Sin garantía'; // tipo_garantia
    includes_tax?: boolean; // incluye_iva
    tags?: string[]; // etiquetas_tags

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
    variants?: ProductVariant[];
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
    seo_keywords?: string;
    
    offer_start_date?: string;
    offer_end_date?: string;
    warranty_days?: number;
    tax_percentage?: number;
    weight?: number;
    dimensions?: { length: number; width: number; height: number };
    cross_sell_products?: string[];
    reference_exchange_rate?: number;
    free_shipping?: boolean;
    supplier_id?: string;
    condition?: 'Nuevo' | 'Usado' | 'Reacondicionado';
    warranty_type?: 'Fábrica' | 'Vendedor' | 'Sin garantía';
    includes_tax?: boolean;
    tags?: string[];
    
    ml_category_id?: string;
    
    variants?: Partial<ProductVariant>[];
}

/**
 * Product update DTO
 */
export interface UpdateProductDto extends Partial<CreateProductDto> {
    is_active?: boolean;
}
