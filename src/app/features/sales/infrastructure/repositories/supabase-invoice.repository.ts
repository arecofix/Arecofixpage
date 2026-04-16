import { Injectable, inject } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { InvoiceRepository } from '../../domain/repositories/invoice.repository';
import { Invoice } from '../../domain/entities/invoice.entity';

@Injectable({
  providedIn: 'root'
})
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
      query = query.or(`customer_name.ilike.%${params.searchTerm}%,notes.ilike.%${params.searchTerm}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as Invoice[];
  }

  async getCount(params: {
    tenantId: string;
    searchTerm?: string;
  }): Promise<number> {
    let query = this.supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', params.tenantId);

    if (params.searchTerm) {
      query = query.or(`customer_name.ilike.%${params.searchTerm}%,notes.ilike.%${params.searchTerm}%`);
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
    return data as Invoice;
  }

  async getByOrderId(orderId: string, tenantId: string): Promise<Invoice | null> {
    const { data, error } = await this.supabase
      .from('invoices')
      .select('id')
      .eq('tenant_id', tenantId)
      .eq('order_id', orderId)
      .maybeSingle();
    
    if (error) throw error;
    return data as Invoice;
  }

  async create(invoice: any): Promise<{ data: Invoice | null; error: any }> {
    const { data, error } = await this.supabase
      .from('invoices')
      .insert(invoice)
      .select()
      .single();
    
    return { data: data as Invoice, error };
  }

  async getRelatedItems(params: {
    type: 'sale' | 'order' | 'repair';
    id: string;
    tenantId: string;
  }): Promise<any[]> {
    const table = params.type === 'sale' ? 'sale_items' : 
                  params.type === 'order' ? 'order_items' : null;
    
    if (!table) return [];

    const { data, error } = await this.supabase
      .from(table)
      .select('*, products(name)')
      .eq(`${params.type}_id`, params.id)
      .eq('tenant_id', params.tenantId);

    if (error) throw error;
    return data || [];
  }
}
