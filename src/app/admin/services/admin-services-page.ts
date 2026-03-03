import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppCatalogService } from '@app/features/products/application/services/app-catalog.service';

@Component({
  selector: 'app-admin-services-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-services-page.html',
})
export class AdminServicesPage implements OnInit {
  private catalogService = inject(AppCatalogService);
  services = signal<any[]>([]);
  loading = signal(true);

  async ngOnInit() {
    await this.loadServices();
  }

  async loadServices() {
    this.loading.set(true);
    try {
      const data = await this.catalogService.getAll();
      this.services.set(data);
    } catch (e: any) {
      console.error('Error loading services', e);
    } finally {
      this.loading.set(false);
    }
  }

  async deleteService(id: string) {
    if (!confirm('¿Estás seguro de eliminar este servicio?')) return;

    try {
      await this.catalogService.delete(id);
      await this.loadServices();
    } catch (e: any) {
      alert('Error al eliminar el servicio');
    }
  }
}

