import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from '@env/environment';

type PostHogClient = {
    init: (key: string, options: Record<string, unknown>) => void;
    identify: (userId: string, properties?: Record<string, unknown>) => void;
    capture: (eventName: string, properties?: Record<string, unknown>) => void;
    reset: () => void;
    get_distinct_id: () => string;
    get_session_id: () => string;
};

let posthogInstance: PostHogClient | null = null;

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

    private async canReachPostHog(host: string): Promise<boolean> {
        if (typeof window === 'undefined' || typeof fetch === 'undefined') return false;
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);
            await fetch(`${host}/status/`, {
                method: 'HEAD',
                mode: 'no-cors',
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return true;
        } catch {
            return false;
        }
    }

    private async initPostHog() {
        if (environment.posthogKey && !this.isPlaceholder(environment.posthogKey) && window.location.hostname !== 'localhost') {
            try {
                const host = environment.posthogHost || 'https://us.i.posthog.com';
                const isReachable = await this.canReachPostHog(host);
                if (!isReachable) {
                    return;
                }

                const ph = await import('posthog-js');
                posthogInstance = (ph.default || ph) as unknown as PostHogClient;
                
                posthogInstance.init(environment.posthogKey as string, {
                    api_host: host,
                    person_profiles: 'identified_only',
                    autocapture: false,
                    capture_dead_clicks: false,
                    disable_session_recording: true,
                    advanced_disable_decide: true,
                    capture_pageview: true,
                    persistence: 'localStorage+cookie',
                    request_batching: true
                });
                this.posthogInitialized = true;
            } catch (err) {
                // PostHog blocked or failed to load - fail silently
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
