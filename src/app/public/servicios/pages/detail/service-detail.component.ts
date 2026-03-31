import { Component, OnInit, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SeoService } from '@app/core/services/seo.service';
import { SERVICIOS_CONTENT, Service } from '../../servicios.data';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [RouterModule, NgOptimizedImage],
  templateUrl: './service-detail.component.html',
})
export class ServiceDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private seoService = inject(SeoService);

  service = signal<Service | null>(null);
  whatsappNumber = environment.contact.whatsappNumber;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.loadService(slug);
      }
    });
  }

  private loadService(slug: string) {
    // Search in Spanish content for now (can be expanded for i18n later)
    const foundService = SERVICIOS_CONTENT.es.services.find(s => s.slug === slug);

    if (foundService) {
      this.service.set(foundService);
      this.setSeo(foundService);
    } else {
      // Redirect to services index if not found
      this.router.navigate(['/servicios']);
    }
  }

  private setSeo(service: Service) {
    this.seoService.setPageData({
      title: service.title,
      description: service.description,
      imageUrl: service.image.startsWith('http') ? service.image : `https://arecofix.com.ar/${service.image}`
    });
    this.setWhatsAppOgTags(service.image, service.description, service.title);
  }

  private setWhatsAppOgTags(imageUrl: string, description: string, serviceTitle: string): void {
     if (typeof document === 'undefined') return;
     const meta = document.head;
     const setOrCreate = (property: string, content: string) => {
       let el = meta.querySelector(`meta[property='${property}']`) as HTMLMetaElement;
       if (!el) {
         el = document.createElement('meta'); el.setAttribute('property', property); document.head.appendChild(el);
       }
       el.setAttribute('content', content);
     };
     const absoluteImageUrl = imageUrl.startsWith('http') ? imageUrl : `${window.location.origin}/${imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl}`;
     setOrCreate('og:title', `${serviceTitle} | Arecofix`);
     setOrCreate('og:image', absoluteImageUrl);
     setOrCreate('og:image:secure_url', absoluteImageUrl);
     setOrCreate('og:image:width', '1200');
     setOrCreate('og:image:height', '630');
     setOrCreate('og:description', description);
     setOrCreate('og:site_name', 'Arecofix');
     setOrCreate('og:type', 'article');
  }

  getWhatsAppLink(service: Service) {
    const message = `Hola Arecofix! Me interesa el servicio de *${service.title}* que vi en la web.`;
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(message)}`;
  }
}
