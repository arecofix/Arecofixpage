/* eslint-disable */
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { ROLES } from '@app/core/constants/roles.constants';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  try {
    const session = await authService.getSession();
    if (!session) {
      router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    // Pure role-based access control
    const allowedRoles: string[] = [
      ROLES.ADMIN, 
      ROLES.STAFF, 
      ROLES.SUPER_ADMIN, 
      ROLES.TENANT_OWNER, 
      ROLES.TECHNICIAN
    ];

    // 1. Primary: check role from the profiles table
    const userProfile = await authService.getUserProfile(session.user.id);
    if (userProfile?.role && allowedRoles.includes(userProfile.role)) {
      return true;
    }

    // 2. Fallback: check Supabase auth metadata (useful when profile row doesn't exist yet)
    const authUser = await authService.getUser();
    const metaRole = authUser?.user_metadata?.['role'] ?? authUser?.app_metadata?.['role'];
    if (metaRole && allowedRoles.includes(metaRole)) {
      return true;
    }

    // 3. Not authorized
    router.navigate(['/']);
    return false;
  } catch {
    // Safety net: redirect to login on unexpected errors
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
};

export const noAuthGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const session = await authService.getSession();
  if (session) {
    router.navigate(['/']);
    return false;
  }
  return true;
};
