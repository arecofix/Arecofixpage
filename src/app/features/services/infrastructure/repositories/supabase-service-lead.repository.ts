import { Injectable, inject } from '@angular/core';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { TenantService } from '@app/core/services/tenant.service';
import { LeadStatus, ServiceLead, ServiceLeadProps } from '../../domain/entities/service-lead.entity';
import { LeadFilterOptions, ServiceLeadRepository } from '../../domain/repositories/service-lead.repository';
import { LeadMapper } from '../../application/mappers/lead.mapper';

@Injectable({
  providedIn: 'root',
})
export class SupabaseServiceLeadRepository implements ServiceLeadRepository {
  private supabase = inject(SUPABASE_CLIENT);
  private tenantService = inject(TenantService);

  private get tenantId(): string {
    return this.tenantService.getTenantId();
  }

  async getAll(options?: LeadFilterOptions): Promise<{ data: ServiceLead[]; total: number }> {
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = this.supabase
      .from('service_leads')
      .select('*, services:service_id(name)', { count: 'exact' })
      .order('created_at', { ascending: false });

    const tid = this.tenantId;
    if (tid) {
      query = query.eq('tenant_id', tid);
    }

    if (options?.status) {
      query = query.eq('status', options.status);
    }

    if (options?.serviceId) {
      query = query.eq('service_id', options.serviceId);
    }

    if (options?.search && options.search.trim()) {
      query = query.or(`name.ilike.%${options.search.trim()}%,email.ilike.%${options.search.trim()}%,phone.ilike.%${options.search.trim()}%`);
    }

    query = query.range(from, to);

    const { data, count, error } = await query;
    if (error) {
      console.error('Error fetching service leads:', error);
      throw error;
    }

    const leads = (data || []).map((row: any) => LeadMapper.toEntity(row));
    return { data: leads, total: count || 0 };
  }

  async getById(id: string): Promise<ServiceLead | null> {
    const { data, error } = await this.supabase
      .from('service_leads')
      .select('*, services:service_id(name)')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching lead ${id}:`, error);
      throw error;
    }

    return data ? LeadMapper.toEntity(data) : null;
  }

  async create(lead: Partial<ServiceLeadProps>): Promise<ServiceLead> {
    const tid = this.tenantId;
    const generatedId = lead.id || crypto.randomUUID();
    const dbPayload: any = {
      id: generatedId,
      service_id: lead.service_id || null,
      name: lead.name,
      email: lead.email || null,
      phone: lead.phone || null,
      message: lead.message,
      source: lead.source || 'landing_service',
      utm_source: lead.utm_source || null,
      utm_medium: lead.utm_medium || null,
      utm_campaign: lead.utm_campaign || null,
      status: lead.status || 'new',
      ip_hash: lead.ip_hash || null,
      user_agent: lead.user_agent || null,
    };
    if (tid) {
      dbPayload.tenant_id = tid;
    }

    // Omit .select() to prevent PostgREST return=representation error for unauthenticated visitors
    const { error } = await this.supabase
      .from('service_leads')
      .insert(dbPayload);

    if (error) {
      console.error('Error creating service lead in Supabase:', error);
      throw error;
    }

    return LeadMapper.toEntity({
      ...dbPayload,
      created_at: new Date().toISOString(),
    });
  }

  async updateStatus(id: string, status: LeadStatus): Promise<ServiceLead> {
    const now = new Date().toISOString();
    const updatePayload: any = { status };
    if (status !== 'new') {
      updatePayload.contacted_at = now;
    }

    const { data, error } = await this.supabase
      .from('service_leads')
      .update(updatePayload)
      .eq('id', id)
      .select('*, services:service_id(name)')
      .single();

    if (error) {
      console.error(`Error updating lead ${id} status:`, error);
      throw error;
    }

    return LeadMapper.toEntity(data);
  }

  async getRecentLeadCountByIp(ipHash: string, hoursWindow = 1): Promise<number> {
    if (!ipHash) return 0;
    const since = new Date(Date.now() - hoursWindow * 3600 * 1000).toISOString();

    const { count, error } = await this.supabase
      .from('service_leads')
      .select('*', { count: 'exact', head: true })
      .eq('ip_hash', ipHash)
      .gte('created_at', since);

    if (error) {
      console.warn('Error checking lead rate limit:', error);
      return 0;
    }

    return count || 0;
  }
}
