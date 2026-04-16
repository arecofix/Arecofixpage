import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';

/**
 * Simple guard that only requires the user to be authenticated, 
 * regardless of their specific role.
 */
export const authenticatedGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  try {
    const session = await authService.getSession();
    
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
