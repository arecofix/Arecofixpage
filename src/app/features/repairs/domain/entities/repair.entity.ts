/**
 * Repair Status Enum
 */
export enum RepairStatus {
    PENDING_DIAGNOSIS = 1,
    SUPPLY_MANAGEMENT = 2,
    IN_PROGRESS = 3,
    QUALITY_CONTROL = 4,
    READY_FOR_PICKUP = 5,
    DELIVERED = 6,
    CANCELLED = 7
}

/**
 * Repair Part Entity
 * Represents a part used in a repair
 */
export interface RepairPart {
    id?: string;
    repair_id: string;
    product_id: string;
    quantity: number;
    unit_price_at_time: number;
    cost_at_time: number;
    created_at?: string;
    // Helper fields for UI
    product_name?: string;
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
    readonly technical_labor_cost?: number;
    readonly notes?: string;
    readonly technician_notes?: string;
    readonly technical_report?: string;
    readonly received_at?: string;
    readonly created_at: string;
    readonly updated_at: string;
    readonly completed_at?: string;
    readonly images?: string[];
    readonly branch_id?: string;
    readonly received_by?: string;
    readonly assigned_technician_id?: string;
    
    // Additional fields from form
    readonly checklist?: RepairChecklist;
    readonly security_pin?: string;
    readonly security_pattern?: string;
    readonly device_passcode?: string;
    
    // Relations (opt-in)
    readonly parts?: RepairPart[];
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
    customer_id?: string;
    customer_name?: string;
    customer_phone?: string;
    device_type: string;
    device_brand: string;
    device_model: string;
    imei?: string;
    issue_description: string;
    estimated_cost?: number;
    deposit_amount?: number;
    notes?: string;
    images?: string[];
    checklist?: RepairChecklist;
    security_pin?: string;
    security_pattern?: string;
    device_passcode?: string;
    branch_id?: string;
    received_by?: string;
    assigned_technician_id?: string;
    current_status_id?: number;
}

/**
 * Repair update DTO
 */
export interface UpdateRepairDto extends Partial<CreateRepairDto> {
    current_status_id?: number;
    final_cost?: number;
    technical_labor_cost?: number;
    technical_report?: string;
    technician_notes?: string;
    completed_at?: string;
    parts?: RepairPart[];
}
