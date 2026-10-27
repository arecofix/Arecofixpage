import { ServiceRepository } from '../../domain/repositories/service.repository';
import { ServiceDto } from '../../domain/dtos/service.dto';
import { ServiceMapper } from '../mappers/service.mapper';

export class ListPublicServicesUseCase {
  constructor(private serviceRepo: ServiceRepository) {}

  async execute(): Promise<ServiceDto[]> {
    const services = await this.serviceRepo.getPublicList();
    return services.map(s => ServiceMapper.toDto(s));
  }
}
