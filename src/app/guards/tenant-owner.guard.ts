import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { ROLES } from '@app/core/constants/roles.constants';
import { filter, take, timeout, catchError } from 'rxjs/operators';
import { of, firstValueFrom } from 'rxjs';

/**
 * Guard that restricts access exclusively to Tenant Owners and Super Admins.
 * It prevents branch-specific roles (admin, staff, technician) from accessing
 * global config pages like Branches management.
 */
export const tenantOwnerGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Skip guard on the server — let the browser enforce it after hydration.
  if (isPlatformServer(platformId)) {
    return true;
  }

  const isBrowser = isPlatformBrowser(platformId);

  try {
    const authState = await firstValueFrom(
      authService.authState$.pipe(
        filter(s => s.isInitialized),
        take(1),
        timeout(5000),
        catchError(() => of({ session: null, user: null, profile: null, isInitialized: true }))
      )
    );

    const userProfile = authState.profile;

    if (!userProfile) {
      if (isBrowser) {
        console.warn('🚫 tenantOwnerGuard: userProfile is null, redirecting to /');
      }
      return router.createUrlTree(['/']);
    }

    const role = userProfile.role;

    if (authService.isSuperAdmin() || role === ROLES.TENANT_OWNER || role === ROLES.SUPER_ADMIN) {
      return true;
    }

    console.warn('🚫 tenantOwnerGuard: Access denied for role:', role);
    return router.createUrlTree(['/']);

  } catch (error) {
    console.error('❌ Error in tenantOwnerGuard:', error);
    return router.createUrlTree(['/']);
  }
};
