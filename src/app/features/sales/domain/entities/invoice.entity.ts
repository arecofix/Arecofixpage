import {
  ArcaItemType,
  ArcaVatCondition,
  ArcaDocType,
  ArcaPaymentMethod,
  ArcaSaleCondition,
  ArcaEmitterData,
  ArcaTaxBreakdown,
} from './arca.entity';

/**
 * Invoice Entity — aligned with public.invoices schema and ARCA standards
 */
export type InvoiceType = 'A' | 'B' | 'C' | 'X';

export type InvoiceOrigin = 'sale' | 'order' | 'manual' | 'repair';

export interface InvoiceItem {
  id?: string;
  product_id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number; // 0, 0.105, 0.21, 0.27
  subtotal: number;
  total: number;
  item_type?: ArcaItemType; // 'labor' | 'part' | 'product' | 'service'
  tax_amount?: number;
}

export interface Invoice {
  id: string;
  order_id?: string;
  repair_id?: string;
  customer_id?: string;
  customer_name?: string;
  customer_email?: string;
  customer_tax_id?: string; // DNI / CUIT / CUIL
  customer_doc_type?: ArcaDocType;
  customer_vat_condition?: ArcaVatCondition;
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
  internal_notes?: string;
  payment_method?: ArcaPaymentMethod;
  sale_condition?: ArcaSaleCondition;
  emitter_snapshot?: ArcaEmitterData;
  tax_breakdown?: ArcaTaxBreakdown;
  cae?: string;
  cae_expires_at?: string;
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
  customer_tax_id?: string;
  customer_doc_type?: ArcaDocType;
  customer_vat_condition?: ArcaVatCondition;
  customer_address?: string;
  invoice_number?: string;
  type: InvoiceType;
  origin: InvoiceOrigin;
  subtotal: number;
  tax_amount: number;
  discount: number;
  total_amount: number;
  items?: InvoiceItem[];
  notes?: string;
  internal_notes?: string;
  payment_method?: ArcaPaymentMethod;
  sale_condition?: ArcaSaleCondition;
  emitter_snapshot?: ArcaEmitterData;
  issued_at?: string;
}

export interface InvoiceResult {
  data: Invoice | null;
  error: Error | null;
  duplicate: boolean;
}
