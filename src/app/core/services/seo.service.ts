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

  constructor() {
    // Service is singleton, initialization logic moved to separate method 
    // to allow explicit control from AppComponent as requested.
  }

  /**
   * Initializes the SEO service.
   * Subscribes to router events to automatically update tags.
   * Must be called once from AppComponent.
   */
  public initialize() {
    // 1. Check if we have TransferState data (Client Side Hydration)
    // This prevents flickering on the client side if the server already rendered the tags.
    if (!isPlatformServer(this.platformId)) {
      const serverSeoData = this.transferState.get(SEO_DATA_KEY, null);
      if (serverSeoData) {
        this.setPageData(serverSeoData);
      }
    }

    // 2. Subscribe to Route Changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.getContentRoute(this.activatedRoute)),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data)
    ).subscribe(data => {
      if (data['seo']) {
        const seoData = data['seo'] as SeoData;
        this.setPageData(seoData);

        // If running on Server, save to TransferState for the Client
        if (isPlatformServer(this.platformId)) {
          this.transferState.set(SEO_DATA_KEY, seoData);
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
    
    // 0. Cleanup previous state
    // Note: Angular's Meta service `updateTag` will replace existing tags with the same name/property,
    // so explicit removal is only needed for tags that might not be present in the new data.
    
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

    // 5. Construct Canonical & Image URLs
    const currentPath = url || this.router.url;
    const finalUrl = currentPath.startsWith('http') ? currentPath : `${environment.baseUrl}${currentPath}`;
    
    // Handle Image URL: if it's relative, append baseUrl. Use default if missing.
    let finalImageUrl = 'assets/img/branding/og-services.jpg'; // Default valid image
    if (imageUrl) {
        finalImageUrl = imageUrl;
    }
    if (!finalImageUrl.startsWith('http')) {
        // Ensure strictly no double slashes if imageUrl starts with /
        const cleanPath = finalImageUrl.startsWith('/') ? finalImageUrl.substring(1) : finalImageUrl;
        finalImageUrl = `${environment.baseUrl}/${cleanPath}`;
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

