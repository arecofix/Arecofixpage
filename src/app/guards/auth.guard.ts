/* eslint-disable */
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { ROLES } from '@app/core/constants/roles.constants';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const session = await authService.getSession();
  if (!session) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  const userProfile = await authService.getUserProfile(session.user.id);

  // Pure role-based access control
  const allowedRoles: string[] = [
    ROLES.ADMIN, 
    ROLES.STAFF, 
    ROLES.SUPER_ADMIN, 
    ROLES.TENANT_OWNER, 
    ROLES.TECHNICIAN
  ];

  if (userProfile?.role && allowedRoles.includes(userProfile.role)) {
    return true;
  }

  // If not admin or staff, redirect to home
  router.navigate(['/']);
  return false;
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
