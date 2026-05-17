import { Injectable, inject } from '@angular/core';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { InvoiceRepository } from '../../domain/repositories/invoice.repository';
import { Invoice, InvoiceOrigin } from '../../domain/entities/invoice.entity';

@Injectable({ providedIn: 'root' })
export class SupabaseInvoiceRepository extends InvoiceRepository {
  private supabase = inject(SUPABASE_CLIENT);

  async getAll(params: {
    limit: number;
    offset: number;
    tenantId: string;
    searchTerm?: string;
  }): Promise<Invoice[]> {
    let query = this.supabase
      .from('invoices')
      .select('*')
      .eq('tenant_id', params.tenantId)
      .order('issued_at', { ascending: false })
      .range(params.offset, params.offset + params.limit - 1);

    if (params.searchTerm) {
      query = query.or(
        `customer_name.ilike.%${params.searchTerm}%,notes.ilike.%${params.searchTerm}%`
      );
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as Invoice[];
  }

  async getCount(params: { tenantId: string; searchTerm?: string }): Promise<number> {
    let query = this.supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', params.tenantId);

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

  async getByOrderId(orderId: string, tenantId: string): Promise<Invoice | null> {
    const { data, error } = await this.supabase
      .from('invoices')
      .select('id')
      .eq('tenant_id', tenantId)
      .eq('order_id', orderId)
      .maybeSingle();

    if (error) throw error;
    return data as Invoice | null;
  }

  async create(invoice: Record<string, unknown>): Promise<{ data: Invoice | null; error: unknown }> {
    const { data, error } = await this.supabase.from('invoices').insert(invoice).select().single();
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
