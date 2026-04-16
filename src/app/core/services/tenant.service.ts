import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { SUPABASE_CLIENT } from '../di/supabase-token';
import { DatabaseError } from '../errors/application.error';
import { LoggerService } from './logger.service';
import { TENANT_CONSTANTS } from '../constants/tenant.constants';

/**
 * Interfaz base para un Tenant de Arecofix SaaS
 */
export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan_type: 'basic' | 'premium' | 'enterprise';
  custom_domain?: string | null;
  branding_settings: {
    logo_url?: string | null;
    favicon_url?: string | null;
    primary_color?: string;
    secondary_color?: string;
    company_name?: string;
    address?: string;
    email?: string;
    phone?: string;
    whatsapp?: string;
  };
  features?: {
    hasProducts?: boolean;
    hasServices?: boolean;
    hasCourses?: boolean;
    hasRepairs?: boolean;
    hasBlog?: boolean;
  };
  currency: string;
  usd_rate: number;
  tax_percentage: number;
  tax_id_name?: string;
  tax_id?: string;
  owner_name?: string;
  location?: string;
  contact_phone?: string;
  contact_email?: string;
  business_hours?: string;
  social_links?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private supabase = inject(SUPABASE_CLIENT);
  private logger = inject(LoggerService);
  private platformId = inject(PLATFORM_ID);

  // Signals para manejar el estado reactivo del inquilino (Angular 17+)
  private _currentTenant = signal<Tenant | null>(null);
  public currentTenant = this._currentTenant.asReadonly();
  
  private _isInitialized = signal<boolean>(false);
  public isInitialized = this._isInitialized.asReadonly();
  
  // Create observable here to capture injection context
  private _currentTenant$ = toObservable(this._currentTenant);

  /**
   * Inicializa el servicio resolviendo el tenant desde el hostname actual.
   * Útil para usar en APP_INITIALIZER.
   */
  async init(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      const hostname = window.location.hostname;
      await this.resolveTenantByHostname(hostname);
    }
  }

  /**
   * Obtiene el ID del Tenant actual de forma sincrónica. Lanza error si no está seteado en un contexto requerido.
   */
  getTenantId(): string {
    const tenant = this._currentTenant();
    if (tenant) return tenant.id;

    if (isPlatformBrowser(this.platformId)) {
      // Intenta recuperar de localStorage en entornos browser como fallback temporal si Signal cayó (ej: F5)
      const storedId = localStorage.getItem('arecofix_tenant_id');
      if (storedId) return storedId;
      
      // Fallback instead of throwing to avoid component init crash before resolveTenant finishes
      return TENANT_CONSTANTS.FALLBACK_ID;
    }

    // Fallback safe for SSR / SSG Prerendering
    return TENANT_CONSTANTS.FALLBACK_ID;
  }

  /**
   * Resuelve el Tenant basado en el Hostname o Custom Domain de la URL del visitante.
   */
  async resolveTenantByHostname(hostname: string): Promise<Tenant | null> {
    // console.debug(`Resolving tenant for hostname: ${hostname}`);
    try {
      // 1. Buscamos primero si el negocio configuró un Custom Domain (Ej: mibau.com.ar)
      let { data, error } = await this.supabase
        .from('tenants')
        .select('*')
        .eq('custom_domain', hostname)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        this.logger.error(`Database error resolving custom domain: ${error.message}`, error);
        throw new DatabaseError(error.message, error);
      }

      // 2. Si no es dominio custom, asumimos subdominio (Ej: mitienda.arecofix.com.ar)
      if (!data) {
        const extractSubdomain = hostname.split('.')[0];
        
        // En localhost o dominio principal, buscamos un tenant base
        const slugToSearch = (hostname.includes('localhost') || hostname === 'arecofix.com.ar' || hostname === 'www.arecofix.com.ar') 
          ? 'arecofix' 
          : extractSubdomain;

        // console.debug(`Searching for tenant by slug: ${slugToSearch}`);
        const { data: slugData, error: slugError } = await this.supabase
          .from('tenants')
          .select('*')
          .eq('slug', slugToSearch)
          .eq('is_active', true)
          .maybeSingle();

        if (slugError) {
           this.logger.error(`Database error resolving slug ${slugToSearch}: ${slugError.message}`, slugError);
           throw new DatabaseError(slugError.message, slugError);
        }

        if (slugData) {
            data = slugData;
        } else {
            this.logger.warn(`No tenant found for slug: ${slugToSearch}. Using fallback.`);
            // 3. Fallback de Seguridad / Desarrollo:
            const { data: fallbackData, error: fallbackError } = await this.supabase
                .from('tenants')
                .select('*')
                .limit(1)
                .maybeSingle();
            
            if (fallbackError) {
              this.logger.error('Error fetching fallback tenant', fallbackError);
            }

            if (fallbackData) {
                this.logger.info('Successfully recovered with fallback tenant', fallbackData.id);
                data = fallbackData;
            } else {
                this.logger.warn('No active tenants found in database. Loading mock tenant.');
                const defaultTenant: Tenant = {
                    id: TENANT_CONSTANTS.FALLBACK_ID,
                    name: 'Arecofix Dev Local',
                    slug: 'demo',
                    plan_type: 'basic',
                    currency: 'ARS',
                    usd_rate: 1,
                    tax_percentage: 21,
                    branding_settings: {
                        primary_color: '#3b82f6'
                    }
                };
                this.setTenant(defaultTenant);
                return defaultTenant;
            }
        }
      }

      if (data) {
        const tenant = data as Tenant;
        this.setTenant(tenant);
        return tenant;
      }

      return null;
      
    } catch (err) {
      this.logger.error('Critical failure in resolveTenantByHostname', err);
      // Ensure we always have a context even in catastrophic failure
      return null;
    }
  }

  /**
   * Seteo forzoso del Tenant (Utilizado principalmente tras Login del Admin/Owner o si resuelven su tienda)
   */
  setTenant(tenant: Tenant): void {
    this._currentTenant.set(tenant);
    this._isInitialized.set(true);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('arecofix_tenant_id', tenant.id);
      
      // Feature Útil: Aplicar Clean Code inyectando la variable CSS del color de la marca del tenant
      if (tenant.branding_settings?.primary_color) {
        document.documentElement.style.setProperty('--primary-color', tenant.branding_settings.primary_color);
      }
    }
    
    // this.logger.info(`Context switched to Tenant: ${tenant.name} (${tenant.id})`);
  }

  /**
   * Obtiene el tenant actual (Síncrono para compatibilidad)
   */
  getCurrentTenant(): Tenant | null {
    return this._currentTenant();
  }

  /**
   * Obtiene el tenant actual como Observable (para compatibilidad RxJS)
   */
  getCurrentTenant$(): Observable<Tenant | null> {
    return this._currentTenant$;
  }

  /**
   * Verifica si estamos en el tenant principal
   */
  isMainTenant(): boolean {
    const current = this._currentTenant();
    return current?.slug === 'arecofix' || 
           current?.id === TENANT_CONSTANTS.FALLBACK_ID ||
           !current;
  }

  /**
   * Verifica si estamos en una sucursal
   */
  isBranch(): boolean {
    return !this.isMainTenant();
  }

  /**
   * Verifica si coincide el hostname con los dominios principales de la plataforma
   */
  isMainDomain(): boolean {
    if (!isPlatformBrowser(this.platformId)) return true;
    const hostname = window.location.hostname;
    return hostname.includes('localhost') || 
           hostname === 'arecofix.com.ar' || 
           hostname === 'www.arecofix.com.ar' ||
           hostname.endsWith('.web.app') || // Firebase default
           hostname.endsWith('.firebaseapp.com'); // Firebase default
  }

  /**
   * Verifica si el ID coincide con el activo
   */
  isCurrentTenant(tenantId: string): boolean {
    return this._currentTenant()?.id === tenantId;
  }

  /**
   * Obtiene todas las sucursales (async para cumplimiento de guardias legacy)
   */
  getBranches(): any[] {
     const current = this._currentTenant();
     return current && !this.isMainTenant() ? [current] : [];
  }

  /**
   * Establece un tenant por ID (Async)
   */
  async setCurrentTenant(tenantId: string): Promise<void> {
    if (tenantId === 'central') {
       await this.resolveTenantByHostname('arecofix.com.ar');
       return;
    }
    
    // Si ya es el actual, no hacer nada
    if (this._currentTenant()?.id === tenantId) return;

    const { data, error } = await this.supabase
      .from('tenants')
      .select('*')
      .eq('id', tenantId)
      .maybeSingle();

    if (data) {
      this.setTenant(data as Tenant);
    }
  }

  /**
   * Busca un tenant por su slug
   */
  async getTenantBySlug(slug: string): Promise<Tenant | null> {
    const { data, error } = await this.supabase
      .from('tenants')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle();
    
    if (error) {
      this.logger.error(`Error fetching tenant by slug ${slug}: ${error.message}`);
      return null;
    }
    
    return data as Tenant;
  }

  /**
   * Limpia el contexto (Usado en el Logout Admin)
   */
  clearTenantContext(): void {
    this._currentTenant.set(null);
    this._isInitialized.set(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('arecofix_tenant_id');
      document.documentElement.style.removeProperty('--primary-color');
    }
  }
}
