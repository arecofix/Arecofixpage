import { ServiceRepository } from '../../domain/repositories/service.repository';
import { ServiceBlockRepository } from '../../domain/repositories/service-block.repository';
import { Service } from '../../domain/entities/service.entity';
import { Slug } from '../../domain/value-objects/slug.vo';

export class DuplicateServiceUseCase {
  constructor(
    private serviceRepo: ServiceRepository,
    private blockRepo: ServiceBlockRepository
  ) {}

  async execute(id: string): Promise<Service> {
    const original = await this.serviceRepo.getById(id);
    if (!original) {
      throw new Error(`Servicio con ID ${id} no encontrado`);
    }

    const newSlug = Slug.slugify(`${original.slug}-copia-${Date.now().toString().slice(-4)}`);
    const features = await this.serviceRepo.getFeatures(id);

    const duplicated = await this.serviceRepo.create(
      {
        name: `${original.name} (Copia)`,
        slug: newSlug,
        category_id: original.categoryId,
        icon: original.icon,
        short_description: original.shortDescription,
        long_description: original.longDescription,
        base_price: original.basePrice,
        price_currency: original.money.getCurrency(),
        duration_minutes: original.durationMinutes,
        is_quotable: original.isQuotable,
        is_bookable: original.isBookable,
        is_published: false,
        template_slug: original.templateSlug,
        hero_image_url: original.heroImageUrl,
        seo_title: original.seo.title ? `${original.seo.title} (Copia)` : null,
        seo_description: original.seo.description,
      },
      features.map(f => f.label)
    );

    // Duplicate all blocks
    const originalBlocks = await this.blockRepo.getBlocks('service', id);
    if (originalBlocks.length > 0) {
      const clonedBlocks = originalBlocks.map(b => ({
        block_type: b.blockType,
        content: JSON.parse(JSON.stringify(b.content)),
        order_index: b.orderIndex,
        is_enabled: b.isEnabled,
      }));
      await this.blockRepo.upsertBlocks('service', duplicated.id, clonedBlocks);
    }

    return duplicated;
  }
}
