import { ServiceRepository } from '../../domain/repositories/service.repository';
import { Service, ServiceProps } from '../../domain/entities/service.entity';
import { Slug } from '../../domain/value-objects/slug.vo';

export interface UpdateServiceInput extends Partial<ServiceProps> {
  features?: string[];
}

export class UpdateServiceUseCase {
  constructor(private serviceRepo: ServiceRepository) {}

  async execute(id: string, input: UpdateServiceInput): Promise<Service> {
    const existing = await this.serviceRepo.getById(id);
    if (!existing) {
      throw new Error(`Servicio con ID ${id} no encontrado`);
    }

    const payload: Partial<ServiceProps> = { ...input };

    // Slug change detection -> register 301 redirect
    if (input.slug && input.slug.trim()) {
      const sanitizedSlug = Slug.slugify(input.slug);
      if (sanitizedSlug !== existing.slug) {
        // Verify collision
        const slugExists = await this.serviceRepo.getBySlug(sanitizedSlug);
        if (slugExists && slugExists.id !== id) {
          throw new Error(`El slug '${sanitizedSlug}' ya está en uso por otro servicio`);
        }
        await this.serviceRepo.createRedirect('service', id, existing.slug, sanitizedSlug);
        payload.slug = sanitizedSlug;
      }
    }

    return this.serviceRepo.update(id, payload, input.features);
  }
}
