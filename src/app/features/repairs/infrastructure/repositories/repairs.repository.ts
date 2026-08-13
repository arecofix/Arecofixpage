import { Injectable, inject } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { TenantService } from '@app/core/services/tenant.service';
import { SupabaseErrorHandlerService } from '@app/core/services/supabase-error-handler.service';
import { Observable, from, map } from 'rxjs';
import { ImageOptimizerService } from '@app/core/services/image-optimizer.service';
import { SupabaseStorageService } from '@app/core/services/supabase-storage.service';

/**
 * DTO optimizado para el listado general de reparaciones.
 * Excluye campos pesados como checklist (jsonb), technical_report (text),
 * technician_notes (text) y relaciones (imágenes/repuestos) para ahorrar ancho de banda.
 */
export interface RepairListDto {
  id: string;
  tracking_code: string;
  customer_name: string;
  device_brand: string;
  device_model: string;
  device_type?: string;
  current_status_id: number;
  created_at: string;
  final_cost: number;
  branch_id?: string;
  tenant_id?: string;
}

/**
 * DTO para la vista detallada de una reparación.
 * Contiene todos los campos del registro, incluyendo los detalles técnicos,
 * el checklist e incluye las relaciones necesarias cargadas bajo demanda.
 */
export interface RepairDetailDto {
  id: string;
  tracking_code: string;
  customer_id?: string;
  customer_name?: string;
  customer_phone?: string;
  device_type: string;
  device_brand: string;
  device_model: string;
  imei?: string;
  repair_number?: number;
  issue_description: string;
  current_status_id: number;
  estimated_cost?: number;
  final_cost?: number;
  deposit_amount?: number;
  technical_labor_cost?: number;
  notes?: string;
  technician_notes?: string;
  technical_report?: string;
  received_at?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  branch_id?: string;
  tenant_id?: string;
  checklist?: {
    charger: boolean;
    battery: boolean;
    chip: boolean;
    sd: boolean;
    case: boolean;
  };
  security_pin?: string;
  security_pattern?: string;
  device_passcode?: string;
  glass_upsell?: boolean;
  spare_part_cost?: number;
  // Relaciones relacionales pesadas, cargadas solo en detalle
  images?: { image_url: string }[];
  parts?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class RepairsRepository {
  private supabase: SupabaseClient = inject(SUPABASE_CLIENT);
  private tenantService = inject(TenantService);
  private errorHandler = inject(SupabaseErrorHandlerService);
  private imageOptimizer = inject(ImageOptimizerService);
  private storageService = inject(SupabaseStorageService);

  private readonly tableName = 'repairs';

  /**
   * Obtiene la lista de reparaciones con paginación obligatoria y DTO optimizado.
   * Evita traer campos pesados o relaciones para reducir el Cached Egress.
   * 
   * @param page Número de página (1-based)
   * @param pageSize Cantidad de registros por página
   * @param filters Filtros de sucursal y término de búsqueda
   */
  getOptimizedList(
    page: number,
    pageSize: number,
    filters?: { branch_id?: string; searchTerm?: string }
  ): Observable<{ data: RepairListDto[]; totalCount: number }> {
    const fromRow = (page - 1) * pageSize;
    const toRow = fromRow + pageSize - 1;

    // Cero select('*'). Definimos solo las columnas estrictamente necesarias para el listado.
    let query = this.supabase
      .from(this.tableName)
      .select(
        'id, tracking_code, current_status_id, created_at, final_cost, branch_id, tenant_id, client:profiles!repairs_client_id_fkey(first_name, last_name), device:customer_devices!device_id(type, model:models(name, brand_id))',
        { count: 'exact' }
      );

    // Aplicar aislamiento multi-tenant
    const tenantId = this.tenantService.getTenantId();
    if (tenantId) {
      query = query.eq('tenant_id', tenantId);
    }

    // Filtrar solo registros no eliminados (soft deletes)
    query = query.is('deleted_at', null);

    // Aplicar filtros adicionales
    if (filters?.branch_id) {
      query = query.eq('branch_id', filters.branch_id);
    }

    if (filters?.searchTerm) {
      const term = `%${filters.searchTerm}%`;
      query = query.or(
        `tracking_code.ilike.${term}`
      );
    }

    // Paginación obligatoria mediante .range()
    query = query
      .order('created_at', { ascending: false })
      .range(fromRow, toRow);

    return from(query).pipe(
      map(({ data, error, count }) => {
        if (error) {
          this.errorHandler.handleError(error, `getOptimizedList ${this.tableName}`);
          throw error;
        }

        return {
          data: (data || []).map((r: any) => ({
            id: r.id,
            tracking_code: r.tracking_code,
            customer_name: r.client ? `${r.client.first_name || ''} ${r.client.last_name || ''}`.trim() : 'Cliente',
            device_brand: '', 
            device_model: r.device?.model?.name || 'Equipo Genérico',
            device_type: r.device?.type,
            current_status_id: r.current_status_id,
            created_at: r.created_at,
            final_cost: r.final_cost,
            branch_id: r.branch_id,
            tenant_id: r.tenant_id
          })) as RepairListDto[],
          totalCount: count || 0
        };
      })
    );
  }

  /**
   * Obtiene el detalle completo de una reparación por su ID.
   * Carga los campos pesados y las relaciones de imágenes/repuestos bajo demanda.
   */
  getOptimizedDetail(id: string): Observable<RepairDetailDto | null> {
    // Aquí sí traemos campos técnicos y de relación, pero solo para un registro individual
    let query = this.supabase
      .from(this.tableName)
      .select(`
        id, tracking_code, customer_id, 
        issue_description, current_status_id, estimated_cost, final_cost,
        deposit_amount, technical_labor_cost, technician_notes, notes,
        technical_report, received_at, created_at, updated_at, completed_at,
        branch_id, tenant_id, checklist, security_pin, security_pattern,
        glass_upsell, spare_part_cost,
        parts:repair_parts_used(id, product_id, quantity, unit_price_at_time, cost_at_time),
        images:repair_images(id, image_url),
        client:profiles!repairs_client_id_fkey(first_name, last_name, phone),
        device:customer_devices!device_id(imei, passcode, model:models(name, brand_id))
      `)
      .eq('id', id);

    const tenantId = this.tenantService.getTenantId();
    if (tenantId) {
      query = query.eq('tenant_id', tenantId);
    }

    return from(query.maybeSingle()).pipe(
      map(({ data, error }) => {
        if (error) {
          this.errorHandler.handleError(error, `getOptimizedDetail ${this.tableName}`);
          throw error;
        }
        const r = data as any;
        return {
          ...r,
          customer_name: r.client ? `${r.client.first_name || ''} ${r.client.last_name || ''}`.trim() : 'Cliente',
          customer_phone: r.client?.phone,
          device_type: r.device?.type,
          device_brand: '',
          device_model: r.device?.model?.name || 'Equipo Genérico',
          imei: r.device?.imei,
          device_passcode: r.device?.passcode
        } as RepairDetailDto | null;
      })
    );
  }

  /**
   * Comprime y sube una imagen al Storage de Supabase.
   * Integra el servicio de compresión antes de la subida para mitigar el ancho de banda.
   */
  async uploadOptimizedImage(file: File, folder: string = 'repairs'): Promise<string> {
    // 1. Comprimir en cliente
    const compressed = await this.imageOptimizer.compressImage(file, {
      maxWidth: 1200,
      maxHeight: 1200,
      quality: 0.8,
      format: 'image/webp'
    });

    // 2. Subir usando el servicio estándar multi-tenant
    return this.storageService.uploadFile(compressed, folder, 'public-assets');
  }
}
