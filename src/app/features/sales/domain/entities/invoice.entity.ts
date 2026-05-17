/**
 * Invoice Entity — aligned with public.invoices schema
 */
export type InvoiceType = 'A' | 'B' | 'C' | 'X';

export type InvoiceOrigin = 'sale' | 'order' | 'manual' | 'repair';

export interface InvoiceItem {
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  subtotal: number;
  total: number;
}

export interface Invoice {
  id: string;
  order_id?: string;
  repair_id?: string;
  customer_id?: string;
  customer_name?: string;
  customer_email?: string;
  customer_tax_id?: string;
  customer_address?: string;
  invoice_number?: number | string;
  pdf_url?: string;
  type: InvoiceType;
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

export interface CreateInvoiceDto {
  order_id?: string;
  repair_id?: string;
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
  issued_at?: string;
}

export interface InvoiceResult {
  data: Invoice | null;
  error: Error | null;
  duplicate: boolean;
}
