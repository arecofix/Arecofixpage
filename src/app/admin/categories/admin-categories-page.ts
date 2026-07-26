import { Component, inject, OnInit, signal, computed } from '@angular/core';

import { RouterLink, ActivatedRoute } from '@angular/router';
import { CategoryRepository } from '@app/features/products/domain/repositories/category.repository';
import { Category } from '@app/features/products/domain/entities/category.entity';
import { firstValueFrom, Subscription } from 'rxjs';
import { Pagination } from '@app/shared/components/pagination/pagination';

@Component({
    selector: 'app-admin-categories-page',
    standalone: true,
    imports: [RouterLink, Pagination],
    templateUrl: './admin-categories-page.html',
})
export class AdminCategoriesPage implements OnInit {
    private categoryRepo = inject(CategoryRepository);
    private route = inject(ActivatedRoute);

    categories = signal<Category[]>([]);
    loading = signal(true);
    
    currentPage = signal(1);
    itemsPerPage = signal(24);
    totalItems = signal(0);
    totalPages = computed(() => Math.max(1, Math.ceil(this.totalItems() / this.itemsPerPage())));

    private querySub?: Subscription;

    async ngOnInit() {
        this.querySub = this.route.queryParams.subscribe(params => {
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
            const res = await firstValueFrom(this.categoryRepo.getPaginated(this.currentPage(), this.itemsPerPage(), { column: 'created_at', ascending: false }));
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
            await firstValueFrom(this.categoryRepo.update(category.id, { is_active: !category.is_active }));
            await this.loadCategories();
        } catch (error) {
            console.error('Error updating category status:', error);
        }
    }
}
