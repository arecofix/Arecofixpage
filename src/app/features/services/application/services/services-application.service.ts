import { Injectable, inject } from '@angular/core';
import { ServiceRepository } from '../../domain/repositories/service.repository';
import { ServiceBlockRepository } from '../../domain/repositories/service-block.repository';
import { ServiceLeadRepository } from '../../domain/repositories/service-lead.repository';
import { CreateServiceInput, CreateServiceUseCase } from '../usecases/create-service.usecase';
import { UpdateServiceInput, UpdateServiceUseCase } from '../usecases/update-service.usecase';
import { PublishServiceUseCase } from '../usecases/publish-service.usecase';
import { UnpublishServiceUseCase } from '../usecases/unpublish-service.usecase';
import { DuplicateServiceUseCase } from '../usecases/duplicate-service.usecase';
import { GetPublicServiceBySlugUseCase, GetPublicServiceResult } from '../usecases/get-public-service-by-slug.usecase';
import { ListPublicServicesUseCase } from '../usecases/list-public-services.usecase';
import { UpsertBlocksUseCase } from '../usecases/upsert-blocks.usecase';
import { ReorderBlocksUseCase, DeleteBlockUseCase } from '../usecases/reorder-blocks.usecase';
import { CreateLeadUseCase } from '../usecases/create-lead.usecase';
import { ListLeadsUseCase, UpdateLeadStatusUseCase } from '../usecases/list-leads.usecase';
import { CreateLeadDto, LeadDto, ServiceBlockDto, ServiceDto } from '../../domain/dtos/service.dto';
import { ServiceFilterOptions } from '../../domain/repositories/service.repository';
import { LeadFilterOptions } from '../../domain/repositories/service-lead.repository';
import { LeadStatus } from '../../domain/entities/service-lead.entity';
import { ServiceMapper } from '../mappers/service.mapper';
import { BlockMapper } from '../mappers/block.mapper';
import { LeadMapper } from '../mappers/lead.mapper';
import { ServiceBlockProps } from '../../domain/entities/service-block.entity';

@Injectable({
  providedIn: 'root',
})
export class ServicesApplicationService {
  private serviceRepo = inject(ServiceRepository);
  private blockRepo = inject(ServiceBlockRepository);
  private leadRepo = inject(ServiceLeadRepository);

  private createServiceUc = new CreateServiceUseCase(this.serviceRepo, this.blockRepo);
  private updateServiceUc = new UpdateServiceUseCase(this.serviceRepo);
  private publishServiceUc = new PublishServiceUseCase(this.serviceRepo, this.blockRepo);
  private unpublishServiceUc = new UnpublishServiceUseCase(this.serviceRepo);
  private duplicateServiceUc = new DuplicateServiceUseCase(this.serviceRepo, this.blockRepo);
  private getPublicServiceBySlugUc = new GetPublicServiceBySlugUseCase(this.serviceRepo, this.blockRepo);
  private listPublicServicesUc = new ListPublicServicesUseCase(this.serviceRepo);
  private upsertBlocksUc = new UpsertBlocksUseCase(this.blockRepo);
  private reorderBlocksUc = new ReorderBlocksUseCase(this.blockRepo);
  private deleteBlockUc = new DeleteBlockUseCase(this.blockRepo);
  private createLeadUc = new CreateLeadUseCase(this.leadRepo);
  private listLeadsUc = new ListLeadsUseCase(this.leadRepo);
  private updateLeadStatusUc = new UpdateLeadStatusUseCase(this.leadRepo);

  // --- Services Operations ---
  async getPaginatedServices(options?: ServiceFilterOptions): Promise<{ data: ServiceDto[]; total: number }> {
    const res = await this.serviceRepo.getAll(options);
    const dtos = await Promise.all(
      res.data.map(async s => {
        const features = await this.serviceRepo.getFeatures(s.id);
        return ServiceMapper.toDto(s, undefined, features.map(f => f.label));
      })
    );
    return { data: dtos, total: res.total };
  }

  async getServiceById(id: string): Promise<ServiceDto | null> {
    const service = await this.serviceRepo.getById(id);
    if (!service) return null;
    const features = await this.serviceRepo.getFeatures(id);
    return ServiceMapper.toDto(service, undefined, features.map(f => f.label));
  }

  async createService(input: CreateServiceInput): Promise<ServiceDto> {
    const service = await this.createServiceUc.execute(input);
    const features = await this.serviceRepo.getFeatures(service.id);
    return ServiceMapper.toDto(service, undefined, features.map(f => f.label));
  }

  async updateService(id: string, input: UpdateServiceInput): Promise<ServiceDto> {
    const service = await this.updateServiceUc.execute(id, input);
    const features = await this.serviceRepo.getFeatures(service.id);
    return ServiceMapper.toDto(service, undefined, features.map(f => f.label));
  }

  async publishService(id: string): Promise<ServiceDto> {
    const service = await this.publishServiceUc.execute(id);
    const features = await this.serviceRepo.getFeatures(service.id);
    return ServiceMapper.toDto(service, undefined, features.map(f => f.label));
  }

  async unpublishService(id: string): Promise<ServiceDto> {
    const service = await this.unpublishServiceUc.execute(id);
    const features = await this.serviceRepo.getFeatures(service.id);
    return ServiceMapper.toDto(service, undefined, features.map(f => f.label));
  }

  async duplicateService(id: string): Promise<ServiceDto> {
    const service = await this.duplicateServiceUc.execute(id);
    const features = await this.serviceRepo.getFeatures(service.id);
    return ServiceMapper.toDto(service, undefined, features.map(f => f.label));
  }

  async deleteService(id: string): Promise<void> {
    return this.serviceRepo.delete(id);
  }

  // --- Public Operations ---
  async getPublicServices(): Promise<ServiceDto[]> {
    return this.listPublicServicesUc.execute();
  }

  async getPublicServiceBySlug(slug: string, siteUrl = 'https://arecofix.com.ar'): Promise<GetPublicServiceResult> {
    return this.getPublicServiceBySlugUc.execute(slug, siteUrl);
  }

  // --- Shared Blocks Operations (Services and Posts) ---
  async getBlocks(ownerType: 'service' | 'post', ownerId: string): Promise<ServiceBlockDto[]> {
    const blocks = await this.blockRepo.getBlocks(ownerType, ownerId);
    return blocks.map(b => BlockMapper.toDto(b));
  }

  async upsertBlocks(
    ownerType: 'service' | 'post',
    ownerId: string,
    blocks: Array<Partial<ServiceBlockProps>>
  ): Promise<ServiceBlockDto[]> {
    const result = await this.upsertBlocksUc.execute(ownerType, ownerId, blocks);
    return result.map(b => BlockMapper.toDto(b));
  }

  async reorderBlocks(ownerType: 'service' | 'post', ownerId: string, orderedIds: string[]): Promise<void> {
    return this.reorderBlocksUc.execute(ownerType, ownerId, orderedIds);
  }

  async deleteBlock(id: string): Promise<void> {
    return this.deleteBlockUc.execute(id);
  }

  // --- Leads Operations ---
  async submitLead(dto: CreateLeadDto, clientIp = '', userAgent = ''): Promise<LeadDto> {
    const lead = await this.createLeadUc.execute(dto, clientIp, userAgent);
    return LeadMapper.toDto(lead);
  }

  async getLeads(options?: LeadFilterOptions): Promise<{ data: LeadDto[]; total: number }> {
    const res = await this.listLeadsUc.execute(options);
    return {
      data: res.data.map(l => LeadMapper.toDto(l)),
      total: res.total,
    };
  }

  async updateLeadStatus(id: string, status: LeadStatus): Promise<LeadDto> {
    const lead = await this.updateLeadStatusUc.execute(id, status);
    return LeadMapper.toDto(lead);
  }
}
