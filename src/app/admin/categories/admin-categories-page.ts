import { Component, inject, OnInit, signal } from '@angular/core';

import { RouterLink } from '@angular/router';
import { CategoryRepository } from '@app/features/products/domain/repositories/category.repository';
import { Category } from '@app/features/products/domain/entities/category.entity';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-admin-categories-page',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './admin-categories-page.html',
})
export class AdminCategoriesPage implements OnInit {
    private categoryRepo = inject(CategoryRepository);
    categories = signal<Category[]>([]);
    loading = signal(true);

    async ngOnInit() {
        await this.loadCategories();
    }

    async loadCategories() {
        this.loading.set(true);
        try {
            const data = await firstValueFrom(this.categoryRepo.getAll({ column: 'created_at', ascending: false }));
            if (data) {
                this.categories.set(data);
            }
        } catch (error) {
            console.error('Error loading categories:', error);
        } finally {
            this.loading.set(false);
        }
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
