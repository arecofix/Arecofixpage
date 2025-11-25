/**
 * Brand Entity
 * Represents a product brand
 */
export interface Brand {
    id: string;
    name: string;
    slug?: string;
    description?: string;
    logo_url?: string;
    website_url?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

/**
 * Brand creation DTO
 */
export interface CreateBrandDto {
    name: string;
    slug?: string;
    description?: string;
    logo_url?: string;
    website_url?: string;
}

/**
 * Brand update DTO
 */
export interface UpdateBrandDto extends Partial<CreateBrandDto> {
    is_active?: boolean;
}
