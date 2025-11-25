/**
 * Repair Status Enum
 */
export enum RepairStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    WAITING_PARTS = 'waiting_parts',
    COMPLETED = 'completed',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled'
}

/**
 * Repair Entity
 * Represents a repair ticket
 */
export interface Repair {
    id: string;
    tracking_code: string;
    customer_id: string;
    customer_name?: string;
    customer_phone?: string;
    device_type: string;
    device_brand: string;
    device_model: string;
    issue_description: string;
    status: RepairStatus;
    estimated_cost?: number;
    final_cost?: number;
    notes?: string;
    technician_id?: string;
    received_at?: string;
    created_at: string;
    updated_at: string;
    completed_at?: string;
}

/**
 * Repair creation DTO
 */
export interface CreateRepairDto {
    customer_id: string;
    customer_name?: string;
    customer_phone?: string;
    device_type: string;
    device_brand: string;
    device_model: string;
    issue_description: string;
    estimated_cost?: number;
    notes?: string;
}

/**
 * Repair update DTO
 */
export interface UpdateRepairDto extends Partial<CreateRepairDto> {
    status?: RepairStatus;
    final_cost?: number;
    technician_id?: string;
    completed_at?: string;
}
