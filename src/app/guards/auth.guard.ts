/* eslint-disable */
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { filter, take, timeout, catchError } from 'rxjs/operators';
import { of, firstValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  try {
    const authState = await firstValueFrom(
      authService.authState$.pipe(
        filter(state => state.isInitialized),
        take(1),
        timeout(5000), // Safety timeout
        catchError(() => of({ session: null, user: null, profile: null, isInitialized: true }))
      )
    );

    const session = authState.session;
    if (!session) {
      console.warn('🚫 authGuard: No session found, redirecting to login');
      return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    }

    const userProfile = authState.profile;
    
    // Staff Revocation Check
    if (userProfile && userProfile.is_active === false) {
      console.warn('🚫 authGuard: User access revoked. Signing out.');
      await authService.signOut();
      return router.createUrlTree(['/login'], { queryParams: { error: 'access_revoked' } });
    }

    return true;
  } catch (error) {
    console.error('❌ Error in authGuard:', error);
    return router.createUrlTree(['/login']);
  }
};

export const noAuthGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const authState = await firstValueFrom(
    authService.authState$.pipe(
      filter(state => state.isInitialized),
      take(1),
      timeout(5000),
      catchError(() => of({ session: null, user: null, profile: null, isInitialized: true }))
    )
  );

  if (authState.session) {
    return router.createUrlTree(['/']);
  }
  return true;
};
