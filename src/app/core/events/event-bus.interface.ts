import { Observable } from 'rxjs';
import { DomainEvent } from './domain-event.interface';

/**
 * Event Bus Abstraction (DIP - Dependency Inversion Principle)
 * Allows application services and domain use-cases to emit and subscribe to
 * events without coupling to specific implementations or modules.
 */
export abstract class IEventBus {
  abstract publish<T>(event: DomainEvent<T>): void;
  abstract on<T>(eventName: string): Observable<DomainEvent<T>>;
}
