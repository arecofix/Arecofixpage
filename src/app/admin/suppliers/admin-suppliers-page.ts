import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '@app/services/auth.service';

@Component({
    selector: 'app-admin-suppliers-page',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './admin-suppliers-page.html',
})
export class AdminSuppliersPage implements OnInit {
    private auth = inject(AuthService);
    suppliers = signal<any[]>([]);
    loading = signal(true);

    async ngOnInit() {
        await this.loadSuppliers();
    }

    async loadSuppliers() {
        this.loading.set(true);
        const supabase = this.auth.getSupabaseClient();
        const { data, error } = await supabase
            .from('suppliers')
            .select('*')
            .order('name');

        if (data) {
            this.suppliers.set(data);
        }
        this.loading.set(false);
    }
}
