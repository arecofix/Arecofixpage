import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';

export const tauriRootRedirectGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);

  // During SSR/prerendering, window is not available — skip Tauri detection
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const isTauri = !!(
    (window as any).__TAURI_INTERNALS__ || 
    (window as any).__TAURI_IPC__ || 
    (window as any).__TAURI__ || 
    window.location.protocol === 'tauri:' || 
    window.location.hostname === 'tauri.localhost'
  );
  
  if (isTauri) {
    const router = inject(Router);
    return router.parseUrl('/admin');
  }
  
  return true;
};
