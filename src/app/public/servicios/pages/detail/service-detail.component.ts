import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SeoService } from '@app/core/services/seo.service';
import { SERVICIOS_CONTENT, Service } from '../../servicios.data';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, NgOptimizedImage],
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
    this.seoService.setPageData(
      service.title,
      service.description,
      service.image.startsWith('http') ? service.image : `https://arecofix.com.ar/${service.image}`
    );
  }

  getWhatsAppLink(service: Service) {
    const message = `Hola Arecofix! Me interesa el servicio de *${service.title}* que vi en la web.`;
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(message)}`;
  }
}
