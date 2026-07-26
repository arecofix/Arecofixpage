import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { AppCatalogService } from '@app/features/products/application/services/app-catalog.service';
import { AppServiceEntity } from '@app/features/products/domain/entities/app-service.entity';
import { Pagination } from '@app/shared/components/pagination/pagination';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-services-page',
  standalone: true,
  imports: [CommonModule, RouterLink, Pagination],
  templateUrl: './admin-services-page.html',
})
export class AdminServicesPage implements OnInit {
  private catalogService = inject(AppCatalogService);
  private route = inject(ActivatedRoute);
  services = signal<AppServiceEntity[]>([]);
  loading = signal(true);
  
  currentPage = signal(1);
  itemsPerPage = signal(24);
  totalItems = signal(0);
  totalPages = computed(() => Math.max(1, Math.ceil(this.totalItems() / this.itemsPerPage())));

  private querySub?: Subscription;

  async ngOnInit() {
    this.querySub = this.route.queryParams.subscribe(params => {
      const page = parseInt(params['_page']) || 1;
      if (this.currentPage() !== page || this.services().length === 0) {
        this.currentPage.set(page);
        this.loadServices();
      }
    });
  }

  ngOnDestroy() {
    this.querySub?.unsubscribe();
  }

  async loadServices() {
    this.loading.set(true);
    try {
      const res = await this.catalogService.getPaginated(this.currentPage(), this.itemsPerPage());
      this.services.set(res.data);
      this.totalItems.set(res.total);
    } catch (e: unknown) {
      if (e instanceof Error) console.error('Error loading services', e.message);
    } finally {
      this.loading.set(false);
    }
  }

  changePage(page: number) {
    this.currentPage.set(page);
    this.loadServices();
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

