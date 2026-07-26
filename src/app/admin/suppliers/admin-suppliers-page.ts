import { Component, inject, OnInit, signal, computed } from '@angular/core';

import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Supplier } from '@app/features/customers/domain/entities/supplier.entity';
import { SupplierService } from '@app/features/customers/application/services/supplier.service';
import { Pagination } from '@app/shared/components/pagination/pagination';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-admin-suppliers-page',
    standalone: true,
    imports: [RouterLink, FormsModule, Pagination],
    templateUrl: './admin-suppliers-page.html',
})
export class AdminSuppliersPage implements OnInit {
    private supplierService = inject(SupplierService);
    private route = inject(ActivatedRoute);
    suppliers = signal<Supplier[]>([]);
    loading = signal(true);

    // Logistics specific
    isTrackingModalOpen = signal(false);
    andreaniTrackingCode = signal<string>('');
    trackingUrl = signal<string | null>(null);

    // Messaging specific
    selectedSupplierIds = signal<Set<string>>(new Set());
    isMessageModalOpen = signal(false);
    bulkMessage = signal<string>('Hola {nombre}, te contacto desde Arecofix. ');

    currentPage = signal(1);
    itemsPerPage = signal(24);
    totalItems = signal(0);
    totalPages = computed(() => Math.max(1, Math.ceil(this.totalItems() / this.itemsPerPage())));

    private querySub?: Subscription;

    async ngOnInit() {
        this.querySub = this.route.queryParams.subscribe(params => {
            const page = parseInt(params['_page']) || 1;
            if (this.currentPage() !== page || this.suppliers().length === 0) {
                this.currentPage.set(page);
                this.loadSuppliers();
            }
        });
    }

    ngOnDestroy() {
        this.querySub?.unsubscribe();
    }

    async loadSuppliers() {
        this.loading.set(true);
        try {
            const res = await this.supplierService.getPaginated(this.currentPage(), this.itemsPerPage());
            const sortedData = res.data.sort((a, b) => a.name.localeCompare(b.name));
            this.suppliers.set(sortedData);
            this.totalItems.set(res.total);
        } catch (error) {
            console.error('Error loading suppliers:', error);
        } finally {
            this.loading.set(false);
        }
    }

    changePage(page: number) {
        this.currentPage.set(page);
        this.loadSuppliers();
    }

    openTracker() {
        this.andreaniTrackingCode.set('');
        this.trackingUrl.set(null);
        this.isTrackingModalOpen.set(true);
    }

    trackAndreani(code: string) {
        if (!code) return;
        this.andreaniTrackingCode.set(code);
        // Genera la URL pública de Andreani para visualización
        this.trackingUrl.set(`https://seguimiento.andreani.com/envio/${code}`);
    }

    // --- Bulk Messaging Logic ---
    toggleSupplier(id: string) {
        const s = new Set(this.selectedSupplierIds());
        if (s.has(id)) s.delete(id);
        else s.add(id);
        this.selectedSupplierIds.set(s);
    }

    toggleAll(event: Event) {
        const checked = (event.target as HTMLInputElement).checked;
        if (checked) {
            const allIds = this.suppliers().filter(s => s.phone).map(s => s.id);
            this.selectedSupplierIds.set(new Set(allIds));
        } else {
            this.selectedSupplierIds.set(new Set());
        }
    }

    sendBulkMessages() {
        const suppliers = this.suppliers().filter(s => this.selectedSupplierIds().has(s.id) && s.phone);
        const baseMsg = this.bulkMessage();
        let delay = 0;
        
        for (const supp of suppliers) {
            setTimeout(() => {
                const finalMsg = baseMsg.replace('{nombre}', supp.name || 'Proveedor');
                const cleanPhone = supp.phone!.replace(/\D/g, '');
                // Check if it starts with country code, if not prepend 549 (Argentina)
                const phoneWithCode = cleanPhone.startsWith('54') ? cleanPhone : `549${cleanPhone}`;
                const wUrl = `https://wa.me/${phoneWithCode}?text=${encodeURIComponent(finalMsg)}`;
                window.open(wUrl, '_blank');
            }, delay);
            delay += 1000; // Open one tab every 1 second
        }
        
        this.isMessageModalOpen.set(false);
        this.selectedSupplierIds.set(new Set());
    }
}
