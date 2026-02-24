import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { TrackingService } from './services/tracking.service';
import { Repair, RepairStatus } from '../../features/repairs/domain/entities/repair.entity';
import { LoggerService } from '../../core/services/logger.service';
import { SeoService } from '../../core/services/seo.service';
import { CompanyService } from '../../core/services/company.service';

@Component({
    selector: 'app-tracking-page',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './tracking-page.html',
    styles: [`
        @media print {
            .no-print {
                display: none !important;
            }
            .print-only {
                display: block !important;
            }
            body {
                background: white;
            }
            .ticket-container {
                border: 1px dashed #000;
                padding: 20px;
                width: 100%;
                margin: 0;
            }
        }
        .print-only {
            display: none;
        }
    `]
})
export class TrackingPage implements OnInit {
    private route = inject(ActivatedRoute);
    private trackingService = inject(TrackingService);
    private logger = inject(LoggerService);
    private seoService = inject(SeoService);
    private companyService = inject(CompanyService);
    
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
                const repairData = data[0] as Repair;
                this.repair.set(repairData);
                await this.updateSeo(repairData);
            } else if (data && !Array.isArray(data)) {
                 // Single object from repository mapFromDb
                 const repairData = data as Repair;
                 this.repair.set(repairData);
                 await this.updateSeo(repairData);
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

    private async updateSeo(r: Repair) {
        const statusName = this.getStatusLabel(r.current_status_id);
        let imageUrl = 'assets/img/branding/og-services.jpg';

        try {
            const settings = await this.companyService.getSettings();
            if (settings?.logo_url) {
                imageUrl = settings.logo_url;
            }
        } catch (e) {
            this.logger.warn('Could not fetch company settings for SEO image', e);
        }

        // Título: [Estado] - Tu [Modelo]
        // Descripción: Gracias por confiar en Arecofix. Tu equipo está en etapa de [Estado].
        this.seoService.setPageData({
            title: `${statusName} - Tu ${r.device_model}`,
            description: `Gracias por confiar en Arecofix. Tu equipo está en etapa de ${statusName}.`,
            imageUrl: imageUrl,
            type: 'article'
        });
    }

    getStatusLabel(statusId: number): string {
        const statusMap: Record<number, string> = {
            [RepairStatus.PENDING_DIAGNOSIS]: 'PENDIENTE DE DIAGNÓSTICO',
            [RepairStatus.SUPPLY_MANAGEMENT]: 'GESTIÓN DE REPUESTOS',
            [RepairStatus.IN_PROGRESS]: 'EN REPARACIÓN',
            [RepairStatus.QUALITY_CONTROL]: 'CONTROL DE CALIDAD',
            [RepairStatus.READY_FOR_PICKUP]: 'LISTO PARA RETIRAR',
            [RepairStatus.DELIVERED]: 'ENTREGADO',
            [RepairStatus.CANCELLED]: 'CANCELADO'
        };
        return statusMap[statusId] || 'PENDIENTE';
    }

    getStatusColor(statusId: number): string {
        const colorMap: Record<number, string> = {
            [RepairStatus.PENDING_DIAGNOSIS]: 'bg-amber-100 text-amber-800 border-amber-200',
            [RepairStatus.SUPPLY_MANAGEMENT]: 'bg-cyan-100 text-cyan-800 border-cyan-200',
            [RepairStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800 border-blue-200',
            [RepairStatus.QUALITY_CONTROL]: 'bg-indigo-100 text-indigo-800 border-indigo-200',
            [RepairStatus.READY_FOR_PICKUP]: 'bg-green-100 text-green-800 border-green-200',
            [RepairStatus.DELIVERED]: 'bg-slate-100 text-slate-800 border-slate-200',
            [RepairStatus.CANCELLED]: 'bg-rose-100 text-rose-800 border-rose-200'
        };
        return colorMap[statusId] || 'bg-slate-100 text-slate-700';
    }

    printTicket() {
        if (typeof window !== 'undefined') {
            window.print();
        }
    }

    openImage(url: string) {
        if (typeof window !== 'undefined') {
            window.open(url, '_blank');
        }
    }
}
