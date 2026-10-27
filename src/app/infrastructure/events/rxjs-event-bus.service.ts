import { Injectable, isDevMode } from '@angular/core';
import { Subject, Subscription, Observable } from 'rxjs';
import { filter, map, share } from 'rxjs/operators';
import { IEventBus } from '../../domain/events/event-bus.interface';
import { DomainEvent } from '@app/core/events/domain-event.interface';

/**
 * Singleton in-memory RxJS EventBus implementation.
 * Provides decoupled, error-isolated domain event dispatching.
 */
@Injectable({ providedIn: 'root' })
export class RxjsEventBusService extends IEventBus {
  private readonly eventSubject = new Subject<unknown>();
  private readonly eventStream$ = this.eventSubject.asObservable().pipe(share());

  /**
   * Publishes a domain event to all active subscribers.
   */
  publish<T>(event: T): void {
    if (!event) return;

    if (isDevMode()) {
      const eventName = (event as { constructor?: { name?: string } })?.constructor?.name ?? typeof event;
      console.debug(`[EventBus] Published: ${eventName}`, event);
    }

    this.eventSubject.next(event);
  }

  /**
   * Subscribes a handler to a specific domain event class type.
   * Completely isolates subscriber execution errors so that one faulty subscriber
   * never interrupts other subscribers or the event stream.
   */
  subscribe<T>(
    eventType: new (...args: any[]) => T,
    handler: (event: T) => void,
  ): Subscription {
    return this.eventStream$
      .pipe(
        filter((event): event is T => {
          if (event instanceof eventType) return true;
          const ctorName = (event as { constructor?: { name?: string } })?.constructor?.name;
          if (ctorName && ctorName === eventType.name) return true;
          const eventName = (event as { eventName?: string })?.eventName;
          return Boolean(eventName && eventName === eventType.name);
        }),
      )
      .subscribe({
        next: (event: T) => {
          try {
            const result: unknown = handler(event);
            if (result && typeof (result as { catch?: unknown }).catch === 'function') {
              (result as Promise<unknown>).catch((err: unknown) => {
                console.error(`[EventBus] Async error in handler for ${eventType.name}:`, err);
              });
            }
          } catch (err) {
            console.error(`[EventBus] Error in handler for ${eventType.name}:`, err);
          }
        },
        error: (err: unknown) => {
          console.error(`[EventBus] Stream error for ${eventType.name}:`, err);
        },
      });
  }

  /**
   * Backward-compatibility hook for string-based event subscriptions
   */
  override on<T>(eventName: string): Observable<DomainEvent<T>> {
    return this.eventStream$.pipe(
      filter((e: unknown) => {
        const item = e as { eventName?: string; constructor?: { name?: string } };
        return item?.eventName === eventName || item?.constructor?.name === eventName;
      }),
      map((e: unknown) => {
        const domainEvt = e as DomainEvent<T>;
        if (domainEvt && typeof domainEvt === 'object' && 'payload' in domainEvt) {
          return domainEvt;
        }
        return {
          eventName,
          occurredAt: new Date().toISOString(),
          payload: e as T,
        };
      })
    );
  }
}
