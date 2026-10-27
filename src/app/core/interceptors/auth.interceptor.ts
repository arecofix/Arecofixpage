import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
  HttpContextToken,
} from '@angular/common/http';
import { inject, PLATFORM_ID, Injectable } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, Subject, from, throwError } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { LoggerService } from '../services/logger.service';
import { environment } from '../../../environments/environment';

/**
 * Context token to prevent infinite retry loops on requests that have already been retried once after 401.
 */
export const IS_RETRY_REQUEST = new HttpContextToken<boolean>(() => false);
export const BYPASS_AUTH = new HttpContextToken<boolean>(() => false);

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorHandler {
  private isRefreshing = false;
  private refreshSubject: Subject<string> | null = null;
  private authService = inject(AuthService);
  private router = inject(Router);
  private logger = inject(LoggerService);
  private platformId = inject(PLATFORM_ID);

  handle401(
    req: HttpRequest<unknown>,
    next: HttpHandlerFn,
    originalError: HttpErrorResponse
  ): Observable<HttpEvent<unknown>> {
    // 1. Guard against SSR
    if (!isPlatformBrowser(this.platformId)) {
      return throwError(() => originalError);
    }

    // 2. Prevent infinite loops: check only HttpContextToken
    if (req.context.get(IS_RETRY_REQUEST)) {
      this.logger.warn(`[AuthInterceptor] 401 persistente tras reintento en ${req.url}. Cerrando sesión.`);
      this.logoutAndRedirect();
      return throwError(() => originalError);
    }

    // 3. Do not attempt to refresh on auth endpoints (login, refresh, signup)
    if (this.isAuthEndpoint(req.url)) {
      return throwError(() => originalError);
    }

    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshSubject = new Subject<string>();

      return from(this.authService.refreshSession()).pipe(
        switchMap((session) => {
          const newAccessToken = session?.access_token;

          if (!newAccessToken) {
            this.logger.error('[AuthInterceptor] Refresh token expirado o sesión inválida.');
            const refreshErr = new Error('Refresh token expirado o sesión inválida');
            this.refreshSubject?.error(refreshErr);
            this.refreshSubject = null;
            this.isRefreshing = false;
            this.logoutAndRedirect();
            return throwError(() => originalError);
          }

          this.refreshSubject?.next(newAccessToken);
          this.refreshSubject?.complete();
          this.refreshSubject = null;
          this.isRefreshing = false;
          return next(this.cloneWithToken(req, newAccessToken));
        }),
        catchError((refreshErr) => {
          this.refreshSubject?.error(refreshErr);
          this.refreshSubject = null;
          this.isRefreshing = false;
          this.logger.error('[AuthInterceptor] Falló el refresco de sesión:', refreshErr);
          this.logoutAndRedirect();
          return throwError(() => (refreshErr instanceof HttpErrorResponse ? refreshErr : originalError));
        })
      );
    } else {
      // Refresh already in flight: queue other concurrent requests and await new token.
      // If refresh fails, refreshSubject emits error and requests are immediately rejected without waiting 10s.
      if (!this.refreshSubject) {
        return throwError(() => originalError);
      }
      return this.refreshSubject.pipe(
        take(1),
        switchMap((token) => {
          return next(this.cloneWithToken(req, token));
        }),
        catchError(() => {
          return throwError(() => originalError);
        })
      );
    }
  }

  cloneWithToken(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
      context: req.context.set(IS_RETRY_REQUEST, true),
    });
  }

  isProtectedApi(url: string): boolean {
    if (this.isAuthEndpoint(url)) return false;

    let pathname = url;
    try {
      if (url.startsWith('http://') || url.startsWith('https://')) {
        const parsed = new URL(url);
        // Only internal / same-origin APIs using environment.allowedApiHosts
        const allowedHosts = environment.allowedApiHosts || [
          'arecofix.com.ar',
          'www.arecofix.com.ar',
          'staging.arecofix.com.ar',
          'localhost',
          '127.0.0.1'
        ];

        const isAllowedHost =
          (typeof window !== 'undefined' && parsed.origin === window.location.origin) ||
          allowedHosts.includes(parsed.hostname);

        if (!isAllowedHost) {
          return false;
        }
        pathname = parsed.pathname;
      }
    } catch {
      // Fallback to evaluating raw url string
    }

    return (
      pathname.startsWith('/api/') ||
      pathname.includes('/api/admin/') ||
      pathname.includes('/api/academy/') ||
      pathname.includes('/api/services/') ||
      pathname.includes('/api/orders/')
    );
  }

  isAuthEndpoint(url: string): boolean {
    return (
      url.includes('/auth/v1/token') ||
      url.includes('grant_type=refresh_token') ||
      url.includes('/auth/v1/recover') ||
      url.includes('/auth/v1/signup') ||
      url.includes('/auth/v1/verify') ||
      url.includes('/api/public/') ||
      url.includes('/login')
    );
  }

  logoutAndRedirect(): void {
    this.authService.signOut().catch(() => {});
    if (typeof window !== 'undefined') {
      const currentUrl = this.router.url || window.location.pathname;
      const isAuthPage = currentUrl.startsWith('/login') || currentUrl.startsWith('/register');
      if (!isAuthPage) {
        this.router.navigate(['/login'], {
          queryParams: { returnUrl: currentUrl },
        });
      }
    }
  }
}

/**
 * Functional HTTP Interceptor for JWT Bearer Authentication and 401 Refresh Handling.
 *
 * Uses getAccessToken() (async) so that even if the interceptor fires before AuthService
 * has finished initializing (i.e. authState.isInitialized is still false), it still waits
 * for the Supabase getSession() to complete before attaching the Bearer token.
 * This eliminates the startup race condition that caused 401s on the first dashboard load.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const handler = inject(AuthInterceptorHandler);
  const authService = inject(AuthService);

  if (req.context.get(BYPASS_AUTH) || !handler.isProtectedApi(req.url)) {
    return next(req);
  }

  // If Authorization header is already set by the caller, skip token injection.
  if (req.headers.has('Authorization')) {
    return next(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && handler.isProtectedApi(req.url)) {
          return handler.handle401(req, next, error);
        }
        return throwError(() => error);
      })
    );
  }

  // Fast path: authState already has a valid session token — use it synchronously to avoid
  // any observable chain overhead on hot paths (most requests after initial load).
  const syncToken = authService.getStoredAccessToken();
  if (syncToken) {
    const authenticatedReq = req.clone({
      setHeaders: { Authorization: `Bearer ${syncToken}` },
    });
    return next(authenticatedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && handler.isProtectedApi(authenticatedReq.url)) {
          return handler.handle401(authenticatedReq, next, error);
        }
        return throwError(() => error);
      })
    );
  }

  // Slow path: authState is not yet hydrated (app just loaded). Await getAccessToken()
  // which internally calls waitForAuth() and then getSession() to recover the token
  // even if authState BehaviorSubject hasn't emitted yet.
  return from(authService.getAccessToken()).pipe(
    switchMap((token) => {
      const authenticatedReq = token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;
      return next(authenticatedReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401 && handler.isProtectedApi(authenticatedReq.url)) {
            return handler.handle401(authenticatedReq, next, error);
          }
          return throwError(() => error);
        })
      );
    })
  );
};
