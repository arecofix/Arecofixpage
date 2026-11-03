import {
  Component,
  inject,
  OnInit,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ServicesApplicationService } from '@app/features/services/application/services/services-application.service';
import { ServiceDto, LeadDto } from '@app/features/services/domain/dtos/service.dto';
import { Slug } from '@app/features/services/domain/value-objects/slug.vo';
import { LeadStatus } from '@app/features/services/domain/entities/service-lead.entity';
import { BlocksEditorComponent } from '@app/shared/components/blocks-editor/blocks-editor.component';

export type EditorTab = 'content' | 'blocks' | 'seo' | 'operational' | 'leads';

@Component({
  selector: 'app-service-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, BlocksEditorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './service-editor.component.html',
})
export class ServiceEditorComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private servicesApp = inject(ServicesApplicationService);

  activeTab = signal<EditorTab>('content');
  serviceId = signal<string | null>(null);
  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  // Form State
  name = signal('');
  slug = signal('');
  icon = signal('fa-tools');
  shortDescription = signal('');
  longDescription = signal('');
  heroImageUrl = signal('');
  features = signal<string[]>([]);
  newFeatureInput = signal('');

  // SEO State
  seoTitle = signal('');
  seoDescription = signal('');
  canonicalUrl = signal('');
  ogImageUrl = signal('');

  // Operational State
  basePrice = signal<number | null>(null);
  priceCurrency = signal('ARS');
  durationMinutes = signal<number | null>(60);
  isQuotable = signal(true);
  isBookable = signal(false);
  isPublished = signal(false);
  publishedAt = signal<string | null>(null);

  // Leads State
  leads = signal<LeadDto[]>([]);
  leadsLoading = signal(false);

  // Computed counters & Google Preview
  shortDescRemaining = computed(() => 280 - (this.shortDescription() || '').length);
  seoTitleRemaining = computed(() => 70 - (this.seoTitle() || '').length);
  seoDescRemaining = computed(() => 160 - (this.seoDescription() || '').length);

  googlePreviewTitle = computed(() => {
    return this.seoTitle().trim() || `${this.name().trim() || 'Título del Servicio'} | Arecofix`;
  });

  googlePreviewUrl = computed(() => {
    const s = this.slug().trim() || 'servicio-ejemplo';
    return `https://arecofix.com.ar/servicios/${s}`;
  });

  googlePreviewDescription = computed(() => {
    return (
      this.seoDescription().trim() ||
      this.shortDescription().trim() ||
      'Servicio profesional y soluciones técnicas especializadas por Arecofix.'
    );
  });

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.serviceId.set(id);
      await this.loadService(id);
      await this.loadLeads(id);
    } else {
      this.loading.set(false);
    }
  }

  async loadService(id: string): Promise<void> {
    this.loading.set(true);
    try {
      const data = await this.servicesApp.getServiceById(id);
      if (data) {
        this.populateForm(data);
      } else {
        this.error.set('Servicio no encontrado.');
      }
    } catch (err: any) {
      console.error('Error cargando servicio:', err);
      this.error.set(err.message || 'Error al cargar el servicio.');
    } finally {
      this.loading.set(false);
    }
  }

  async loadLeads(serviceId: string): Promise<void> {
    this.leadsLoading.set(true);
    try {
      const res = await this.servicesApp.getLeads({ serviceId, limit: 50 });
      this.leads.set(res.data);
    } catch (e) {
      console.warn('Error cargando leads del servicio:', e);
    } finally {
      this.leadsLoading.set(false);
    }
  }

  private populateForm(data: ServiceDto): void {
    this.name.set(data.name || '');
    this.slug.set(data.slug || '');
    this.icon.set(data.icon || 'fa-tools');
    this.shortDescription.set(data.short_description || '');
    this.longDescription.set(data.long_description || '');
    this.heroImageUrl.set(data.hero_image_url || '');
    this.features.set(data.features || []);

    this.seoTitle.set(data.seo_title || '');
    this.seoDescription.set(data.seo_description || '');
    this.canonicalUrl.set(data.canonical_url || '');
    this.ogImageUrl.set(data.og_image_url || '');

    this.basePrice.set(data.base_price !== undefined ? data.base_price : null);
    this.priceCurrency.set(data.price_currency || 'ARS');
    this.durationMinutes.set(data.duration_minutes ?? null);
    this.isQuotable.set(data.is_quotable);
    this.isBookable.set(data.is_bookable);
    this.isPublished.set(data.is_published);
    this.publishedAt.set(data.published_at || null);
  }

  onNameChange(val: string): void {
    this.name.set(val);
    if (!this.serviceId() && (!this.slug() || this.slug().startsWith('nuevo'))) {
      this.slug.set(Slug.slugify(val));
    }
  }

  addFeature(): void {
    const val = this.newFeatureInput().trim();
    if (!val) return;
    this.features.set([...this.features(), val]);
    this.newFeatureInput.set('');
  }

  removeFeature(index: number): void {
    const list = [...this.features()];
    list.splice(index, 1);
    this.features.set(list);
  }

  async save(andPublish = false): Promise<void> {
    this.saving.set(true);
    this.error.set(null);
    this.successMessage.set(null);

    const payload = {
      name: this.name().trim(),
      slug: Slug.slugify(this.slug().trim() || this.name().trim()),
      icon: this.icon().trim() || 'fa-tools',
      short_description: this.shortDescription().trim() || null,
      long_description: this.longDescription().trim() || null,
      hero_image_url: this.heroImageUrl().trim() || null,
      features: this.features(),
      seo_title: this.seoTitle().trim() || null,
      seo_description: this.seoDescription().trim() || null,
      canonical_url: this.canonicalUrl().trim() || null,
      og_image_url: this.ogImageUrl().trim() || null,
      base_price: this.basePrice(),
      price_currency: this.priceCurrency(),
      duration_minutes: this.durationMinutes(),
      is_quotable: this.isQuotable(),
      is_bookable: this.isBookable(),
    };

    try {
      let saved: ServiceDto;
      const currentId = this.serviceId();

      if (currentId) {
        saved = await this.servicesApp.updateService(currentId, payload);
      } else {
        saved = await this.servicesApp.createService(payload);
        this.serviceId.set(saved.id);
      }

      if (andPublish) {
        saved = await this.servicesApp.publishService(saved.id);
        this.isPublished.set(true);
        this.publishedAt.set(saved.published_at || new Date().toISOString());
        this.successMessage.set('¡Servicio publicado y visible en la web!');
      } else {
        this.successMessage.set('Borrador guardado exitosamente.');
      }

      this.populateForm(saved);
    } catch (err: any) {
      console.error('Error guardando servicio:', err);
      this.error.set(err.message || 'Error al guardar el servicio.');
    } finally {
      this.saving.set(false);
    }
  }

  async togglePublish(): Promise<void> {
    const id = this.serviceId();
    if (!id) {
      await this.save(true);
      return;
    }

    this.saving.set(true);
    this.error.set(null);
    try {
      if (this.isPublished()) {
        const res = await this.servicesApp.unpublishService(id);
        this.isPublished.set(false);
        this.successMessage.set('El servicio fue despublicado (estado borrador).');
      } else {
        const res = await this.servicesApp.publishService(id);
        this.isPublished.set(true);
        this.publishedAt.set(res.published_at || new Date().toISOString());
        this.successMessage.set('¡Servicio publicado y accesible públicamente!');
      }
    } catch (err: any) {
      this.error.set(err.message || 'Error al cambiar estado de publicación.');
    } finally {
      this.saving.set(false);
    }
  }

  async duplicate(): Promise<void> {
    const id = this.serviceId();
    if (!id) return;
    if (!confirm('¿Deseas duplicar este servicio? Se creará una copia en borrador con todos sus bloques.')) return;

    this.saving.set(true);
    try {
      const duplicated = await this.servicesApp.duplicateService(id);
      await this.router.navigate(['/admin/services', duplicated.id, 'edit']);
    } catch (err: any) {
      this.error.set(err.message || 'Error al duplicar el servicio.');
    } finally {
      this.saving.set(false);
    }
  }

  async updateLeadStatus(leadId: string, status: LeadStatus): Promise<void> {
    try {
      await this.servicesApp.updateLeadStatus(leadId, status);
      const list = [...this.leads()];
      const item = list.find(l => l.id === leadId);
      if (item) {
        item.status = status;
        this.leads.set(list);
      }
    } catch (err: any) {
      alert('Error actualizando estado del lead: ' + err.message);
    }
  }
}
