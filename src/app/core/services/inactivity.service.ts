import { Injectable, NgZone, inject } from '@angular/core';
import { BehaviorSubject, fromEvent, merge, Subscription, timer, of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InactivityService {
  // Default to 60 minutes
  private readonly TIMEOUT_MS = 60 * 60 * 1000; 
  
  private isLockedSubject = new BehaviorSubject<boolean>(false);
  public isLocked$ = this.isLockedSubject.asObservable();
  
  private activitySubscription?: Subscription;
  private ngZone = inject(NgZone);

  constructor() {
    this.startTracking();
  }

  public startTracking() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    // Run tracking outside Angular zone to prevent excessive change detection triggers
    this.ngZone.runOutsideAngular(() => {
      const activityEvents$ = merge(
        fromEvent(document, 'mousemove'),
        fromEvent(document, 'keydown'),
        fromEvent(document, 'click'),
        fromEvent(document, 'touchstart'),
        fromEvent(document, 'scroll')
      ).pipe(
        // Throttle high-frequency events to avoid resetting the observable too rapidly
        debounceTime(500)
      );

      // We merge `of(null)` so the timer starts counting down immediately upon tracking
      const activityOrInitial$ = merge(of(null), activityEvents$);

      this.activitySubscription = activityOrInitial$.pipe(
        switchMap(() => timer(this.TIMEOUT_MS))
      ).subscribe(() => {
        // Once timer completes (meaning no activity occurred to switchMap and cancel it), we lock
        if (!this.isLockedSubject.value) {
          this.ngZone.run(() => {
            this.lock();
          });
        }
      });
    });
  }

  public lock() {
    this.isLockedSubject.next(true);
  }

  public unlock() {
    this.isLockedSubject.next(false);
  }

  public stopTracking() {
    if (this.activitySubscription) {
      this.activitySubscription.unsubscribe();
    }
  }
}
