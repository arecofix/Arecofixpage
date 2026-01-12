import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

export interface SeoData {
  title: string;
  description: string;
  keywords?: string;
  // Open Graph
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private titleService = inject(Title);
  private metaService = inject(Meta);

  constructor() {}

  setSeoData(data: SeoData) {
    // Basic SEO
    this.titleService.setTitle(data.title);
    this.metaService.updateTag({ name: 'description', content: data.description });
    
    if (data.keywords) {
      this.metaService.updateTag({ name: 'keywords', content: data.keywords });
    }

    // Open Graph
    if (data.ogTitle || data.title) {
        this.metaService.updateTag({ property: 'og:title', content: data.ogTitle || data.title });
    }
    
    if (data.ogDescription || data.description) {
        this.metaService.updateTag({ property: 'og:description', content: data.ogDescription || data.description });
    }

    if (data.ogImage) {
        this.metaService.updateTag({ property: 'og:image', content: data.ogImage });
    }

    if (data.ogUrl) {
        this.metaService.updateTag({ property: 'og:url', content: data.ogUrl });
    }

    // Default to website
    this.metaService.updateTag({ property: 'og:type', content: data.ogType || 'website' });
    
    // Additional Best Practices
    this.metaService.updateTag({ name: 'robots', content: 'index, follow' });
  }
}
