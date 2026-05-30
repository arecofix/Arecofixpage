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
    // startTracking is disabled to keep sessions open indefinitely
    // this.startTracking();
  }

  public startTracking() {
    // Disabled as per user request to remove lock screen
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
