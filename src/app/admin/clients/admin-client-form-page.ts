import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/services/auth.service';

@Component({
    selector: 'app-admin-client-form-page',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './admin-client-form-page.html',
})
export class AdminClientFormPage implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private auth = inject(AuthService);

    id: string | null = null;
    form = signal({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        dni: '',
    });

    loading = signal(true);
    saving = signal(false);
    error = signal<string | null>(null);

    async ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        if (this.id) {
            const supabase = this.auth.getSupabaseClient();
            const { data, error } = await supabase.from('profiles').select('*').eq('id', this.id).single();
            if (data) {
                this.form.set({
                    first_name: data.first_name || '',
                    last_name: data.last_name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    address: data.address || '', // Assuming address exists in profiles
                    dni: data.dni || '', // Assuming dni exists in profiles
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

        try {
            if (this.id) {
                const { error } = await supabase.from('profiles').update(payload).eq('id', this.id);
                if (error) throw error;
            } else {
                // Creating a new user is complex (requires auth.users insert).
                // For now, we might just show an error or handle it differently.
                // Or we can use a separate 'clients' table if we want to manage non-user clients.
                // But for now, let's assume we are editing existing users.
                throw new Error('Creación de nuevos usuarios debe hacerse desde el registro.');
            }
            this.router.navigate(['/admin/clients']);
        } catch (e: any) {
            this.error.set(e.message);
        } finally {
            this.saving.set(false);
        }
    }
}
