import { Invoice } from '../../domain/entities/invoice.entity';

export class InvoiceMapper {
  private static readonly VALID_DB_COLUMNS = new Set<string>([
    'id',
    'tenant_id',
    'order_id',
    'repair_id',
    'repair_order_id',
    'repair_order_number',
    'customer_id',
    'customer_name',
    'customer_email',
    'customer_tax_id',
    'customer_doc_type',
    'customer_vat_condition',
    'customer_address',
    'invoice_number',
    'pdf_url',
    'type',
    'origin',
    'status',
    'subtotal',
    'net_amount',
    'tax_amount',
    'discount',
    'total_amount',
    'advance_payment',
    'balance_due',
    'surcharge',
    'items',
    'notes',
    'internal_notes',
    'payment_method',
    'sale_condition',
    'emitter_snapshot',
    'tax_breakdown',
    'cae',
    'cae_expires_at',
    'issued_at',
    'created_at',
    'deleted_at'
  ]);

  /**
   * Safe Partial Update Mapper for Invoices.
   * STRICT GUARANTEE: Never coerces missing/undefined fields to null.
   * Only includes fields explicitly provided in the partial DTO.
   */
  static mapUpdateToDb(dto: Partial<Invoice>): Record<string, unknown> {
    const payload: Record<string, unknown> = {};
    const raw = dto as Record<string, unknown>;

    for (const key of Object.keys(raw)) {
      if (this.VALID_DB_COLUMNS.has(key) && raw[key] !== undefined) {
        payload[key] = raw[key];
      }
    }

    // Always strip primary key and tenant identifier from updates
    delete payload['id'];
    delete payload['tenant_id'];

    return payload;
  }
}
