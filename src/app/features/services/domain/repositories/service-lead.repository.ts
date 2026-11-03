import { LeadStatus, ServiceLead, ServiceLeadProps } from '../entities/service-lead.entity';

export interface LeadFilterOptions {
  status?: LeadStatus;
  serviceId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export abstract class ServiceLeadRepository {
  abstract getAll(options?: LeadFilterOptions): Promise<{ data: ServiceLead[]; total: number }>;
  abstract getById(id: string): Promise<ServiceLead | null>;
  abstract create(lead: Partial<ServiceLeadProps>): Promise<ServiceLead>;
  abstract updateStatus(id: string, status: LeadStatus): Promise<ServiceLead>;
  abstract getRecentLeadCountByIp(ipHash: string, hoursWindow: number): Promise<number>;
}
