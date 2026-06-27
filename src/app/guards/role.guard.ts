import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { ROLES } from '@app/core/constants/roles.constants';
import { TENANT_CONSTANTS } from '@app/core/constants/tenant.constants';
import { filter, take, timeout, catchError } from 'rxjs/operators';
import { of, firstValueFrom } from 'rxjs';

export const roleGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  try {
    const authState = await firstValueFrom(
      authService.authState$.pipe(
        filter(s => s.isInitialized),
        take(1),
        timeout(5000),
        catchError(() => of({ session: null, user: null, profile: null, isInitialized: true }))
      )
    );

    const allowedRoles: string[] = [
      ROLES.ADMIN, 
      ROLES.STAFF, 
      ROLES.SUPER_ADMIN, 
      ROLES.TENANT_OWNER, 
      ROLES.TECHNICIAN
    ];

    const userProfile = authState.profile;
    const userRole = userProfile?.role;
    const userEmail = userProfile?.email;

    // Super Admin access
    if (authService.isSuperAdmin() || 
        (userProfile && (TENANT_CONSTANTS.SUPER_ADMIN_EMAILS.includes(userEmail || '') || (userRole && allowedRoles.includes(userRole))))) {
      return true;
    }
    
    const metaRole = authState.user?.user_metadata?.['role'] ?? authState.user?.app_metadata?.['role'];
    if (metaRole && allowedRoles.includes(metaRole)) {
      return true;
    }

    console.warn('🚫 roleGuard: Auth access denied for user:', userEmail);
    return router.createUrlTree(['/']);
  } catch (error) {
    console.error('❌ Error in roleGuard:', error);
    return router.createUrlTree(['/login']);
  }
};
