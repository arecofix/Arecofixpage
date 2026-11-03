import { Injectable, inject } from '@angular/core';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { LoggerService } from '@app/core/services/logger.service';
import { TenantService } from '@app/core/services/tenant.service';
import { CashMovementRepository, CreateCashMovementDto } from '../../domain/repositories/cash-movement.repository';

@Injectable({ providedIn: 'root' })
export class SupabaseCashMovementRepository extends CashMovementRepository {
  private supabase = inject(SUPABASE_CLIENT);
  private logger = inject(LoggerService);
  private tenantService = inject(TenantService);

  private readonly processedSourceIds = new Set<string>();
  private readonly inFlightSourceIds = new Set<string>();

  async existsBySourceEventId(sourceEventId: string): Promise<boolean> {
    if (!sourceEventId) return false;
    if (this.processedSourceIds.has(sourceEventId) || this.inFlightSourceIds.has(sourceEventId)) {
      return true;
    }
    this.inFlightSourceIds.add(sourceEventId);

    try {
      const tenantId = this.tenantService.getTenantId();
      let query = this.supabase
        .from('cash_movements')
        .select('id')
        .eq('reference_id', sourceEventId);

      if (tenantId) {
        query = query.eq('tenant_id', tenantId);
      }

      const { data, error } = await query;
      if (error) {
        this.logger.warn('[SupabaseCashMovementRepository] Error checking sourceEventId:', error);
        this.inFlightSourceIds.delete(sourceEventId);
        return false;
      }

      const exists = Boolean(data && data.length > 0);
      if (exists) {
        this.processedSourceIds.add(sourceEventId);
        this.inFlightSourceIds.delete(sourceEventId);
      }
      return exists;
    } catch {
      this.inFlightSourceIds.delete(sourceEventId);
      return false;
    }
  }

  async create(dto: CreateCashMovementDto): Promise<unknown> {
    try {
      const tenantId = dto.tenant_id ?? this.tenantService.getTenantId();
      const payload = {
        tenant_id: tenantId,
        branch_id: dto.branch_id ?? null,
        type: dto.type,
        notes: dto.concept,
        amount: dto.amount,
        payment_method: dto.method,
        reference_id: dto.sourceEventId,
        category: this.mapCategory(dto.sourceModule),
        created_at: typeof dto.date === 'string' ? dto.date : (dto.date ? dto.date.toISOString() : new Date().toISOString()),
      };

      const { data, error } = await this.supabase
        .from('cash_movements')
        .insert(payload)
        .select()
        .single();

      if (error) {
        this.logger.error('[SupabaseCashMovementRepository] Insert failed:', error);
        throw error;
      }

      if (dto.sourceEventId) {
        this.processedSourceIds.add(dto.sourceEventId);
        this.inFlightSourceIds.delete(dto.sourceEventId);
      }
      return data;
    } catch (err) {
      if (dto.sourceEventId) {
        this.inFlightSourceIds.delete(dto.sourceEventId);
      }
      throw err;
    }
  }

  private mapCategory(sourceModule: string): string {
    switch (sourceModule) {
      case 'sales':
        return 'sale';
      case 'purchases':
        return 'purchase';
      case 'orders':
        return 'sale';
      case 'repairs':
        return 'repair';
      default:
        return 'otros';
    }
  }
}
