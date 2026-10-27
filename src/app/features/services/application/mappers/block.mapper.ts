import { ServiceBlock, ServiceBlockProps } from '../../domain/entities/service-block.entity';
import { ServiceBlockDto } from '../../domain/dtos/service.dto';

export class BlockMapper {
  static toEntity(raw: any): ServiceBlock {
    return new ServiceBlock({
      id: raw.id,
      owner_type: raw.owner_type,
      owner_id: raw.owner_id,
      block_type: raw.block_type,
      content: typeof raw.content === 'string' ? JSON.parse(raw.content) : (raw.content || {}),
      order_index: raw.order_index ?? 0,
      is_enabled: raw.is_enabled ?? true,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toDto(block: ServiceBlock): ServiceBlockDto {
    return {
      id: block.id,
      owner_type: block.ownerType,
      owner_id: block.ownerId,
      block_type: block.blockType,
      content: block.content,
      order_index: block.orderIndex,
      is_enabled: block.isEnabled,
      created_at: block.createdAt,
      updated_at: block.updatedAt,
    };
  }

  static toProps(dto: Partial<ServiceBlockDto>, ownerType: 'service' | 'post', ownerId: string): Partial<ServiceBlockProps> {
    return {
      id: dto.id,
      owner_type: ownerType,
      owner_id: ownerId,
      block_type: dto.block_type,
      content: dto.content,
      order_index: dto.order_index,
      is_enabled: dto.is_enabled,
    };
  }
}
