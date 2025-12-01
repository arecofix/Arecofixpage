import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/services/auth.service';

@Component({
    selector: 'app-admin-category-form-page',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './admin-category-form-page.html',
})
export class AdminCategoryFormPage implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private auth = inject(AuthService);

    id: string | null = null;
    form = signal({
        name: '',
        slug: '',
        description: '',
        icon: '',
        type: 'product',
        is_active: true,
    });

    loading = signal(true);
    saving = signal(false);
    error = signal<string | null>(null);

    async ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        if (this.id) {
            const supabase = this.auth.getSupabaseClient();
            const { data, error } = await supabase.from('categories').select('*').eq('id', this.id).single();
            if (data) {
                this.form.set({
                    name: data.name,
                    slug: data.slug,
                    description: data.description || '',
                    icon: data.icon || '',
                    type: data.type,
                    is_active: data.is_active,
                });
            }
        }
        this.loading.set(false);
    }

    async save() {
        this.saving.set(true);
        this.error.set(null);
        const supabase = this.auth.getSupabaseClient();
        const payload = { ...this.form() };

        if (!payload.slug) {
            payload.slug = this.slugify(payload.name);
        }

        try {
            if (this.id) {
                const { error } = await supabase.from('categories').update(payload).eq('id', this.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('categories').insert(payload);
                if (error) throw error;
            }
            this.router.navigate(['/admin/categories']);
        } catch (e: any) {
            this.error.set(e.message);
        } finally {
            this.saving.set(false);
        }
    }

    private slugify(text: string): string {
        return text.toString().toLowerCase().trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-');
    }
}
