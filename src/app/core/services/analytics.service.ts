import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '@env/environment';
import posthog from 'posthog-js';

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
    private platformId = inject(PLATFORM_ID);
    private isBrowser = isPlatformBrowser(this.platformId);

    constructor() {
        if (this.isBrowser && environment.posthogKey) {
            posthog.init(environment.posthogKey, {
                api_host: environment.posthogHost || 'https://us.i.posthog.com',
                person_profiles: 'identified_only', // or 'always' depending on preference
                loaded: (ph) => {
                    if (environment.production) ph.debug(false);
                }
            });
        }
    }

    identify(userId: string, properties: Record<string, unknown> = {}) {
        if (this.isBrowser && environment.posthogKey) {
            posthog.identify(userId, properties);
        }
    }

    capture(eventName: string, properties: Record<string, unknown> = {}) {
        if (this.isBrowser && environment.posthogKey) {
            posthog.capture(eventName, properties);
        }
    }

    reset() {
        if (this.isBrowser && environment.posthogKey) {
            posthog.reset();
        }
    }

    isEnabled(): boolean {
        return this.isBrowser && !!environment.posthogKey && environment.posthogKey.indexOf('PLACEHOLDER') === -1;
    }

    getDistinctId(): string {
        return this.isBrowser ? posthog.get_distinct_id() : '';
    }

    getSessionId(): string {
        return this.isBrowser ? posthog.get_session_id() : '';
    }
}
