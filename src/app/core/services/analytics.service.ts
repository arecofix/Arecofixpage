import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from '@env/environment';
import posthog from 'posthog-js';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAnalytics, logEvent, setUserId, setUserProperties } from 'firebase/analytics';

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
    private platformId = inject(PLATFORM_ID);
    private router = inject(Router);
    private isBrowser = isPlatformBrowser(this.platformId);
    private firebaseApp: any;
    private firebaseAnalytics: any;

    constructor() {
        if (this.isBrowser) {
            this.initPostHog();
            this.initFirebase();
            this.initGoogleAnalytics();
            this.initMetaPixel();
            this.setupRouterTracking();
        }
    }

    private setupRouterTracking() {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(() => {
            this.trackPageView();
        });
    }

    private initPostHog() {
        if (environment.posthogKey && environment.posthogKey.indexOf('PLACEHOLDER') === -1) {
            try {
                posthog.init(environment.posthogKey as string, {
                    api_host: environment.posthogHost || 'https://us.i.posthog.com',
                    person_profiles: 'identified_only',
                    autocapture: true,
                    capture_pageview: true,
                    persistence: 'localStorage+cookie'
                });
            } catch (err) {
                console.error('PostHog initialization failed', err);
            }
        }
    }

    private initFirebase() {
        if (environment.firebase?.apiKey) {
            try {
                this.firebaseApp = !getApps().length ? initializeApp(environment.firebase) : getApp();
                if (environment.firebase.measurementId) {
                    this.firebaseAnalytics = getAnalytics(this.firebaseApp);
                }
            } catch (err) {
                console.error('Firebase initialization failed', err);
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
            if (environment.posthogKey) posthog.identify(userId, properties);
            if (this.firebaseAnalytics) {
                setUserId(this.firebaseAnalytics, userId);
                setUserProperties(this.firebaseAnalytics, properties);
            }
            if ((window as any).gtag) {
                (window as any).gtag('set', 'user_properties', properties);
            }
        }
    }

    capture(eventName: string, properties: Record<string, unknown> = {}) {
        if (this.isBrowser) {
            if (environment.posthogKey) posthog.capture(eventName, properties);
            
            if (this.firebaseAnalytics) {
                logEvent(this.firebaseAnalytics, eventName, properties);
            }
            
            if ((window as any).gtag) {
                (window as any).gtag('event', eventName, properties);
            }

            if ((window as any).fbq) {
                (window as any).fbq('track', eventName, properties);
            }
        }
    }

    trackPageView() {
        if (this.isBrowser) {
            if ((window as any).fbq) {
                (window as any).fbq('track', 'PageView');
            }
            if ((window as any).gtag) {
                (window as any).gtag('event', 'page_view');
            }
        }
    }

    reset() {
        if (this.isBrowser) {
            if (environment.posthogKey) posthog.reset();
            if (this.firebaseAnalytics) {
                setUserId(this.firebaseAnalytics, null);
            }
        }
    }

    isEnabled(): boolean {
        return this.isBrowser;
    }

    getDistinctId(): string {
        return this.isBrowser ? posthog.get_distinct_id() : '';
    }

    getSessionId(): string {
        return this.isBrowser ? posthog.get_session_id() : '';
    }
}
