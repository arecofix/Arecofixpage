import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '@app/services/auth.service';

@Component({
    selector: 'app-admin-invoices-page',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './admin-invoices-page.html',
})
export class AdminInvoicesPage implements OnInit {
    private auth = inject(AuthService);
    invoices = signal<any[]>([]);
    loading = signal(true);

    async ngOnInit() {
        await this.loadInvoices();
    }

    async loadInvoices() {
        this.loading.set(true);
        const supabase = this.auth.getSupabaseClient();
        const { data, error } = await supabase
            .from('invoices')
            .select('*, sales(*)')
            .order('issued_at', { ascending: false });

        if (data) {
            this.invoices.set(data);
        }
        this.loading.set(false);
    }
}
