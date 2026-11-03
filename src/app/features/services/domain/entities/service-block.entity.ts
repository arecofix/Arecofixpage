import { BlockType, validateBlockContent } from '../dtos/block-schemas';

export interface ServiceBlockProps {
  id: string;
  owner_type: 'service' | 'post';
  owner_id: string;
  block_type: BlockType;
  content: Record<string, any>;
  order_index?: number;
  is_enabled?: boolean;
  created_at?: string;
  updated_at?: string;
}

export class ServiceBlock {
  readonly id: string;
  readonly ownerType: 'service' | 'post';
  readonly ownerId: string;
  readonly blockType: BlockType;
  content: Record<string, any>;
  orderIndex: number;
  isEnabled: boolean;
  readonly createdAt: string;
  updatedAt: string;

  constructor(props: ServiceBlockProps) {
    this.id = props.id;
    this.ownerType = props.owner_type;
    this.ownerId = props.owner_id;
    this.blockType = props.block_type;
    this.content = props.content || {};
    this.orderIndex = props.order_index ?? 0;
    this.isEnabled = props.is_enabled ?? true;
    this.createdAt = props.created_at || new Date().toISOString();
    this.updatedAt = props.updated_at || new Date().toISOString();
  }

  validate(): { valid: boolean; error?: string } {
    const result = validateBlockContent(this.blockType, this.content);
    if (!result.success) {
      return { valid: false, error: result.error };
    }
    return { valid: true };
  }

  updateContent(newContent: Record<string, any>): void {
    const result = validateBlockContent(this.blockType, newContent);
    if (!result.success) {
      throw new Error(`Contenido de bloque inválido para '${this.blockType}': ${result.error}`);
    }
    this.content = result.data;
    this.updatedAt = new Date().toISOString();
  }

  toObject(): ServiceBlockProps {
    return {
      id: this.id,
      owner_type: this.ownerType,
      owner_id: this.ownerId,
      block_type: this.blockType,
      content: this.content,
      order_index: this.orderIndex,
      is_enabled: this.isEnabled,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }
}
