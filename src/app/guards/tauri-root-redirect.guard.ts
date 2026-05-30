import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { firstValueFrom, of } from 'rxjs';
import { filter, take, timeout, catchError } from 'rxjs/operators';

export const tauriRootRedirectGuard: CanActivateFn = async (route, state) => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);
  const authService = inject(AuthService);

  // During SSR/prerendering, window is not available
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const { isTauri } = await import('@tauri-apps/api/core');
  if (isTauri()) {
    try {
      const authState = await firstValueFrom(
        authService.authState$.pipe(
          filter(s => s.isInitialized),
          take(1),
          timeout(2000),
          catchError(() => of({ session: null, profile: null, isInitialized: true }))
        )
      );

      if (authState.session) {
         let branchIdToUse = authState.profile?.branch_id;
         if (!branchIdToUse) {
            branchIdToUse = localStorage.getItem('arecofix_admin_branch_id') || undefined;
         }

         if (branchIdToUse) {
            const branch = await firstValueFrom(
               authService.currentBranch$.pipe(
                  filter(b => b?.id === branchIdToUse),
                  take(1),
                  timeout(2000),
                  catchError(() => of(null))
               )
            );
            if (branch?.slug) {
               return router.parseUrl(`/${branch.slug}/admin`);
            }
         }
      }
    } catch (e) {
      console.warn('tauriRootRedirectGuard auth check failed', e);
    }
    
    return router.parseUrl('/admin');
  }
  
  return true;
};
