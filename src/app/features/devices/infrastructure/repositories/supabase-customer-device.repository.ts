import { Injectable, inject } from '@angular/core';
import { from, Observable, of, switchMap } from 'rxjs';
import { ICustomerDeviceRepository } from '../../domain/repositories/customer-device.repository';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { TenantService } from '@app/core/services/tenant.service';

@Injectable({
  providedIn: 'root'
})
export class SupabaseCustomerDeviceRepository implements ICustomerDeviceRepository {
  private supabase = inject(SUPABASE_CLIENT);
  private tenantService = inject(TenantService);

  ensureModelExists(name: string, slug: string, brandId?: string | null): Observable<string | null> {
    const tenantId = this.tenantService.getTenantId();

    return from(
      this.supabase
        .from('device_models')
        .select('id')
        .eq('slug', slug)
        .eq('tenant_id', tenantId)
        .maybeSingle()
    ).pipe(
      switchMap(({ data, error }) => {
        if (error) {
          console.error('[SupabaseCustomerDeviceRepository] Error fetching model:', error);
          return of(null);
        }
        
        if (data && data.id) {
          return of(data.id as string);
        }

        return from(
          this.supabase
            .from('device_models')
            .insert({
              name: name,
              slug: slug,
              brand_id: brandId || null,
              tenant_id: tenantId,
            })
            .select('id')
            .single()
        ).pipe(
          switchMap(({ data: newData, error: insertError }) => {
            if (insertError) {
              console.error('[SupabaseCustomerDeviceRepository] Error inserting model:', insertError);
              return of(null);
            }
            return of(newData?.id as string | null);
          })
        );
      })
    );
  }

  upsertDevice(payload: { deviceId?: string | null; userId: string; modelId: string | null; type?: string | null; imei?: string | null; passcode?: string | null; }): Observable<string | null> {
    const tenantId = this.tenantService.getTenantId();
    
    if (payload.deviceId) {
      const updatePayload: Record<string, unknown> = {
        imei: payload.imei || null,
        passcode: payload.passcode || null,
      };
      if (payload.modelId) updatePayload['model_id'] = payload.modelId;
      if (payload.type) updatePayload['type'] = payload.type;

      return from(
        this.supabase
          .from('customer_devices')
          .update(updatePayload)
          .eq('id', payload.deviceId)
          .select('id')
          .single()
      ).pipe(
        switchMap(({ data, error }) => {
          if (error) {
            console.error('[SupabaseCustomerDeviceRepository] Error updating device:', error);
            return of(null);
          }
          return of(payload.deviceId || null);
        })
      );
    } else {
      return from(
        this.supabase
          .from('customer_devices')
          .insert({
            user_id: payload.userId,
            model_id: payload.modelId,
            type: payload.type || null,
            imei: payload.imei || null,
            passcode: payload.passcode || null,
            tenant_id: tenantId,
          })
          .select('id')
          .single()
      ).pipe(
        switchMap(({ data, error }) => {
          if (error) {
            console.error('[SupabaseCustomerDeviceRepository] Error inserting device:', error);
            return of(null);
          }
          return of(data?.id as string | null);
        })
      );
    }
  }
}
