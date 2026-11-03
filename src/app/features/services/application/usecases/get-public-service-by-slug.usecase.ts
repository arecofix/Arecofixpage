import { ServiceRepository } from '../../domain/repositories/service.repository';
import { ServiceBlockRepository } from '../../domain/repositories/service-block.repository';
import { ServicePublicDto } from '../../domain/dtos/service.dto';
import { ServiceMapper } from '../mappers/service.mapper';

export type GetPublicServiceResult =
  | { type: 'found'; data: ServicePublicDto }
  | { type: 'redirect'; targetSlug: string }
  | { type: 'not_found' };

export class GetPublicServiceBySlugUseCase {
  constructor(
    private serviceRepo: ServiceRepository,
    private blockRepo: ServiceBlockRepository
  ) {}

  async execute(slug: string, siteUrl = 'https://arecofix.com.ar'): Promise<GetPublicServiceResult> {
    const service = await this.serviceRepo.getBySlug(slug);

    if (service && service.isPublished) {
      const features = await this.serviceRepo.getFeatures(service.id);
      const blocks = await this.blockRepo.getBlocks('service', service.id);
      const publicDto = ServiceMapper.toPublicDto(service, features, blocks, siteUrl);
      return { type: 'found', data: publicDto };
    }

    // Check if there is a 301 redirect for this slug
    const redirectedSlug = await this.serviceRepo.findRedirect(slug, 'service');
    if (redirectedSlug) {
      return { type: 'redirect', targetSlug: redirectedSlug };
    }

    return { type: 'not_found' };
  }
}
