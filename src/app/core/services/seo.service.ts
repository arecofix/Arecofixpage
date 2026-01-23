import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private router = inject(Router);

  constructor() {
    this.init();
  }

  private init() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Reset sensitive tags on navigation to avoid data leaking between pages
      this.resetData();
    });
  }

  private resetData() {
    // Remove specific product/article tags that might linger
    this.metaService.removeTag('property="product:price:amount"');
    this.metaService.removeTag('property="product:price:currency"');
    this.metaService.removeTag('property="article:published_time"');
    this.metaService.removeTag('property="article:author"');
    
    // Reset basic Open Graph type to website default
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
  }

  setPageData(title: string, description: string, imageUrl?: string, type: 'website' | 'product' | 'article' = 'website') {
    // Set Title
    const finalTitle = `${title} | Arecofix`;
    this.titleService.setTitle(finalTitle);

    // Set Meta Description
    this.metaService.updateTag({ name: 'description', content: description });

    // Set Open Graph Tags (Social Sharing)
    this.metaService.updateTag({ property: 'og:title', content: finalTitle });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:type', content: type });
    this.metaService.updateTag({ property: 'og:url', content: `${environment.baseUrl}${this.router.url}` });
    
    if (imageUrl) {
      const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${environment.baseUrl}/${imageUrl.replace(/^\//, '')}`;
      this.metaService.updateTag({ property: 'og:image', content: fullImageUrl });
      this.metaService.updateTag({ name: 'twitter:image', content: fullImageUrl });
    } else {
        // Default Image
        this.metaService.updateTag({ property: 'og:image', content: `${environment.baseUrl}/assets/img/brands/logo/logo-normal1.PNG` });
    }

    // Twitter Card
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: finalTitle });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
  }
}
