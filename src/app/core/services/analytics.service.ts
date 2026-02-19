import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
    private platformId = inject(PLATFORM_ID);

    constructor() {
        // PostHog is initialized in main.ts before the app starts (Browser Only)
    }

    identify(userId: string, properties: Record<string, unknown> = {}) {
        if (isPlatformBrowser(this.platformId)) {
            import('posthog-js').then(posthog => {
                posthog.default.identify(userId, properties);
            });
        }
    }

    capture(eventName: string, properties: Record<string, unknown> = {}) {
        if (isPlatformBrowser(this.platformId)) {
            import('posthog-js').then(posthog => {
                posthog.default.capture(eventName, properties);
            });
        }
    }

    reset() {
        if (isPlatformBrowser(this.platformId)) {
            import('posthog-js').then(posthog => {
                posthog.default.reset();
            });
        }
    }
}
