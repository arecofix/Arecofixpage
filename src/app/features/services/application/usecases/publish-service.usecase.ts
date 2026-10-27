import { ServiceRepository } from '../../domain/repositories/service.repository';
import { ServiceBlockRepository } from '../../domain/repositories/service-block.repository';
import { Service } from '../../domain/entities/service.entity';

export class PublishServiceUseCase {
  constructor(
    private serviceRepo: ServiceRepository,
    private blockRepo: ServiceBlockRepository
  ) {}

  async execute(id: string): Promise<Service> {
    const service = await this.serviceRepo.getById(id);
    if (!service) {
      throw new Error(`Servicio con ID ${id} no encontrado`);
    }

    // Verify blocks: at least one enabled hero block
    const blocks = await this.blockRepo.getBlocks('service', id);
    const hasHero = blocks.some(b => b.blockType === 'hero' && b.isEnabled);

    service.publish(hasHero);

    return this.serviceRepo.update(id, {
      is_published: true,
      published_at: service.publishedAt || new Date().toISOString(),
      seo_title: service.seo.title,
      seo_description: service.seo.description,
      canonical_url: service.seo.canonicalUrl || `https://arecofix.com.ar/servicios/${service.slug}`,
    });
  }
}
