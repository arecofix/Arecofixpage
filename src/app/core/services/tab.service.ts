import { Injectable, inject } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStrategy } from '../strategies/custom-route-reuse.strategy';

export interface TabInfo {
  title: string;
  url: string;
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TabService {
  private static readonly STORAGE_KEY = 'arecofix_admin_tabs';
  private tabsSubject = new BehaviorSubject<TabInfo[]>(this.loadSavedTabs());
  public tabs$ = this.tabsSubject.asObservable();
  
  private router = inject(Router);
  private routeReuseStrategy = inject(RouteReuseStrategy) as CustomRouteReuseStrategy;

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Only track /admin routes for tabs to avoid cluttering public pages
      if (event.urlAfterRedirects.includes('/admin')) {
        this.addOrActivateTab(event.urlAfterRedirects);
      }
    });

    // If already initialized on an admin route, ensure tab is present
    setTimeout(() => {
      if (this.router.url && this.router.url.includes('/admin')) {
        this.addOrActivateTab(this.router.url);
      }
    }, 0);
  }

  private loadSavedTabs(): TabInfo[] {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        const raw = window.sessionStorage.getItem(TabService.STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch {}
    }
    return [];
  }

  private saveTabs(tabs: TabInfo[]): void {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        window.sessionStorage.setItem(TabService.STORAGE_KEY, JSON.stringify(tabs));
      } catch {}
    }
  }

  private addOrActivateTab(url: string) {
    const tabs = this.tabsSubject.value;
    
    let currentRoute = this.router.routerState.root;
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }
    
    // Attempt to get route title
    let title = currentRoute.snapshot.data['title'] || currentRoute.snapshot.routeConfig?.title || 'Pestaña';

    // Deselect all
    tabs.forEach(t => t.active = false);

    const existingTab = tabs.find(t => t.url === url);
    if (existingTab) {
      existingTab.active = true;
    } else {
      // Limit to 50 tabs for stress handling
      if (tabs.length >= 50) {
        // Remove first non-active or oldest
        tabs.shift();
      }
      tabs.push({
        title: title as string,
        url: url,
        active: true
      });
    }
    
    this.tabsSubject.next([...tabs]);
    this.saveTabs(tabs);
  }

  public closeTab(index: number) {
    const tabs = this.tabsSubject.value;
    const tabToClose = tabs[index];
    
    if (this.routeReuseStrategy && this.routeReuseStrategy.clearRouteCache) {
      // The strategy uses the route path config, but for simplicity we clear based on full path segments
      // We will just clear all for simplicity, or we can improve CustomRouteReuseStrategy to use the exact URL.
      const urlParts = tabToClose.url.split('?')[0].split('/');
      const lastPart = urlParts[urlParts.length - 1];
      if (lastPart) {
          this.routeReuseStrategy.clearRouteCache(lastPart);
      }
    }

    tabs.splice(index, 1);
    
    if (tabToClose.active) {
      if (tabs.length > 0) {
        const nextTab = tabs[tabs.length - 1];
        this.router.navigateByUrl(nextTab.url);
      } else {
        this.router.navigate(['/admin/dashboard']);
      }
    } else {
      this.tabsSubject.next([...tabs]);
    }
    this.saveTabs(tabs);
  }

  public closeAllTabs() {
    if (this.routeReuseStrategy && this.routeReuseStrategy.clearAll) {
      this.routeReuseStrategy.clearAll();
    }
    this.tabsSubject.next([]);
    this.saveTabs([]);
    this.router.navigate(['/admin/dashboard']);
  }
}
