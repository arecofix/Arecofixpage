import { Component, inject, OnInit, signal } from '@angular/core';

import { RouterLink } from '@angular/router';
import { Supplier } from '@app/features/customers/domain/entities/supplier.entity';
import { SupplierService } from '@app/features/customers/application/services/supplier.service';

@Component({
    selector: 'app-admin-suppliers-page',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './admin-suppliers-page.html',
})
export class AdminSuppliersPage implements OnInit {
    private supplierService = inject(SupplierService);
    suppliers = signal<Supplier[]>([]);
    loading = signal(true);

    async ngOnInit() {
        await this.loadSuppliers();
    }

    async loadSuppliers() {
        this.loading.set(true);
        try {
            const data = await this.supplierService.getAll();
            // Default order by name in service is better, but sorting here in memory for now
            const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
            this.suppliers.set(sortedData);
        } catch (error) {
            console.error('Error loading suppliers:', error);
        } finally {
            this.loading.set(false);
        }
    }
}
