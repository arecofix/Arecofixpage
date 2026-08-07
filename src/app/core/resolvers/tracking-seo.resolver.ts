import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { GetRepairTrackingUseCase } from '@app/features/repairs/application/usecases/get-repair-tracking.usecase';
import { SeoService } from '@app/core/services/seo.service';
import { PublicRepairDto } from '@app/features/repairs/domain/dtos/public-repair.dto';
import { map, catchError, of, tap } from 'rxjs';
import { environment } from '@env/environment';

export const trackingSeoResolver: ResolveFn<PublicRepairDto | null> = (route, state) => {
  const trackingUseCase = inject(GetRepairTrackingUseCase);
  const seoService = inject(SeoService);

  const code = route.paramMap.get('code');
  if (!code || code.toUpperCase() === 'CONSULTA') return of(null);

  return trackingUseCase.execute(code).pipe(
    tap(repairData => {
      if (repairData) {
        const title = `Estado de Reparación #${repairData.repair_number || code} | Arecofix`;
        const desc = `Seguimiento de ${repairData.device_model}. Estado actual: ${repairData.status_label}. ${repairData.issue_description || ''}`;
        
        let imageUrl = '';
        if (repairData.images && repairData.images.length > 0) {
            imageUrl = repairData.images[0];
            if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('assets/')) {
                imageUrl = `${environment.supabaseUrl}/storage/v1/object/public/repair-images/${imageUrl}`;
            }
        }
        
        if (!imageUrl) {
            imageUrl = 'assets/img/branding/og-services.png';
        }

        seoService.setPageData({
            title: title,
            description: desc,
            imageUrl: imageUrl,
            type: 'website',
            url: `/tracking/${code}`
        });
      }
    }),
    catchError(() => of(null))
  );
};
