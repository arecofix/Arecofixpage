import { ServiceBlockRepository } from '../../domain/repositories/service-block.repository';

export class ReorderBlocksUseCase {
  constructor(private blockRepo: ServiceBlockRepository) {}

  async execute(ownerType: 'service' | 'post', ownerId: string, orderedIds: string[]): Promise<void> {
    return this.blockRepo.reorderBlocks(ownerType, ownerId, orderedIds);
  }
}

export class DeleteBlockUseCase {
  constructor(private blockRepo: ServiceBlockRepository) {}

  async execute(id: string): Promise<void> {
    return this.blockRepo.deleteBlock(id);
  }
}
