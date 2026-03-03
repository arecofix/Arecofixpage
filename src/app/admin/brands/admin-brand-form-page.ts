import { Component, inject, OnInit, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { BrandRepository } from '@app/features/products/domain/repositories/brand.repository';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-admin-brand-form-page',
    standalone: true,
    imports: [FormsModule, RouterLink],
    templateUrl: './admin-brand-form-page.html',
})
export class AdminBrandFormPage implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private auth = inject(AuthService);
    private brandRepo = inject(BrandRepository);

    id: string | null = null;
    form = signal({
        name: '',
        slug: '',
        logo_url: '',
        is_active: true,
    });

    loading = signal(true);
    saving = signal(false);
    error = signal<string | null>(null);

    async ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        if (this.id) {
            try {
                const data = await firstValueFrom(this.brandRepo.getById(this.id));
                if (data) {
                    this.form.set({
                        name: data.name || '',
                        slug: data.slug || '',
                        logo_url: data.logo_url || '',
                        is_active: data.is_active ?? true,
                    });
                }
            } catch (err) {
                console.error('Error loading brand:', err);
                this.error.set('Error al cargar la marca.');
            }
        }
        this.loading.set(false);
    }

    async onFileChange(event: any) {
        const file: File = event.target.files?.[0];
        if (!file) return;
        const supabase = this.auth.getSupabaseClient();
        const filePath = `brands/${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage.from('public-assets').upload(filePath, file);
        if (error) {
            this.error.set(error.message);
            return;
        }
        const { data: publicUrl } = supabase.storage.from('public-assets').getPublicUrl(data.path);
        this.form.update((f) => ({ ...f, logo_url: publicUrl.publicUrl }));
    }

    async save() {
        this.saving.set(true);
        this.error.set(null);
        
        const payload = { ...this.form() };

        if (!payload.slug) {
            payload.slug = this.slugify(payload.name);
        }

        try {
            if (this.id) {
                await firstValueFrom(this.brandRepo.update(this.id, payload as any));
            } else {
                await firstValueFrom(this.brandRepo.create(payload as any));
            }
            this.router.navigate(['/admin/brands']);
        } catch (e: any) {
            this.error.set(e.message || 'Error al guardar la marca');
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
