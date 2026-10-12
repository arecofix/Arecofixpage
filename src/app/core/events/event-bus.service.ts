import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { DomainEvent } from './domain-event.interface';
import { IEventBus } from './event-bus.interface';

/**
 * In-memory RxJS EventBus implementation.
 * Enables reactive, decoupled communication between modules.
 */
@Injectable({
  providedIn: 'root',
})
export class EventBusService extends IEventBus {
  private eventStream$ = new Subject<DomainEvent<unknown>>();

  /**
   * Publishes a domain event onto the bus.
   */
  publish<T>(event: DomainEvent<T>): void {
    if (!event || !event.eventName) {
      console.warn('[EventBus] Attempted to publish an invalid event:', event);
      return;
    }
    this.eventStream$.next(event as DomainEvent<unknown>);
  }

  /**
   * Subscribes to events with the given event name.
   */
  on<T>(eventName: string): Observable<DomainEvent<T>> {
    return this.eventStream$.pipe(
      filter((e): e is DomainEvent<T> => e.eventName === eventName)
    );
  }
}
