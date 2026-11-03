import { Injectable } from '@angular/core';
import { RxjsEventBusService } from '../../infrastructure/events/rxjs-event-bus.service';

/**
 * Backward-compatible EventBusService alias extending RxjsEventBusService.
 */
@Injectable({
  providedIn: 'root',
})
export class EventBusService extends RxjsEventBusService {}
