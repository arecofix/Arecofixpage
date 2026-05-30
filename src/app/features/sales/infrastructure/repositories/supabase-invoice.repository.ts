import { Injectable, inject } from '@angular/core';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { InvoiceRepository } from '../../domain/repositories/invoice.repository';
import { Invoice, InvoiceOrigin } from '../../domain/entities/invoice.entity';
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
  }): Promise<Invoice[]> {
    const selectFields = `
      id, invoice_number, order_id, repair_id, customer_name, customer_email, 
      issued_at, subtotal, discount, tenant_id,
      type, origin, tax_amount, total_amount
    `;
    let query = this.supabase
      .from('invoices')
      .select(selectFields)
      .eq('tenant_id', params.tenantId);

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
    // Bypass faulty database trigger by generating invoice_number client-side if missing
    if (!invoice['invoice_number']) {
      try {
        const { data: latest } = await this.supabase
          .from('invoices')
          .select('invoice_number')
          .eq('tenant_id', invoice['tenant_id'] as string)
          .order('invoice_number', { ascending: false })
          .limit(1);

        let nextNumber = 1;
        if (latest && latest.length > 0 && latest[0].invoice_number) {
          const parsed = parseInt(latest[0].invoice_number, 10);
          if (!isNaN(parsed)) {
            nextNumber = parsed + 1;
          }
        }
        invoice['invoice_number'] = nextNumber.toString().padStart(6, '0');
      } catch (e) {
        console.warn('Could not auto-generate invoice number on client side', e);
      }
    }

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
