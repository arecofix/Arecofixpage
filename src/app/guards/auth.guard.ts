/* eslint-disable */
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { ROLES } from '@app/core/constants/roles.constants';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('🔍 authGuard - Checking access for:', state.url);

  try {
    const session = await authService.getSession();
    if (!session) {
      console.warn('🚫 authGuard: No session found, redirecting to login');
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
    const userRole = userProfile?.role;
    const userEmail = userProfile?.email;
    
    console.log('📋 authGuard - User profile:', {
      email: userEmail,
      role: userRole,
      tenantId: userProfile?.tenant_id,
      isSuperAdmin: authService.isSuperAdmin()
    });
    
    // Super Admin por email o señal tiene acceso global
    if (authService.isSuperAdmin() || 
        userEmail === 'ezequielenrico15@gmail.com' || 
        (userRole && allowedRoles.includes(userRole))) {
      console.log('🔓 Auth access granted for user:', userEmail, 'role:', userRole);
      return true;
    }

    // 2. Fallback: check Supabase auth metadata (useful when profile row doesn't exist yet)
    const authUser = await authService.getUser();
    const metaRole = authUser?.user_metadata?.['role'] ?? authUser?.app_metadata?.['role'];
    if (metaRole && allowedRoles.includes(metaRole)) {
      console.log('🔓 Auth access granted via metadata for user:', authUser?.email);
      return true;
    }

    // 3. Not authorized
    console.warn('🚫 Auth access denied for user:', userEmail, 'role:', userRole);
    router.navigate(['/']);
    return false;
  } catch (error) {
    console.error('❌ Error in authGuard:', error);
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
