import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Purchase } from '@app/features/sales/domain/entities/purchase.entity';
import { AdminPurchaseService } from './services/admin-purchase.service';

@Component({
    selector: 'app-admin-purchases-page',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './admin-purchases-page.html',
})
export class AdminPurchasesPage implements OnInit {
    private purchaseService = inject(AdminPurchaseService);
    purchases = signal<Purchase[]>([]);
    loading = signal(true);

    async ngOnInit() {
        await this.loadPurchases();
    }

    async loadPurchases() {
        this.loading.set(true);
        try {
            const data = await this.purchaseService.getPurchases();
            this.purchases.set(data);
        } catch (error) {
            console.error('Error loading purchases:', error);
        } finally {
            this.loading.set(false);
        }
    }
}
