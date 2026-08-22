import {
  Component,
  inject,
  OnInit,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';

import { RouterLink, ActivatedRoute } from '@angular/router';
import { CategoryRepository } from '@app/features/products/domain/repositories/category.repository';
import { Category } from '@app/features/products/domain/entities/category.entity';
import { firstValueFrom, Subscription } from 'rxjs';
import { Pagination } from '@app/shared/components/pagination/pagination';
import { LoggerService } from '@app/core/services/logger.service';
import { NotificationService } from '@app/core/services/notification.service';

@Component({
  selector: 'app-admin-categories-page',
  standalone: true,
  imports: [RouterLink, Pagination],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './admin-categories-page.html',
})
export class AdminCategoriesPage implements OnInit {
  private categoryRepo = inject(CategoryRepository);
  private route = inject(ActivatedRoute);
  private logger = inject(LoggerService);
  private notification = inject(NotificationService);

  categories = signal<Category[]>([]);
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
      if (this.currentPage() !== page || this.categories().length === 0) {
        this.currentPage.set(page);
        this.loadCategories();
      }
    });
  }

  ngOnDestroy() {
    this.querySub?.unsubscribe();
  }

  async loadCategories() {
    this.loading.set(true);
    try {
      const res = await firstValueFrom(
        this.categoryRepo.getPaginated(
          this.currentPage(),
          this.itemsPerPage(),
          { column: 'created_at', ascending: false },
        ),
      );
      if (res) {
        this.categories.set(res.data);
        this.totalItems.set(res.total);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      this.loading.set(false);
    }
  }

  changePage(page: number) {
    this.currentPage.set(page);
    this.loadCategories();
  }

  async toggleStatus(category: any) {
    try {
      await firstValueFrom(
        this.categoryRepo.update(category.id, {
          is_active: !category.is_active,
        }),
      );
      await this.loadCategories();
      this.notification.showSuccess('Estado actualizado correctamente');
    } catch (error) {
      this.logger.error('Error updating category status', error);
      this.notification.showError('Error al actualizar el estado');
    }
  }

  async deleteCategory(category: Category) {
    if (
      !confirm(
        `¿Estás seguro de que deseas eliminar la categoría "${category.name}"?`,
      )
    ) {
      return;
    }

    try {
      await firstValueFrom(this.categoryRepo.delete(category.id));
      await this.loadCategories();
      this.notification.showSuccess('Categoría eliminada correctamente');
    } catch (error: any) {
      this.logger.error('Failed to delete category', error);
      if (
        error?.message?.includes('foreign key constraint') ||
        error?.code === '23503'
      ) {
        this.notification.showError(
          'No se puede eliminar la categoría porque hay productos que la están usando.',
        );
      } else {
        this.notification.showError('Error al eliminar la categoría');
      }
    }
  }
}
