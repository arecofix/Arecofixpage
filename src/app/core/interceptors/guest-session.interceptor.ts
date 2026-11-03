import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { getOrCreateGuestSessionId } from '../utils/uuid.utils';

/**
 * Attaches the persistent x-guest-session UUID header to all requests
 * targeting Supabase PostgREST (/rest/v1/) and backend Express (/api/).
 * This allows RLS and backend services to isolate guest carts and anonymous interactions safely.
 */
export const guestSessionInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return next(req);
  }

  const sessionId = getOrCreateGuestSessionId();
  if (!sessionId) {
    return next(req);
  }

  // Only attach header to transactional guest orders or order_items
  const isOrders = req.url.includes('/rest/v1/orders') || req.url.includes('/rest/v1/order_items');
  if (isOrders && !req.headers.has('x-guest-session')) {
    const cloned = req.clone({
      setHeaders: {
        'x-guest-session': sessionId,
      },
    });
    return next(cloned);
  }

  return next(req);
};
