/**
 * Generic Domain Event interface for Clean Architecture & Tactical DDD
 */
export interface DomainEvent<T = unknown> {
  readonly eventName: string;
  readonly occurredAt: string;
  readonly payload: T;
}
