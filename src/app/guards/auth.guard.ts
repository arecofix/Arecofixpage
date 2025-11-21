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
      
      // Allow specific email addresses regardless of role
      const allowedEmails = [
        'ezequielenrico15@gmail.com',
        'Ezequielenrico1015@hotmail.com'
      ];
      
      if (allowedEmails.includes(session.user.email?.toLowerCase() || '')) {
        resolve(true);
        return;
      }
      
      // Check if user has admin role
      if (userProfile?.role === 'admin') {
        resolve(true);
        return;
      }
      
      // If not admin or allowed email, redirect to home
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
