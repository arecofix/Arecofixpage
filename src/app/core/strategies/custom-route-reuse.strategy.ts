import { Injectable } from '@angular/core';
import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  private handlers: { [key: string]: DetachedRouteHandle } = {};

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // Only cache routes that explicitly have reuse: true in route data
    // Or cache all /admin routes if we want a global tab system
    // Let's rely on route data 'reuse' flag or a 'tabName' property.
    return !!route.data && (route.data['reuse'] === true || !!route.data['tabName']);
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    const path = this.getRoutePath(route);
    if (!path) return;
    
    if (handle) {
      this.handlers[path] = handle;
    } else {
      delete this.handlers[path];
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const path = this.getRoutePath(route);
    return !!path && !!this.handlers[path];
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const path = this.getRoutePath(route);
    if (!path) return null;
    return this.handlers[path] || null;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    // Basic route reuse condition
    return future.routeConfig === curr.routeConfig;
  }

  private getRoutePath(route: ActivatedRouteSnapshot): string {
    // Build a unique path key
    // Including params ensures /admin/sales/1 and /admin/sales/2 are cached separately if needed
    let path = route.routeConfig ? route.routeConfig.path || '' : '';
    let current = route;
    while (current.firstChild) {
        current = current.firstChild;
        if (current.routeConfig && current.routeConfig.path) {
            path += '/' + current.routeConfig.path;
        }
    }
    // Simplification for our tabs: use the full URL path from the router (if we could access it).
    // But inside the strategy, we construct it:
    return path;
  }

  // Method to clear a specific route cache when a tab is explicitly closed
  public clearRouteCache(pathSegment: string): void {
    const keys = Object.keys(this.handlers);
    for (const key of keys) {
      if (key.includes(pathSegment)) {
        // Destroy component ref if possible
        const handle = this.handlers[key] as any;
        if (handle && handle.componentRef && handle.componentRef.destroy) {
          handle.componentRef.destroy();
        }
        delete this.handlers[key];
      }
    }
  }

  public clearAll(): void {
    const keys = Object.keys(this.handlers);
    for (const key of keys) {
        const handle = this.handlers[key] as any;
        if (handle && handle.componentRef && handle.componentRef.destroy) {
            handle.componentRef.destroy();
        }
    }
    this.handlers = {};
  }
}
