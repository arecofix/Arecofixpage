import { Invoice, InvoiceOrigin } from '../entities/invoice.entity';

export abstract class InvoiceRepository {
  abstract getAll(params: {
    limit: number;
    offset: number;
    tenantId: string;
    searchTerm?: string;
  }): Promise<Invoice[]>;

  abstract getCount(params: { tenantId: string; searchTerm?: string }): Promise<number>;

  abstract getById(id: string, tenantId: string): Promise<Invoice | null>;

  abstract getByOrderId(orderId: string, tenantId: string): Promise<Invoice | null>;

  abstract create(invoice: Record<string, unknown>): Promise<{ data: Invoice | null; error: unknown }>;

  abstract getLineItems(params: {
    origin: InvoiceOrigin;
    referenceId: string;
    tenantId: string;
    embeddedItems?: Invoice['items'];
  }): Promise<unknown[]>;
}
