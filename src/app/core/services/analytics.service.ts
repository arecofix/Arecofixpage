import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from '@env/environment';

let posthogInstance: any;

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
    private platformId = inject(PLATFORM_ID);
    private router = inject(Router);
    private isBrowser = isPlatformBrowser(this.platformId);
    private posthogInitialized = false;

    constructor() {
        if (this.isBrowser) {
            // Defer analytics initialization to prevent main thread blocking (Improves FCP & TBT)
            setTimeout(() => {
                this.initPostHog();
                this.initGoogleAnalytics();
                this.initMetaPixel();
            }, 3500);
            this.setupRouterTracking();
        }
    }

    private isPlaceholder(key: string | undefined | null): boolean {
        if (!key) return true;
        const normalized = key.toUpperCase();
        return normalized.includes('PLACEHOLDER') || 
               normalized.includes('YOUR_') || 
               normalized === 'TODO';
    }

    private setupRouterTracking() {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(() => {
            this.trackPageView();
        });
    }

    private async initPostHog() {
        if (environment.posthogKey && !this.isPlaceholder(environment.posthogKey)) {
            try {
                const ph = await import('posthog-js');
                posthogInstance = ph.default || ph;
                
                posthogInstance.init(environment.posthogKey as string, {
                    api_host: environment.posthogHost || 'https://us.i.posthog.com',
                    person_profiles: 'identified_only',
                    autocapture: true,
                    capture_pageview: true,
                    persistence: 'localStorage+cookie'
                });
                this.posthogInitialized = true;
            } catch (err) {
                console.warn('PostHog initialization deferred (potentially blocked by client/ad-blocker)', err);
            }
        }
    }

    private initGoogleAnalytics() {
        // GTAG initialization logic can go here if needed dynamically, 
        // but typically we target the global gtag function if loaded via index.html
        // For clean architecture, we'll keep the script loading in index.html but wrap the usage here.
    }

    private initMetaPixel() {
        // Pixel initialization - we call the global fbq if available
    }

    identify(userId: string, properties: Record<string, unknown> = {}) {
        if (this.isBrowser) {
            if (this.posthogInitialized && posthogInstance) {
                try { posthogInstance.identify(userId, properties); } catch (e) {}
            }
            if (window.gtag) {
                window.gtag('set', 'user_properties', properties);
            }
        }
    }

    capture(eventName: string, properties: Record<string, unknown> = {}) {
        if (this.isBrowser) {
            if (this.posthogInitialized && posthogInstance) {
                try { posthogInstance.capture(eventName, properties); } catch (e) {}
            }
            
            if (window.gtag) {
                window.gtag('event', eventName, properties);
            }

            if (window.fbq) {
                window.fbq('track', eventName, properties);
            }
        }
    }

    trackPageView() {
        if (this.isBrowser) {
            if (window.fbq) {
                window.fbq('track', 'PageView');
            }
            if (window.gtag) {
                window.gtag('event', 'page_view');
            }
        }
    }

    reset() {
        if (this.isBrowser) {
            if (this.posthogInitialized && posthogInstance) {
                try { posthogInstance.reset(); } catch (e) {}
            }
        }
    }

    isEnabled(): boolean {
        return this.isBrowser;
    }

    getDistinctId(): string {
        return this.isBrowser && this.posthogInitialized && posthogInstance ? posthogInstance.get_distinct_id() : '';
    }

    getSessionId(): string {
        return this.isBrowser && this.posthogInitialized && posthogInstance ? posthogInstance.get_session_id() : '';
    }
}
