import { Injectable, inject, PLATFORM_ID, makeStateKey, TransferState } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { DOCUMENT, isPlatformServer } from '@angular/common';
import { filter, map, mergeMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface SeoData {
  title: string;
  description: string;
  imageUrl?: string;
  type?: 'website' | 'product' | 'article' | 'profile';
  keywords?: string;
  url?: string; // Optional override
  schema?: Record<string, any>;
  author?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
}

const SEO_DATA_KEY = makeStateKey<SeoData>('SEO_DATA');

// Dictionary of predefined Meta Tags based on internal routes
export const STATIC_SEO_CONFIG: Record<string, SeoData> = {
  '/': {
    title: 'Soluciones de Software & Consultoría IT',
    description: 'Expertos en desarrollo de software a medida, aplicaciones móviles y transformación digital. Consultoría IT y servicio técnico especializado en Marcos Paz.',
    imageUrl: 'assets/img/branding/og-services.jpg'
  },
  '/celular': {
    title: 'Reparación de Celulares en Marcos Paz | Servicio Técnico Arecofix',
    description: 'Arreglo de pantallas, baterías y pines de carga en el acto. Calidad garantizada en Marcos Paz.',
    imageUrl: 'assets/img/branding/og-celulares.jpg',
    keywords: 'reparacion de celulares marcos paz, servicio tecnico celulares, arreglo de pantallas, cambio de bateria, arecofix'
  },
  '/contacto': {
    title: 'Contacto | Arecofix - Estamos para Ayudarte',
    description: '¿Tenés alguna consulta o necesitás soporte técnico? Contáctanos por WhatsApp, Email o visitanos en nuestro local.',
    imageUrl: 'assets/img/branding/og-contact.jpg'
  },
  '/servicios': {
    title: 'Servicios de Tecnología y Reparación | Arecofix',
    description: 'Soluciones integrales: Reparación de Celulares, Desarrollo de Software, Cámaras de Seguridad y Soporte IT para empresas.',
    imageUrl: 'assets/img/branding/og-services.jpg',
    keywords: 'servicios informaticos, reparacion celulares, desarrollo software, soporte it, camaras seguridad'
  },
  '/nosotros': {
    title: 'Sobre Nosotros | Arecofix - Innovación y Compromiso',
    description: 'Conocé al equipo detrás de Arecofix. Somos expertos en tecnología comprometidos con brindar soluciones de calidad en Marcos Paz.',
    imageUrl: 'assets/img/branding/logo/logo-normal1.PNG'
  },
  '/academy': {
    title: 'Arecofix Academy | Cursos de Tecnología',
    description: 'Aprendé reparación de celulares, programación y más con nuestros cursos presenciales y online.',
    imageUrl: 'assets/img/branding/logo/logo-normal1.PNG'
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

  constructor() {}

  /**
   * Initializes the SEO service.
   * Subscribes to router events to automatically update tags.
   */
  public initialize() {
    // 1. Check if we have TransferState data (Client Side Hydration)
    if (!isPlatformServer(this.platformId)) {
      const serverSeoData = this.transferState.get(SEO_DATA_KEY, null);
      if (serverSeoData) {
        this.setPageData(serverSeoData);
      }
    } else {
      // Immediate execution for Server to avoid racing with NavigationEnd
      const initialUrl = this.router.url.split('?')[0];
      if (STATIC_SEO_CONFIG[initialUrl]) {
        this.setPageData(STATIC_SEO_CONFIG[initialUrl]);
      }
    }

    // 2. Subscribe to Route Changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map((event: any) => event.urlAfterRedirects.split('?')[0]), // Normalize the URL
    ).subscribe((currentPath: string) => {
      
      // Look in the Static Configuration Object first
      let seoData = STATIC_SEO_CONFIG[currentPath];

      // If not defined statically, attempt to read from ActivatedRoute data
      if (!seoData) {
        const routeData = this.getContentRoute(this.activatedRoute).snapshot.data;
        if (routeData && routeData['seo']) {
          seoData = routeData['seo'] as SeoData;
        }
      }

      // If no static or activated route data exists, enforce absolute defaults
      if (!seoData) {
        seoData = {
          title: 'Arecofix - Servicio Técnico de Celulares y Soluciones IT',
          description: 'Experto en reparación de celulares en el acto, desarrollo web y transformación digital en Marcos Paz.',
          imageUrl: 'assets/img/branding/og-services.jpg'
        };
      }

      if (seoData) {
        // Prevent rewriting empty state while hydrating
        if (!isPlatformServer(this.platformId) && this.transferState.hasKey(SEO_DATA_KEY)) {
           this.transferState.remove(SEO_DATA_KEY);
           return;
        }

        this.setPageData(seoData);

      } else {
        if (!isPlatformServer(this.platformId) && this.transferState.hasKey(SEO_DATA_KEY)) {
           this.transferState.remove(SEO_DATA_KEY);
        }
      }
    });
  }

  /**
   * Recursively traverses the route tree to find the last child (the actual page component).
   */
  private getContentRoute(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }

  /**
   * Sets all SEO metadata for the current page.
   */
  public setPageData(data: SeoData) {
    if (isPlatformServer(this.platformId)) {
      this.transferState.set(SEO_DATA_KEY, data);
    }

    const { 
        title, 
        description, 
        imageUrl, 
        type = 'website', 
        keywords, 
        schema,
        url,
        author,
        twitterCard = 'summary_large_image'
    } = data;
    
    // 1. Set Browser Title
    const finalTitle = title.includes('|') || title.includes('Arecofix') ? title : `${title} | Arecofix`;
    this.titleService.setTitle(finalTitle);

    // 2. Set Meta Description
    this.metaService.updateTag({ name: 'description', content: description });

    // 3. Keywords
    if (keywords) {
      this.metaService.updateTag({ name: 'keywords', content: keywords });
    }

    // 4. Author
    if (author) {
        this.metaService.updateTag({ name: 'author', content: author });
    }

    // 5. Construct Canonical & Image URLs absolutely
    const currentPath = url || this.router.url.split('?')[0]; // discard query params from canonical
    const finalUrl = currentPath.startsWith('http') ? currentPath : `${environment.baseUrl}${currentPath}`;
    
    let finalImageUrl = `${environment.baseUrl}/assets/img/branding/og-services.jpg`; // Default absolute image
    if (imageUrl) {
        if (imageUrl.startsWith('http')) {
            finalImageUrl = imageUrl;
        } else {
            const cleanPath = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;
            finalImageUrl = `${environment.baseUrl}/${cleanPath}`;
        }
    }

    // 6. Set Social Media Tags (Open Graph)
    this.metaService.updateTag({ property: 'og:title', content: finalTitle });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:type', content: type });
    this.metaService.updateTag({ property: 'og:url', content: finalUrl });
    this.metaService.updateTag({ property: 'og:image', content: finalImageUrl });
    if (finalImageUrl.startsWith('https')) {
        this.metaService.updateTag({ property: 'og:image:secure_url', content: finalImageUrl });
    }
    this.metaService.updateTag({ property: 'og:site_name', content: 'Arecofix' });

    // 7. Twitter Cards
    this.metaService.updateTag({ name: 'twitter:card', content: twitterCard });
    this.metaService.updateTag({ name: 'twitter:title', content: finalTitle });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
    this.metaService.updateTag({ name: 'twitter:image', content: finalImageUrl });

    // 8. Canonical URL
    this.setCanonicalUrl(finalUrl);

    // 9. Structured Data (JSON-LD)
    if (schema) {
      this.injectJsonLd(schema);
    } else {
        this.removeJsonLd();
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

  private removeJsonLd() {
    const script = this.document.getElementById('json-ld-schema');
    if (script) {
      script.remove();
    }
  }
}
