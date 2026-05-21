import { Injectable, inject, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NavigationStateService {
  private router = inject(Router);
  private readonly _isMobileMenuOpen = signal<boolean>(false);
  
  /** Read-only state signal exposed to components */
  public readonly isMobileMenuOpen = this._isMobileMenuOpen.asReadonly();

  constructor() {
    // Automatically close the mobile menu on any successful routing transition
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        this.closeMobileMenu();
      });
  }

  public openMobileMenu(): void {
    this._isMobileMenuOpen.set(true);
  }

  public closeMobileMenu(): void {
    this._isMobileMenuOpen.set(false);
  }

  public toggleMobileMenu(): void {
    this._isMobileMenuOpen.update(open => !open);
  }
}
