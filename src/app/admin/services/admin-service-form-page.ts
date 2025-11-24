import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/services/auth.service';

@Component({
    selector: 'app-admin-service-form-page',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './admin-service-form-page.html',
})
export class AdminServiceFormPage implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private auth = inject(AuthService);

    id: string | null = null;
    form = signal({
        name: '',
        description: '',
        price: 0,
        duration_minutes: 60,
        is_active: true
    });

    loading = signal(true);
    saving = signal(false);
    error = signal<string | null>(null);

    async ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        if (this.id) {
            const supabase = this.auth.getSupabaseClient();
            const { data, error } = await supabase.from('services').select('*').eq('id', this.id).single();
            if (data) {
                this.form.set({
                    name: data.name,
                    description: data.description || '',
                    price: data.price || 0,
                    duration_minutes: data.duration_minutes || 60,
                    is_active: data.is_active
                });
            }
        }
        this.loading.set(false);
    }

    async save() {
        this.saving.set(true);
        this.error.set(null);
        const supabase = this.auth.getSupabaseClient();

        const rawForm = this.form();
        const payload = {
            name: rawForm.name,
            description: rawForm.description,
            price: Number(rawForm.price),
            duration_minutes: Number(rawForm.duration_minutes),
            is_active: rawForm.is_active
        };

        try {
            if (this.id) {
                const { error } = await supabase.from('services').update(payload).eq('id', this.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('services').insert(payload);
                if (error) throw error;
            }
            this.router.navigate(['/admin/services']);
        } catch (e: any) {
            console.error('Error saving service:', e);
            this.error.set(e.message || 'Error al guardar el servicio. Verifica los datos.');
        } finally {
            this.saving.set(false);
        }
    }
}
