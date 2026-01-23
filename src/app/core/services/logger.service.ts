import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

/**
 * Logger Service
 * Replaces console.log with environment-aware logging
 * Only logs in development mode
 */
@Injectable({
    providedIn: 'root'
})
export class LoggerService {
    private readonly isProduction = environment.production;

    /**
     * Log debug information (only in development)
     */
    debug(message: string, data?: unknown): void {
        if (!this.isProduction) {
            console.log(`[DEBUG] ${message}`, data || '');
        }
    }

    /**
     * Log informational messages
     */
    info(message: string, data?: unknown): void {
        if (!this.isProduction) {
            console.info(`[INFO] ${message}`, data || '');
        }
    }

    /**
     * Log warnings (shown in all environments)
     */
    warn(message: string, data?: unknown): void {
        console.warn(`[WARN] ${message}`, data || '');
    }

    /**
     * Log errors (shown in all environments)
     */
    error(message: string, error?: unknown): void {
        console.error(`[ERROR] ${message}`, error || '');

        // In production, you might want to send errors to a monitoring service
        if (this.isProduction) {
            this.sendToMonitoring(message, error);
        }
    }

    /**
     * Send errors to monitoring service (PostHog, Sentry, etc.)
     */
    private sendToMonitoring(message: string, error: unknown): void {
        // Implement error monitoring integration (e.g., Sentry, Bugsnag)
        // For now, errors are only logged to the console via console.error in production.
    }

    /**
     * Log performance metrics
     */
    performance(label: string, duration: number): void {
        if (!this.isProduction) {
            console.log(`[PERF] ${label}: ${duration}ms`);
        }
    }

    /**
     * Create a performance timer
     */
    startTimer(label: string): () => void {
        const start = performance.now();
        return () => {
            const duration = performance.now() - start;
            this.performance(label, duration);
        };
    }
}
