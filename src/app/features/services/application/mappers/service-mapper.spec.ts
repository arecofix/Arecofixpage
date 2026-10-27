import { Service } from '../../domain/entities/service.entity';
import { ServiceBlock } from '../../domain/entities/service-block.entity';
import { ServiceFeature } from '../../domain/entities/service-feature.entity';
import { ServiceMapper } from './service.mapper';

describe('ServiceMapper', () => {

  it('should map database row to domain Service entity', () => {
    const raw = {
      id: 'svc-123',
      name: 'Auditoría de Sitios web',
      slug: 'auditoria-de-sitios-web',
      base_price: 69000,
      price_currency: 'ARS',
      is_published: true,
      short_description: 'Análisis forense de performance y SEO',
    };

    const entity = ServiceMapper.toEntity(raw);
    expect(entity.id).toBe('svc-123');
    expect(entity.name).toBe('Auditoría de Sitios web');
    expect(entity.basePrice).toBe(69000);
    expect(entity.money.format()).toContain('69.000');
    expect(entity.isPublished).toBe(true);
  });

  it('should generate valid Schema.org JSON-LD graph with Service, LocalBusiness and Breadcrumbs', () => {
    const service = new Service({
      id: 'svc-123',
      name: 'Auditoría de Sitios Web',
      slug: 'auditoria-de-sitios-web',
      base_price: 69000,
      short_description: 'Optimización y análisis de software',
      is_published: true,
    });

    const features = [
      new ServiceFeature({ id: 'f-1', service_id: 'svc-123', label: 'Velocidad' }),
    ];

    const blocks = [
      new ServiceBlock({
        id: 'b-1',
        owner_type: 'service',
        owner_id: 'svc-123',
        block_type: 'hero',
        content: { title: 'Hero' },
        is_enabled: true,
      }),
    ];

    const publicDto = ServiceMapper.toPublicDto(service, features, blocks, 'https://arecofix.com.ar');

    expect(publicDto.schema_org).toBeDefined();
    expect(publicDto.schema_org['@context']).toBe('https://schema.org');
    expect(publicDto.schema_org['@graph']).toBeDefined();

    const graph = publicDto.schema_org['@graph'];
    const serviceNode = graph.find((n: any) => n['@type'] === 'Service');
    const breadcrumbNode = graph.find((n: any) => n['@type'] === 'BreadcrumbList');

    expect(serviceNode).toBeDefined();
    expect(serviceNode.name).toBe('Auditoría de Sitios Web');
    expect(serviceNode.provider['@type']).toBe('LocalBusiness');
    expect(serviceNode.offers.price).toBe(69000);

    expect(breadcrumbNode).toBeDefined();
    expect(breadcrumbNode.itemListElement.length).toBe(3);
    expect(breadcrumbNode.itemListElement[1].name).toBe('Servicios');
  });

});
