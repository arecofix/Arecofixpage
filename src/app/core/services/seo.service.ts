import { Injectable, inject, PLATFORM_ID, makeStateKey, TransferState, DOCUMENT } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { isPlatformServer } from '@angular/common';
import { filter, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface SeoData {
  title: string;
  description: string;
  imageUrl?: string;
  type?: 'website' | 'product' | 'article' | 'profile';
  keywords?: string;
  url?: string;
  schema?: Record<string, any>;
  author?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
}

const SEO_DATA_KEY = makeStateKey<SeoData>('SEO_DATA');

export const STATIC_SEO_CONFIG: Record<string, SeoData> = {
  '/': {
    title: 'Arecofix - Servicio Técnico y Soluciones IT en Marcos Paz',
    description: 'Especialistas en reparación de celulares, notebooks y consolas en el acto. Venta de repuestos y accesorios. ¡Presupuesto gratis!',
    imageUrl: 'assets/img/branding/og-services.jpg'
  },
  '/celular': {
    title: 'Reparación de Celulares en Marcos Paz | Arecofix',
    description: 'Cambio de módulos y baterías en el acto con repuestos originales. Servicio técnico especializado para iPhone, Samsung y Motorola.',
    imageUrl: 'assets/img/branding/og-celulares-pro.png'
  },
  '/servicios': {
    title: 'Nuestros Servicios Técnicos | Arecofix',
    description: 'Reparación de Hardware, Microsoldadura, Desarrollo Web y Cámaras de Seguridad para empresas y hogares.',
    imageUrl: 'assets/img/branding/og-services.jpg'
  }
};

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);
  private transferState = inject(TransferState);

  private lastDynamicPath: string | null = null;

  public initialize() {
    if (isPlatformServer(this.platformId)) {
      const initialUrl = this.router.url.split('?')[0];
      if (STATIC_SEO_CONFIG[initialUrl]) {
        this.setPageData(STATIC_SEO_CONFIG[initialUrl]);
      }
    } else {
      // Avoid flicker: retrieve SEO data from server state if available
      const transferredData = this.transferState.get(SEO_DATA_KEY, null);
      if (transferredData) {
        this.setPageData(transferredData);
      }
    }

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map((event: any) => event.urlAfterRedirects.split('?')[0]),
    ).subscribe((currentPath: string) => {
      
      const isDynamic = currentPath.includes('/detalle/') || 
                       currentPath.includes('/posts/') || 
                       currentPath.includes('/tracking/');

      // If it's a dynamic route, we let the COMPONENT handle SEO.
      // We don't overwrite if we are already on the same dynamic path to avoid flicker.
      if (isDynamic) {
          this.lastDynamicPath = currentPath;
          return; 
      }

      this.lastDynamicPath = null;
      let seoData = STATIC_SEO_CONFIG[currentPath];

      if (!seoData) {
        const routeData = this.getContentRoute(this.activatedRoute).snapshot.data;
        if (routeData && routeData['seo']) {
          seoData = routeData['seo'] as SeoData;
        }
      }

      // Final Fallback for standard pages
      if (!seoData) {
        seoData = {
          title: 'Arecofix - Servicio Técnico y Soluciones IT',
          description: 'Líderes en reparación técnica y soluciones tecnológicas en Marcos Paz.',
          imageUrl: 'assets/img/branding/og-services.jpg'
        };
      }

      this.setPageData(seoData);
    });
  }

  private getContentRoute(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }

  public setPageData(data: SeoData) {
    if (isPlatformServer(this.platformId)) {
      this.transferState.set(SEO_DATA_KEY, data);
    }

    const { 
        title = 'Arecofix', 
        description = 'Servicio Técnico Especializado.', 
        imageUrl, 
        type = 'website', 
        keywords, 
        url,
        twitterCard = 'summary_large_image'
    } = data;
    

    const finalTitle = title.includes('Arecofix') ? title : `${title} | Arecofix`;
    this.titleService.setTitle(finalTitle);

    // Standard Tags
    this.metaService.updateTag({ name: 'description', content: description });
    if (keywords) {
      this.metaService.updateTag({ name: 'keywords', content: keywords });
    }

    // --- Dynamic Domain Resolution ---
    let SITE_URL = 'https://arecofix.com.ar';
    if (typeof window !== 'undefined') {
        SITE_URL = `${window.location.protocol}//${window.location.host}`;
    }

    const currentPath = url || this.router.url.split('?')[0];
    const finalUrl = currentPath.startsWith('http') 
        ? currentPath 
        : `${SITE_URL}${currentPath.startsWith('/') ? '' : '/'}${currentPath}`;
    
    // --- Image URL Resolution ---
    let finalImageUrl = `${SITE_URL}/assets/img/branding/og-services.jpg`;
    
    if (imageUrl && imageUrl.trim().length > 0) {
        if (imageUrl.startsWith('http')) {
            finalImageUrl = imageUrl;
        } else {
            // Remove leading dots or slashes and join with site URL
            const cleanPath = imageUrl.replace(/^[\.\/]+/, '');
            finalImageUrl = `${SITE_URL}/${cleanPath}`;
        }
    }

    // --- Critical Validation: Prevent Recursive or Broken URLs ---
    // 1. Never use the same URL for page and image (Facebook Crawler error)
    // 2. Never use dynamic routes as images (prevents HTML-as-image error)
    const normalize = (u: string) => u.toLowerCase().replace(/\/$/, '');
    const isDynamic = finalImageUrl.includes('/detalle/') || finalImageUrl.includes('/posts/') || finalImageUrl.includes('/tracking/');
    
    if (normalize(finalImageUrl) === normalize(finalUrl) || isDynamic) {
        if (isPlatformServer(this.platformId)) {
          console.warn(`[SEO] Warning: Invalid Image URL detected: ${finalImageUrl}. Falling back to default branding.`);
        }
        finalImageUrl = `${SITE_URL}/assets/img/branding/og-services.jpg`;
    }

    // Open Graph
    this.metaService.updateTag({ property: 'og:title', content: finalTitle });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:type', content: type });
    this.metaService.updateTag({ property: 'og:url', content: finalUrl });
    this.metaService.updateTag({ property: 'og:image', content: finalImageUrl });
    this.metaService.updateTag({ property: 'og:image:secure_url', content: finalImageUrl });
    this.metaService.updateTag({ property: 'og:image:width', content: '1200' });
    this.metaService.updateTag({ property: 'og:image:height', content: '630' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Arecofix' });

    // Twitter
    this.metaService.updateTag({ name: 'twitter:card', content: twitterCard });
    this.metaService.updateTag({ name: 'twitter:title', content: finalTitle });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
    this.metaService.updateTag({ name: 'twitter:image', content: finalImageUrl });

    this.setCanonicalUrl(finalUrl);
    
    if (data.schema) {
      this.injectJsonLd(data.schema);
    }
  }


  private setCanonicalUrl(url: string) {
    let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');
    if (!link) {
        link = this.document.createElement('link');
        link.setAttribute('rel', 'canonical');
        this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private injectJsonLd(schema: Record<string, any>) {
    const scriptId = 'json-ld-schema';
    let script = this.document.getElementById(scriptId) as HTMLScriptElement;
    if (!script) {
        script = this.document.createElement('script');
        script.id = scriptId;
        script.type = 'application/ld+json';
        this.document.head.appendChild(script);
    }
    script.text = JSON.stringify(schema);
  }
}
