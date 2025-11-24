import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '@app/services/auth.service';

@Component({
    selector: 'app-admin-invoice-detail-page',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './admin-invoice-detail-page.html',
})
export class AdminInvoiceDetailPage implements OnInit {
    private route = inject(ActivatedRoute);
    private auth = inject(AuthService);

    invoice = signal<any>(null);
    items = signal<any[]>([]);
    loading = signal(true);

    async ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            const supabase = this.auth.getSupabaseClient();

            // Fetch invoice
            const { data: invoice } = await supabase
                .from('invoices')
                .select('*, sales(*)')
                .eq('id', id)
                .single();

            if (invoice) {
                this.invoice.set(invoice);

                // Fetch items
                if (invoice.sales?.id) {
                    const { data: items } = await supabase
                        .from('sale_items')
                        .select('*, products(name)')
                        .eq('sale_id', invoice.sales.id);

                    if (items) {
                        this.items.set(items);
                    }
                }
            }
        }
        this.loading.set(false);
    }

    print() {
        window.print();
    }
}
