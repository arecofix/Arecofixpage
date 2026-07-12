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
    styles: [`
        @media print {
            /* Default (A4 mode): hide the no-print wrapper */
            .no-print { display: none !important; }

            /* POS mode: hide the A4 content, show only ticket */
            body.print-pos-mode .px-6 { display: none !important; }
            body.print-pos-mode #pos-ticket-print { display: block !important; }
            body.print-pos-mode {
                margin: 0 !important;
                padding: 0 !important;
            }
            @page {
                /* Will be overridden per mode via JS */
                margin: 5mm;
            }
        }
    `]
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

    /** Controls print rendering mode: 'a4' for full invoice, 'pos' for 80mm ticket */
    printMode = signal<'a4' | 'pos'>('a4');

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

    /** Print in A4/PDF format (full invoice layout) */
    print() {
        this.printMode.set('a4');
        document.body.classList.remove('print-pos-mode');
        setTimeout(() => window.print(), 100);
    }

    /** Print in 80mm POS ticket format */
    printTicketPOS() {
        this.printMode.set('pos');
        document.body.classList.add('print-pos-mode');
        setTimeout(() => {
            window.print();
            // Reset after print dialog closes
            setTimeout(() => {
                document.body.classList.remove('print-pos-mode');
                this.printMode.set('a4');
            }, 1000);
        }, 150);
    }
}

