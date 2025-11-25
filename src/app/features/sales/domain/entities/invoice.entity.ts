/**
 * Invoice Entity
 * Represents an invoice for a sale
 */
export interface Invoice {
    id: string;
    sale_id: string;
    customer_name?: string;
    invoice_number?: string;
    type: 'A' | 'B' | 'C';
    total_amount: number;
    issued_at: string;
    created_at: string;
}

/**
 * Invoice creation DTO
 */
export interface CreateInvoiceDto {
    sale_id: string;
    customer_name?: string;
    invoice_number?: string;
    type: 'A' | 'B' | 'C';
    total_amount: number;
    issued_at?: string;
}
