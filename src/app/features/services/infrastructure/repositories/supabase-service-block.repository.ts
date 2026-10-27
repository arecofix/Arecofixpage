import { Injectable, inject } from '@angular/core';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { ServiceBlock, ServiceBlockProps } from '../../domain/entities/service-block.entity';
import { ServiceBlockRepository } from '../../domain/repositories/service-block.repository';
import { BlockMapper } from '../../application/mappers/block.mapper';

@Injectable({
  providedIn: 'root',
})
export class SupabaseServiceBlockRepository implements ServiceBlockRepository {
  private supabase = inject(SUPABASE_CLIENT);

  async getBlocks(ownerType: 'service' | 'post', ownerId: string): Promise<ServiceBlock[]> {
    const { data, error } = await this.supabase
      .from('service_blocks')
      .select('*')
      .eq('owner_type', ownerType)
      .eq('owner_id', ownerId)
      .order('order_index', { ascending: true });

    if (error) {
      console.error(`Error fetching blocks for ${ownerType}:${ownerId}:`, error);
      throw error;
    }

    return (data || []).map((row: any) => BlockMapper.toEntity(row));
  }

  async upsertBlocks(
    ownerType: 'service' | 'post',
    ownerId: string,
    blocks: Array<Partial<ServiceBlockProps>>
  ): Promise<ServiceBlock[]> {
    if (!blocks || blocks.length === 0) return [];

    const now = new Date().toISOString();
    const rows = blocks.map((b, idx) => {
      const payload: any = {
        owner_type: ownerType,
        owner_id: ownerId,
        block_type: b.block_type,
        content: b.content || {},
        order_index: b.order_index !== undefined ? b.order_index : idx,
        is_enabled: b.is_enabled !== undefined ? b.is_enabled : true,
        updated_at: now,
      };
      if (b.id) {
        payload.id = b.id;
      }
      return payload;
    });

    const { data, error } = await this.supabase
      .from('service_blocks')
      .upsert(rows, { onConflict: 'id' })
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error upserting blocks:', error);
      throw error;
    }

    return (data || []).map((row: any) => BlockMapper.toEntity(row));
  }

  async deleteBlock(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('service_blocks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting block ${id}:`, error);
      throw error;
    }
  }

  async reorderBlocks(ownerType: 'service' | 'post', ownerId: string, orderedIds: string[]): Promise<void> {
    if (!orderedIds || orderedIds.length === 0) return;

    const updates = orderedIds.map((id, index) =>
      this.supabase
        .from('service_blocks')
        .update({ order_index: index, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('owner_type', ownerType)
        .eq('owner_id', ownerId)
    );

    const results = await Promise.all(updates);
    const hasError = results.find(r => r.error);
    if (hasError && hasError.error) {
      console.error('Error reordering blocks:', hasError.error);
      throw hasError.error;
    }
  }
}
