import { Injectable, inject } from '@angular/core';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { InvoiceRepository } from '../../domain/repositories/invoice.repository';
import { Invoice, InvoiceOrigin, InvoiceStatus } from '../../domain/entities/invoice.entity';
import { AuthService } from '@app/core/services/auth.service';
import { BranchContextService } from '@app/core/services/branch-context.service';

@Injectable({ providedIn: 'root' })
export class SupabaseInvoiceRepository extends InvoiceRepository {
  private supabase = inject(SUPABASE_CLIENT);
  private authService = inject(AuthService);
  private branchContextService = inject(BranchContextService);

  async getAll(params: {
    limit: number;
    offset: number;
    tenantId: string;
    searchTerm?: string;
    status?: InvoiceStatus;
  }): Promise<Invoice[]> {
    const selectFields = `
      id, invoice_number, order_id, repair_id, customer_name, customer_email, 
      customer_tax_id, customer_address, notes, status, advance_payment, balance_due,
      issued_at, subtotal, discount, tenant_id,
      type, origin, tax_amount, total_amount, internal_notes, payment_method, sale_condition,
      customer_doc_type, customer_vat_condition, repair_order_id, repair_order_number
    `;
    let query = this.supabase
      .from('invoices')
      .select(selectFields)
      .eq('tenant_id', params.tenantId);

    if (params.status) {
      query = query.eq('status', params.status);
    }

    query = query
      .order('issued_at', { ascending: false })
      .range(params.offset, params.offset + params.limit - 1);

    if (params.searchTerm) {
      query = query.or(
        `customer_name.ilike.%${params.searchTerm}%,notes.ilike.%${params.searchTerm}%`
      );
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as unknown as Invoice[];
  }

  async getCount(params: {
    tenantId: string;
    searchTerm?: string;
    status?: InvoiceStatus;
  }): Promise<number> {
    let query = this.supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', params.tenantId);

    if (params.status) {
      query = query.eq('status', params.status);
    }

    if (params.searchTerm) {
      query = query.or(
        `customer_name.ilike.%${params.searchTerm}%,notes.ilike.%${params.searchTerm}%`
      );
    }

    const { count, error } = await query;
    if (error) throw error;
    return count || 0;
  }

  async getById(id: string, tenantId: string): Promise<Invoice | null> {
    const { data, error } = await this.supabase
      .from('invoices')
      .select('*')
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .maybeSingle();

    if (error) throw error;
    return data as Invoice | null;
  }

  private readonly inFlightOrderIds = new Set<string>();
  private readonly processedOrderIds = new Set<string>();
  private readonly inFlightRepairIds = new Set<string>();
  private readonly processedRepairIds = new Set<string>();

  async getByOrderId(orderId: string, tenantId: string): Promise<Invoice | null> {
    if (!orderId) return null;
    if (this.processedOrderIds.has(orderId) || this.inFlightOrderIds.has(orderId)) {
      return { id: 'in-flight-' + orderId, order_id: orderId, status: 'draft' } as unknown as Invoice;
    }
    this.inFlightOrderIds.add(orderId);

    try {
      let query = this.supabase
        .from('invoices')
        .select('id')
        .eq('order_id', orderId);

      if (tenantId) {
        query = query.eq('tenant_id', tenantId);
      }

      const { data, error } = await query.maybeSingle();

      if (error) {
        this.inFlightOrderIds.delete(orderId);
        throw error;
      }
      if (data) {
        this.processedOrderIds.add(orderId);
        this.inFlightOrderIds.delete(orderId);
      }
      return data as Invoice | null;
    } catch (err) {
      this.inFlightOrderIds.delete(orderId);
      throw err;
    }
  }

  async getByRepairId(repairId: string, tenantId: string): Promise<Invoice | null> {
    if (!repairId) return null;
    if (this.processedRepairIds.has(repairId) || this.inFlightRepairIds.has(repairId)) {
      return { id: 'in-flight-' + repairId, repair_id: repairId, status: 'draft' } as unknown as Invoice;
    }
    this.inFlightRepairIds.add(repairId);

    try {
      let query = this.supabase
        .from('invoices')
        .select('*')
        .or(`repair_id.eq.${repairId},repair_order_id.eq.${repairId}`)
        .order('created_at', { ascending: false })
        .limit(1);

      if (tenantId) {
        query = query.eq('tenant_id', tenantId);
      }

      const { data, error } = await query.maybeSingle();

      if (!error && data) {
        this.processedRepairIds.add(repairId);
        this.inFlightRepairIds.delete(repairId);
        return data as Invoice;
      }

      this.inFlightRepairIds.delete(repairId);
      return null;
    } catch {
      this.inFlightRepairIds.delete(repairId);
      return null;
    }
  }

  async getDraftCount(tenantId: string): Promise<number> {
    try {
      const { count, error } = await this.supabase
        .from('invoices')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', tenantId)
        .in('status', ['draft', 'pending_review']);

      if (error) {
        return 0;
      }
      return count || 0;
    } catch {
      return 0;
    }
  }

  async update(id: string, partial: Partial<Invoice>): Promise<{ data: Invoice | null; error: unknown }> {
    const { data, error } = await this.supabase
      .from('invoices')
      .update(partial)
      .eq('id', id)
      .select()
      .maybeSingle();

    return { data: data as Invoice | null, error };
  }

  async create(invoice: Record<string, unknown>): Promise<{ data: Invoice | null; error: unknown }> {
    if (invoice['invoice_number'] !== undefined && invoice['invoice_number'] !== null) {
      if (typeof invoice['invoice_number'] === 'string') {
        const parsed = parseInt(invoice['invoice_number'], 10);
        if (!isNaN(parsed)) {
          invoice['invoice_number'] = parsed;
        }
      }
    } else {
      try {
        const { data: latest } = await this.supabase
          .from('invoices')
          .select('invoice_number')
          .eq('tenant_id', invoice['tenant_id'] as string)
          .order('invoice_number', { ascending: false })
          .limit(1);

        let nextNumber = 1;
        if (latest && latest.length > 0 && latest[0].invoice_number) {
          const parsed = parseInt(String(latest[0].invoice_number), 10);
          if (!isNaN(parsed)) {
            nextNumber = parsed + 1;
          }
        }
        invoice['invoice_number'] = nextNumber;
      } catch (e) {
        console.warn('Could not auto-generate invoice number on client side', e);
      }
    }

    const orderId = invoice['order_id'] as string | undefined;
    const repairId = (invoice['repair_id'] || invoice['repair_order_id']) as string | undefined;

    const { data, error } = await this.supabase.from('invoices').insert(invoice).select().single();

    if (orderId) {
      this.processedOrderIds.add(orderId);
      this.inFlightOrderIds.delete(orderId);
    }
    if (repairId) {
      this.processedRepairIds.add(repairId);
      this.inFlightRepairIds.delete(repairId);
    }

    return { data: data as Invoice, error };
  }

  async getLineItems(params: {
    origin: InvoiceOrigin;
    referenceId: string;
    tenantId: string;
    embeddedItems?: Invoice['items'];
  }): Promise<unknown[]> {
    if (params.origin === 'manual' || params.origin === 'sale') {
      return params.embeddedItems ?? [];
    }

    if (params.origin === 'order') {
      const { data, error } = await this.supabase
        .from('order_items')
        .select('*, products(name)')
        .eq('order_id', params.referenceId)
        .eq('tenant_id', params.tenantId);

      if (error) throw error;
      return data || [];
    }

    if (params.origin === 'repair') {
      const { data, error } = await this.supabase
        .from('repair_parts_used')
        .select('*, products(name)')
        .eq('repair_id', params.referenceId)
        .eq('tenant_id', params.tenantId);

      if (error) throw error;
      return data || [];
    }

    return params.embeddedItems ?? [];
  }
}
