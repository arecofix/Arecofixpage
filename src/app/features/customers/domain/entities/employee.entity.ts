/**
 * Employee Entity
 * Represents an employee/staff member
 */
export interface Employee {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    position?: string;
    department?: string;
    hire_date?: string;
    salary?: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

/**
 * Employee creation DTO
 */
export interface CreateEmployeeDto {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    position?: string;
    department?: string;
    hire_date?: string;
    salary?: number;
}

/**
 * Employee update DTO
 */
export interface UpdateEmployeeDto extends Partial<CreateEmployeeDto> {
    is_active?: boolean;
}
