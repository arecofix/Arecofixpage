import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CompanyService, CompanySettings } from '@app/core/services/company.service';
import { InvoiceService } from '@app/features/sales/application/invoice.service';
import { Invoice, InvoiceItem } from '@app/features/sales/domain/entities/invoice.entity';

@Component({
    selector: 'app-admin-invoice-detail-page',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './admin-invoice-detail-page.html',
})
export class AdminInvoiceDetailPage implements OnInit {
    private route = inject(ActivatedRoute);
    private companyService = inject(CompanyService);
    private invoiceService = inject(InvoiceService);

    invoice = signal<Invoice | null>(null);
    items = signal<InvoiceItem[]>([]);
    company = signal<CompanySettings | null>(null);
    loading = signal(true);

    error = signal('');
    
    async ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        
        try {
            // Fetch company settings
            const companyData = await this.companyService.getSettings();
            if (companyData) {
                this.company.set(companyData);
            }

            if (id) {
                const result = await this.invoiceService.getInvoiceWithDetails(id);
                if (result.invoice) {
                    this.invoice.set(result.invoice);
                    this.items.set(result.items);
                } else {
                    this.error.set('Factura no encontrada');
                }
            }
        } catch (e: unknown) {
            console.error('Error loading invoice:', e);
            const errorMessage = e instanceof Error ? e.message : 'Error al cargar la factura';
            this.error.set(errorMessage);
        } finally {
            this.loading.set(false);
        }
    }

    print() {
        window.print();
    }
}
