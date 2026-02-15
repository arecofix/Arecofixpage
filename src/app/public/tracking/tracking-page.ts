import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { TrackingService } from './services/tracking.service';
import { Repair } from '../../features/repairs/domain/entities/repair.entity';
import { LoggerService } from '../../core/services/logger.service';

@Component({
    selector: 'app-tracking-page',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './tracking-page.html',
})
export class TrackingPage implements OnInit {
    private route = inject(ActivatedRoute);
    private trackingService = inject(TrackingService);
    private logger = inject(LoggerService);
    whatsappNumber = environment.contact.whatsappNumber;

    code: string | null = null;
    repair = signal<Repair | null>(null);
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
        const code = this.code;
        if (!code) return;

        try {
            const { data, error } = await this.trackingService.getRepairByCode(code);

            if (error) {
                this.logger.error('Error fetching repair:', error);
                this.error.set(`Error al buscar la reparación. Por favor intente nuevamente.`);
            } else if (data && Array.isArray(data) && data.length > 0) {
                // The RPC returns a partial structure matching the table, which matches our Repair entity
                this.repair.set(data[0] as Repair);
            } else {
                this.error.set('No se encontró ninguna reparación con este código.');
            }
        } catch (e: unknown) {
            this.logger.error('TrackingPage: Unexpected error:', e);
            this.error.set('Ocurrió un error inesperado al procesar su solicitud.');
        } finally {
            this.loading.set(false);
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

    openImage(url: string) {
        window.open(url, '_blank');
    }
}
