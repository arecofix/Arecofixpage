import { Injectable, inject, signal, Injector } from '@angular/core';
import { SUPABASE_CLIENT } from '../di/supabase-token';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private supabase = inject(SUPABASE_CLIENT);
  private injector = inject(Injector);
  
  // Cache of permissions for the current user
  private permissionsCache = signal<Set<string>>(new Set());
  private loaded = signal<boolean>(false);
  private loadInFlight: Promise<void> | null = null;

  constructor() { }

  /**
   * Loads the atomic permissions for the current user from the database.
   * This calls the UDF `get_my_permissions()`.
   */
  async loadPermissions(force = false): Promise<void> {
    if (!force && this.loaded()) {
      return;
    }
    if (this.loadInFlight) {
      return this.loadInFlight;
    }

    this.loadInFlight = (async () => {
      try {
        const { data, error } = await this.supabase.rpc('get_my_permissions');
        if (error) {
          console.error('Error fetching permissions:', error);
          this.permissionsCache.set(new Set());
          return;
        }
        
        const permSet = new Set<string>();
        if (data && Array.isArray(data)) {
          data.forEach(p => {
            if (p && p.permission) {
              permSet.add(p.permission);
            }
          });
        }
        this.permissionsCache.set(permSet);
        this.loaded.set(true);
      } catch (err) {
        console.error('Unexpected error loading permissions', err);
        this.permissionsCache.set(new Set());
      } finally {
        this.loadInFlight = null;
      }
    })();

    return this.loadInFlight;
  }

  /**
   * Checks if the user has a specific permission.
   * Note: This checks the cached permissions. `loadPermissions()` must be called upon login.
   */
  hasPermission(permission: string): boolean {
    try {
      const auth = this.injector.get(AuthService);
      if (auth.isSuperAdmin() || auth.getCurrentProfile()?.role === 'super_admin') {
        return true;
      }
    } catch {}

    if (!this.loaded()) {
      console.warn(`Permission checked before loaded: ${permission}`);
    }
    return this.permissionsCache().has(permission);
  }

  /**
   * Clears the permission cache (e.g. on logout)
   */
  clear(): void {
    this.permissionsCache.set(new Set());
    this.loaded.set(false);
  }
  
  isLoaded(): boolean {
    return this.loaded();
  }

  isLoadedSignal() {
    return this.loaded();
  }
}
