import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, switchMap, tap, catchError, finalize } from 'rxjs/operators';
import { SupabaseService } from '@app/core/services/supabase.service';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  isMain: boolean;
  branding: {
    logo?: string;
    favicon?: string;
    primaryColor: string;
    secondaryColor: string;
    companyName: string;
    contactInfo: {
      phone: string;
      email: string;
      address: string;
      whatsapp: string;
    };
  };
  features: {
    hasProducts: boolean;
    hasServices: boolean;
    hasCourses: boolean;
    hasRepairs: boolean;
    hasBlog: boolean;
  };
  database: {
    schema: string;
    isolationLevel: 'complete' | 'partial';
  };
}

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private router = inject(Router);
  private supabase = inject(SupabaseService);
  private currentTenantSubject = new BehaviorSubject<Tenant | null>(null);
  public currentTenant$: Observable<Tenant | null> = this.currentTenantSubject.asObservable();
  
  private tenants: Map<string, Tenant> = new Map();

  constructor() {
    this.initializeTenants();
    this.detectCurrentTenant();
  }

  /**
   * Inicializa los tenants disponibles
   */
  private initializeTenants(): void {
    // Tenant principal (Arecofix Central)
    this.tenants.set('central', {
      id: 'central',
      name: 'Arecofix',
      slug: '',
      isMain: true,
      branding: {
        logo: 'assets/img/branding/logo/logo-normal1.PNG',
        favicon: 'assets/img/branding/favicon/favicon.ico',
        primaryColor: '#1f2136',
        secondaryColor: '#3b82f6',
        companyName: 'Arecofix Soluciones Informáticas',
        contactInfo: {
          phone: '01123456789',
          email: 'info@arecofix.com.ar',
          address: 'Marcos Paz, Buenos Aires',
          whatsapp: '5491123456789'
        }
      },
      features: {
        hasProducts: true,
        hasServices: true,
        hasCourses: true,
        hasRepairs: true,
        hasBlog: true
      },
      database: {
        schema: 'public',
        isolationLevel: 'complete'
      }
    });

    // Tenant Zona Norte (Sudamericana Enlozados)
    this.tenants.set('zona-norte', {
      id: 'zona-norte',
      name: 'Sudamericana Enlozados',
      slug: 'Zona-Norte',
      isMain: false,
      branding: {
        logo: 'assets/img/branches/zona-norte/logo.png',
        favicon: 'assets/img/branches/zona-norte/favicon.ico',
        primaryColor: '#1e40af',
        secondaryColor: '#3b82f6',
        companyName: 'Sudamericana Enlozados',
        contactInfo: {
          phone: '(011) 15-6304-9494',
          email: 'enlosud@hotmail.com',
          address: 'Beazley 3735 - Pompeya CABA',
          whatsapp: '5491563049494'
        }
      },
      features: {
        hasProducts: true,
        hasServices: true,
        hasCourses: false,
        hasRepairs: false,
        hasBlog: false
      },
      database: {
        schema: 'zona_norte',
        isolationLevel: 'complete'
      }
    });
  }

  /**
   * Detecta el tenant actual basado en la URL
   */
  private detectCurrentTenant(): void {
    const path = window.location.pathname;
    const slug = path.split('/')[1]; // Obtiene el primer segmento de la URL
    
    if (slug && this.tenants.has(slug)) {
      this.setCurrentTenant(slug);
    } else {
      // Si no hay slug o no coincide, usa el tenant principal
      this.setCurrentTenant('central');
    }
  }

  /**
   * Establece el tenant actual
   */
  setCurrentTenant(tenantId: string): void {
    const tenant = this.tenants.get(tenantId);
    if (tenant) {
      this.currentTenantSubject.next(tenant);
      this.applyTenantBranding(tenant);
      this.isolateTenantData(tenant);
    }
  }

  /**
   * Obtiene el tenant actual como Observable
   */
  getCurrentTenant$(): Observable<Tenant | null> {
    return this.currentTenantSubject.asObservable();
  }

  /**
   * Obtiene el tenant actual
   */
  getCurrentTenant(): Tenant | null {
    return this.currentTenantSubject.value;
  }

  /**
   * Verifica si estamos en el tenant principal
   */
  isMainTenant(): boolean {
    const current = this.getCurrentTenant();
    return current?.isMain || false;
  }

  /**
   * Verifica si estamos en una sucursal
   */
  isBranch(): boolean {
    return !this.isMainTenant();
  }

  /**
   * Aplica el branding del tenant actual
   */
  private applyTenantBranding(tenant: Tenant): void {
    // Actualizar favicon
    this.updateFavicon(tenant.branding.favicon);
    
    // Actualizar título de la página
    this.updatePageTitle(tenant.branding.companyName);
    
    // Actualizar meta tags
    this.updateMetaTags(tenant);
    
    // Aplicar variables CSS para colores
    this.applyCSSVariables(tenant.branding);
  }

  /**
   * Actualiza el favicon
   */
  private updateFavicon(faviconUrl?: string): void {
    if (faviconUrl) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = faviconUrl;
    }
  }

  /**
   * Actualiza el título de la página
   */
  private updatePageTitle(companyName: string): void {
    const baseTitle = companyName;
    const currentTitle = document.title;
    
    if (!currentTitle.includes(companyName)) {
      document.title = `${baseTitle} | ${currentTitle}`;
    }
  }

  /**
   * Actualiza meta tags
   */
  private updateMetaTags(tenant: Tenant): void {
    // Actualizar Open Graph
    this.updateMetaTag('property', 'og:site_name', tenant.branding.companyName);
    this.updateMetaTag('property', 'og:title', tenant.branding.companyName);
    
    // Actualizar Twitter
    this.updateMetaTag('name', 'twitter:site', tenant.branding.companyName);
    
    // Actualizar theme-color
    this.updateMetaTag('name', 'theme-color', tenant.branding.primaryColor);
  }

  /**
   * Actualiza un meta tag específico
   */
  private updateMetaTag(attribute: string, name: string, content: string): void {
    let meta: HTMLMetaElement | null = document.querySelector(`meta[${attribute}="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attribute, name);
      document.head.appendChild(meta);
    }
    meta.content = content;
  }

  /**
   * Aplica variables CSS para colores del tenant
   */
  private applyCSSVariables(branding: Tenant['branding']): void {
    const root = document.documentElement;
    root.style.setProperty('--tenant-primary-color', branding.primaryColor);
    root.style.setProperty('--tenant-secondary-color', branding.secondaryColor);
    root.style.setProperty('--tenant-company-name', `"${branding.companyName}"`);
  }

  /**
   * Aísla los datos del tenant para evitar mezcla con otros tenants
   */
  private isolateTenantData(tenant: Tenant): void {
    if (tenant.database.isolationLevel === 'complete') {
      // Aquí se implementaría la lógica para cambiar de schema de base de datos
      // Por ahora, simulamos la separación a nivel de aplicación
      // Temporarily comment out structured logging until properly configured
      // this.logger.debug('Tenant data isolation applied', { 
      //   tenantId: tenant.id,
      //   tenantName: tenant.name,
      //   schema: tenant.database.schema 
      // });
      
      // Agregar clase CSS al body para estilos específicos del tenant
      document.body.className = document.body.className
        .replace(/tenant-\w+/g, '') // Remover clases de tenant anteriores
        .trim();
      document.body.classList.add(`tenant-${tenant.id}`);
      
      // Almacenar información del tenant para uso en servicios
      localStorage.setItem('currentTenant', JSON.stringify({
        id: tenant.id,
        schema: tenant.database.schema,
        isolationLevel: tenant.database.isolationLevel
      }));
    }
  }

  /**
   * Obtiene todos los tenants disponibles
   */
  getAllTenants(): Tenant[] {
    return Array.from(this.tenants.values());
  }

  /**
   * Obtiene tenants que no son el principal (sucursales)
   */
  getBranches(): Tenant[] {
    return Array.from(this.tenants.values()).filter(t => !t.isMain);
  }

  /**
   * Verifica si un tenant tiene una característica específica
   */
  hasFeature(feature: keyof Tenant['features']): boolean {
    const current = this.getCurrentTenant();
    return current?.features[feature] || false;
  }

  /**
   * Obtiene el prefijo de base de datos para el tenant actual
   */
  getDatabasePrefix(): string {
    const current = this.getCurrentTenant();
    return current?.database.schema || 'public';
  }

  /**
   * Limpia el aislamiento del tenant actual
   */
  clearTenantIsolation(): void {
    document.body.className = document.body.className
      .replace(/tenant-\w+/g, '')
      .trim();
    localStorage.removeItem('currentTenant');
  }

  /**
   * Navega a un tenant específico
   */
  navigateToTenant(tenantId: string): void {
    const tenant = this.tenants.get(tenantId);
    if (tenant) {
      const baseUrl = window.location.origin;
      const targetUrl = tenant.isMain ? 
        `${baseUrl}/` : 
        `${baseUrl}/${tenant.slug}`;
      
      if (window.location.pathname !== targetUrl) {
        window.location.href = targetUrl;
      }
    }
  }

  /**
   * Obtiene la información de contacto del tenant actual
   */
  getContactInfo() {
    const current = this.getCurrentTenant();
    return current?.branding.contactInfo || null;
  }

  /**
   * Verifica si la URL actual pertenece a un tenant específico
   */
  isCurrentTenant(tenantId: string): boolean {
    const current = this.getCurrentTenant();
    return current?.id === tenantId;
  }
}
