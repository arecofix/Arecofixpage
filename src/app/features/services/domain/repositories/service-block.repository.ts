import { ServiceBlock, ServiceBlockProps } from '../entities/service-block.entity';

export abstract class ServiceBlockRepository {
  abstract getBlocks(ownerType: 'service' | 'post', ownerId: string): Promise<ServiceBlock[]>;
  abstract upsertBlocks(ownerType: 'service' | 'post', ownerId: string, blocks: Array<Partial<ServiceBlockProps>>): Promise<ServiceBlock[]>;
  abstract deleteBlock(id: string): Promise<void>;
  abstract reorderBlocks(ownerType: 'service' | 'post', ownerId: string, orderedIds: string[]): Promise<void>;
}
