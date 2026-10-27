import { LeadFilterOptions, ServiceLeadRepository } from '../../domain/repositories/service-lead.repository';
import { LeadStatus, ServiceLead } from '../../domain/entities/service-lead.entity';

export class ListLeadsUseCase {
  constructor(private leadRepo: ServiceLeadRepository) {}

  async execute(options?: LeadFilterOptions): Promise<{ data: ServiceLead[]; total: number }> {
    return this.leadRepo.getAll(options);
  }
}

export class UpdateLeadStatusUseCase {
  constructor(private leadRepo: ServiceLeadRepository) {}

  async execute(id: string, status: LeadStatus): Promise<ServiceLead> {
    const validStatuses: LeadStatus[] = ['new', 'contacted', 'quoted', 'won', 'lost'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Estado de lead inválido: ${status}`);
    }
    return this.leadRepo.updateStatus(id, status);
  }
}
