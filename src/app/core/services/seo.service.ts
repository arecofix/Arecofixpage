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
  schema?: Record<string, any>;
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
    this.init();
  }

  private init() {
    // 1. Check if we have TransferState data (Client Side Hydration)
    if (!isPlatformServer(this.platformId)) {
      const serverSeoData = this.transferState.get(SEO_DATA_KEY, null);
      if (serverSeoData) {
        this.setPageData(serverSeoData);
      }
    }

    // 2. Subscribe to Route Changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.rootRoute(this.activatedRoute)),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data)
    ).subscribe(data => {
      // If the route has 'seo' data, use it.
      if (data['seo']) {
        const seoData = data['seo'] as SeoData;
        this.setPageData(seoData);

        // If on Server, save to TransferState
        if (isPlatformServer(this.platformId)) {
          this.transferState.set(SEO_DATA_KEY, seoData);
        }
      } else {
        // Reset if no SEO data found for current route (optional, or keep previous?)
        // Usually better to keep previous or have a default. 
        // But resetData() is called inside setPageData().
        // If we want to guarantee clean state for pages without SEO, we might call resetData() here,
        // but that might wipe the default app title.
      }
    });
  }

  private rootRoute(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }

  resetData() {
    // Remove specific product/article tags that might linger
    this.metaService.removeTag('property="product:price:amount"');
    this.metaService.removeTag('property="product:price:currency"');
    this.metaService.removeTag('property="article:published_time"');
    this.metaService.removeTag('property="article:author"');
    
    // Reset basic Open Graph type to website default
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.removeTag('name="keywords"');

    // Clear JSON-LD
    this.clearJsonLd();
  }
  
  /**
   * Sets the core page metadata including Title, Description, and Canonical URL.
   * This is the entry point for basic SEO configuration per page.
   */
  setPageData(data: SeoData) {
    const { title, description, imageUrl, type = 'website', keywords, schema } = data;
    
    // 0. Reset previous specific tags
    this.resetData();

    // 1. Set Browser Title
    const finalTitle = title.includes('|') || title.includes('Arecofix') ? title : `${title} | Arecofix`;
    this.titleService.setTitle(finalTitle);

    // 2. Set Meta Description
    this.metaService.updateTag({ name: 'description', content: description });

    // 3. Set Keywords (Optional)
    if (keywords) {
      this.metaService.updateTag({ name: 'keywords', content: keywords });
    }

    // 4. Set Social Media Tags (Open Graph & Twitter)
    this.setSocialMediaTags({
        title: finalTitle,
        description,
        image: imageUrl || `${environment.baseUrl}/assets/img/brands/logo/logo-normal1.PNG`,
        url: this.router.url,
        type
    });

    // 5. Set Canonical URL
    this.setCanonicalUrl(this.router.url);

    // 6. Set Structured Data (JSON-LD)
    if (schema) {
      this.setJsonLd(schema);
    }
  }

  /**
   * Specifically sets Open Graph and Twitter Card metadata.
   * Crucial for WhatsApp, Facebook, and Twitter sharing previews.
   */
  setSocialMediaTags(config: { title: string; description: string; image: string; url: string; type: string }) {
    // Open Graph (Facebook, WhatsApp, LinkedIn)
    this.metaService.updateTag({ property: 'og:title', content: config.title });
    this.metaService.updateTag({ property: 'og:description', content: config.description });
    this.metaService.updateTag({ property: 'og:type', content: config.type });
    this.metaService.updateTag({ property: 'og:url', content: config.url.startsWith('http') ? config.url : `${environment.baseUrl}${config.url}` });
    
    const fullImageUrl = config.image.startsWith('http') ? config.image : `${environment.baseUrl}${config.image.startsWith('/') ? '' : '/'}${config.image}`;
    this.metaService.updateTag({ property: 'og:image', content: fullImageUrl });
    
    // Ensure image secure url is set for https
    if (fullImageUrl.startsWith('https')) {
        this.metaService.updateTag({ property: 'og:image:secure_url', content: fullImageUrl });
    }

    // Twitter Card
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: config.title });
    this.metaService.updateTag({ name: 'twitter:description', content: config.description });
    this.metaService.updateTag({ name: 'twitter:image', content: fullImageUrl });
  }

  setCanonicalUrl(url: string) {
    // Check if link exists
    let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');
    if (!link) {
        link = this.document.createElement('link');
        link.setAttribute('rel', 'canonical');
        this.document.head.appendChild(link);
    }
    const finalUrl = url.startsWith('http') ? url : `${environment.baseUrl}${url}`;
    link.setAttribute('href', finalUrl);
  }

  setJsonLd(schema: Record<string, any>) {
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

  clearJsonLd() {
    const scriptId = 'json-ld-schema';
    const script = this.document.getElementById(scriptId);
    if (script) {
      script.remove();
    }
  }
}

