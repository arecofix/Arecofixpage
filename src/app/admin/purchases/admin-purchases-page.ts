import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { Purchase } from '@app/features/sales/domain/entities/purchase.entity';

@Component({
    selector: 'app-admin-purchases-page',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './admin-purchases-page.html',
})
export class AdminPurchasesPage implements OnInit {
    private auth = inject(AuthService);
    purchases = signal<Purchase[]>([]);
    loading = signal(true);

    async ngOnInit() {
        await this.loadPurchases();
    }

    async loadPurchases() {
        this.loading.set(true);
        const supabase = this.auth.getSupabaseClient();
        const { data, error } = await supabase
            .from('purchases')
            .select('*, suppliers(name)')
            .order('created_at', { ascending: false });

        if (data) {
            this.purchases.set(data);
        }
        this.loading.set(false);
    }
}
