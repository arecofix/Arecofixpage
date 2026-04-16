import { Invoice, CreateInvoiceDto } from '../entities/invoice.entity';

export abstract class InvoiceRepository {
    abstract getAll(params: {
        limit: number;
        offset: number;
        tenantId: string;
        searchTerm?: string;
    }): Promise<Invoice[]>;

    abstract getCount(params: {
        tenantId: string;
        searchTerm?: string;
    }): Promise<number>;

    abstract getById(id: string, tenantId: string): Promise<Invoice | null>;

    abstract getByOrderId(orderId: string, tenantId: string): Promise<Invoice | null>;

    abstract create(invoice: any): Promise<{ data: Invoice | null; error: any }>;

    abstract getRelatedItems(params: {
        type: 'sale' | 'order' | 'repair';
        id: string;
        tenantId: string;
    }): Promise<any[]>;
}
