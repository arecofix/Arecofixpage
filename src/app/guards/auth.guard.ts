import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn, CanDeactivateFn } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  private authService = inject(AuthService);
  private router = inject(Router);

  async canActivate(): Promise<boolean> {
    const session = await this.authService.getSession();
    if (!session) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return new Promise(async (resolve) => {
    const session = await authService.getSession();
    if (!session) {
      router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      resolve(false);
      return;
    }

    // Check if accessing admin routes
    if (state.url.startsWith('/admin')) {
      const userProfile = await authService.getUserProfile(session.user.id);

      // Pure role-based access control
      // Only users with 'admin' or 'staff' roles can access admin panel
      if (userProfile?.role === 'admin' || userProfile?.role === 'staff') {
        resolve(true);
        return;
      }

      // If not admin or staff, redirect to home
      router.navigate(['/']);
      resolve(false);
      return;
    }

    resolve(true);
  });
};

export const noAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return new Promise(async (resolve) => {
    const session = await authService.getSession();
    if (session) {
      router.navigate(['/']);
      resolve(false);
    } else {
      resolve(true);
    }
  });
};
