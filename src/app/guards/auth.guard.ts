/* eslint-disable */
/* tslint:disable */
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { ROLES } from '@app/core/constants/roles.constants';

export const authGuard = (async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const session = await authService.getSession();
  if (!session) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // Check if accessing admin routes
  if (state.url.startsWith('/admin')) {
    const userProfile = await authService.getUserProfile(session.user.id);

    // Pure role-based access control
    if (userProfile?.role === ROLES.ADMIN || userProfile?.role === ROLES.STAFF) {
      return true;
    }

    // If not admin or staff, redirect to home
    router.navigate(['/']);
    return false;
  }

  return true;
}) as CanActivateFn;

export const noAuthGuard = (async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const session = await authService.getSession();
  if (session) {
    router.navigate(['/']);
    return false;
  } else {
    return true;
  }
}) as CanActivateFn;
