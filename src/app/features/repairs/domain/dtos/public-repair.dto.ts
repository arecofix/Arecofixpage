import { RepairStatus } from '../entities/repair.entity';

/**
 * DTO for public tracking view.
 * Ensures only safe, necessary data is exposed.
 */
export interface PublicRepairDto {
    readonly tracking_code: string;
    readonly device_model: string;
    readonly current_status_id: number;
    readonly status_label: string;
    readonly status_color: string;
    readonly received_at: string;
    readonly issue_description: string;
    readonly total_cost: number;
    readonly deposit_amount: number;
    readonly balance_to_pay: number;
    readonly repair_number?: number;
    readonly customer_name?: string;
    readonly technician_report?: string;
    readonly images?: string[];
}
