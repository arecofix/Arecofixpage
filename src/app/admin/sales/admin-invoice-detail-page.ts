import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { CompanyService } from '@app/core/services/company.service';
import { TenantService } from '@app/core/services/tenant.service';

@Component({
    selector: 'app-admin-invoice-detail-page',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './admin-invoice-detail-page.html',
})
export class AdminInvoiceDetailPage implements OnInit {
    private route = inject(ActivatedRoute);
    private auth = inject(AuthService);
    private companyService = inject(CompanyService);
    private tenantService = inject(TenantService);

    invoice = signal<any>(null);
    items = signal<any[]>([]);
    company = signal<any>(null);
    loading = signal(true);

    error = signal('');
    
    async ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        const supabase = this.auth.getSupabaseClient();
        
        try {
            // Fetch company settings
            const companyData = await this.companyService.getSettings();
            if (companyData) {
                this.company.set(companyData);
            }

            if (id) {
                // Fetch invoice
                const { data: invoice, error: invoiceError } = await supabase
                    .from('invoices')
                    .select('*, sales(*)')
                    .eq('id', id)
                    .eq('tenant_id', this.tenantService.getTenantId())
                    .single();

                if (invoiceError) throw invoiceError;

                if (invoice) {
                    this.invoice.set(invoice);

                    // Fetch items
                    if (invoice.sales?.id) {
                        const { data: items, error: itemsError } = await supabase
                            .from('sale_items')
                            .select('*, products(name)')
                            .eq('sale_id', invoice.sales.id)
                            .eq('tenant_id', this.tenantService.getTenantId());
                        
                        if (itemsError) {
                            console.error('Error fetching items:', itemsError);
                            // Don't block page render on items error
                        } else if (items) {
                            this.items.set(items);
                        }
                    }
                }
            }
        } catch (e: any) {
            console.error('Error loading invoice:', e);
            this.error.set(e.message || 'Error al cargar la factura');
        } finally {
            this.loading.set(false);
        }
    }

    print() {
        window.print();
    }
}
