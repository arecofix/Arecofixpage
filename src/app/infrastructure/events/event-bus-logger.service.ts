import { Injectable, isDevMode } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EventBusLoggerService {
  logEvent(eventName: string, payload: unknown): void {
    if (isDevMode()) {
      console.log(`[EventBusLogger] [${new Date().toISOString()}] ${eventName}:`, payload);
    }
  }

  logError(eventName: string, error: unknown): void {
    console.error(`[EventBusLogger] Error processing ${eventName}:`, error);
  }
}
