import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppCatalogService } from '@app/features/products/application/services/app-catalog.service';
import { AppServiceEntity } from '@app/features/products/domain/entities/app-service.entity';

@Component({
  selector: 'app-admin-services-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-services-page.html',
})
export class AdminServicesPage implements OnInit {
  private catalogService = inject(AppCatalogService);
  services = signal<AppServiceEntity[]>([]);
  loading = signal(true);

  async ngOnInit() {
    await this.loadServices();
  }

  async loadServices() {
    this.loading.set(true);
    try {
      const data = await this.catalogService.getAll();
      this.services.set(data);
    } catch (e: unknown) {
      if (e instanceof Error) console.error('Error loading services', e.message);
    } finally {
      this.loading.set(false);
    }
  }

  async deleteService(id: string) {
    if (!confirm('¿Estás seguro de eliminar este servicio?')) return;

    try {
      await this.catalogService.delete(id);
      await this.loadServices();
    } catch (e: unknown) {
      alert('Error al eliminar el servicio');
    }
  }
}

