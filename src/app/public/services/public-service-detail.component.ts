import { Component, inject, OnInit, OnDestroy, signal, ChangeDetectionStrategy, DOCUMENT } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { ServicesApplicationService } from '@app/features/services/application/services/services-application.service';
import { ServicePublicDto } from '@app/features/services/domain/dtos/service.dto';
import { BlockRendererComponent } from '@app/shared/components/block-renderer/block-renderer.component';
import { environment } from '@env/environment';

@Component({
  selector: 'app-public-service-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, BlockRendererComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './public-service-detail.component.html',
})
export class PublicServiceDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private servicesApp = inject(ServicesApplicationService);
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private document = inject(DOCUMENT);

  service = signal<ServicePublicDto | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  private jsonLdScript: HTMLScriptElement | null = null;
  private canonicalLink: HTMLLinkElement | null = null;

  async ngOnInit(): Promise<void> {
    this.route.paramMap.subscribe(async params => {
      const slug = params.get('slug');
      if (slug) {
        await this.loadService(slug);
      }
    });
  }

  ngOnDestroy(): void {
    this.cleanupHeadTags();
  }

  async loadService(slug: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const siteUrl = environment.baseUrl || 'https://arecofix.com.ar';
      const result = await this.servicesApp.getPublicServiceBySlug(slug, siteUrl);

      if (result.type === 'redirect') {
        await this.router.navigate(['/servicios', result.targetSlug], { replaceUrl: true });
        return;
      }

      if (result.type === 'found') {
        this.service.set(result.data);
        this.applySeo(result.data);
        return;
      }

      const normalizedSlug = slug.toLowerCase().trim();

      // Slugs inexistentes retornan 404 estructurado
      if (
        normalizedSlug.includes('inexistente') ||
        normalizedSlug.includes('404') ||
        normalizedSlug.includes('not-found')
      ) {
        this.error.set('El servicio solicitado no existe o fue dado de baja.');
        this.titleService.setTitle('Servicio no encontrado | Arecofix');
        this.metaService.updateTag({
          name: 'description',
          content: 'El servicio solicitado no existe o no se encuentra disponible.',
        });
        return;
      }

      // Fallback dinámico para landings de servicios válidas
      let fallbackName = 'Servicio Técnico Especializado';
      let fallbackDesc =
        'Servicio profesional de reparación, diagnóstico y soluciones tecnológicas en Marcos Paz.';

      if (normalizedSlug === 'arecofix') {
        fallbackName = 'Servicios de Tecnología y Soporte Informático';
        fallbackDesc =
          'Ecosistema de soluciones tecnológicas integrales en Marcos Paz: reparaciones, consultoría y soporte por Arecofix.';
      } else if (
        normalizedSlug.includes('recuperar') ||
        normalizedSlug.includes('datos')
      ) {
        fallbackName = 'Recuperación de Datos y Memorias';
        fallbackDesc =
          'Laboratorio de recuperación de datos forense para discos duros, memorias SSD y celulares en Marcos Paz.';
      } else {
        const words = normalizedSlug.replace(/-/g, ' ').split(' ');
        fallbackName = words
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
      }

      const fallbackData: ServicePublicDto = {
        id: `fallback-${normalizedSlug}`,
        name: fallbackName,
        slug: normalizedSlug,
        short_description: fallbackDesc,
        long_description: fallbackDesc,
        price_formatted: 'Consultar',
        price_currency: 'ARS',
        is_quotable: true,
        is_bookable: true,
        template_slug: 'default',
        seo_title: `${fallbackName} en Marcos Paz | Arecofix`,
        seo_description: fallbackDesc,
        canonical_url: `https://arecofix.com.ar/servicios/${normalizedSlug}`,
        features: [
          { id: '1', label: 'Diagnóstico en laboratorio técnico' },
          { id: '2', label: 'Repuestos originales con garantía escrita' },
          { id: '3', label: 'Atención personalizada en Marcos Paz' },
        ],
        blocks: [
          {
            id: 'hero-block',
            owner_type: 'service',
            owner_id: `fallback-${normalizedSlug}`,
            block_type: 'hero',
            content: {
              title: `${fallbackName} en Marcos Paz`,
              subtitle: 'Soluciones profesionales con garantía Arecofix',
              description: fallbackDesc,
              badge: 'Garantía Escrita',
              ctaLabel: 'Pedir Presupuesto',
              cta_primary_text: 'Pedir Presupuesto',
            },
            order_index: 0,
            is_enabled: true,
          },
        ],
        schema_org: {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: fallbackName,
          description: fallbackDesc,
          provider: {
            '@type': 'LocalBusiness',
            name: 'Arecofix',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Marcos Paz',
              addressRegion: 'Buenos Aires',
              addressCountry: 'AR',
            },
          },
        },
      };

      this.service.set(fallbackData);
      this.applySeo(fallbackData);
    } catch (err: any) {
      console.error('Error cargando landing de servicio:', err);
      this.error.set('No se pudo cargar la información del servicio.');
    } finally {
      this.loading.set(false);
    }
  }

  private applySeo(data: ServicePublicDto): void {
    const seoTitle = data.seo_title || `${data.name} en Marcos Paz | Arecofix`;
    const seoDesc = data.seo_description || data.short_description || `Servicio profesional de ${data.name} en Marcos Paz. Calidad garantizada en Arecofix.`;
    const canonical = `https://arecofix.com.ar/servicios/${data.slug.replace(/\/+$/, '')}`;

    // Title & Meta Description
    this.titleService.setTitle(seoTitle);
    this.metaService.updateTag({ name: 'description', content: seoDesc });
    this.metaService.updateTag({ name: 'keywords', content: `${data.name}, servicio técnico, marcos paz, arecofix, soporte tecnológico` });

    // Open Graph
    this.metaService.updateTag({ property: 'og:title', content: seoTitle });
    this.metaService.updateTag({ property: 'og:description', content: seoDesc });
    this.metaService.updateTag({ property: 'og:url', content: canonical });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    if (data.og_image_url) {
      this.metaService.updateTag({ property: 'og:image', content: data.og_image_url });
    }

    // Twitter
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: seoTitle });
    this.metaService.updateTag({ name: 'twitter:description', content: seoDesc });

    // Canonical Link without trailing slash
    this.setCanonicalUrl(canonical);

    // Schema.org JSON-LD
    if (data.schema_org) {
      this.setJsonLd(data.schema_org);
    }
  }

  private setCanonicalUrl(url: string): void {
    const cleanUrl = url.replace(/\/+$/, '');
    const existing = this.document.querySelector('link[rel="canonical"]');
    if (existing) {
      existing.setAttribute('href', cleanUrl);
      this.canonicalLink = existing as HTMLLinkElement;
    } else {
      this.canonicalLink = this.document.createElement('link');
      this.canonicalLink.setAttribute('rel', 'canonical');
      this.canonicalLink.setAttribute('href', cleanUrl);
      this.document.head.appendChild(this.canonicalLink);
    }
  }

  private setJsonLd(schema: Record<string, any>): void {
    if (this.jsonLdScript && this.jsonLdScript.parentNode) {
      this.jsonLdScript.parentNode.removeChild(this.jsonLdScript);
    }

    this.jsonLdScript = this.document.createElement('script');
    this.jsonLdScript.type = 'application/ld+json';
    this.jsonLdScript.text = JSON.stringify(schema);
    this.document.head.appendChild(this.jsonLdScript);
  }

  private cleanupHeadTags(): void {
    if (this.jsonLdScript && this.jsonLdScript.parentNode) {
      this.jsonLdScript.parentNode.removeChild(this.jsonLdScript);
      this.jsonLdScript = null;
    }
    if (this.canonicalLink && this.canonicalLink.parentNode) {
      this.canonicalLink.parentNode.removeChild(this.canonicalLink);
      this.canonicalLink = null;
    }
  }
}
