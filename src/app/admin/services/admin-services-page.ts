import {
  Component,
  inject,
  OnInit,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ServicesApplicationService } from '@app/features/services/application/services/services-application.service';
import { ServiceDto } from '@app/features/services/domain/dtos/service.dto';
import { Pagination } from '@app/shared/components/pagination/pagination';

@Component({
  selector: 'app-admin-services-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, Pagination],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-services-page.html',
})
export class AdminServicesPage implements OnInit {
  private servicesApp = inject(ServicesApplicationService);
  private route = inject(ActivatedRoute);

  services = signal<ServiceDto[]>([]);
  loading = signal(true);
  search = signal('');
  filterStatus = signal<'all' | 'published' | 'draft'>('all');

  currentPage = signal(1);
  itemsPerPage = signal(20);
  totalItems = signal(0);
  totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalItems() / this.itemsPerPage()))
  );

  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe(params => {
      const page = parseInt(params['_page']) || 1;
      this.currentPage.set(page);
      this.loadServices();
    });
  }

  async loadServices(): Promise<void> {
    this.loading.set(true);
    try {
      const isPublishedFilter =
        this.filterStatus() === 'published'
          ? true
          : this.filterStatus() === 'draft'
          ? false
          : undefined;

      const res = await this.servicesApp.getPaginatedServices({
        page: this.currentPage(),
        limit: this.itemsPerPage(),
        search: this.search().trim() || undefined,
        isPublished: isPublishedFilter,
      });

      this.services.set(res.data);
      this.totalItems.set(res.total);
    } catch (e: any) {
      console.error('Error cargando servicios:', e);
    } finally {
      this.loading.set(false);
    }
  }

  onSearchChange(): void {
    this.currentPage.set(1);
    this.loadServices();
  }

  onFilterStatusChange(status: 'all' | 'published' | 'draft'): void {
    this.filterStatus.set(status);
    this.currentPage.set(1);
    this.loadServices();
  }

  changePage(page: number): void {
    this.currentPage.set(page);
    this.loadServices();
  }

  async duplicateService(id: string): Promise<void> {
    if (!confirm('¿Deseas duplicar este servicio?')) return;
    try {
      this.loading.set(true);
      await this.servicesApp.duplicateService(id);
      await this.loadServices();
    } catch (err: any) {
      alert('Error al duplicar el servicio: ' + err.message);
      this.loading.set(false);
    }
  }

  async deleteService(id: string): Promise<void> {
    if (!confirm('¿Estás seguro de eliminar este servicio? Se despublicará de la web.')) return;

    try {
      this.loading.set(true);
      await this.servicesApp.deleteService(id);
      await this.loadServices();
    } catch (e: any) {
      alert('Error al eliminar el servicio');
      this.loading.set(false);
    }
  }
}
