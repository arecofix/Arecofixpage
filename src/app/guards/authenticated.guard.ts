import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { filter, take, timeout, catchError } from 'rxjs/operators';
import { of, firstValueFrom } from 'rxjs';

/**
 * Simple guard that only requires the user to be authenticated, 
 * regardless of their specific role.
 */
export const authenticatedGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Bypass guard during SSR to allow SEO tags to render
  if (isPlatformServer(platformId)) {
    return true;
  }

  try {
    const authState = await firstValueFrom(
      authService.authState$.pipe(
        filter(s => s.isInitialized),
        take(1),
        timeout(5000), // Safety timeout
        catchError(() => of({ session: null, user: null, profile: null, isInitialized: true }))
      )
    );

    const session = authState.session;
    
    if (session) {
      return true;
    }

    // Not authenticated -> redirect to login with the return URL
    console.warn('🚫 authenticatedGuard: No session, redirecting to login');
    router.navigate(['/login'], { 
      queryParams: { returnUrl: state.url } 
    });
    return false;
  } catch (error) {
    console.error('❌ Error in authenticatedGuard:', error);
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
};
