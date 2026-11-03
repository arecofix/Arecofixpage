import { ServiceRepository } from '../../domain/repositories/service.repository';
import { ServiceBlockRepository } from '../../domain/repositories/service-block.repository';
import { Service, ServiceProps } from '../../domain/entities/service.entity';
import { Slug } from '../../domain/value-objects/slug.vo';

export interface CreateServiceInput {
  name: string;
  slug?: string | null;
  category_id?: string | null;
  icon?: string | null;
  short_description?: string | null;
  long_description?: string | null;
  base_price?: number | null;
  price_currency?: string | null;
  duration_minutes?: number | null;
  is_quotable?: boolean;
  is_bookable?: boolean;
  template_slug?: string | null;
  hero_image_url?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  canonical_url?: string | null;
  og_image_url?: string | null;
  features?: string[];
}

export class CreateServiceUseCase {
  constructor(
    private serviceRepo: ServiceRepository,
    private blockRepo?: ServiceBlockRepository
  ) {}

  async execute(input: CreateServiceInput): Promise<Service> {
    if (!input.name || input.name.trim().length < 3) {
      throw new Error('El nombre del servicio debe tener al menos 3 caracteres');
    }

    const cleanSlug = Slug.slugify(input.slug || input.name);
    const existing = await this.serviceRepo.getBySlug(cleanSlug);
    let finalSlug = cleanSlug;
    if (existing) {
      finalSlug = `${cleanSlug}-${Date.now().toString().slice(-4)}`;
    }

    const serviceProps: Partial<ServiceProps> = {
      name: input.name.trim(),
      slug: finalSlug,
      category_id: input.category_id || null,
      icon: input.icon || 'fa-tools',
      short_description: input.short_description?.trim() || null,
      long_description: input.long_description || null,
      base_price: input.base_price !== undefined ? input.base_price : null,
      price_currency: input.price_currency || 'ARS',
      duration_minutes: input.duration_minutes ?? null,
      is_quotable: input.is_quotable ?? true,
      is_bookable: input.is_bookable ?? false,
      is_published: false,
      template_slug: input.template_slug || 'landing-v1',
      hero_image_url: input.hero_image_url || null,
      seo_title: input.seo_title || null,
      seo_description: input.seo_description || null,
    };

    const created = await this.serviceRepo.create(serviceProps, input.features);

    // Initial default Hero block
    if (this.blockRepo) {
      await this.blockRepo.upsertBlocks('service', created.id, [
        {
          block_type: 'hero',
          order_index: 0,
          is_enabled: true,
          content: {
            title: created.name,
            subtitle: created.shortDescription || 'Servicio profesional garantizado por Arecofix.',
            ctaLabel: 'Consultar Presupuesto',
            ctaHref: '#contacto',
            align: 'left',
            imageUrl: created.heroImageUrl || '',
          },
        },
      ]);
    }

    return created;
  }
}
