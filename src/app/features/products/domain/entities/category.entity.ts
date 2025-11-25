/**
 * Category Entity
 * Represents a product category
 */
export interface Category {
    id: string;
    name: string;
    slug: string;
    type?: string;
    description?: string;
    image_url?: string;
    parent_id?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

/**
 * Category creation DTO
 */
export interface CreateCategoryDto {
    name: string;
    slug: string;
    type?: string;
    description?: string;
    image_url?: string;
    parent_id?: string;
}

/**
 * Category update DTO
 */
export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {
    is_active?: boolean;
}
