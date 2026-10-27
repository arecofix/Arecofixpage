import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { ServicesApplicationService } from '@app/features/services/application/services/services-application.service';
import { ServiceDto } from '@app/features/services/domain/dtos/service.dto';

@Component({
  selector: 'app-public-services-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './public-services-list.component.html',
})
export class PublicServicesListComponent implements OnInit {
  private servicesApp = inject(ServicesApplicationService);
  private titleService = inject(Title);
  private metaService = inject(Meta);

  services = signal<ServiceDto[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    this.setSeoMeta();
    await this.loadServices();
  }

  private setSeoMeta(): void {
    this.titleService.setTitle('Servicios Profesionales de Tecnología y Reparación | Arecofix');
    this.metaService.updateTag({
      name: 'description',
      content: 'Conocé todos los servicios de Arecofix: desarrollo de software, auditoría técnica, reparación de celulares y computadoras en Marcos Paz.',
    });
    this.metaService.updateTag({ property: 'og:title', content: 'Servicios Profesionales | Arecofix' });
    this.metaService.updateTag({ property: 'og:description', content: 'Soluciones tecnológicas y soporte técnico especializado.' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://arecofix.com.ar/servicios' });
  }

  async loadServices(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const data = await this.servicesApp.getPublicServices();
      this.services.set(data);
    } catch (err: any) {
      console.error('Error cargando servicios públicos:', err);
      this.error.set('No se pudieron cargar los servicios en este momento.');
    } finally {
      this.loading.set(false);
    }
  }
}
