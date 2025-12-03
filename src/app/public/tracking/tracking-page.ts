import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-tracking-page',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './tracking-page.html',
})
export class TrackingPage implements OnInit {
    private route = inject(ActivatedRoute);
    private auth = inject(AuthService);
    whatsappNumber = environment.contact.whatsappNumber;

    code: string | null = null;
    repair = signal<any>(null);
    loading = signal(true);
    error = signal<string | null>(null);

    async ngOnInit() {
        this.code = this.route.snapshot.paramMap.get('code');
        if (this.code) {
            await this.loadRepair();
        } else {
            this.error.set('Código de seguimiento no válido.');
            this.loading.set(false);
        }
    }

    async loadRepair() {
        console.log('TrackingPage: loadRepair started. Code:', this.code);
        const supabase = this.auth.getSupabaseClient();
        console.log('TrackingPage: Supabase client obtained:', !!supabase);

        try {
            // Use the RPC function we defined in the migration for secure access
            console.log('TrackingPage: Calling rpc get_repair_by_tracking...');
            const { data, error } = await supabase.rpc('get_repair_by_tracking', { code: this.code });
            console.log('TrackingPage: RPC result:', { data, error });

            if (error) {
                console.error('Error fetching repair:', error);
                // Show the actual error message to the user for debugging
                this.error.set(`Error: ${error.message || JSON.stringify(error)}`);
            } else if (data && data.length > 0) {
                console.log('TrackingPage: Repair found:', data[0]);
                this.repair.set(data[0]);
            } else {
                console.warn('TrackingPage: No repair found for code:', this.code);
                this.error.set('No se encontró ninguna reparación con este código.');
            }
        } catch (e: any) {
            console.error('TrackingPage: Unexpected error:', e);
            this.error.set(`Error inesperado: ${e.message || e}`);
        } finally {
            this.loading.set(false);
            console.log('TrackingPage: Loading set to false');
        }
    }

    getStatusLabel(status: string): string {
        const statusMap: Record<string, string> = {
            'pending': 'Pendiente',
            'in_progress': 'En Progreso',
            'completed': 'Completado',
            'delivered': 'Entregado',
            'cancelled': 'Cancelado'
        };
        return statusMap[status] || status;
    }

    getStatusColor(status: string): string {
        const colorMap: Record<string, string> = {
            'pending': 'badge-warning',
            'in_progress': 'badge-info',
            'completed': 'badge-success',
            'delivered': 'badge-success',
            'cancelled': 'badge-error'
        };
        return colorMap[status] || 'badge-ghost';
    }
}
