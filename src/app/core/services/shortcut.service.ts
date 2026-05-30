import { Injectable, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject, Observable } from 'rxjs';

export enum AppShortcut {
  SEARCH_PRODUCT = 'SEARCH_PRODUCT', // F3
  CHECKOUT = 'CHECKOUT', // F12
  OPEN_MOVEMENTS = 'OPEN_MOVEMENTS', // Ctrl + B
  NEW_TICKET = 'NEW_TICKET', // Ctrl + N
}

@Injectable({
  providedIn: 'root'
})
export class ShortcutService implements OnDestroy {
  private shortcutSubject = new Subject<AppShortcut>();
  public shortcut$: Observable<AppShortcut> = this.shortcutSubject.asObservable();
  
  private keydownListener!: (e: KeyboardEvent) => void;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.initShortcuts();
    }
  }

  private initShortcuts() {
    this.keydownListener = (e: KeyboardEvent) => {
      // F3
      if (e.key === 'F3') {
        e.preventDefault();
        this.shortcutSubject.next(AppShortcut.SEARCH_PRODUCT);
      }
      
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
        this.shortcutSubject.next(AppShortcut.CHECKOUT);
      }
      
      // Ctrl + B
      if (e.ctrlKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        this.shortcutSubject.next(AppShortcut.OPEN_MOVEMENTS);
      }

      // Ctrl + N
      if (e.ctrlKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        this.shortcutSubject.next(AppShortcut.NEW_TICKET);
      }
    };

    window.addEventListener('keydown', this.keydownListener);
  }

  ngOnDestroy() {
    if (this.isBrowser && this.keydownListener) {
      window.removeEventListener('keydown', this.keydownListener);
    }
  }
}
