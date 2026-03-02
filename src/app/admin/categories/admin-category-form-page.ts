import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoryService } from '@app/public/categories/services/category.service';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-admin-category-form-page',
    standalone: true,
    imports: [FormsModule, RouterLink],
    templateUrl: './admin-category-form-page.html',
})
export class AdminCategoryFormPage implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private categoryService = inject(CategoryService);

    id: string | null = null;
    categories = signal<any[]>([]);
    form = signal({
        name: '',
        slug: '',
        description: '',
        image_url: '',
        type: 'product' as 'product' | 'course' | 'service',
        parent_id: undefined as string | undefined,
        is_active: true,
    });

    loading = signal(true);
    saving = signal(false);
    error = signal<string | null>(null);

    async ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        
        // Fetch all categories for the parent dropdown
        try {
            const list = await firstValueFrom(this.categoryService.getAll());
            this.categories.set(list);
        } catch (e) {
            console.error('Error fetching parent categories:', e);
        }

        if (this.id) {
            try {
                const category = await firstValueFrom(this.categoryService.getById(this.id));
                if (category) {
                    this.form.set({
                        name: category.name,
                        slug: category.slug,
                        description: category.description || '',
                        image_url: category.image_url || (category as any).icon || '',
                        type: category.type as any,
                        parent_id: category.parent_id || undefined,
                        is_active: !!category.is_active,
                    });
                }
            } catch (e) {
                console.error('Error loading category:', e);
                this.error.set('No se pudo cargar la categoría.');
            }
        }
        this.loading.set(false);
    }

    async save() {
        this.saving.set(true);
        this.error.set(null);
        
        const payload = { ...this.form() };

        try {
            if (this.id) {
                await firstValueFrom(this.categoryService.update(this.id, payload));
            } else {
                await firstValueFrom(this.categoryService.create(payload));
            }
            this.router.navigate(['/admin/categories']);
        } catch (e: any) {
            console.error('Save error:', e);
            if (e.message?.includes('row-level security') || e.code === '42501') {
                this.error.set('Error de permisos: No tienes autorización para realizar esta acción en este tenant.');
            } else {
                this.error.set(e.message || 'Ocurrió un error al guardar la categoría.');
            }
        } finally {
            this.saving.set(false);
        }
    }
}
