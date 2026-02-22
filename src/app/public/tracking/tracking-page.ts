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

    getStatusLabel(statusId: number): string {
        const statusMap: Record<number, string> = {
            1: 'Pendiente',
            2: 'En Progreso',
            3: 'Esperando Repuestos',
            4: 'Completado',
            5: 'Entregado',
            6: 'Cancelado'
        };
        return statusMap[statusId] || 'Pendiente';
    }

    getStatusColor(statusId: number): string {
        const colorMap: Record<number, string> = {
            1: 'badge-warning',
            2: 'badge-info',
            3: 'badge-secondary',
            4: 'badge-success',
            5: 'badge-success',
            6: 'badge-error'
        };
        return colorMap[statusId] || 'badge-ghost';
    }

    openImage(url: string) {
        if (typeof window !== 'undefined') {
            window.open(url, '_blank');
        }
    }
}
