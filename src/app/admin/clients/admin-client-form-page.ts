import { Component, inject, OnInit, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CustomerService } from '@app/features/customers/application/services/customer.service';

@Component({
    selector: 'app-admin-client-form-page',
    standalone: true,
    imports: [FormsModule, RouterLink],
    templateUrl: './admin-client-form-page.html',
})
export class AdminClientFormPage implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private customerService = inject(CustomerService);

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
            try {
                const data = await this.customerService.getById(this.id);
                if (data) {
                    this.form.set({
                        first_name: data.first_name || '',
                        last_name: data.last_name || '',
                        email: data.email || '',
                        phone: data.phone || '',
                        address: data.address || '', 
                        dni: data.dni || '',
                    });
                }
            } catch (err) {
                console.error('Error loading client:', err);
                this.error.set('Error loading client details.');
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
                await this.customerService.update(this.id, payload);
            } else {
                await this.customerService.create(payload);
            }
            this.router.navigate(['/admin/clients']);
        } catch (e: any) {
            this.error.set(e.message || 'Error al registrar cliente. Asegúrate de correr la actualización SQL de la base de datos (docs/create-client-rpc.sql).');
            console.error(e);
        } finally {
            this.saving.set(false);
        }
    }
}
