import {
  Component,
  inject,
  OnInit,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';

import { RouterLink, ActivatedRoute } from '@angular/router';
import { BrandRepository } from '@app/features/products/domain/repositories/brand.repository';
import { Brand } from '@app/features/products/domain/entities/brand.entity';
import { LoggerService } from '@app/core/services/logger.service';
import { NotificationService } from '@app/core/services/notification.service';
import { firstValueFrom, Subscription } from 'rxjs';
import { Pagination } from '@app/shared/components/pagination/pagination';

@Component({
  selector: 'app-admin-brands-page',
  standalone: true,
  imports: [RouterLink, Pagination],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './admin-brands-page.html',
})
export class AdminBrandsPage implements OnInit {
  private brandRepo = inject(BrandRepository);
  private logger = inject(LoggerService);
  private notification = inject(NotificationService);
  private route = inject(ActivatedRoute);

  brands = signal<Brand[]>([]);
  loading = signal(true);

  currentPage = signal(1);
  itemsPerPage = signal(24);
  totalItems = signal(0);
  totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalItems() / this.itemsPerPage())),
  );

  private querySub?: Subscription;

  async ngOnInit() {
    this.querySub = this.route.queryParams.subscribe((params) => {
      const page = parseInt(params['_page']) || 1;
      if (this.currentPage() !== page || this.brands().length === 0) {
        this.currentPage.set(page);
        this.loadBrands();
      }
    });
  }

  ngOnDestroy() {
    this.querySub?.unsubscribe();
  }

  async loadBrands() {
    this.loading.set(true);
    try {
      const res = await firstValueFrom(
        this.brandRepo.getPaginated(this.currentPage(), this.itemsPerPage(), {
          column: 'name',
          ascending: true,
        }),
      );
      this.brands.set(res.data);
      this.totalItems.set(res.total);
    } catch (error) {
      this.logger.error('Failed to load brands', error);
      this.notification.showError('Error al cargar las marcas');
    } finally {
      this.loading.set(false);
    }
  }

  changePage(page: number) {
    this.currentPage.set(page);
    this.loadBrands();
  }

  async toggleStatus(brand: Brand) {
    try {
      await firstValueFrom(
        this.brandRepo.update(brand.id, { is_active: !brand.is_active }),
      );
      await this.loadBrands();
      this.notification.showSuccess('Estado actualizado correctamente');
    } catch (error) {
      this.logger.error('Failed to toggle brand status', error);
      this.notification.showError('Error al actualizar el estado');
    }
  }

  async deleteBrand(brand: Brand) {
    if (
      !confirm(`¿Estás seguro de que deseas eliminar la marca "${brand.name}"?`)
    ) {
      return;
    }

    try {
      await firstValueFrom(this.brandRepo.delete(brand.id));
      await this.loadBrands();
      this.notification.showSuccess('Marca eliminada correctamente');
    } catch (error: any) {
      this.logger.error('Failed to delete brand', error);
      if (
        error?.message?.includes('foreign key constraint') ||
        error?.code === '23503'
      ) {
        this.notification.showError(
          'No se puede eliminar la marca porque hay productos que la están usando.',
        );
      } else {
        this.notification.showError('Error al eliminar la marca');
      }
    }
  }
}
