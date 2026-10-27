import { ServiceBlockRepository } from '../../domain/repositories/service-block.repository';
import { ServiceBlock, ServiceBlockProps } from '../../domain/entities/service-block.entity';
import { validateBlockContent } from '../../domain/dtos/block-schemas';

export class UpsertBlocksUseCase {
  constructor(private blockRepo: ServiceBlockRepository) {}

  async execute(
    ownerType: 'service' | 'post',
    ownerId: string,
    blocks: Array<Partial<ServiceBlockProps>>
  ): Promise<ServiceBlock[]> {
    const errors: Record<string, string> = {};

    blocks.forEach((block, index) => {
      if (!block.block_type) {
        errors[`block_${index}`] = 'El tipo de bloque es requerido';
        return;
      }
      const validation = validateBlockContent(block.block_type, block.content || {});
      if (!validation.success) {
        errors[block.id || `block_${index}`] = validation.error || 'Contenido inválido';
      }
    });

    if (Object.keys(errors).length > 0) {
      const err = new Error('Errores de validación en los bloques');
      (err as any).validationErrors = errors;
      throw err;
    }

    return this.blockRepo.upsertBlocks(ownerType, ownerId, blocks);
  }
}
