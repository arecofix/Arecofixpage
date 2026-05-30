/* eslint-disable */
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { ROLES } from '@app/core/constants/roles.constants';
import { TENANT_CONSTANTS } from '@app/core/constants/tenant.constants';
import { filter, map, take, timeout, catchError } from 'rxjs/operators';
import { of, firstValueFrom } from 'rxjs';

import { TenantService } from '@app/core/services/tenant.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const tenantService = inject(TenantService);
  const router = inject(Router);

  console.log('🔍 authGuard - Checking access for:', state.url);

  try {
    // Wait for the auth state to be fully initialized before making a decision
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
      router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    // Role-based access control
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
    
    // 1. Staff Revocation Check
    if (userProfile && userProfile.is_active === false) {
      console.warn('🚫 authGuard: User access revoked. Signing out.');
      await authService.signOut();
      router.navigate(['/login'], { queryParams: { error: 'access_revoked' } });
      return false;
    }
    
    // 2. Tenant Subscription and Active Check
    const tenant = tenantService.getCurrentTenant();
    if (tenant) {
       if (tenant.is_active === false) {
           console.warn(`🚫 authGuard: Tenant is suspended (is_active=false). Redirecting to login.`);
           await authService.signOut();
           router.navigate(['/login'], { queryParams: { error: 'tenant_suspended' } });
           return false;
       }
       if (['moroso', 'cancelado', 'suspendido'].includes(tenant.subscription_status || '')) {
           console.warn(`🚫 authGuard: Tenant subscription is ${tenant.subscription_status}. Redirecting to payment.`);
           router.navigate(['/payment-required']);
           return false;
       }
    }

    console.log('📋 authGuard - Context:', {
      email: userEmail,
      role: userRole,
      isSuperAdmin: authService.isSuperAdmin()
    });
    
    // Super Admin access
    if (authService.isSuperAdmin() || 
        (userProfile && (TENANT_CONSTANTS.SUPER_ADMIN_EMAILS.includes(userEmail || '') || (userRole && allowedRoles.includes(userRole))))) {
      return true;
    }
    const metaRole = authState.user?.user_metadata?.['role'] ?? authState.user?.app_metadata?.['role'];
    if (metaRole && allowedRoles.includes(metaRole)) {
      return true;
    }

    console.warn('🚫 Auth access denied for user:', userEmail);
    router.navigate(['/']);
    return false;
  } catch (error) {
    console.error('❌ Error in authGuard:', error);
    router.navigate(['/login']);
    return false;
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
    router.navigate(['/']);
    return false;
  }
  return true;
};
