/**
 * Invoice Entity — Extended for manual invoicing support
 *
 * Clean Architecture: This entity is framework-agnostic and
 * contains only the domain data, no Angular dependencies.
 */
export type InvoiceType = 'A' | 'B' | 'C' | 'X'; // X = internal/manual ticket

export type InvoiceOrigin = 'sale' | 'order' | 'manual' | 'repair';

export interface InvoiceItem {
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;   // e.g. 0.21 for 21% IVA
  subtotal: number;   // quantity * unit_price (before tax)
  total: number;      // subtotal * (1 + tax_rate)
}

export interface Invoice {
  id: string;
  /** Associated order/sale ID (optional for manual invoices) */
  order_id?: string;
  sale_id?: string;
  repair_id?: string;
  customer_id?: string;
  customer_name?: string;
  customer_email?: string;
  customer_tax_id?: string;
  customer_address?: string;
  invoice_number?: string;
  pdf_url?: string;
  type: InvoiceType;
  /** How this invoice was created */
  origin: InvoiceOrigin;
  subtotal: number;
  net_amount?: number;
  tax_amount: number;
  discount: number;
  total_amount: number;
  items?: InvoiceItem[];
  notes?: string;
  issued_at: string;
  created_at: string;
  tenant_id?: string;
  deleted_at?: string;
}

/**
 * DTO for creating any invoice (automatic or manual).
 * Origin field distinguishes the trigger.
 */
export interface CreateInvoiceDto {
  order_id?: string;
  sale_id?: string;
  customer_id?: string;
  customer_name?: string;
  customer_email?: string;
  invoice_number?: string;
  type: InvoiceType;
  origin: InvoiceOrigin;
  subtotal: number;
  tax_amount: number;
  discount: number;
  total_amount: number;
  items?: InvoiceItem[];
  notes?: string;
  repair_id?: string;
  issued_at?: string;
}

/**
 * Result of a generate-invoice operation.
 * Always returns data + error so callers can handle both paths without throwing.
 */
export interface InvoiceResult {
  data: Invoice | null;
  error: Error | null;
  duplicate: boolean; // true if invoice already existed for this order
}
