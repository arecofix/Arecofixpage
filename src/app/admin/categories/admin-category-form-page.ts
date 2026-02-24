import { Component, inject, OnInit, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { TenantService } from '@app/core/services/tenant.service';

@Component({
    selector: 'app-admin-category-form-page',
    standalone: true,
    imports: [FormsModule, RouterLink],
    templateUrl: './admin-category-form-page.html',
})
export class AdminCategoryFormPage implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private auth = inject(AuthService);
    private tenantService = inject(TenantService);

    id: string | null = null;
    categories = signal<any[]>([]);
    form = signal({
        name: '',
        slug: '',
        description: '',
        image_url: '',
        type: 'product',
        parent_id: '' as string | null,
        is_active: true,
    });

    loading = signal(true);
    saving = signal(false);
    error = signal<string | null>(null);

    async ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        const supabase = this.auth.getSupabaseClient();
        
        // Fetch all categories for the parent dropdown
        const { data: categoriesData } = await supabase.from('categories')
            .select('id, name')
            .eq('tenant_id', this.tenantService.getTenantId())
            .eq('is_active', true)
            .order('name');
        if (categoriesData) {
            this.categories.set(categoriesData);
        }

        if (this.id) {
            const { data, error } = await supabase.from('categories')
                .select('*')
                .eq('tenant_id', this.tenantService.getTenantId())
                .eq('id', this.id)
                .single();
            if (data) {
                this.form.set({
                    name: data.name,
                    slug: data.slug,
                    description: data.description || '',
                    image_url: data.image_url || data.icon || '',
                    type: data.type,
                    parent_id: data.parent_id || null,
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
                const { error } = await supabase.from('categories')
                    .update(payload)
                    .eq('id', this.id)
                    .eq('tenant_id', this.tenantService.getTenantId());
                if (error) throw error;
            } else {
                const { error } = await supabase.from('categories').insert({
                    ...payload,
                    tenant_id: this.tenantService.getTenantId()
                });
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
