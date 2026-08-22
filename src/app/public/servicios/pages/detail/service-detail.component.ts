import {
  Component,
  OnInit,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SeoService } from '@app/core/services/seo.service';
import { SERVICIOS_CONTENT, Service } from '../../servicios.data';
import { environment } from '../../../../../environments/environment';
import { AppCatalogService } from '@app/features/products/application/services/app-catalog.service';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [RouterModule, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './service-detail.component.html',
})
export class ServiceDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private seoService = inject(SeoService);
  private catalogService = inject(AppCatalogService);

  service = signal<Service | null>(null);
  whatsappNumber = environment.contact.whatsappNumber;

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (slug) {
        this.loadService(slug);
      }
    });
  }

  private slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }

  private async loadService(slug: string) {
    // 1. Search in database first
    try {
      const dbServices = await this.catalogService.getAll();
      const foundDb = dbServices.find(
        (s) => s.slug === slug || this.slugify(s.name) === slug,
      );
      if (foundDb && foundDb.is_active) {
        let desc = foundDb.description || '';
        let icon = 'fa-tools';
        let features: string[] = [];

        if (desc.trim().startsWith('{') && desc.trim().endsWith('}')) {
          try {
            const parsed = JSON.parse(desc);
            desc = parsed.description || '';
            icon = parsed.icon || 'fa-tools';
            features = parsed.features || [];
          } catch (e) {
            // ignore
          }
        }

        const mappedService: Service = {
          id: foundDb.id as any,
          title: foundDb.name,
          slug: foundDb.slug || this.slugify(foundDb.name),
          description: desc,
          icon: icon,
          features: features,
          price: foundDb.price
            ? `Desde $${Number(foundDb.price).toLocaleString('es-AR')}`
            : 'Consultar',
          image:
            foundDb.image_url || 'assets/img/services/repair-illustration.webp',
          link: `/servicios/${foundDb.slug || this.slugify(foundDb.name)}`,
        };
        this.service.set(mappedService);
        this.setSeo(mappedService);
        return;
      }
    } catch (e) {
      console.error('Error loading service from DB:', e);
    }

    // 2. Fallback to static Spanish content
    const foundService = SERVICIOS_CONTENT.es.services.find(
      (s) => s.slug === slug,
    );

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
      imageUrl: service.image,
    });
  }

  getWhatsAppLink(service: Service) {
    const message = `Hola Arecofix! Me interesa el servicio de *${service.title}* que vi en la web.`;
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(message)}`;
  }
}
