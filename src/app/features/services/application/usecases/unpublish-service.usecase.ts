import { ServiceRepository } from '../../domain/repositories/service.repository';
import { Service } from '../../domain/entities/service.entity';

export class UnpublishServiceUseCase {
  constructor(private serviceRepo: ServiceRepository) {}

  async execute(id: string): Promise<Service> {
    const service = await this.serviceRepo.getById(id);
    if (!service) {
      throw new Error(`Servicio con ID ${id} no encontrado`);
    }
    service.unpublish();
    return this.serviceRepo.update(id, { is_published: false });
  }
}
