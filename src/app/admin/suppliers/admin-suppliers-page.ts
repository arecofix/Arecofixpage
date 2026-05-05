import { Component, inject, OnInit, signal } from '@angular/core';

import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Supplier } from '@app/features/customers/domain/entities/supplier.entity';
import { SupplierService } from '@app/features/customers/application/services/supplier.service';

@Component({
    selector: 'app-admin-suppliers-page',
    standalone: true,
    imports: [RouterLink, FormsModule],
    templateUrl: './admin-suppliers-page.html',
})
export class AdminSuppliersPage implements OnInit {
    private supplierService = inject(SupplierService);
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
