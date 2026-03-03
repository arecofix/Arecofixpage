import { Component, inject, OnInit, signal } from '@angular/core';

import { RouterLink } from '@angular/router';
import { CustomerService } from '@app/features/customers/application/services/customer.service';
import { UserProfile } from '@app/features/authentication/domain/entities/user.entity';

@Component({
    selector: 'app-admin-clients-page',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './admin-clients-page.html',
})
export class AdminClientsPage implements OnInit {
    private customerService = inject(CustomerService);
    clients = signal<UserProfile[]>([]);
    loading = signal(true);

    async ngOnInit() {
        await this.loadClients();
    }

    async loadClients() {
        this.loading.set(true);
        try {
            const data = await this.customerService.getAll();
            this.clients.set(data);
        } catch (error) {
            console.error('Error loading clients:', error);
        } finally {
            this.loading.set(false);
        }
    }
}
