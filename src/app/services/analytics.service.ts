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

    identify(userId: string, properties: any = {}) {
        posthog.identify(userId, properties);
    }

    capture(eventName: string, properties: any = {}) {
        posthog.capture(eventName, properties);
    }

    reset() {
        posthog.reset();
    }
}
