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
    readonly id: string;
    readonly tracking_code: string;
    readonly customer_id?: string;
    readonly customer_name?: string;
    readonly customer_phone?: string;
    readonly device_type: string;
    readonly device_brand: string;
    readonly device_model: string;
    readonly imei?: string;
    readonly repair_number?: number;
    readonly issue_description: string;
    readonly current_status_id: number;
    readonly estimated_cost?: number;
    readonly final_cost?: number;
    readonly deposit_amount?: number;
    readonly notes?: string;
    readonly technician_notes?: string;
    readonly technician_id?: string;
    readonly received_at?: string;
    readonly created_at: string;
    readonly updated_at: string;
    readonly completed_at?: string;
    readonly images?: string[];
    // Additional fields from form
    readonly checklist?: RepairChecklist;
    readonly security_pin?: string;
    readonly security_pattern?: string;
}

export interface RepairChecklist {
    charger: boolean;
    battery: boolean;
    chip: boolean;
    sd: boolean;
    case: boolean;
}

/**
 * Repair creation DTO
 */
export interface CreateRepairDto {
    readonly customer_id?: string;
    readonly customer_name?: string;
    readonly customer_phone?: string;
    readonly device_type: string;
    readonly device_brand: string;
    readonly device_model: string;
    readonly imei?: string;
    readonly issue_description: string;
    readonly estimated_cost?: number;
    readonly notes?: string;
    readonly images?: string[];
    readonly checklist?: RepairChecklist;
    readonly security_pin?: string;
    readonly security_pattern?: string;
}

/**
 * Repair update DTO
 */
export interface UpdateRepairDto extends Partial<CreateRepairDto> {
    readonly current_status_id?: number;
    readonly final_cost?: number;
    readonly technician_id?: string;
    readonly completed_at?: string;
}
