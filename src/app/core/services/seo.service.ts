import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

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
      // Logic to reset or set default tags can go here
      // For now we rely on individual pages calling setPageData
    });
  }

  setPageData(title: string, description: string, imageUrl?: string) {
    // Set Title
    const finalTitle = `${title} | Arecofix`;
    this.titleService.setTitle(finalTitle);

    // Set Meta Description
    this.metaService.updateTag({ name: 'description', content: description });

    // Set Open Graph Tags (Social Sharing)
    this.metaService.updateTag({ property: 'og:title', content: finalTitle });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:url', content: `https://arecofix.com.ar${this.router.url}` });
    
    if (imageUrl) {
      this.metaService.updateTag({ property: 'og:image', content: imageUrl });
      this.metaService.updateTag({ name: 'twitter:image', content: imageUrl });
    } else {
        // Default Image
        this.metaService.updateTag({ property: 'og:image', content: 'https://arecofix.com.ar/assets/img/brands/logo/logo-normal1.PNG' });
    }

    // Twitter Card
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: finalTitle });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
  }
}
