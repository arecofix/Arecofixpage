import { Component, inject, OnInit, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SupplierService } from '@app/features/customers/application/services/supplier.service';

@Component({
    selector: 'app-admin-supplier-form-page',
    standalone: true,
    imports: [FormsModule, RouterLink],
    templateUrl: './admin-supplier-form-page.html',
})
export class AdminSupplierFormPage implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private supplierService = inject(SupplierService);

    id: string | null = null;
    form = signal({
        name: '',
        type: '',
        rubro: '',
        address: '',
        cuil: '',
        email: '',
        phone: '',
        is_active: true,
    });

    loading = signal(true);
    saving = signal(false);
    error = signal<string | null>(null);

    async ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        if (this.id) {
            try {
                const data = await this.supplierService.getById(this.id);
                if (data) {
                    this.form.set({
                        name: data.name,
                        type: data.type || '',
                        rubro: data.rubro || '',
                        address: data.address || '',
                        cuil: data.tax_id || '', // Map tax_id to cuil
                        email: data.email || '',
                        phone: data.phone || '',
                        is_active: data.is_active,
                    });
                }
            } catch (error) {
                console.error('Error loading supplier:', error);
                this.error.set('Error loading supplier details.');
            }
        }
        this.loading.set(false);
    }

    async save() {
        this.saving.set(true);
        this.error.set(null);
        
        const payload: any = {
            name: this.form().name,
            type: this.form().type,
            rubro: this.form().rubro,
            address: this.form().address,
            tax_id: this.form().cuil, // Map cuil to tax_id
            email: this.form().email,
            phone: this.form().phone,
            is_active: this.form().is_active
        };

        try {
            if (this.id) {
                await this.supplierService.update(this.id, payload);
            } else {
                await this.supplierService.create(payload);
            }
            this.router.navigate(['/admin/suppliers']);
        } catch (e: any) {
            this.error.set(e.message);
        } finally {
            this.saving.set(false);
        }
    }
}
