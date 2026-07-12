import { Component, inject, OnInit, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AppCatalogService } from '@app/features/products/application/services/app-catalog.service';

@Component({
    selector: 'app-admin-service-form-page',
    standalone: true,
    imports: [FormsModule, RouterLink],
    templateUrl: './admin-service-form-page.html',
})
export class AdminServiceFormPage implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private catalogService = inject(AppCatalogService);

    id: string | null = null;
    form = signal({
        name: '',
        slug: '',
        description: '',
        price: 0,
        duration_minutes: 60,
        image_url: '',
        icon: 'fa-tools',
        features: '',
        is_active: true
    });

    loading = signal(true);
    saving = signal(false);
    error = signal<string | null>(null);

    async ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        if (this.id) {
            try {
                const data = await this.catalogService.getById(this.id);
                if (data) {
                    let desc = data.description || '';
                    let icon = 'fa-tools';
                    let features = '';

                    if (desc.trim().startsWith('{') && desc.trim().endsWith('}')) {
                        try {
                            const parsed = JSON.parse(desc);
                            desc = parsed.description || '';
                            icon = parsed.icon || 'fa-tools';
                            features = parsed.features ? parsed.features.join('\n') : '';
                        } catch (e) {
                            // fallback to plain text
                        }
                    }

                    this.form.set({
                        name: data.name,
                        slug: data.slug || '',
                        description: desc,
                        price: data.price || 0,
                        duration_minutes: data.duration_minutes || 60,
                        image_url: data.image_url || '',
                        icon: icon,
                        features: features,
                        is_active: data.is_active
                    });
                }
            } catch (err) {
                console.error('Error loading service:', err);
                this.error.set('Error loading service details.');
            }
        }
        this.loading.set(false);
    }

    slugify(text: string): string {
        return text
            .toString()
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    }

    async save() {
        this.saving.set(true);
        this.error.set(null);

        const rawForm = this.form();
        const featuresArray = rawForm.features
            ? rawForm.features.split('\n').map(f => f.trim()).filter(f => f.length > 0)
            : [];
        
        const serializedDescription = JSON.stringify({
            description: rawForm.description,
            icon: rawForm.icon || 'fa-tools',
            features: featuresArray
        });

        const payload = {
            name: rawForm.name,
            slug: rawForm.slug.trim() || this.slugify(rawForm.name),
            description: serializedDescription,
            price: Number(rawForm.price),
            duration_minutes: Number(rawForm.duration_minutes),
            image_url: rawForm.image_url.trim() || undefined,
            is_active: rawForm.is_active
        };

        try {
            if (this.id) {
                await this.catalogService.update(this.id, payload);
            } else {
                await this.catalogService.create(payload);
            }
            this.router.navigate(['/admin/services']);
        } catch (e: unknown) {
            console.error('Error saving service:', e);
            this.error.set((e instanceof Error ? e.message : String(e)) || 'Error al guardar el servicio. Verifica los datos.');
        } finally {
            this.saving.set(false);
        }
    }
}

