import { Service, ServiceProps } from '../../domain/entities/service.entity';
import { ServiceFeature } from '../../domain/entities/service-feature.entity';
import { ServiceBlock } from '../../domain/entities/service-block.entity';
import { ServiceDto, ServicePublicDto } from '../../domain/dtos/service.dto';
import { BlockMapper } from './block.mapper';

export class ServiceMapper {
  static toEntity(raw: any): Service {
    return new Service({
      id: raw.id,
      tenant_id: raw.tenant_id,
      category_id: raw.category_id,
      name: raw.name,
      slug: raw.slug,
      icon: raw.icon,
      short_description: raw.short_description,
      long_description: raw.long_description,
      base_price: raw.base_price !== null && raw.base_price !== undefined ? Number(raw.base_price) : (raw.price !== null && raw.price !== undefined ? Number(raw.price) : null),
      price_currency: raw.price_currency || 'ARS',
      duration_minutes: raw.duration_minutes ? Number(raw.duration_minutes) : null,
      is_quotable: raw.is_quotable ?? true,
      is_bookable: raw.is_bookable ?? false,
      is_published: raw.is_published ?? false,
      template_slug: raw.template_slug || 'landing-v1',
      hero_image_url: raw.hero_image_url,
      seo_title: raw.seo_title,
      seo_description: raw.seo_description,
      canonical_url: raw.canonical_url,
      og_image_url: raw.og_image_url,
      published_at: raw.published_at,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
      deleted_at: raw.deleted_at,
    });
  }

  static toDto(service: Service, categoryName?: string, features?: string[], leadsCount?: number): ServiceDto {
    return {
      id: service.id,
      name: service.name,
      slug: service.slug,
      category_id: service.categoryId,
      category_name: categoryName || null,
      icon: service.icon,
      short_description: service.shortDescription,
      long_description: service.longDescription,
      base_price: service.basePrice,
      price_formatted: service.money.format(),
      price_currency: service.money.getCurrency(),
      duration_minutes: service.durationMinutes,
      is_quotable: service.isQuotable,
      is_bookable: service.isBookable,
      is_published: service.isPublished,
      template_slug: service.templateSlug,
      hero_image_url: service.heroImageUrl,
      seo_title: service.seo.title,
      seo_description: service.seo.description,
      canonical_url: service.seo.canonicalUrl || `https://arecofix.com.ar/servicios/${service.slug}`,
      og_image_url: service.seo.ogImageUrl,
      published_at: service.publishedAt,
      created_at: service.createdAt,
      updated_at: service.updatedAt,
      features: features || [],
      leads_count: leadsCount || 0,
    };
  }

  static toPublicDto(service: Service, features: ServiceFeature[], blocks: ServiceBlock[], siteUrl = 'https://arecofix.com.ar'): ServicePublicDto {
    const canonical = service.seo.canonicalUrl || `${siteUrl}/servicios/${service.slug}`;
    const enabledBlocks = blocks.filter(b => b.isEnabled);

    // Schema.org Graph (Service, LocalBusiness, BreadcrumbList)
    const schemaGraph = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          '@id': `${canonical}#service`,
          name: service.name,
          description: service.shortDescription,
          url: canonical,
          serviceType: 'Tecnología & Reparaciones',
          provider: {
            '@type': 'LocalBusiness',
            '@id': `${siteUrl}/#organization`,
            name: 'Arecofix',
            url: siteUrl,
            telephone: '+5491125960900',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Jorge Newbery 69',
              addressLocality: 'Marcos Paz',
              addressRegion: 'Buenos Aires',
              postalCode: '1727',
              addressCountry: 'AR',
            },
            sameAs: [
              'https://www.facebook.com/ArecoFix/',
              'https://www.instagram.com/ArecoFix/',
            ],
          },
          offers: service.basePrice !== null ? {
            '@type': 'Offer',
            price: service.basePrice,
            priceCurrency: service.money.getCurrency(),
            availability: 'https://schema.org/InStock',
            url: canonical,
          } : undefined,
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Inicio',
              item: siteUrl,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Servicios',
              item: `${siteUrl}/servicios`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: service.name,
              item: canonical,
            },
          ],
        },
      ],
    };

    return {
      id: service.id,
      name: service.name,
      slug: service.slug,
      icon: service.icon,
      short_description: service.shortDescription,
      long_description: service.longDescription,
      base_price: service.basePrice,
      price_formatted: service.money.format(),
      price_currency: service.money.getCurrency(),
      duration_minutes: service.durationMinutes,
      is_quotable: service.isQuotable,
      is_bookable: service.isBookable,
      template_slug: service.templateSlug,
      hero_image_url: service.heroImageUrl,
      seo_title: service.seo.title,
      seo_description: service.seo.description,
      canonical_url: canonical,
      og_image_url: service.seo.ogImageUrl || service.heroImageUrl,
      published_at: service.publishedAt,
      features: features.map(f => ({ id: f.id, label: f.label, icon: f.icon })),
      blocks: enabledBlocks.map(b => BlockMapper.toDto(b)),
      schema_org: schemaGraph,
    };
  }
}
