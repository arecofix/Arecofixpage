import { Component, inject, OnInit, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { EmployeeService } from '@app/features/customers/application/services/employee.service';

@Component({
    selector: 'app-admin-employee-form-page',
    standalone: true,
    imports: [FormsModule, RouterLink],
    templateUrl: './admin-employee-form-page.html',
})
export class AdminEmployeeFormPage implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private auth = inject(AuthService);
    private employeeService = inject(EmployeeService);

    id: string | null = null;
    form = signal({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        role: 'staff',
        avatar_url: '',
        password: '',
    });

    loading = signal(true);
    saving = signal(false);
    error = signal<string | null>(null);

    async ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        if (this.id) {
            try {
                const data = await this.employeeService.getById(this.id);
                if (data) {
                    this.form.set({
                        first_name: data.first_name || '',
                        last_name: data.last_name || '',
                        email: data.email || '',
                        phone: data.phone || '',
                        role: data.role || 'staff',
                        avatar_url: data.avatar_url || '',
                        password: '', // We don't fetch passwords, it's only here to satisfy type logic when saving
                    });
                }
            } catch (error) {
                console.error('Error fetching employee:', error);
                this.error.set('No se pudo cargar el empleado.');
            }
        }
        this.loading.set(false);
    }

    async onFileChange(event: any) {
        const file: File = event.target.files?.[0];
        if (!file) return;
        const supabase = this.auth.getSupabaseClient();
        const filePath = `avatars/${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage.from('public-assets').upload(filePath, file);
        if (error) {
            this.error.set(error.message);
            return;
        }
        const { data: publicUrl } = supabase.storage.from('public-assets').getPublicUrl(data.path);
        this.form.update((f) => ({ ...f, avatar_url: publicUrl.publicUrl }));
    }

    async save() {
        this.saving.set(true);
        this.error.set(null);
        
        // Exclude password from standard updates
        const { password, ...updatePayload } = this.form();

        try {
            if (this.id) {
                await this.employeeService.update(this.id, updatePayload);
            } else {
                if (!password || password.length < 6) {
                    throw new Error('La contraseña debe tener al menos 6 caracteres.');
                }
                const payloadWithPassword = { ...updatePayload, password };
                await this.employeeService.create(payloadWithPassword);
            }
            this.router.navigate(['/admin/employees']);
        } catch (e: any) {
            this.error.set(e.message || 'Error al guardar el empleado.');
            console.error('Employee Save Error:', e);
        } finally {
            this.saving.set(false);
        }
    }
}
