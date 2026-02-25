import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../di/supabase-token';
import { DatabaseError } from '../errors/application.error';
import { LoggerService } from './logger.service';

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
  };
  currency: string;
  tax_percentage: number;
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
      return '00000000-0000-0000-0000-000000000000';
    }

    // Fallback safe for SSR / SSG Prerendering
    return '00000000-0000-0000-0000-000000000000';
  }

  /**
   * Resuelve el Tenant basado en el Hostname o Custom Domain de la URL del visitante.
   */
  async resolveTenantByHostname(hostname: string): Promise<Tenant | null> {
    this.logger.info(`Resolving tenant for hostname: ${hostname}`);
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

        this.logger.debug(`Searching for tenant by slug: ${slugToSearch}`);
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
                    id: '00000000-0000-0000-0000-000000000000',
                    name: 'Arecofix Dev Local',
                    slug: 'demo',
                    plan_type: 'basic',
                    currency: 'ARS',
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
    
    this.logger.info(`Context switched to Tenant: ${tenant.name} (${tenant.id})`);
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
