/**
 * Supplier Entity
 * Represents a supplier/vendor
 */
export interface Supplier {
    id: string;
    name: string;
    contact_person?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    postal_code?: string;
    tax_id?: string;
    cuil?: string;
    rubro?: string;
    type?: string;
    notes?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

/**
 * Supplier creation DTO
 */
export interface CreateSupplierDto {
    name: string;
    contact_person?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    postal_code?: string;
    tax_id?: string;
    cuil?: string;
    rubro?: string;
    type?: string;
    notes?: string;
}

/**
 * Supplier update DTO
 */
export interface UpdateSupplierDto extends Partial<CreateSupplierDto> {
    is_active?: boolean;
}
