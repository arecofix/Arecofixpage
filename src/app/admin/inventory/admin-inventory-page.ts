import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '@app/services/auth.service';

@Component({
    selector: 'app-admin-inventory-page',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './admin-inventory-page.html',
})
export class AdminInventoryPage implements OnInit {
    private auth = inject(AuthService);
    products = signal<any[]>([]);
    loading = signal(true);

    async ngOnInit() {
        await this.loadInventory();
    }

    async loadInventory() {
        this.loading.set(true);
        const supabase = this.auth.getSupabaseClient();
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('stock', { ascending: true }); // Low stock first

        if (data) {
            this.products.set(data);
        }
        this.loading.set(false);
    }
}
