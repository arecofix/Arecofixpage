/**
 * Customer Entity
 * Represents a customer/client
 */
export interface Customer {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    postal_code?: string;
    notes?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

/**
 * Customer creation DTO
 */
export interface CreateCustomerDto {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    postal_code?: string;
    notes?: string;
}

/**
 * Customer update DTO
 */
export interface UpdateCustomerDto extends Partial<CreateCustomerDto> {
    is_active?: boolean;
}
