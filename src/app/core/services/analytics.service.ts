import { Injectable } from '@angular/core';
import posthog from 'posthog-js';

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {

    constructor() {
        // PostHog is initialized in main.ts before the app starts
        // This service just provides helper methods to interact with PostHog
    }

    identify(userId: string, properties: Record<string, unknown> = {}) {
        posthog.identify(userId, properties);
    }

    capture(eventName: string, properties: Record<string, unknown> = {}) {
        posthog.capture(eventName, properties);
    }

    reset() {
        posthog.reset();
    }
}
