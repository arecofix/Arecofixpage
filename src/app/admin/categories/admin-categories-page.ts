import { Component, inject, OnInit, signal } from '@angular/core';

import { RouterLink } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { Category } from '@app/features/products/domain/entities/category.entity';

@Component({
    selector: 'app-admin-categories-page',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './admin-categories-page.html',
})
export class AdminCategoriesPage implements OnInit {
    private auth = inject(AuthService);
    categories = signal<Category[]>([]);
    loading = signal(true);

    async ngOnInit() {
        await this.loadCategories();
    }

    async loadCategories() {
        this.loading.set(true);
        const supabase = this.auth.getSupabaseClient();
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) {
            this.categories.set(data);
        }
        this.loading.set(false);
    }

    async toggleStatus(category: any) {
        const supabase = this.auth.getSupabaseClient();
        const { error } = await supabase
            .from('categories')
            .update({ is_active: !category.is_active })
            .eq('id', category.id);

        if (!error) {
            await this.loadCategories();
        }
    }
}
