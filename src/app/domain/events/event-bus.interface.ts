import { Subscription, Observable } from 'rxjs';
import { DomainEvent } from '@app/core/events/domain-event.interface';

/**
 * Domain Event Bus Interface (DIP - Dependency Inversion Principle)
 * Allows decoupled event publishing and subscribing across bounded contexts.
 */
export abstract class IEventBus {
  abstract publish<T>(event: T): void;
  abstract subscribe<T>(
    eventType: new (...args: any[]) => T,
    handler: (event: T) => void
  ): Subscription;

  /**
   * Compatibility hook for legacy event-name subscriptions
   */
  abstract on<T>(eventName: string): Observable<DomainEvent<T>>;
}
