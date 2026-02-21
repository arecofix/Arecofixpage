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
        // Safe stub since analytics was stripped
    }

    capture(eventName: string, properties: Record<string, unknown> = {}) {
        // Safe stub since analytics was stripped
    }

    reset() {
        // Safe stub since analytics was stripped
    }
}
